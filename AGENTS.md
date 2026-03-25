# Agent Instructions

Keep instructions minimal here—this file is added to every session's context.

- **Use Bun** instead of Node.js: `bun run`, `bun install`, `bun test`, `bunx` instead of npx.
- Use **skills** for specific tasks. **Canonical:** `skills/<id>/SKILL.md` (OpenSkills-style). The scaffold CLI mirrors those into `.cursor/skills/`, `.claude/skills/`, and `.codex/skills/` for Cursor (incl. Cloud), Claude Code, **OpenAI Codex** (CLI / app skills layout), etc. That mirror is **not** the same as [Entire](https://entire.io)’s **OpenCode** agent integration ([OpenCode](https://github.com/anomalyco/opencode) uses `.opencode/` plugins). Entire lists **OpenAI Codex** as **planned**; there is no Entire↔Codex hook integration yet. You can also run `npx playbook list` where configured.
- **Commit policy:** Follow **`skills/git-commits/SKILL.md`** for commit strategy, Conventional Commits-style messages, and how to write subjects and bodies as an agent. **`scaffold project`** (and aliases **`init`** / **`create`**) requires Git on PATH and global **`user.name`** / **`user.email`** unless **`--no-git`**.
- **Scaffold CLI (all agents):** read **`skills/scaffolding/SKILL.md`** first for every top-level `scaffold` command, typical `apps/` and `packages/` layout, and pointers to stack-specific skills (`frontend-workspace`, `backend-workspace`, etc.).
- **Monorepo layout:** **Turborepo** — root workspace **`package.json`** and **`turbo.json`**. Run **`bun`** and **`scaffold`** from the repo root unless a task targets a single app or package.
- **`apps/`** — Applications only. Folder names reflect app type (e.g. **`frontend-vite-*`**, **`api-elysia-*`**, **`cli`**, **`mcp-*`**, **`documentation-*`**).
- **`packages/`** — Shared code: **`domain`** (shared types/logic), **`svc-config`** and **`svc-*`** (backend services; keep data access behind a service layer from API apps), **`ui`** (Shadcn primitives only), **`ui-lib`** and **`ui-*`** (composed UI; depend on **`ui`** / **`ui-lib`**, never on **`svc-*`**), **`typescript-config`**, and other packages added via the CLI. **Never** add a **`svc-*`** dependency to a **`ui-*`** package, or a **`ui-*`** dependency to a **`svc-*`** package.
- **After scaffolding an app**, read the README in that app's directory before implementing. The README explains structure, scaffolding commands, and architecture.
- **For API routes**, use scaffold expansion commands (e.g. `scaffold api-elysia add-crud-routes <entity>`) before customizing.
- **For persistence**, add a data service (e.g. `svc-prisma`). API handlers should call a service layer that wraps the data package, not the data package directly.
- Prefer functional programming. In React, use functions instead of classes.
- When extending the repo with the CLI, use **`skills/scaffolding/SKILL.md`** plus any stack skill that applies (`frontend-workspace`, `backend-workspace`, …).

<!-- effect-solutions:start -->

## Effect (TypeScript)

Use **[Effect](https://effect.website)** for typed errors, services/layers, and composable async where it fits (often backend and CLI). **Keep OXC** (`oxfmt` / `oxlint`) for format and lint.

### Shared Effect reference (machine-local)

**`scaffold project`** (unless **`SCAFFOLD_SKIP_EFFECT_SHARED_REFERENCE=1`**) already ensures a shallow **Effect** source tree exists at **`~/.local/share/effect-solutions/effect`** and that **[Dora](https://dora-cli.dev/)** is initialized and indexed there. Do **not** clone Effect into this monorepo, and do **not** treat `dora init` / `dora index` on that path as part of day-to-day work in this repository—setup is an install-time concern, not an agent onboarding step.

**Reading Effect’s implementation:** Use **Dora** with that directory as the project root (e.g. `cd ~/.local/share/effect-solutions/effect`, then `dora status`, `dora symbol`, `dora file`, `dora refs`, dependency commands) to explore APIs and patterns **before** guessing. Opening or searching files under that path directly is fine when quicker. Background: [Effect Solutions](https://www.effect.solutions), [Effect-TS/effect-smol](https://github.com/Effect-TS/effect-smol).

### Effect Solutions (monorepo root only)

From the **repository root**, `bunx effect-solutions list` / `bunx effect-solutions show <topic>...` — curated guides at [effect.solutions](https://www.effect.solutions). **`effect-solutions`** is a **root** devDependency only.

### Schemas

Use **`effect/Schema`**; do not add **`@effect/schema`** (deprecated).

### TypeScript and Effect tooling

- **`@workspace/typescript-config`**: [Effect tsconfig guidance](https://www.effect.solutions/tsconfig) — **`base.json`** includes **`@effect/language-service`**; **bundled** presets use **`module: "preserve"`**, **`moduleResolution: "bundler"`**, **`moduleDetection: "force"`**; **Next.js** includes the Next plugin **and** the Effect plugin.
- **`@effect/language-service`** is on the **workspace root** only; packages **`extend`** the shared config.
- Use **workspace TypeScript**; root **`prepare`** runs **`effect-language-service patch`** after **`bun install`**.

<!-- effect-solutions:end -->


<!-- scaffold-agent-skills -->
- **Scaffold skills:** canonical **`skills/<id>/SKILL.md`** (OpenSkills-style). This project syncs copies to **`.cursor/skills/`**, **`.claude/skills/`** per **`.scaffold/agent-targets.json`**. Add agents later with **`scaffold agents add`**. Start with **`skills/scaffolding/SKILL.md`** for the full CLI command map and repo layout (not frontend/backend-specific).


## Code Exploration with dora

This codebase uses dora for fast code intelligence and architectural analysis.

### IMPORTANT: Use dora for code exploration

**ALWAYS use dora commands for code exploration instead of Grep/Glob/Find.**

### All Commands

**Overview:**

- `dora status` - Check index health, file/symbol counts, last indexed time
- `dora map` - Show packages, file count, symbol count

**Files & Symbols:**

- `dora ls [directory] [--limit N] [--sort field]` - List files in directory with metadata (symbols, deps, rdeps). Default limit: 100
- `dora file <path>` - Show file's symbols, dependencies, and dependents
- `dora symbol <query> [--kind type] [--limit N]` - Find symbols by name across codebase. Default limit: 20
- `dora refs <symbol> [--kind type] [--limit N]` - Find all references to a symbol
- `dora exports <path>` - List exported symbols from a file
- `dora imports <path>` - Show what a file imports

**Dependencies:**

- `dora deps <path> [--depth N]` - Show file dependencies (what this imports). Default depth: 1
- `dora rdeps <path> [--depth N]` - Show reverse dependencies (what imports this). Default depth: 1
- `dora adventure <from> <to>` - Find shortest dependency path between two files

**Code Health:**

- `dora leaves [--max-dependents N]` - Find files with few/no dependents. Default: 0
- `dora lost [--limit N]` - Find unused exported symbols. Default limit: 50
- `dora treasure [--limit N]` - Find most referenced files and files with most dependencies. Default: 10

**Architecture Analysis:**

- `dora cycles [--limit N]` - Detect circular dependencies. Empty = good. Default: 50
- `dora coupling [--threshold N]` - Find bidirectionally dependent file pairs. Default threshold: 5
- `dora complexity [--sort metric]` - Show file complexity metrics (sort by: complexity, symbols, stability). Default: complexity

**Change Impact:**

- `dora changes <ref>` - Show files changed since git ref and their impact
- `dora graph <path> [--depth N] [--direction type]` - Generate dependency graph. Direction: deps, rdeps, both. Default: both, depth 1

**Documentation:**

- `dora docs [--type TYPE]` - List all documentation files. Use --type to filter by md or txt
- `dora docs search <query> [--limit N]` - Search through documentation content. Default limit: 20
- `dora docs show <path> [--content]` - Show document metadata and references. Use --content to include full text

**Note:** To find where a symbol/file is documented, use `dora symbol` or `dora file` which show a `documented_in` field.

**Database:**

- `dora schema` - Show database schema (tables, columns, indexes)
- `dora cookbook show [recipe]` - Query patterns with real examples (quickstart, methods, references, exports)
- `dora query "<sql>"` - Execute read-only SQL query against the database

### When to Use Other Tools

- **Read**: For reading file source code
- **Grep**: Only for non-code files or when dora fails
- **Edit/Write**: For making changes
- **Bash**: For running commands/tests

### Quick Workflow

```bash
dora status                      # Check index health
dora treasure                    # Find core files
dora file <path>                 # Understand a file
dora deps/rdeps <path>           # Navigate dependencies
dora symbol <query>              # Find symbols (shows documented_in)
dora refs <symbol>               # Find references
dora docs                        # List all documentation
dora docs search <query>         # Search documentation content
```

For detailed usage and examples, refer to `./dora/docs/SKILL.md`.
