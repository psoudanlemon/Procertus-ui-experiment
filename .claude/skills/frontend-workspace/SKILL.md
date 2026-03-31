---
name: frontend-workspace
description: Frontend stack for this monorepo — app types, packages/ui (Shadcn), ui-lib, custom ui-*, Storybook, Tailwind, scaffold component, workspace-ui, Vite wiring.
globs:
  ["**/packages/ui/**", "**/packages/ui-lib/**", "**/packages/ui-*/**", "**/apps/frontend-*/**"]
---

# Frontend workspace (scaffold CLI)

**Canonical skill file:** `skills/frontend-workspace/SKILL.md` (OpenSkills-style: one folder per skill, `SKILL.md` inside). The scaffold CLI copies this into `.cursor/skills/`, `.claude/skills/`, and `.codex/skills/` so Cursor Cloud, Claude Code, Codex, and other agents can load the same content.

For **all** `scaffold` commands and generic repo layout, use **`skills/scaffolding/SKILL.md`** first.

Workspace scope for imports: **`@procertus-ui/…`** (e.g. `@procertus-ui/ui`, `@procertus-ui/ui-lib`).

## CLI commands (run from repo root)

| Command                                                                       | Purpose                                                           |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `scaffold project <name> [--apps …] [--packages …]`                           | New monorepo + optional apps/packages                             |
| `scaffold init <name> [--packages domain,svc-config,ui,ui-lib]`               | Base monorepo only                                                |
| `scaffold app <name> --type <type> [--with-ui]`                               | Add application under `apps/`                                     |
| `scaffold package <name> --type ui`                                           | Add `packages/ui-<name>` (needs `packages/ui`)                    |
| `scaffold ui <name>`                                                          | Same as `package … --type ui`                                     |
| `scaffold component <Name> [--package ui-lib or ui-*] [--hook] [--variant …]` | Composed component (alias: `scaffold workspace-ui add-component`) |
| `scaffold workspace-ui add-primitive <id>`                                    | Extra Shadcn primitive in `packages/ui` only                      |
| `scaffold workspace-ui wire-vite-app <appDir> …`                              | Wire Vite app to workspace UI + Tailwind                          |
| `scaffold module <name>`                                                      | Service + UI package pair (loosely coupled via domain)            |

Use `--non-interactive` in CI/agents.

## Frontend app types

| `--type`            | Role                  |
| ------------------- | --------------------- |
| `frontend-nextjs`   | Next.js + React       |
| `frontend-vite`     | Vite SPA + React      |
| `frontend-tanstack` | TanStack Start        |
| `documentation`     | Starlight / docs site |
| `slide-deck`        | Reveal slides         |

React frontends can use **`--with-ui`** to ensure `packages/ui` and `packages/ui-lib` exist and are added as dependencies.

## UI package layout

| Path                    | Role                                                                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui`           | **Only** Shadcn registry: `components.json`, `bunx shadcn@latest add …`. Default primitive catalog on init. **No** `scaffold component` here. |
| `packages/ui-lib`       | Composed components, hooks, Storybook. Imports **`@procertus-ui/ui`**. No local Shadcn registry.                                              |
| `packages/ui-<feature>` | Same rules as `ui-lib`; use **`scaffold ui <feature>`**. Depends on `@procertus-ui/ui` (and often `ui-lib`).                                  |

**Rules:** UI packages never depend on `svc-*`. Backend never imports `ui-*`.

## Shadcn, Tailwind, Storybook

- **Shadcn/ui** runs only in **`packages/ui`**. After init, use **`workspace-ui add-primitive`** for additional registry components so exports and Storybook stay aligned.
- **Tailwind v4** is configured in UI packages and wired into Vite apps via **`wire-vite-app`** when needed.
- **Storybook:** run `bun run storybook` / `build-storybook` from each UI package. Shared patterns: `.storybook/main.ts`, Vite alias for `@/…` in Shadcn sources.

## `scaffold component` (composed only)

- Target **`ui-lib`** or **`ui-*`** via `--package`, or infer cwd under `packages/<that>/`.
- **`--variant`:** `composed` (default), `minimal`, `form-field`, `list-item`, `section`, `settings`, `data-panel`.
- **`--hook`:** generates `use<Pascal>.ts` for logic; keep `.tsx` presentational.

## Improving the UI stack

1. Prefer **variants** that match the UX (lists → `list-item` + `data-panel`, forms → `form-field`).
2. Extract containers vs presentational pieces; export from `src/index.ts`.
3. For new primitives only, stay in **`packages/ui`** and sync via CLI.

## Related skills

Other scaffolded skills live under **`skills/`** (e.g. **`skills/workspace-domain/`**, **`skills/backend-workspace/`**) when those packages exist.
