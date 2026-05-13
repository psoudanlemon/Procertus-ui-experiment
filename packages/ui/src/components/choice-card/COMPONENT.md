# ChoiceCard

- **Single** — `RadioGroupItem` (default). **Multiple** — `Checkbox` with `checked` + `onCheckedChange` and `selectionMode="multiple"`. Do not put multiple-mode cards inside a `RadioGroup`; use `ChoiceCardGroup` with `selectionMode="multiple"`.
- **Appearance** — `default` (inline radio + text), `hero` (two-zone tier-card: header strip with title + control on top, body strip with description below, divided by a horizontal border), or `minimal` (title-only chip — `description` and `leading` are ignored, the radio/checkbox stays in the DOM as `sr-only` for keyboard + a11y).
- **Variant** — `elevated` (static branded glow, "quiet promotion" tier) | `default` (clean border) | `faded` (dashed border, reduced opacity); same chrome applies across `default`, `hero`, and `minimal` appearances.
- **State** — {@link useChoiceSelection} for `selectedId` / `selectedIds`, `toggle`, `setIncluded` (stable for checkboxes), `setSelectedId(s)`.
- **API** — `controlId` for the native `id` + `htmlFor` link.

# ChoiceCardGroup

- `selectionMode` — `single` (default) wraps a `RadioGroup`; `multiple` uses a `div role="group"` and ignores Radix radio props.
- `layout="grid"` — `grid-cols-1`, then **`md:grid-cols-2`** (two columns on medium+ viewports). For three columns on large screens, pass `className="xl:grid-cols-3"` (suited to three or more cards).
