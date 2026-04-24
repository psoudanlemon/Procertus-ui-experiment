import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

import { workspaceUiAliasPlugin } from "@procertus-ui/ui/vite-workspace-ui-alias";

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const monorepoRoot = path.join(packageRoot, "..", "..");
const uiPackageRoot = path.resolve(packageRoot, "..", "ui");

/**
 * Storybook — do **not** merge the app’s full `vite.config.ts` here (duplicate React plugin / broken graph).
 * Use explicit **`.ts`** on local imports (Storybook / Vite ESM): https://storybook.js.org/docs/faq#extensionless-imports-in-st
 * @see https://storybook.js.org/docs/configure/integration/typescript
 * @see https://zenn.dev/wakamsha/articles/setup-storybook7-with-pnpm-workspaces — monorepo `include` for docgen
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  staticDirs: ["../public"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      // Paths relative to this file (`.storybook/`): `../src` = ui-lib, `../../ui/src` = primitives package.
      include: [
        path.join(packageRoot, "src/**/*.tsx").replace(/\\/g, "/"),
        path.join(uiPackageRoot, "src/**/*.tsx").replace(/\\/g, "/"),
      ],
    },
  },
  async viteFinal(configStorybook) {
    // Strip the `@` → `./src` alias from vite.config.ts — it only points to
    // ui-lib/src and hijacks `@/` imports inside packages/ui source files,
    // breaking shared React contexts (e.g. SidebarProvider).
    // The custom workspaceUiAliasPlugin handles `@/` with proper per-package resolution.
    if (configStorybook.resolve?.alias) {
      const alias = configStorybook.resolve.alias;
      if (Array.isArray(alias)) {
        configStorybook.resolve.alias = alias.filter(
          (a: { find?: string | RegExp }) => a.find !== "@",
        );
      } else if (typeof alias === "object" && "@" in alias) {
        delete (alias as Record<string, string>)["@"];
      }
    }
    return mergeConfig(configStorybook, {
      plugins: [workspaceUiAliasPlugin({ packageRoot, uiPackageRoot }), tailwindcss()],
      resolve: {
        dedupe: ["react", "react-dom", "@procertus-ui/ui"],
      },
      build: {
        chunkSizeWarningLimit: 1600,
      },
      server: {
        fs: {
          allow: [
            packageRoot,
            monorepoRoot,
            uiPackageRoot,
            path.join(packageRoot, "node_modules"),
            path.join(monorepoRoot, "node_modules"),
          ],
        },
      },
    });
  },
};

export default config;
