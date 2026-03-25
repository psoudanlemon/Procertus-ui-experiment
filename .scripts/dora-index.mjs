#!/usr/bin/env node
/**
 * Dora index script for Bun workspaces. Discovers packages/apps and runs scip-typescript.
 * Avoids --yarn-workspaces which fails when packageManager is bun.
 */
import { readdirSync, existsSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const dirs = ["packages", "apps"];
const projects = [];
for (const d of dirs) {
  const p = join(process.cwd(), d);
  if (!existsSync(p)) continue;
  for (const name of readdirSync(p, { withFileTypes: true })) {
    if (name.isDirectory()) projects.push(join(d, name.name));
  }
}
const args = ["index", ...projects, "--infer-tsconfig", "--output", ".dora/index.scip"];
const r = spawnSync("bunx", ["@sourcegraph/scip-typescript", ...args], {
  cwd: process.cwd(),
  stdio: "inherit",
});
process.exit(r.status ?? 1);
