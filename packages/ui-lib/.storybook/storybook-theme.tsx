import type { ReactNode } from "react";
import { useLayoutEffect } from "react";

import {
  DEFAULT_THEME_ID,
  isThemeId,
  ModeProvider,
  ThemeProvider,
  TooltipProvider,
  useMode,
  useTheme,
  type Mode,
  type ThemeId,
} from "@procertus-ui/ui";

function StorybookToolbarThemeSync({ toolbarTheme }: { toolbarTheme: ThemeId }) {
  const { setTheme, theme } = useTheme();
  useLayoutEffect(() => {
    if (theme !== toolbarTheme) setTheme(toolbarTheme);
  }, [toolbarTheme, setTheme, theme]);
  return null;
}

function StorybookToolbarModeSync({ toolbarMode }: { toolbarMode: Mode }) {
  const { setMode, mode } = useMode();
  useLayoutEffect(() => {
    if (mode !== toolbarMode) setMode(toolbarMode);
  }, [toolbarMode, setMode, mode]);
  return null;
}

function parseToolbarMode(value: unknown): Mode {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return "dark";
}

function parseToolbarTheme(value: unknown): ThemeId {
  if (isThemeId(value)) {
    return value;
  }
  return DEFAULT_THEME_ID;
}

/**
 * Wraps the Storybook canvas with ThemeProvider (palette) + ModeProvider (light/dark/system).
 * Storybook **toolbars** drive `globalTypes.theme` (palette id) and `globalTypes.mode` (color mode).
 */
export function StorybookThemeDecorator({
  children,
  theme: themeId,
  mode,
}: {
  children: ReactNode;
  theme: ThemeId;
  mode: Mode;
}) {
  return (
    <ThemeProvider defaultTheme={themeId} storageKey="sb-ui-lib-theme">
      <StorybookToolbarThemeSync toolbarTheme={themeId} />
      <ModeProvider defaultMode={mode} storageKey="sb-ui-lib-mode">
        <StorybookToolbarModeSync toolbarMode={mode} />
        <TooltipProvider delayDuration={0}>
          {/** No min-h-screen — it forced Docs/Canvas previews to full viewport height. */}
          <div className="relative box-border w-full bg-background text-foreground">
            <div className="relative box-border">{children}</div>
          </div>
        </TooltipProvider>
      </ModeProvider>
    </ThemeProvider>
  );
}

export { parseToolbarTheme, parseToolbarMode };
