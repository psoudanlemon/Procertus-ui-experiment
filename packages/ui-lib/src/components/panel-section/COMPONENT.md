# PanelSection

Scaffolded with **`scaffold workspace-ui add-component PanelSection --variant section`**, then adapted for **detail panels** (no card chrome).

## Purpose

- **`packages/ui-lib`**: presentational **section stack** — optional **`h2` title**, optional **description** (`<p>`, muted), then **`children`**.
- **Spacing:** `gap-1` between title and description; **`gap-section`** between the intro block and the body (design tokens).
- **Optional `title` / `description`** — omit both for a body-only block. Empty strings are treated as absent.
- **`contentClassName`** — layout on the body wrapper (e.g. `flex flex-wrap gap-2` for action rows).

## Checklist

1. Keep **routing, mutations, and confirm flows** in apps; `PanelSection` stays presentational.
2. **Stories** in `PanelSection.stories.tsx` cover header combinations and follow-up actions.
3. **Exports**: `index.ts` and root `packages/ui-lib/src/index.ts`.
