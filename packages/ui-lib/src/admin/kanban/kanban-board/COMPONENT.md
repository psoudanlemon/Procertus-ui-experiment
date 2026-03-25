# KanbanBoard

Scaffolded by `scaffold workspace-ui add-component` (template variant **`composed`** — alert band, media, card shell, dialog).

## Composition (AI / humans)

This template **names private pieces** in the same file (`KanbanBoardAlertBand`, `KanbanBoardHero`) to show how to split UI before extracting files. When a slice stabilizes, move it to `KanbanBoard-alert-band.tsx` (or similar) and re-export from this folder.

- **Cross-feature composition** — Import other **ui-lib** components from `@scope/ui-lib` (same package). Primitives only from `@scope/ui` (`packages/ui`).
- **After scaffold** — Replace placeholder copy, wire real `children`, and trim props you do not need. Prefer **`data-panel`** + **`list-item`** for admin tables instead of stretching this template.

## Checklist

1. **Presentation** — `KanbanBoard.tsx` only; no data fetching.
2. **Stories** — Add variants (loading, error, empty) as separate stories.
3. **State** — Add a `useKanbanBoard` hook in this folder if you need state, then export it from `index.ts`.
4. **Formatting** — Match project Prettier/oxfmt (2 spaces in generated files).
