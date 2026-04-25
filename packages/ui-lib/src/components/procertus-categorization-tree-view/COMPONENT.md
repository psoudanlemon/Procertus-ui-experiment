# ProcertusCategorizationTreeView

Scaffolded with `scaffold workspace-ui add-component ProcertusCategorizationTreeView --package ui-lib --variant data-panel`, then implemented as the full tree browser (docs parity).

## Usage

- **Data:** pass a `ProcertusCategorizationDoc` via the `doc` prop (e.g. from `useProcertusCategorizationDoc()` in an app that wraps `ProcertusCategorizationProvider`, or `defaultProcertusCategorizationDoc` in Storybook).
- **No JSON in ui-lib:** types and pure helpers come from `@procertus-ui/procertus-categorization`.

## Stories

`ProcertusCategorizationTreeView.stories.tsx` uses the package default document for a standalone demo.
