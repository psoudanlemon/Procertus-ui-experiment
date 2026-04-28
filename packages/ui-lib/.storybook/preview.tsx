import type { Preview } from "@storybook/react-vite";

import { THEMES } from "@procertus-ui/ui";
import "@procertus-ui/ui/globals.css";
import "./preview.css";
import { parseToolbarMode, parseToolbarTheme, StorybookThemeDecorator } from "./storybook-theme";

/** Must match `PROCERTUS_DOCS_ROOT_SYNC_TYPE` in procertus-docs `storybook-parent-sync.ts`. */
const PROCERTUS_DOCS_ROOT_SYNC_TYPE = "procertus-docs-root-sync" as const;

function applyHtmlRootFromDocsPortalMessage(payload: {
  mode: string;
  theme?: string;
  density?: string;
}): void {
  const root = document.documentElement;
  const mode = payload.mode;
  root.classList.remove("light", "dark");
  if (mode === "system") {
    root.classList.add(
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    );
  } else if (mode === "dark" || mode === "light") {
    root.classList.add(mode);
  } else {
    root.classList.add("light");
  }
  if (payload.theme !== undefined) {
    root.dataset.theme = String(payload.theme);
  }
  if (payload.density !== undefined) {
    root.dataset.density = String(payload.density);
  }
}

window.addEventListener("message", (event: MessageEvent) => {
  if (event.source !== window.parent) {
    return;
  }
  const data = event.data as {
    type?: string;
    mode?: string;
    theme?: string;
    density?: string;
  };
  if (data?.type !== PROCERTUS_DOCS_ROOT_SYNC_TYPE) {
    return;
  }
  applyHtmlRootFromDocsPortalMessage({
    mode: data.mode ?? "light",
    theme: data.theme,
    density: data.density,
  });
});

const THEME_TOOLBAR_ICONS = ["circle", "component"] as const;

const preview: Preview = {
  initialGlobals: {
    theme: "default",
    mode: "light",
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
      defaultValue: "light",
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
    options: {
      storySort: {
        order: [
          "Custom components",
          [
            "Application shell",
            "Authentication",
            [
              "*",
              "Forms",
              ["Account details", "Login", "Forgot password", "Verify code", "Set password"],
            ],
            "Status pages",
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
