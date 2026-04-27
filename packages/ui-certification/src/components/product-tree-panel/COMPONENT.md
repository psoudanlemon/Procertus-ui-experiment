# ProductTreePanel

Card + optional filter + **group / product** tree. Groups are collapsible; selectable product rows call `onSelectProduct`. Product rows can also stay visible but unavailable via `selectable: false`, `statusLabel`, and `unavailableReason` so a wizard can show why an active certification intent is not offered for a product. Use `expandedIds` + `onToggle` for controlled expansion (no client graph engine here — Task B provides nodes).
