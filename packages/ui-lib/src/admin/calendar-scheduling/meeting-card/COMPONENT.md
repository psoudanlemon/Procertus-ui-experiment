# MeetingCard

Scaffolded by `scaffold workspace-ui add-component` (template variant **`list-item`** — Avatar + text + role + status + row actions menu).

## Checklist (AI / humans)

1. **Presentation** — Row layout only; use **`intent`** + **`status`** for visual dialects without new CSS files. Wire virtualization and data in a parent.
2. **Stories** — Add long-title, no-badge, and loading avatar variants.
3. **State** — Add a `useMeetingCard` hook in this folder if you need state, then export it from `index.ts`.
4. **Exports** — This folder's `index.ts` and `packages/ui-lib/src/index.ts` are updated by the scaffold.
5. **Primitives** — Import from `@scope/ui` (root); do not run `shadcn add` here.
