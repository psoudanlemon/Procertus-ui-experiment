# DownloadableDocumentsList

Presentational primitives for surfacing downloadable documents (rulesets, guides, PDFs, attachments). No fetching — parents supply `href`s.

## When to use which

| Need | Use |
| --- | --- |
| One document inside an existing list or section | `DownloadableDocumentListItem` (`variant="row"`, default) |
| One document as a standalone tile | `DownloadableDocumentListItem` (`variant="card"`) |
| Multiple documents in a responsive 1 / 2 / 3-column grid | `DownloadableDocumentGrid` |
| Multiple documents inside a labeled "Documents" card | `DownloadableDocumentsList` |

## `variant="row"` vs `variant="card"`

- **`row`** — file icon on the left, title + description in the middle, format hint and download/delete buttons on the right. Reflows to a stacked layout on small viewports via `Item`'s `responsive` flag. Pick this when documents sit in a vertical list and the title carries the visual weight. Each row reads as a line item, not a destination.
- **`card`** — file icon top-left, title + description on top, format hint bottom-left, download affordance bottom-right. **Always stacked** (no breakpoint switching). Cards fill their grid track (no internal width cap) — when used inside `DownloadableDocumentGrid`, the grid's stepped column count handles per-card sizing. Pick this when documents need more visual presence as discrete tiles — feature lists, knowledge-base previews, attachment galleries. When no `onDelete` is passed, the **entire card becomes the download anchor** (richer hit target, single click affordance).

## `DownloadableDocumentGrid`

Opinionated wrapper that renders each item as `variant="card"` inside a CSS Grid with **explicit, stepped column counts**:

| Grid container width | Columns |
| --- | --- |
| under 42rem (~672px) | 1 |
| 42rem and up | 2 |
| 80rem (~1280px) and up | 3 |

The 3-column breakpoint sits intentionally high — typical master-card bodies in this app land around 70–75rem and should stay in the 2-column band. 3 columns only appears on full-bleed surfaces that exceed the standard page width.

The steps are driven by **container queries** against the grid's own inline size, not by viewport breakpoints — so the column count adapts to wherever the grid sits (constrained reading column, full-width section, side panel, …) without per-page configuration.

Reach for this whenever you have two or more downloadable documents to surface side-by-side.

The grid behavior is backed by the `card-grid` Tailwind utility (defined in `packages/ui/src/styles/globals.css`). The utility requires an ancestor with `container-type: inline-size` (Tailwind's `@container` class) — `DownloadableDocumentGrid` provides this wrapper automatically. If you use `card-grid` directly on another card-style surface, wrap it in `<div class="@container">` yourself.

## `DownloadableDocumentsList`

Opinionated wrapper that puts items inside a labeled `Card` with title and description headers, rendering each item as `variant="row"` in a vertical list. Use when the documents are the primary content of a self-contained section that wants its own framing.

## Props

- **`DownloadableDocumentListItemData`** — `id`, `title`, optional `description`, `date`, `formatHint`, `href`.
- **`onDelete`** (item-level or grid/list-level) — when provided, renders a destructive delete button. On `variant="card"` this also disables the whole-card click-target behavior, since the row now contains two distinct interactive controls.
