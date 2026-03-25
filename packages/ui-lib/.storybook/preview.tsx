import type { Preview } from "@storybook/react-vite";

import { THEMES } from "@procertus-ui/ui";
import "@procertus-ui/ui/globals.css";
import "./preview.css";
import { parseToolbarMode, parseToolbarTheme, StorybookThemeDecorator } from "./storybook-theme";

const THEME_TOOLBAR_ICONS = ["circle", "component"] as const;

const preview: Preview = {
  initialGlobals: {
    theme: "default",
    mode: "dark",
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Brand palette (semantic tokens under packages/ui/src/styles/themes/)",
      defaultValue: "default",
      toolbar: {
        title: "Theme",
        icon: "component",
        items: THEMES.map((t, i) => ({
          value: t.id,
          title: t.label,
          icon: THEME_TOOLBAR_ICONS[i % THEME_TOOLBAR_ICONS.length] ?? "circle",
        })),
        dynamicTitle: true,
      },
    },
    mode: {
      name: "Mode",
      description: "Color mode for the current theme (light / dark / system)",
      defaultValue: "dark",
      toolbar: {
        title: "Mode",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
          { value: "system", title: "System", icon: "mirror" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = parseToolbarTheme(context.globals.theme);
      const mode = parseToolbarMode(context.globals.mode);
      return (
        <StorybookThemeDecorator theme={theme} mode={mode}>
          <Story />
        </StorybookThemeDecorator>
      );
    },
  ],
  parameters: {
    /**
     * Storybook’s built-in backgrounds tool applies `!important` colors to `.sb-show-main`, which
     * fights `body` / `bg-background` from UI globals. Disable it so the **Mode** toolbar is the
     * single control: it toggles `light` / `dark` on `document.documentElement`, and `--background`
     * (per `data-theme` + mode) always paints the preview.
     */
    backgrounds: { disable: true },
    /** Canvas tab: center stories by default. Override per file (e.g. `layout: "padded"` for wide panels). */
    layout: "centered",
    /** Docs tab: centered canvas blocks; story blocks size to content (see theme decorator — no forced 100vh). */
    docs: {
      canvas: { layout: "centered" },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
