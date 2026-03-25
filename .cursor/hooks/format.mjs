#!/usr/bin/env node
/**
 * Format + lint hook: runs format script and oxlint --fix after file edit (Cursor or Claude Code).
 * Input (stdin): JSON - Cursor: { file_path }, Claude: { tool_input: { file_path } }
 * Exit 0: success (or skip). Exit 2: block. Other: fail-open.
 */
import { readFileSync, existsSync } from "fs";
import { spawnSync } from "child_process";
import { dirname, resolve } from "path";

const OXFMT_EXTS = /\\.(ts|tsx|js|jsx|mjs|cjs|json|jsonc|md)$/i;
const OXLINT_EXTS = /\\.(ts|tsx|js|jsx|mjs|cjs)$/i;

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    const chunks = [];
    let chunk;
    process.stdin.setEncoding("utf8");
    process.stdin.resume();
    while ((chunk = process.stdin.read()) !== null) chunks.push(chunk);
    return chunks.join("");
  }
}

function main() {
  let input;
  try {
    const raw = readStdin();
    if (!raw.trim()) exit(0);
    input = JSON.parse(raw);
  } catch {
    exit(0);
  }

  const filePath = input.file_path ?? input.tool_input?.file_path;
  if (!filePath || typeof filePath !== "string") exit(0);

  const absPath = resolve(filePath);
  if (!existsSync(absPath)) exit(0);
  if (!OXFMT_EXTS.test(absPath)) exit(0);

  // Find project root (package.json with format script)
  let root = dirname(absPath);
  while (root !== "/" && root !== ".") {
    const pkgPath = resolve(root, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
        if (pkg.scripts?.format) break;
      } catch {
        // ignore
      }
    }
    root = dirname(root);
  }
  if (root === "/" || root === ".") exit(0);

  const pm =
    existsSync(resolve(root, "bun.lockb")) || existsSync(resolve(root, "bun.lock"))
      ? "bun"
      : "npm";
  const relPath = absPath.startsWith(root) ? absPath.slice(root.length).replace(/^\//, "") : absPath;

  // 1. Format via package script
  const fmtResult = spawnSync(pm, ["run", "format", "--", relPath], {
    cwd: root,
    stdio: "pipe",
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (fmtResult.status !== 0) exit(fmtResult.status ?? 1);

  // 2. Lint with oxlint --fix (per-file; turbo lint doesn't accept paths)
  if (OXLINT_EXTS.test(absPath)) {
    const binDir = resolve(root, "node_modules/.bin");
    const oxlintBin = ["oxlint", "oxlint.cmd"].find((b) => existsSync(resolve(binDir, b)));
    if (oxlintBin) {
      const lintResult = spawnSync(resolve(binDir, oxlintBin), ["--fix", absPath], {
        cwd: root,
        stdio: "pipe",
        encoding: "utf8",
        shell: process.platform === "win32",
      });
      if (lintResult.stdout) process.stdout.write(lintResult.stdout);
      if (lintResult.stderr) process.stderr.write(lintResult.stderr);
      exit(lintResult.status ?? 0);
    }
  }
  exit(0);
}

function exit(code) {
  process.exit(code === undefined ? 0 : code);
}

main();
