# DownloadableDocumentsList

Presentational list of document rows. **`DownloadableDocumentListItem`** renders the file icon, stacked title + description (left), and a right-side cluster with bytes/date metadata, an optional destructive delete button, and a ghost download `<a download>` button.

- **Props:** `items: DownloadableDocumentListItemData[]` — `id`, `title`, optional `description`, `date`, `formatHint`, `href`. List-level `onDelete?: (id) => void` enables the delete affordance per row.
- **No IO:** parents supply URLs (mock `#` anchors in prototypes).
