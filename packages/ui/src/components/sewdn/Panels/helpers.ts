// Helper functions for DetailPanels layout calculations

import type { PanelData, CalculatedPanelState } from './types';

// --- Type Definitions ---

export interface NaturalLayoutResult {
  // Export if needed by tests
  numFull: number;
  numStacked: number;
  numHidden: number;
  totalVisibleWidth: number;
}

export interface LayoutConfig {
  // Export if needed by tests
  panelWidth: number;
  stackedPanelWidth: number;
  maxVisiblePanels: number;
  mainViewMinWidth: number;
  containerWidth: number;
}

// Type for combined result from helper
export interface PanelLayoutInfo {
  position: {
    right: number;
    zIndex: number;
    baseWidth: number; // Keep baseWidth for inner div
  };
  state: CalculatedPanelState['state'];
}

// Result includes map from ID to layout info and total width based on FINAL states
interface LayoutCalculationResult {
  panelLayouts: Map<string, PanelLayoutInfo>;
  totalVisibleWidth: number;
}

// --- Helper Functions ---

// Standalone calculateNaturalLayout
export const calculateNaturalLayout =
  ({
    containerWidth,
    mainViewMinWidth,
    maxVisiblePanels,
    panelWidth,
    stackedPanelWidth,
  }: LayoutConfig) =>
  (panelCount: number): NaturalLayoutResult => {
    const potentialPanelWidth = Math.max(0, containerWidth - mainViewMinWidth);
    const numFull = Math.min(
      panelCount,
      maxVisiblePanels,
      Math.floor(potentialPanelWidth / panelWidth)
    );
    const widthAfterFull = Math.max(0, potentialPanelWidth - numFull * panelWidth);
    const numStacked = Math.min(
      Math.max(0, panelCount - numFull),
      Math.max(0, maxVisiblePanels - numFull),
      Math.floor(widthAfterFull / stackedPanelWidth)
    );
    const numHidden = Math.max(0, panelCount - numFull - numStacked);
    const totalVisibleWidth = numFull * panelWidth + numStacked * stackedPanelWidth;
    return { numFull, numStacked, numHidden, totalVisibleWidth };
  };

/**
 * Returns a function specialized for calculating final panel layouts (state & position)
 * based on the given config and active panel.
 */
export function configurePanelLayoutCalculator(config: LayoutConfig): (
  // Keep this name
  panels: PanelData[], // Needs panels array
  naturalLayout: NaturalLayoutResult,
  activePanelIndex: number | null | undefined
) => LayoutCalculationResult {
  // Return combined info
  return (
    panels: PanelData[], // Needs panels array
    naturalLayout: NaturalLayoutResult,
    activePanelIndex: number | null | undefined
  ): LayoutCalculationResult => {
    const panelCount = panels.length;
    const { numFull: naturalNumFull, numStacked: naturalNumStacked } = naturalLayout;

    // Determine demotedPanelIndex
    let demotedPanelIndex: number | null = null;
    if (activePanelIndex != null) {
      const activePanelIndexFromRight = panelCount - 1 - activePanelIndex;
      const isActiveNaturallyFull = activePanelIndexFromRight < naturalNumFull;
      if (!isActiveNaturallyFull && naturalNumFull > 0) {
        demotedPanelIndex = panelCount - 1;
      }
    }

    // First pass: Determine final state and count final visible panels
    const panelStates: Array<{ finalState: CalculatedPanelState['state'] }> = [];
    let finalNumFull = 0;
    let finalNumStacked = 0;
    for (let i = 0; i < panelCount; i++) {
      const panelIndexFromRight = panelCount - 1 - i;
      let naturalState: CalculatedPanelState['state'] = 'hidden';
      if (panelIndexFromRight < naturalNumFull) naturalState = 'full';
      else if (panelIndexFromRight < naturalNumFull + naturalNumStacked) naturalState = 'stacked';

      let finalState: CalculatedPanelState['state'];
      if (i === activePanelIndex) finalState = 'full';
      else if (i === demotedPanelIndex) finalState = 'stacked';
      else finalState = naturalState;

      panelStates.push({ finalState });
      if (finalState === 'full') finalNumFull++;
      else if (finalState === 'stacked') finalNumStacked++;
    }

    // Calculate total width based on FINAL states
    const finalTotalVisibleWidth =
      finalNumFull * config.panelWidth + finalNumStacked * config.stackedPanelWidth;

    // Second pass: Calculate offsets based on final states
    let currentRightOffset = -config.panelWidth;
    const panelLayouts = new Map<string, PanelLayoutInfo>();

    for (let i = panelCount - 1; i >= 0; i--) {
      const panel = panels[i];
      const { finalState } = panelStates[i];
      if (finalState === 'full') currentRightOffset += config.panelWidth;
      else if (finalState === 'stacked') currentRightOffset += config.stackedPanelWidth;
      const position: PanelLayoutInfo['position'] = {
        right: currentRightOffset,
        zIndex: finalState === 'hidden' ? -1 : i,
        baseWidth: config.panelWidth,
      };
      panelLayouts.set(panel.id, { position, state: finalState });
    }

    // <<< REMOVE Log Here >>>
    // console.log('[configurePanelLayoutCalculator] Final Layouts:', Object.fromEntries(panelLayouts.entries()));

    return { panelLayouts, totalVisibleWidth: finalTotalVisibleWidth };
  };
}
