# SelectChoiceCard

- **Single** — `RadioGroupItem` (default). **Multiple** — `Checkbox` with `checked` + `onCheckedChange` and `selectionMode="multiple"`. Do not put multiple-mode cards inside a `RadioGroup`; use `SelectChoiceCardGroup` with `selectionMode="multiple"`.
- **Appearance** — `default` (inline radio + text), `hero` (two-zone tier-card: header strip with title + control on top, body strip with description below, divided by a horizontal border), or `minimal` (title-only chip — `description` and `leading` are ignored, the radio/checkbox stays in the DOM as `sr-only` for keyboard + a11y).
- **Variant** — `elevated` (soft drop shadow) | `default` (clean border) | `faded` (dashed border, reduced opacity); same chrome applies across `default`, `hero`, and `minimal` appearances.
- **State** — {@link useChoiceSelection} for `selectedId` / `selectedIds`, `toggle`, `setIncluded` (stable for checkboxes), `setSelectedId(s)`.
- **API** — `controlId` for the native `id` + `htmlFor` link.

# SelectChoiceCardGroup

- `selectionMode` — `single` (default) wraps a `RadioGroup`; `multiple` uses a `div role="group"` and ignores Radix radio props.
