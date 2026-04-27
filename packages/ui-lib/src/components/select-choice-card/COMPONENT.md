# SelectChoiceCard

- **Single** — `RadioGroupItem` (default). **Multiple** — `Checkbox` with `checked` + `onCheckedChange` and `selectionMode="multiple"`. Do not put multiple-mode cards inside a `RadioGroup`; use `SelectChoiceCardGroup` with `selectionMode="multiple"`.
- **Appearance** — `default` (row + visible control) or `hero` (empty-state–like: centered, `p-8` / `p-10`, large title, optional `icon` in an `EmptyIcon` well, `sr-only` control).
- **Emphasis** — `primary` | `secondary` | `tertiary` (weight of border/background; still applies in `hero`).
- **State** — {@link useChoiceSelection} for `selectedId` / `selectedIds`, `toggle`, `setIncluded` (stable for checkboxes), `setSelectedId(s)`.
- **API rename** — `controlId` (not `radioId`) for the native `id` + `htmlFor` link.

# SelectChoiceCardGroup

- `selectionMode` — `single` (default) wraps a `RadioGroup`; `multiple` uses a `div role="group"` and ignores Radix radio props.
