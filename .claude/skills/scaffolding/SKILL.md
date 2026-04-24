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
| **`scaffold benchmark <benchmark-id> [name]`** | Same baseline as **`scaffold project`**, then copies the selected benchmark specification into **`docs/benchmark/`**, writes **`.scaffold/benchmark.json`**, and appends benchmark-reading guidance to **`AGENTS.md`** so agents can discover the brief automatically. |
| **`scaffold agents add …`** | Add agent support later (same stub generation + skill sync + Dora symlinks). Example: **`scaffold agents add codex`** or **`scaffold agents add --agents opencode`**. |
| **`scaffold app <name> --type <type>`** | Add an app under **`apps/`**. **`--with-ui`** for React frontends pulls in workspace UI packages when needed. |
| **`scaffold service <name>`** | Add **`packages/svc-<name>`** (Effect-based service template). |
| **`scaffold ui <name>`** | Add **`packages/ui-<name>`** (composed UI; requires **`packages/ui`**). |
| **`scaffold package <name> --type ui \| service`** | Same family as **`ui`** or generic **`svc-*`** style package. |
| **`scaffold component <Name>`** | Composed UI component (alias of **`workspace-ui add-component`**). Targets **`ui-lib`** or **`ui-*`**, not **`packages/ui`**. |
| **`scaffold subdomain <name>`** | Creates underscore-prefixed subdomain package folders such as **`packages/_<name>-svc-<name>`** and/or **`packages/_<name>-ui-<name>`**, while keeping package names unchanged. |
| **`scaffold workspace-ui …`** | UI package expansions: **`add-component`**, **`add-primitive`**, **`wire-vite-app`**, etc. |
| **`scaffold app-module`** | Generic app expansions (e.g. **`remove-module`**, **`add-module`**, **`add-service-module`**, **`add-crud-module`**, **`add-ui-module`**). The CLI detects the target framework from app-local metadata. |
| **`scaffold cli …`** | Expansions for CLI apps scaffolded with the **`cli`** app type. |
| **`scaffold metrics …`** | CLI telemetry / metrics (advanced). |

## Expansion-first planning

In a freshly scaffolded project, package-owned skills such as **`workspace-domain`**, **`workspace-service`**, **`workspace-http-app`**, and **`frontend-workspace`** may not exist yet.

Do **not** assume that means the corresponding scaffold flows are unavailable. Plan with these command families from the start, even before their owning packages have been scaffolded:

| Command family | Use for |
|---------------|---------|
| **`scaffold workspace-domain add-entity`** / **`remove-entity`** | Add or remove Effect-based domain entities, DTOs, pages, and `CrudPort` contracts |
| **`scaffold workspace-service add-module`** / **`remove-module`** | Expand `svc-*` packages with backend business modules |
| **`scaffold app-module add-module`** / **`remove-module`** | Add generic frontend or API app modules |
| **`scaffold app-module add-service-module`** | Wire an API module to an existing service package |
| **`scaffold app-module add-crud-module`** | Add CRUD HTTP endpoints backed by a service entity module |
| **`scaffold app-module add-ui-module`** | Wire a subdomain UI package into a frontend app |
| **`scaffold workspace-ui add-component`** | Add presentational components to `ui-lib` or `ui-*` |
| **`scaffold workspace-ui add-mock-data`** | Add entity-scoped mock providers, hooks, adapters, and stories to a subdomain UI package |
| **`scaffold workspace-ui add-primitive`** | Add Shadcn primitives inside `packages/ui` only |
| **`scaffold workspace-ui wire-vite-app`** | Connect a Vite frontend to workspace UI/Tailwind setup |
| **`scaffold frontend wire-prototype`** | Wire a mock-backed subdomain flow into a frontend app for prototype/demo use |

## Scaffolded architecture map

Use these conventions during planning even when the specialized skill files are not present yet:

- **Domain packages** define pure business contracts: `Schema.Class` entities, create/update/list DTOs, pages, and entity access ports built on `CrudPort`.
- **Service packages** implement backend business modules and integrations. They consume domain contracts and may wrap persistence packages such as `svc-prisma`.
- **API apps** wire HTTP transport to service modules. Route handlers should call services, not Prisma or database clients directly.
- **UI packages** stay presentational. When a subdomain UI package exists, it can also own mock providers, hooks, adapters, and Storybook stories via `workspace-ui add-mock-data`.
- **Frontend apps** should integrate subdomain UI packages through app expansion commands and can use `frontend wire-prototype` when the goal is a mock-backed prototype flow.

## Planning checklist before editing files

1. Read the benchmark docs or user specification first.
2. Read `.scaffold/target.json` on existing apps/packages before traversing the filesystem. It records scaffolded expansions such as domain entities, service modules, UI components, mock flows, and app wiring.
3. Prefer scaffold commands and expansion subcommands over hand-creating modules, routes, providers, or stories.
4. Scaffold from the inside out when the app depends on shared contracts:
   - domain entities and ports
   - persistence/service packages
   - API/CLI modules
   - UI components and mock flows
   - frontend integration or prototype wiring

## Common scaffold-first recipes

Create a full subdomain foundation:

```bash
scaffold subdomain billing --packages domain,service,ui --with-mocks --non-interactive
```

Add domain entities and ports:

```bash
scaffold workspace-domain add-entity invoice --domain _billing-domain-billing --schema ./invoice.entity.yaml
scaffold workspace-domain add-entity payment --domain _billing-domain-billing --schema ./payment.entity.yaml
```

Expand a service package with backend modules:

```bash
scaffold workspace-service add-module invoices --service svc-billing
```

Wire backend services into an API app:

```bash
scaffold app-module add-service-module pricing --service pricing-engine --app api-hono-api
scaffold app-module add-crud-module users --service accounts --app api-elysia-api
```

Extend a subdomain UI package with mock data and components:

```bash
scaffold workspace-ui add-mock-data invoice --package _billing-ui-billing --domain _billing-domain-billing
scaffold workspace-ui add-component InvoiceList --package _billing-ui-billing --variant list-item
```

Wire UI and prototype flows into a frontend app:

```bash
scaffold app-module add-ui-module billing --app frontend-web
scaffold frontend wire-prototype billing --app frontend-web
```

## After you scaffold

1. Read the **README** in the new **`apps/<app>/`** (or package) directory for type-specific architecture and scripts.
2. Run **`bun install`** at the repo root if the tool did not already finish installs.
3. Prefer **expansion** subcommands (**`workspace-ui`**, **`api-*`**) before hand-editing generated route/component shells.
4. **Entire:** When the [Entire CLI](https://entire.io) is on PATH, **`scaffold project`** and **`scaffold benchmark`** run **`entire enable --agent <id>`** for each agent that maps to Entire (**cursor**, **claude-code**, **opencode**) according to **`.scaffold/agent-targets.json`** (same set you chose at create time, unless you ran **`scaffold agents add`**). Entire only accepts one **`--agent`** per invocation; the CLI chains them with **`--force`** after the first. **OpenCode** in Entire is **not** OpenAI **Codex**; Entire lists **OpenAI Codex** as **planned**. **Codex** in **`--agents`** still generates **`.codex/skills`** for Codex CLI tooling. Subprocess uses **`ACCESSIBLE=1`**. If the CLI is missing, interactive runs can offer Homebrew or the install script. **`--no-entire`** skips. Docs: [introduction](https://docs.entire.io/introduction).
5. **Git:** Unless you used **`--no-git`**, you must have global **`user.name`** / **`user.email`** before running **`scaffold project`** or **`scaffold benchmark`**. **`git init`** happens before Entire; **`entire enable`** runs next; then the CLI finishes, writes **`.scaffold/metrics/*.jsonl`**, and runs **`git add -A`** + **`git commit`** (see **`skills/git-commits/SKILL.md`** for message shape). Add **`git remote`** when you publish.

## Stack-specific skills (when present)

| Skill folder | When it appears |
|--------------|-----------------|
| **`skills/git-commits/`** | Default: commit strategy and how agents should write messages (see **`AGENTS.md`**). |
| **`skills/frontend-workspace/`** | UI packages and/or React frontend apps exist. |
| **`skills/backend-workspace/`** | Domain, svc-config, API apps, and/or **`svc-*`** packages exist. |
| **`skills/<package-or-app-id>/`** | Extra stubs from optional packages (e.g. domain) or app types (e.g. api-elysia). |

For **project structure conventions**, see **`.cursor/rules/`** (especially project file structure) if present.
