# TaskQuickEditFields

Scaffolded by `scaffold workspace-ui add-component` (template variant **`form-field`** — Card + Label / Input / Textarea + optional Cancel + submit).

## Checklist (AI / humans)

1. **Presentation** — Keep `TaskQuickEditFields.tsx` presentational; validation and API calls live in a parent or `react-hook-form` resolver.
2. **Stories** — Add invalid, disabled, and loading states.
3. **State** — Add a `useTaskQuickEditFields` hook in this folder if you need state, then export it from `index.ts`.
4. **Exports** — This folder's `index.ts` and `packages/ui-lib/src/index.ts` are updated by the scaffold.
5. **Primitives** — Import from `@scope/ui` (root); do not run `shadcn add` here.
