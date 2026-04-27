import React from 'react';

// Placeholder for the actual data structure of a panel
export interface PanelData {
  id: string;
  content: React.ReactNode;
  // Add other panel-specific data as needed
}

// Configuration properties for the Panels component
// NOW: Props for the PRESENTATIONAL component
export interface PanelsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode; // Expected to be the MainView

  // Data directly from the hook's result
  calculatedPanels: CalculatedPanelState[];
  displayMode: 'docked' | 'overlay';
  totalVisibleWidth: number;

  // Callbacks needed by the <Panel> component
  removePanel: (panelId: string) => void;
  activateStackedPanel: (panelId: string) => void;

  // Necessary config/state from parent for layout calculation
  mainViewMinWidth: number;
  containerWidth: number; // Needed to calculate main view width
}

// Calculated state for an individual panel within the hook
export interface CalculatedPanelState {
  id: string;
  panelType: string;
  content: React.ReactNode;
  mode: 'docked' | 'overlay';
  state: 'full' | 'stacked' | 'hidden';
  position: {
    right: number;
    zIndex: number;
    width: number;
  };
}

// Type for the value returned by the usePanels hook
// Needs to align with props passed to the presentational component
export interface UsePanelsReturn {
  calculatedPanels: CalculatedPanelState[];
  displayMode: 'docked' | 'overlay';
  totalVisibleWidth: number;
  activePanelId: string | null;
  removePanel: (panelId: string) => void;
  activateStackedPanel: (panelId: string) => void;
}

// --- Core Configuration Options ---
export type PanelsConfigProps = {
  panelWidth?: number;
  maxPanels?: number; // Max total panels allowed
  maxVisiblePanels?: number; // Max panels visible without stacking in docked mode
  mainViewMinWidth?: number;
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'; // Breakpoint for switching to overlay mode
  stackedPanelWidth?: number; // Width of stacked panels in docked mode
  onDockedPanelsChange?: (dockedPanelIds: string[]) => void; // Callback when docked panels change
};

// Type for the arguments the core usePanels hook expects
// Combines config with state/callback args
export interface UsePanelsArgs extends PanelsConfigProps {
  panels: PanelData[];
  activePanelId: string | null;
  containerWidth: number;
  onClose: (id: string) => void;
  onActivateRequest: (id: string) => void;
  // Note: panelWidth, maxVisiblePanels, mainViewMinWidth are inherited from PanelsConfigProps
}

export type UseDetailPanelsArgs = UsePanelsArgs;
export type UseDetailPanelsReturn = UsePanelsReturn;
export type DetailPanelsProps = PanelsConfigProps;

// --- Serializable Types Definition ---
// Basic definition - might need refinement based on exact needs
// type SerializablePrimitive = string | number | boolean | null | undefined;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
// interface SerializableObject extends Record<string, SerializableValue> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
// interface SerializableArray extends Array<SerializableValue> {}
// type SerializableValue = SerializablePrimitive | SerializableObject | SerializableArray;

// Type for the props map values that can be persisted
// export type SerializableProps = Record<string, SerializableValue> | undefined; // Removed definition
