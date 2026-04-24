---
name: frontend-workspace
description: Frontend stack for this monorepo — app types, packages/ui (Shadcn), ui-lib, custom ui-*, Storybook, Tailwind, scaffold component, workspace-ui, Vite wiring.
globs:
  [
    "**/packages/ui/**",
    "**/packages/ui-lib/**",
    "**/packages/ui-*/**",
    "**/apps/frontend-*/**",
  ]
---

# Frontend workspace (scaffold CLI)

**Canonical skill file:** `skills/frontend-workspace/SKILL.md` (OpenSkills-style: one folder per skill, `SKILL.md` inside). The scaffold CLI copies this into `.cursor/skills/`, `.claude/skills/`, and `.codex/skills/` so Cursor Cloud, Claude Code, Codex, and other agents can load the same content.

Read **`skills/scaffolding/SKILL.md`** first for the generic CLI surface, project creation flags, and the cross-workspace scaffold map.

This skill adds the frontend-specific rules: which UI expansion to use, how to keep UI packages presentational, and how mock-backed prototype wiring should be organized.

Workspace scope for imports: **`@procertus-ui/…`** (for example `@procertus-ui/ui`, `@procertus-ui/ui-lib`).

## Frontend roles

| Path | Role |
|------|------|
| `packages/ui` | Shadcn registry primitives only |
| `packages/ui-lib` | Shared composed UI components and hooks |
| `packages/ui-<feature>` | Feature- or subdomain-owned composed UI packages |
| `apps/frontend-*` | Application shells, routing, page composition, app-level state |

UI packages never depend on `svc-*`. Backend packages never import `ui-*`.

## Choose the right expansion

| Command | Use when |
|--------|----------|
| `scaffold workspace-ui add-primitive <id>` | Add or sync a Shadcn primitive in `packages/ui` |
| `scaffold workspace-ui add-component <Name> --package <ui-lib\|ui-*>` | Add a presentational component scaffold in `ui-lib` or a feature UI package |
| `scaffold workspace-ui add-mock-data <entity> --package <ui-*> --domain <domain>` | Add mock providers, hooks, adapters, and stories for one entity inside a subdomain UI package |
| `scaffold app-module add-ui-module <subdomain> --app <frontend-app>` | Wire an existing subdomain UI package into a frontend app module tree |
| `scaffold frontend wire-prototype <subdomain> --app <frontend-app>` | Build a mock-backed prototype flow in an app using the subdomain UI package |
| `scaffold workspace-ui wire-vite-app <appDir> …` | Wire a Vite app to workspace UI and Tailwind |

## UI package organization

Inside **`packages/ui-lib`** and **`packages/ui-*`**:

- keep `.tsx` files presentational
- move business logic into hooks, wrapper components, or mock-backed composition files
- export a stable public API from `src/index.ts`
- keep Storybook stories close to the components or mock flows they demonstrate
- use domain packages for shared types only; do not pull backend services into UI packages

Inside **`packages/ui`**:

- use it only for Shadcn primitives and registry-managed base components
- do not scaffold composed feature components here
- use `workspace-ui add-primitive` instead of hand-copying registry snippets

## Mock data inside UI packages

Do **not** create a separate `ui-mock-*` package.

For subdomain prototypes:

- keep mock providers, hooks, adapters, and stories in the owning UI package
- use **`scaffold workspace-ui add-mock-data <entity>`** to create the flow under `src/mocks/<entity>/`
- refine generated seed data so stories and demos resemble real entity shapes
- treat Storybook as the first verification surface before wiring an app

## Frontend app integration

Inside **`apps/frontend-*`**:

- keep application code focused on routing, page composition, data-provider selection, and app shell concerns
- import presentational UI from `ui-lib` or `ui-*`
- use `app-module add-ui-module` when the app should host the real subdomain UI module
- use `frontend wire-prototype` when the app should host a mock-backed vertical slice quickly

Default sequence for a new subdomain UI flow:

1. Ensure the owning domain entities already exist.
2. Add mock data in the subdomain UI package.
3. Add or extend presentational components.
4. Verify states in Storybook.
5. Wire the UI module or prototype flow into a frontend app.

## Code quality defaults

1. Prefer presentational components plus hooks over monolithic smart components.
2. Use `--variant` on `add-component` to match the UX shape instead of starting from empty files.
3. Keep app integration thin: composition in apps, presentation in UI packages, mock data in `ui-*`.
4. Reuse generated mock providers and hooks instead of inventing ad hoc fixtures in stories or pages.
5. Test critical frontend state transitions and form flows, but use Storybook for most visual verification.

## Storybook, Tailwind, and app types

- **Storybook:** `bun run storybook` from the repo root runs package storybooks via Turbo.
- **Tailwind v4:** wired into UI packages and Vite apps through scaffolded setup.
- **Frontend app types:** `frontend-nextjs`, `frontend-vite`, and `frontend-tanstack` each own routing and app bootstrapping; use their app README after scaffolding.

## Related skills

- **`skills/workspace-domain/`** for domain entities, DTOs, and ports that shape UI mock flows
- **`skills/backend-workspace/`** when a frontend flow depends on API or service wiring
- package- or app-specific skills under **`skills/<skill-id>/`** when those pieces have been scaffolded
