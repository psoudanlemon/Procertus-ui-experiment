---
name: scaffolding
description: Generic scaffold CLI — all top-level commands, monorepo layout (apps/, packages/), and where to find stack-specific skills. Not frontend- or backend-only.
globs: []
---

# Scaffolding CLI (monorepo)

**Canonical:** `skills/scaffolding/SKILL.md`. Run commands from the **repository root** unless noted. Use **`--non-interactive`** for CI and agents.

Workspace npm scope is **`@procertus-ui/…`** (from root `package.json` name `@procertus-ui/root`).

## Monorepo layout (typical)

| Area | Contents |
|------|----------|
| **`apps/`** | Applications: `frontend-*`, `api-*`, `cli`, `documentation`, etc. (prefix reflects app type). |
| **`packages/`** | Shared libraries: **`domain`**, **`svc-config`**, **`ui`** (Shadcn primitives only), **`ui-lib`**, **`ui-<name>`** (composed), **`svc-<name>`** (backend services). |
| **`skills/`** | Agent skill playbooks (`SKILL.md` per folder); mirrored only to agent dirs you selected (e.g. `.cursor/`, `.claude/`, `.codex/`, `.opencode/`). |

**Rules of thumb:** `ui-*` packages never depend on `svc-*`. Backend services never depend on `ui-*`. Optional packages at create time: `domain`, `svc-config`, `ui`, `ui-lib`.

## Top-level CLI commands

| Command | Purpose |
|---------|---------|
| **`scaffold project <name>`** (aliases: **`init`**, **`create`**) | New Turborepo-style monorepo. **Git (default):** requires Git on PATH + **`git config --global user.name`** / **`user.email`** (checked **before** any files are created). **`git init`** runs **before** Entire (for hooks); **first commit** runs **after** Entire setup (unless **`--no-entire`** / CLI missing). Initial commit uses **`chore(scaffold): add monorepo baseline`** plus a body (includes **`.scaffold/metrics`** from that CLI run). **`--no-git`** skips all Git steps. Add **`git remote`** when you publish. **AI agents:** interactive flow asks which agents to support (**Cursor**, **Claude**, **Codex**, **OpenCode**); default **cursor,claude**. **`--agents cursor,claude,…`** or **`--non-interactive`** uses defaults unless overridden. Writes **`.scaffold/agent-targets.json`**; root stubs and skill mirrors match that list only. |
| **`scaffold agents add …`** | Add agent support later (same stub generation + skill sync + Dora symlinks). Example: **`scaffold agents add codex`** or **`scaffold agents add --agents opencode`**. |
| **`scaffold app <name> --type <type>`** | Add an app under **`apps/`**. **`--with-ui`** for React frontends pulls in workspace UI packages when needed. |
| **`scaffold service <name>`** | Add **`packages/svc-<name>`** (Effect-based service template). |
| **`scaffold ui <name>`** | Add **`packages/ui-<name>`** (composed UI; requires **`packages/ui`**). |
| **`scaffold package <name> --type ui \| service`** | Same family as **`ui`** or generic **`svc-*`** style package. |
| **`scaffold component <Name>`** | Composed UI component (alias of **`workspace-ui add-component`**). Targets **`ui-lib`** or **`ui-*`**, not **`packages/ui`**. |
| **`scaffold module <name>`** | Creates **`svc-<name>`** + **`ui-<name>`** pair; both use **`domain`** for shared types, no direct package dependency between the pair. |
| **`scaffold workspace-ui …`** | UI package expansions: **`add-component`**, **`add-primitive`**, **`wire-vite-app`**, etc. |
| **`scaffold api-elysia`**, **`api-hono`**, **`api-fastify`** | API app expansions (e.g. **`add-crud-routes`**, **`add-middleware`**, **`add-plugin`**, **`add-handler`**). Use **`--app`** when multiple API apps exist. |
| **`scaffold cli …`** | Expansions for CLI apps scaffolded with the **`cli`** app type. |
| **`scaffold metrics …`** | CLI telemetry / metrics (advanced). |

## After you scaffold

1. Read the **README** in the new **`apps/<app>/`** (or package) directory for type-specific architecture and scripts.
2. Run **`bun install`** at the repo root if the tool did not already finish installs.
3. Prefer **expansion** subcommands (**`workspace-ui`**, **`api-*`**) before hand-editing generated route/component shells.
4. **Entire:** When the [Entire CLI](https://entire.io) is on PATH, `scaffold project` runs **`entire enable --agent <id>`** for each agent that maps to Entire (**cursor**, **claude-code**, **opencode**) according to **`.scaffold/agent-targets.json`** (same set you chose at create time, unless you ran **`scaffold agents add`**). Entire only accepts one **`--agent`** per invocation; the CLI chains them with **`--force`** after the first. **OpenCode** in Entire is **not** OpenAI **Codex**; Entire lists **OpenAI Codex** as **planned**. **Codex** in **`--agents`** still generates **`.codex/skills`** for Codex CLI tooling. Subprocess uses **`ACCESSIBLE=1`**. If the CLI is missing, interactive runs can offer Homebrew or the install script. **`--no-entire`** skips. Docs: [introduction](https://docs.entire.io/introduction).
5. **Git:** Unless you used **`--no-git`**, you must have global **`user.name`** / **`user.email`** before running **`scaffold project`**. **`git init`** happens before Entire; **`entire enable`** runs next; then the CLI finishes, writes **`.scaffold/metrics/*.jsonl`**, and runs **`git add -A`** + **`git commit`** (see **`skills/git-commits/SKILL.md`** for message shape). Add **`git remote`** when you publish.

## Stack-specific skills (when present)

| Skill folder | When it appears |
|--------------|-----------------|
| **`skills/git-commits/`** | Default: commit strategy and how agents should write messages (see **`AGENTS.md`**). |
| **`skills/frontend-workspace/`** | UI packages and/or React frontend apps exist. |
| **`skills/backend-workspace/`** | Domain, svc-config, API apps, and/or **`svc-*`** packages exist. |
| **`skills/<package-or-app-id>/`** | Extra stubs from optional packages (e.g. domain) or app types (e.g. api-elysia). |

For **project structure conventions**, see **`.cursor/rules/`** (especially project file structure) if present.
