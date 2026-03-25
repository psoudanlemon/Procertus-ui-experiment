# @procertus-ui/ui

Workspace package for **Shadcn UI primitives** only.

## Role

- This is the **single** package where the Shadcn CLI is used: `components.json` lives here, and registry components are added with:

  ```bash
  cd packages/ui
  bunx shadcn@latest add <component> -y
  ```

  After init, **`installDefaultUiPrimitivesCatalog`** runs: **`executeAddUiPrimitives`** for **`primitives-registry`** (Shadcn + Lloyd `@storybook/<id>-story`), then **`installLloydDesignSystemStories`** (Color, Radius, Shadow, Spacing, Typography from the [`@storybook` registry](https://registry.lloydrichards.dev)), then **`installThemeShowcaseBlocks`** ([Shadcn blocks](https://ui.shadcn.com/blocks) **`dashboard-01`**, **`login-03`**, **`signup-01`** plus **`scroll-area`** / **`resizable`** for the Mail layout), then sync. Primitive stories live under **`src/components/<id>-radix.stories.tsx`**; **theme stress-tests** live under **`src/showcase/*.stories.tsx`** (Storybook group **`theme/showcase`** — Cards, Dashboard, Mail, Color palette, Typography, Login, Sign up). Library `tsc` excludes `*.stories.*`. For **additional** primitives only, use **`add-primitive`** (design-system stories are not re-run). To re-run theme blocks only: **`installThemeShowcaseBlocks(projectRoot)`** from **`@workspace/pkg-ui`**.

- **Do not** add composed or app-specific components here. Use **`packages/ui-lib`** or **`packages/ui-<name>`** and `scaffold workspace-ui add-component` (or `scaffold component`) for those.

- **Consumers** — frontend apps, `ui-lib`, and custom `ui-*` packages — **import** primitives and hooks from this package’s root export (e.g. `import { Button, useTheme } from "@procertus-ui/ui"`). **`syncUiPrimitivesPackage`** regenerates **`src/components/ui/index.ts`** and **`src/hooks/index.ts`** as barrels (one `export *` per source file) and **`src/index.ts`** re-exports them. Use **named imports** so bundlers can tree-shake unused modules; **`package.json`** marks only `**/*.css` as side effects.

## Themes and modes

- **Theme** — Brand palette (`default`, `ocean`, …). Registry: `src/lib/themes.ts` (`THEMES`, `ThemeId`, `DEFAULT_THEME_ID`, `isThemeId()`). Styles: one file per id under `src/styles/themes/<id>.css`, imported from `globals.css`. `ThemeProvider` sets `document.documentElement.dataset.theme` (e.g. `html[data-theme="ocean"]` in CSS).
- **Mode** — Color appearance for the **current** theme: **light**, **dark**, or **system** (follow OS). `ModeProvider` toggles the `light` / `dark` classes on `<html>` (same as Shadcn).
- **Apps** — Wrap with both: `<ThemeProvider><ModeProvider>…</ModeProvider></ThemeProvider>`. Storybook uses toolbar **Theme** (palette) + **Mode** (light/dark/system).

## See also

Project conventions: `.cursor/rules/001-project-file-structure.mdc` and the **scaffold-workspace-ui** / **scaffold-ui** Cursor skills.
