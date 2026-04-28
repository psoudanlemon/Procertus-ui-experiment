# DownloadableDocumentsList

Presentational list of document rows with a download action. Use `DownloadableDocumentListItem` for custom layouts; default `DownloadableDocumentsList` maps `items` and wraps them in a `Card`.

- **Props:** `items: DownloadableDocumentListItemData[]` — `id`, `title`, optional `description`, `formatHint`, `href`.
- **No IO:** parents supply URLs (mock `#` anchors in prototypes).
