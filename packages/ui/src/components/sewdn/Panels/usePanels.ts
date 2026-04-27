import { useEffect, useMemo, useCallback } from 'react';
import type { CalculatedPanelState, UsePanelsArgs, UsePanelsReturn } from './types';
// Final correct imports
import {
  calculateNaturalLayout,
  configurePanelLayoutCalculator,
  type LayoutConfig,
  type PanelLayoutInfo,
} from './helpers';

const DEFAULT_PANEL_WIDTH = 504;
const DEFAULT_MAX_PANELS = 5;
const DEFAULT_MAX_VISIBLE_PANELS = 3;
const DEFAULT_MAIN_VIEW_MIN_WIDTH = 600;
const DEFAULT_BREAKPOINT = 'sm';
const DEFAULT_STACKED_PANEL_WIDTH = 80;

// Mapping of breakpoint keys to default Tailwind pixel values
const breakpointValues: Record<NonNullable<UsePanelsArgs['breakpoint']>, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function usePanels({
  panels,
  containerWidth,
  activePanelId,
  panelWidth = DEFAULT_PANEL_WIDTH,
  maxPanels: _maxPanels = DEFAULT_MAX_PANELS,
  maxVisiblePanels = DEFAULT_MAX_VISIBLE_PANELS,
  mainViewMinWidth = DEFAULT_MAIN_VIEW_MIN_WIDTH,
  breakpoint,
  stackedPanelWidth = DEFAULT_STACKED_PANEL_WIDTH,
  onClose,
  onDockedPanelsChange,
  onActivateRequest,
}: UsePanelsArgs): UsePanelsReturn {
  const displayMode = useMemo((): 'docked' | 'overlay' => {
    const effectiveBreakpoint = breakpoint || DEFAULT_BREAKPOINT;
    const threshold = breakpointValues[effectiveBreakpoint];
    return containerWidth > 0 && containerWidth <= threshold ? 'overlay' : 'docked';
  }, [containerWidth, breakpoint]);

  const layoutConfig = useMemo(
    (): LayoutConfig => ({
      panelWidth,
      stackedPanelWidth,
      maxVisiblePanels,
      mainViewMinWidth,
      containerWidth,
    }),
    [panelWidth, stackedPanelWidth, maxVisiblePanels, mainViewMinWidth, containerWidth]
  );

  // Memoize the configured layout calculator function
  const calculateNaturalLayoutFn = useMemo(
    () => calculateNaturalLayout(layoutConfig),
    [layoutConfig]
  );
  const calculatePanelLayoutsFn = useMemo(
    () => configurePanelLayoutCalculator(layoutConfig),
    [layoutConfig]
  );

  const processedLayout = useMemo(() => {
    let calculatedPanelsData: CalculatedPanelState[];
    let finalTotalVisibleWidth = 0;

    // Find the index of the active panel
    const activePanelIndex =
      activePanelId != null ? panels.findIndex(p => p.id === activePanelId) : null;
    const finalActiveIndex = activePanelIndex === -1 ? null : activePanelIndex;

    if (displayMode === 'overlay') {
      calculatedPanelsData = panels.map((panel, index) => ({
        id: panel.id,
        panelType: panel.id,
        content: panel.content,
        mode: 'overlay',
        state: 'full',
        position: {
          right: 0,
          zIndex: index,
          width: containerWidth || window.innerWidth, // Use width
        },
      }));
      finalTotalVisibleWidth = 0;
    } else {
      // Docked mode logic using the combined helper
      const naturalLayout = calculateNaturalLayoutFn(panels.length);

      // Get layout map and final width from helper
      const { panelLayouts, totalVisibleWidth } = calculatePanelLayoutsFn(
        panels, // Pass panels array
        naturalLayout,
        finalActiveIndex
      );
      finalTotalVisibleWidth = totalVisibleWidth;

      // Construct final array from map
      calculatedPanelsData = panels.map(panel => {
        const layoutInfo = panelLayouts.get(panel.id) as PanelLayoutInfo;
        return {
          id: panel.id,
          panelType: panel.id,
          content: panel.content,
          mode: 'docked',
          state: layoutInfo.state,
          // IMPORTANT: Need to match position structure { right, zIndex, width }
          position: {
            right: layoutInfo.position.right,
            zIndex: layoutInfo.position.zIndex,
            width: layoutInfo.position.baseWidth, // Map baseWidth back to width
          },
        };
      });
    }

    return { calculatedPanels: calculatedPanelsData, totalVisibleWidth: finalTotalVisibleWidth };
  }, [
    panels,
    layoutConfig,
    activePanelId,
    displayMode,
    containerWidth,
    calculateNaturalLayoutFn,
    calculatePanelLayoutsFn,
  ]); // Update deps

  // --- Handlers to be returned ---
  const removePanel = useCallback(
    (panelId: string) => {
      onClose(panelId);
    },
    [onClose]
  );

  const activateStackedPanel = useCallback(
    (panelId: string) => {
      onActivateRequest(panelId);
    },
    [onActivateRequest]
  );

  // --- Effect for Docked Change Callback ---
  useEffect(() => {
    if (displayMode === 'docked') {
      const dockedPanelIds = processedLayout.calculatedPanels
        .filter(p => p.mode === 'docked' && p.state !== 'hidden')
        .map(p => p.id);
      onDockedPanelsChange?.(dockedPanelIds);
    }
  }, [processedLayout.calculatedPanels, displayMode, onDockedPanelsChange]);

  // --- Return Value ---
  return {
    calculatedPanels: processedLayout.calculatedPanels,
    displayMode,
    activePanelId,
    removePanel,
    activateStackedPanel,
    totalVisibleWidth: processedLayout.totalVisibleWidth,
  };
}
