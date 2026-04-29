# DownloadableDocumentsList

Presentational list of document rows. **`DownloadableDocumentListItem`** uses **`Item asChild`** so the whole row is one **`<a download>`** (hover/focus on the anchor per [shadcn Item / Link](https://ui.shadcn.com/docs/components/radix/item#link)): **`ItemMedia`** (file icon), **`ItemContent`** (title + description), **`ItemActions`** (decorative download icon only, `aria-hidden`).

- **Props:** `items: DownloadableDocumentListItemData[]` — `id`, `title`, optional `description`, `formatHint`, `href`.
- **No IO:** parents supply URLs (mock `#` anchors in prototypes).
