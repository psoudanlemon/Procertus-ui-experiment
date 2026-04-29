import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Relative import: package subpath resolves to `.ts` in node_modules, externalized from the
// config bundle, and Node cannot load it (ERR_UNKNOWN_FILE_EXTENSION).
import { workspaceUiAliasPlugin } from "../../packages/ui/src/vite-workspace-ui-alias.ts";

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
