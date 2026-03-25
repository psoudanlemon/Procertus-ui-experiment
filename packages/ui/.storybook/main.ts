import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

import { workspaceUiAliasPlugin } from "./vite-workspace-ui-alias.ts";

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
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      include: ["../src/**/*.tsx"],
    },
  },
  async viteFinal(configStorybook) {
    return mergeConfig(configStorybook, {
      plugins: [
        workspaceUiAliasPlugin({ packageRoot, uiPackageRoot }),
        tailwindcss(),
      ],
      resolve: {
        dedupe: ["react", "react-dom"],
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
