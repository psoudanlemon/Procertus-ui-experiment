import type { Preview } from "@storybook/react-vite";
import { addons } from "storybook/preview-api";
import { GLOBALS_UPDATED, NAVIGATE_URL } from "storybook/internal/core-events";

import { THEMES } from "@/lib/themes";
import "../src/styles/globals.css";
import "./preview.css";
import { parseToolbarDensity, parseToolbarMode, parseToolbarTheme, StorybookThemeDecorator } from "./storybook-theme";

/**
 * Intercept clicks on `?path=/story/...` and `?path=/docs/...` links inside
 * MDX docs pages and route them through Storybook's navigation channel so the
 * manager shell (sidebar + toolbar) stays intact.
 */
document.addEventListener("click", (e) => {
  const anchor = (e.target as Element).closest?.("a[href^='?path=/']");
  if (!anchor) return;

  const href = anchor.getAttribute("href");
  if (!href) return;

  e.preventDefault();
  e.stopPropagation();

  try {
    const channel = addons.getChannel();
    channel.emit(NAVIGATE_URL, href);
  } catch {
    // Fallback: set the parent frame URL directly
    const url = new URL(href, window.top?.location.href ?? window.location.href);
    if (window.top) window.top.location.href = url.toString();
  }
});

/**
 * Module-level listener: syncs toolbar mode/theme to the DOM imperatively.
 * Standalone MDX docs pages (no inline stories) don't run the decorator,
 * so the ModeProvider/ThemeProvider never fire. This fills the gap.
 */
try {
  const channel = addons.getChannel();
  channel.on(
    GLOBALS_UPDATED,
    ({ globals }: { globals: Record<string, unknown> }) => {
      const root = document.documentElement;

      if (globals.mode != null) {
        const mode = String(globals.mode);
        root.classList.remove("light", "dark");
        if (mode === "system") {
          root.classList.add(
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light",
          );
        } else {
          root.classList.add(mode);
        }
        localStorage.setItem("sb-ui-mode", mode);
      }

      if (globals.theme != null) {
        const theme = String(globals.theme);
        root.dataset.theme = theme;
        localStorage.setItem("sb-ui-theme", theme);
      }

      if (globals.density != null) {
        const density = String(globals.density);
        root.dataset.density = density;
        localStorage.setItem("sb-ui-density", density);
      }
    },
  );
} catch {
  // Channel not ready — decorators will handle it once a story renders.
}

const THEME_TOOLBAR_ICONS = ["circle", "component"] as const;

const preview: Preview = {
  initialGlobals: {
    theme: "default",
    mode: "dark",
    density: "operational",
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Brand palette (semantic tokens under src/styles/themes/)",
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
    density: {
      name: "Density",
      description: "Spacing density preset (operational / spacious)",
      defaultValue: "operational",
      toolbar: {
        title: "Density",
        icon: "grid",
        items: [
          { value: "operational", title: "Operational", icon: "grid" },
          { value: "spacious", title: "Spacious", icon: "sidebar" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = parseToolbarTheme(context.globals.theme);
      const mode = parseToolbarMode(context.globals.mode);
      const density = parseToolbarDensity(context.globals.density);
      return (
        <StorybookThemeDecorator theme={theme} mode={mode} density={density}>
          <Story />
        </StorybookThemeDecorator>
      );
    },
  ],
  parameters: {
    /**
     * Storybook’s built-in backgrounds tool applies `!important` colors to `.sb-show-main`, which
     * fights `body` / `bg-background` from this package’s globals. Disable it so the **Mode** toolbar
     * is the single control: it toggles `light` / `dark` on `document.documentElement`, and
     * `--background` (per `data-theme` + mode) always paints the preview.
     */
    backgrounds: { disable: true },
    /** Canvas tab: center stories by default. Override per file (e.g. `layout: "padded"` for wide panels). */
    layout: "centered",
    /** Docs tab: centered canvas blocks; story blocks size to content (see theme decorator — no forced 100vh). */
    docs: {
      canvas: { layout: "centered" },
    },
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "design tokens",
          [
            "Typography",
            ["Guidelines", "Font Family", "Font Size", "Font Weight", "Line Height", "Letter Spacing"],
            "Logotype", ["Guidelines", "Minimum dimensions", "Background rules", "*"],
            "Iconography",
            "Color", ["Guidelines", "Default", "*"],
            "Gradient", ["Guidelines", "Default", "*"],
            "Radius", ["Guidelines", "Default", "*"],
            "Spacing", ["Guidelines", "Default", "*"],
            "Shadow", ["Guidelines", "Default", "*"],
            "Elevation", ["Guidelines", "*"],
            "Document architecture",
            "Motion",
          ],
          "components",
          ["*", ["Guidelines", "Default", "*"]],
          "Applied Guidelines",
          [
            "Typography",
            "Logotype",
            "Iconography",
            "Colors",
            "Gradients",
            "Radius",
            "Spacing",
            "Shadows",
            "Elevation",
            "Document architecture",
            "Motion",
          ],
          "Showroom",
          [
            "Typography", ["Registry Detail View", "Management Data Grid", "Management Shell", "Long-form Content"],
            "Dashboard", "Login", "Sign up", "Mail",
          ],
        ],
      },
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
