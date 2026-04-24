import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { workspaceUiAliasPlugin } from "@procertus-ui/ui/vite-workspace-ui-alias";

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(packageRoot, "../..");
const uiPackageRoot = path.join(monorepoRoot, "packages", "ui");

export default defineConfig({
  plugins: [
    workspaceUiAliasPlugin({ packageRoot, uiPackageRoot }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "@procertus-ui/ui"],
  },
  server: {
    fs: {
      allow: [monorepoRoot],
    },
  },
});
