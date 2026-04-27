import { useMemo } from 'react';

// Define breakpoints (adjust as needed, e.g., align with Tailwind)
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Define default configurations per breakpoint
interface ResponsiveDefaults {
  panelWidth: number;
  maxVisiblePanels: number;
  mainViewMinWidth: number;
}

const DEFAULT_CONFIGS: Record<keyof typeof BREAKPOINTS | 'base', ResponsiveDefaults> = {
  base: { panelWidth: 300, maxVisiblePanels: 1, mainViewMinWidth: 300 }, // Smallest screens / default
  sm: { panelWidth: 320, maxVisiblePanels: 1, mainViewMinWidth: 320 },
  md: { panelWidth: 350, maxVisiblePanels: 1, mainViewMinWidth: 400 },
  lg: { panelWidth: 380, maxVisiblePanels: 2, mainViewMinWidth: 450 },
  xl: { panelWidth: 400, maxVisiblePanels: 3, mainViewMinWidth: 500 },
  '2xl': { panelWidth: 420, maxVisiblePanels: 3, mainViewMinWidth: 550 },
};

/**
 * Hook to determine default layout values based on container width.
 * @param containerWidth The current width of the DetailPanels container.
 * @returns An object containing default panelWidth, maxVisiblePanels, and mainViewMinWidth.
 */
export function useResponsivePanelDefaults(containerWidth: number): ResponsiveDefaults {
  const defaults = useMemo(() => {
    if (containerWidth >= BREAKPOINTS['2xl']) {
      return DEFAULT_CONFIGS['2xl'];
    }
    if (containerWidth >= BREAKPOINTS.xl) {
      return DEFAULT_CONFIGS.xl;
    }
    if (containerWidth >= BREAKPOINTS.lg) {
      return DEFAULT_CONFIGS.lg;
    }
    if (containerWidth >= BREAKPOINTS.md) {
      return DEFAULT_CONFIGS.md;
    }
    if (containerWidth >= BREAKPOINTS.sm) {
      return DEFAULT_CONFIGS.sm;
    }
    return DEFAULT_CONFIGS.base;
  }, [containerWidth]);

  return defaults;
}
