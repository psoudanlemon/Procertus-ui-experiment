import { createContext, useContext } from 'react';
import type { ComponentType } from 'react';
import type { UsePanelsArgs, CalculatedPanelState } from './types';
import type { SerializableProps } from './persistence'; // Correct import for SerializableProps

// Define the shape of the context value, now generic over the panel registry
// TPanelRegistry represents the map like { typeName: ComponentType<Props> }
export interface PanelsContextType<
  TPanelRegistry extends Record<string, ComponentType<any>> = Record<string, ComponentType<any>>, // Default generic
> {
  // Layout state (id is now panelType)
  calculatedPanels: CalculatedPanelState[];
  displayMode: 'docked' | 'overlay';
  totalVisibleWidth: number;
  // Config accessible via context
  containerWidth: number;
  panelWidth?: number;
  maxPanels?: number;
  maxVisiblePanels?: number;
  mainViewMinWidth?: number;
  breakpoint?: UsePanelsArgs['breakpoint'];
  stackedPanelWidth?: number;
  // State managed via persistence layer
  activePanelType: string | null;
  // Get current props for a specific open panel type
  getPanelProps: (type: keyof TPanelRegistry) => SerializableProps | undefined;
  // Actions with updated signatures
  openPanel: <TType extends keyof TPanelRegistry>(type: TType, props?: SerializableProps) => void; // Return void now
  removePanel: (type: keyof TPanelRegistry | string) => void; // Can close by type
  activateStackedPanel: (type: keyof TPanelRegistry | string) => void; // Activate by type
  onDockedPanelsChange?: (dockedPanelIds: string[]) => void;
}

// Create the context with a default value that matches the *base* type.
// We need to cast the context when consuming it if we want the specific registry type.
const defaultContextValue: PanelsContextType<any> = {
  calculatedPanels: [],
  displayMode: 'docked',
  totalVisibleWidth: 0,
  removePanel: () => {
    console.warn('removePanel called outside Provider');
  },
  activateStackedPanel: () => {
    console.warn('activateStackedPanel called outside Provider');
  },
  // Default openPanel needs a generic signature placeholder or error
  openPanel: <TType extends keyof any>(_type: TType, _props?: SerializableProps) => {
    console.warn('openPanel called outside Provider');
  },
  getPanelProps: () => {
    console.warn('getPanelProps called outside Provider');
    return undefined;
  },
  containerWidth: 0,
  activePanelType: null,
  panelWidth: undefined,
  maxPanels: undefined,
  maxVisiblePanels: undefined,
  mainViewMinWidth: undefined,
  breakpoint: undefined,
  stackedPanelWidth: undefined,
  onDockedPanelsChange: () => {
    console.warn('onDockedPanelsChange called outside Provider');
  },
};
// The context itself holds the base type
export const PanelsContext = createContext<PanelsContextType<any>>(defaultContextValue);

// Consumer hook becomes generic
export function usePanelsContext<
  TPanelRegistry extends Record<string, ComponentType<any>> = Record<string, ComponentType<any>>,
>(): PanelsContextType<TPanelRegistry> {
  // Cast the context value to the specific registry type expected by the consumer
  return useContext(PanelsContext) as PanelsContextType<TPanelRegistry>;
}
