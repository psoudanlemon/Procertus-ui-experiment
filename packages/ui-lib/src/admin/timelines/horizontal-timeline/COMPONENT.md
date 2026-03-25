# HorizontalTimeline

Scaffolded by `scaffold workspace-ui add-component` (template variant **`data-panel`** — Card + filter toolbar + `children` for tables or lists).

## Checklist (AI / humans)

1. **Presentation** — Toolbar and shell only; render **Table** / virtualized lists / stacked **`list-item`** components in `children`.
2. **Composition** — Prefer reusing a **`list-item`** variant row inside the table; avoid duplicating row markup.
3. **State** — Add a `useHorizontalTimeline` hook in this folder if you need state, then export it from `index.ts`.
4. **Primitives** — Import from `@scope/ui` only.
