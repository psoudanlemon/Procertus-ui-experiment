# DesignTokensShowcase

Scaffolded with `scaffold workspace-ui add-component DesignTokensShowcase --variant section`, then expanded into a **token + primitive gallery** for prototype apps.

## Pieces

| Export | Role |
|--------|------|
| `DesignTokensShowcase` | Tabs: overview, semantic colors, shape/depth, form controls — uses Card, Alert, Field, Tabs, typography, etc. |
| `PrototypeSurfaceMarquee` | Three tiles using `--gradient-*` CSS variables + Badge. |
| `TokenSwatch` | Reusable label + color tile for swatch grids. |

## Consumption

- **Storybook:** `ui-lib/DesignTokensShowcase` stories.
- **Apps (recommended):** `import { DesignTokensShowcase, … } from "@procertus-ui/ui-lib/design-tokens-showcase"` so `tsc` does not pull the whole ui-lib barrel.
- **Barrel:** also re-exported from `@procertus-ui/ui-lib` root `index.ts`.

## Checklist

1. Keep **presentation-only** — routing and data live in apps.
2. **Primitives** — import from `@procertus-ui/ui` only; do not run `shadcn add` in ui-lib.
