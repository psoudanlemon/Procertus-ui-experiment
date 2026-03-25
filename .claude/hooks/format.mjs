#!/usr/bin/env node
/**
 * Format hook: runs oxfmt after file edit (Cursor or Claude Code).
 * Input (stdin): JSON - Cursor: { file_path }, Claude: { tool_input: { file_path } }
 * Exit 0: success (or skip). Exit 2: block. Other: fail-open.
 */
import { readFileSync, existsSync } from "fs";
import { spawnSync } from "child_process";
import { dirname, resolve } from "path";

const OXFMT_EXTS = /\\.(ts|tsx|js|jsx|mjs|cjs|json|jsonc|md)$/i;

function readStdin() {
  const chunks = [];
  let chunk;
  process.stdin.setEncoding("utf8");
  process.stdin.resume();
  while ((chunk = process.stdin.read()) !== null) chunks.push(chunk);
  return chunks.join("");
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

  // Find project root (contains package.json with oxfmt)
  let root = dirname(absPath);
  while (root !== "/" && root !== ".") {
    const pkgPath = resolve(root, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies } || {};
        if (Object.keys(deps).some((d) => d === "oxfmt" || d.startsWith("oxfmt@"))) break;
      } catch {
        // ignore
      }
    }
    root = dirname(root);
  }
  if (root === "/" || root === ".") exit(0);

  const binDir = resolve(root, "node_modules/.bin");
  const oxfmtBin = ["oxfmt", "oxfmt.cmd"].find((b) => existsSync(resolve(binDir, b)));
  if (!oxfmtBin) exit(0);

  const r = spawnSync(resolve(binDir, oxfmtBin), [absPath], {
    cwd: root,
    stdio: "pipe",
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  exit(r.status ?? 0);
}

function exit(code) {
  process.exit(code === undefined ? 0 : code);
}

main();
