import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

export interface WorkspaceUiAliasOptions {
  /** e.g. `packages/ui-lib` or `packages/ui` */
  readonly packageRoot: string;
  /** Sibling `packages/ui` (always the primitives package name in this monorepo layout). */
  readonly uiPackageRoot: string;
}

/** Vite may pass `file://…` URLs or `?query` suffixes on `importer`; normalize before `path.relative`. */
function normalizeImporterPath(importer: string): string {
  const withoutQuery = importer.split("?")[0]!;
  if (withoutQuery.startsWith("file:")) {
    try {
      return fileURLToPath(withoutQuery);
    } catch {
      return withoutQuery;
    }
  }
  return path.normalize(withoutQuery);
}

/** Resolve `@/foo/bar` to an existing file under `srcRoot` (always includes extension). */
function resolveSubpathToAbsoluteFile(srcRoot: string, subpath: string): string | undefined {
  const normalized = subpath.replace(/\\/g, "/").replace(/\.(tsx|ts|jsx|mts|mjs|js)$/, "");
  const base = path.join(srcRoot, normalized);
  for (const ext of [".tsx", ".ts", ".jsx", ".mts", ".js"]) {
    const p = base + ext;
    if (existsSync(p)) return p;
  }
  return undefined;
}

/**
 * `@/…` path as it appears in source, or after Vite’s `alias: { "@": "<pkg>/src" }` (Storybook merges
 * `vite.config.ts`), which rewrites `@/components/ui/button` → `./src/components/ui/button` relative
 * to the **Storybook package** cwd — wrong for files under `packages/ui`.
 */
function parseVirtualSrcSubpath(id: string): string | undefined {
  if (id.startsWith("@/")) {
    return id.slice(2);
  }
  if (id.startsWith("./src/")) {
    return id.slice(6);
  }
  if (id.startsWith("src/")) {
    return id.slice(4);
  }
  return undefined;
}

/**
 * Vite does not read `tsconfig` `paths`. Shadcn sources use `@/…`; map `@/` from the file that imports
 * it — `packages/ui/src` vs this package’s `src` — so Storybook matches TypeScript.
 *
 * Rollup may call `resolveId` **without** `importer` when resolving nested imports (e.g. `sheet` →
 * `button`). If we bail on `!importer`, `@/` falls through to a wrong alias and primitives break.
 *
 * Always return a resolved path **with** a file extension; extensionless ids break Vite’s load step in Storybook.
 */
export function workspaceUiAliasPlugin(opts: WorkspaceUiAliasOptions): Plugin {
  const uiRoot = path.resolve(opts.uiPackageRoot);
  const pkgRoot = path.resolve(opts.packageRoot);
  const uiSrc = path.join(uiRoot, "src");
  const localSrc = path.join(pkgRoot, "src");

  function isPathUnder(ancestor: string, file: string): boolean {
    const rel = path.relative(ancestor, file);
    return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
  }

  return {
    name: "storybook-workspace-ui-at-alias",
    enforce: "pre",
    resolveId(id, importer) {
      const from = importer ? normalizeImporterPath(importer) : undefined;

      // Another resolver may yield extensionless absolute paths under `src/`; Vite then fails to load.
      if (path.isAbsolute(id) && !/\.(tsx|ts|jsx|mts|mjs|js)$/.test(id)) {
        if (isPathUnder(uiSrc, id)) {
          const fixed = resolveSubpathToAbsoluteFile(uiSrc, path.relative(uiSrc, id));
          if (fixed) return fixed;
        }
        if (isPathUnder(localSrc, id)) {
          const fixed = resolveSubpathToAbsoluteFile(localSrc, path.relative(localSrc, id));
          if (fixed) return fixed;
        }
      }

      // Alias resolved `@/…` to an absolute path under this package's `src/` while the importer lives
      // in `packages/ui` — remap to `uiPackageRoot/src`.
      if (path.isAbsolute(id) && from && isPathUnder(uiRoot, from) && isPathUnder(localSrc, id)) {
        const rel = path.relative(localSrc, id);
        return resolveSubpathToAbsoluteFile(uiSrc, rel);
      }

      const subpath = parseVirtualSrcSubpath(id);
      if (subpath === undefined) {
        return undefined;
      }

      if (from) {
        if (isPathUnder(uiRoot, from)) {
          return resolveSubpathToAbsoluteFile(uiSrc, subpath);
        }
        if (isPathUnder(pkgRoot, from)) {
          return (
            resolveSubpathToAbsoluteFile(localSrc, subpath) ??
            resolveSubpathToAbsoluteFile(uiSrc, subpath)
          );
        }
      }

      return (
        resolveSubpathToAbsoluteFile(uiSrc, subpath) ??
        resolveSubpathToAbsoluteFile(localSrc, subpath)
      );
    },
  };
}
