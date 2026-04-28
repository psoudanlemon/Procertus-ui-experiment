import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  createElement,
} from 'react';
import type { ComponentType } from 'react';
import { PanelsContext, type PanelsContextType } from './PanelsContext';
import { usePanels } from './usePanels';
import { useResponsivePanelDefaults } from './useResponsivePanelDefaults';
import type {
  PanelData,
  PanelsConfigProps,
} from './types';
import { useNoPersistence, type PersistenceLayer, type SerializableProps } from './persistence';

// --- Props (Accept containerWidth) ---
type PanelsProviderProps<TPanelRegistry extends Record<string, ComponentType<any>>> =
  PanelsConfigProps & {
    containerWidth: number; // Required prop for width
    persistenceLayer?: PersistenceLayer;
    children: React.ReactNode;
    panelTypes: TPanelRegistry;
  };

export function PanelsProvider<TPanelRegistry extends Record<string, ComponentType<any>>>({
  children,
  containerWidth, // Use prop
  persistenceLayer: userPersistenceLayer,
  panelTypes,
  ...configProps
}: PanelsProviderProps<TPanelRegistry>) {
  // --- Setup Persistence Layer (Default to NoPersistence) ---
  const noPersistenceLayer = useNoPersistence();
  const persistenceLayer = userPersistenceLayer ?? noPersistenceLayer;

  // --- Get Responsive Defaults (using passed containerWidth) ---
  const responsiveDefaults = useResponsivePanelDefaults(containerWidth);

  // --- Determine Final Config Values ---
  const finalPanelWidth = configProps.panelWidth ?? responsiveDefaults.panelWidth;
  const finalMaxVisiblePanels = configProps.maxVisiblePanels ?? responsiveDefaults.maxVisiblePanels;
  const finalMainViewMinWidth = configProps.mainViewMinWidth ?? responsiveDefaults.mainViewMinWidth;
  const maxPanels = configProps.maxPanels;
  const breakpoint = configProps.breakpoint;
  const stackedPanelWidth = configProps.stackedPanelWidth;

  // --- State synchronized with Persistence Layer ---
  const [openPanelTypes, setOpenPanelTypes] = useState<string[]>(() =>
    persistenceLayer.getOpenPanelTypes()
  );
  const [panelPropsMap, setPanelPropsMap] = useState<
    Record<string, Record<string, any> | undefined>
  >(() => persistenceLayer.getPanelPropsMap());
  const [activePanelType, setActivePanelType] = useState<string | null>(() =>
    persistenceLayer.getActivePanelType()
  );

  // Effect to subscribe and read state (using the determined layer)
  useEffect(() => {
    const initialTypes = persistenceLayer.getOpenPanelTypes();
    const initialPropsMap = persistenceLayer.getPanelPropsMap();
    const initialActiveType = persistenceLayer.getActivePanelType();

    setOpenPanelTypes(initialTypes);
    setPanelPropsMap(initialPropsMap);
    setActivePanelType(initialActiveType);

    const unsubscribe = persistenceLayer.subscribe(() => {
      setOpenPanelTypes(persistenceLayer.getOpenPanelTypes());
      setPanelPropsMap(persistenceLayer.getPanelPropsMap());
      setActivePanelType(persistenceLayer.getActivePanelType());
    });

    return unsubscribe;
  }, [persistenceLayer]);

  // --- Callbacks ---
  const handleClose = useCallback(
    (type: string | keyof TPanelRegistry) => {
      const typeStr = type as string;
      const newTypes = openPanelTypes.filter(t => t !== typeStr);
      const newPropsMap = { ...panelPropsMap };
      delete newPropsMap[typeStr];
      persistenceLayer.setOpenPanelTypes(newTypes);
      persistenceLayer.setPanelPropsMap(newPropsMap);
      if (activePanelType === typeStr) persistenceLayer.setActivePanelType(null);
      setOpenPanelTypes(newTypes);
      setPanelPropsMap(newPropsMap);
      if (activePanelType === typeStr) setActivePanelType(null);
    },
    [openPanelTypes, panelPropsMap, activePanelType, persistenceLayer]
  );

  const handleActivateRequest = useCallback(
    (type: string | keyof TPanelRegistry) => {
      const typeStr = type as string;
      if (!openPanelTypes.includes(typeStr)) return;
      const newActiveType = activePanelType === typeStr ? null : typeStr;
      const newTypes = [...openPanelTypes.filter(t => t !== typeStr), typeStr];
      persistenceLayer.setActivePanelType(newActiveType);
      persistenceLayer.setOpenPanelTypes(newTypes);
      setActivePanelType(newActiveType);
      setOpenPanelTypes(newTypes);
    },
    [openPanelTypes, activePanelType, persistenceLayer]
  );

  // --- Reconstruct PanelData for Core Hook ---
  const panelsData = useMemo((): PanelData[] => {
    const data: PanelData[] = [];
    for (const type of openPanelTypes) {
      const PanelComponent = panelTypes[type];
      if (!PanelComponent) {
        console.error(`PanelsProvider: Unknown panel type "${type}".`);
        continue;
      }
      const props = panelPropsMap[type] || {}; // Serializable props
      const componentProps = {
        ...props,
        panelType: type, // Inject panelType
      };
      const content = createElement(PanelComponent, componentProps as any);
      data.push({ id: type, content: content as React.ReactNode });
    }
    return data;
  }, [openPanelTypes, panelPropsMap, panelTypes]);

  // --- openPanel function ---
  const openPanel = useCallback(
    <TType extends keyof TPanelRegistry>(type: TType, props?: SerializableProps): void => {
      const typeStr = type as string;
      if (!panelTypes[typeStr]) {
        console.error(`PanelsProvider: Attempted to open unknown panel type "${typeStr}".`);
        return;
      }
      const alreadyOpen = openPanelTypes.includes(typeStr);
      const newProps = props;

      let newTypes = openPanelTypes;
      if (alreadyOpen) {
        newTypes = [...openPanelTypes.filter(t => t !== typeStr), typeStr];
      } else {
        if (maxPanels && openPanelTypes.length >= maxPanels) {
          console.warn(`PanelsProvider: Max panels (${maxPanels}) reached.`);
          return;
        }
        newTypes = [...openPanelTypes, typeStr];
      }
      const newPropsMap = { ...panelPropsMap, [typeStr]: newProps };

      persistenceLayer.setOpenPanelTypes(newTypes);
      persistenceLayer.setPanelPropsMap(newPropsMap);
      persistenceLayer.setActivePanelType(typeStr);

      setPanelPropsMap(newPropsMap);
      setOpenPanelTypes(newTypes);
      setActivePanelType(typeStr);
    },
    [openPanelTypes, panelPropsMap, persistenceLayer, maxPanels, panelTypes]
  );

  // --- getPanelProps function ---
  const getPanelProps = useCallback(
    (type: keyof TPanelRegistry): SerializableProps => {
      return panelPropsMap[type as string];
    },
    [panelPropsMap]
  );

  // --- Call the CORE usePanels hook ---
  const PanelsResult = usePanels({
    // Pass config props and calculated values
    containerWidth,
    panels: panelsData,
    activePanelId: activePanelType,
    onClose: handleClose,
    onActivateRequest: handleActivateRequest,
    panelWidth: finalPanelWidth,
    maxVisiblePanels: finalMaxVisiblePanels,
    mainViewMinWidth: finalMainViewMinWidth,
    maxPanels: maxPanels,
    breakpoint: breakpoint,
    stackedPanelWidth: stackedPanelWidth,
    // Pass the original callback directly, assuming the hook calls it with string[]
    onDockedPanelsChange: configProps.onDockedPanelsChange,
  });

  // --- Provide context value ---
  const contextValue = useMemo(
    (): PanelsContextType<TPanelRegistry> => ({
      calculatedPanels: PanelsResult.calculatedPanels.map(p => ({ ...p, panelType: p.id })),
      displayMode: PanelsResult.displayMode,
      totalVisibleWidth: PanelsResult.totalVisibleWidth,
      activePanelType: activePanelType,
      containerWidth, // Use width from prop
      openPanel: openPanel as PanelsContextType<TPanelRegistry>['openPanel'],
      removePanel: handleClose,
      activateStackedPanel: handleActivateRequest,
      getPanelProps: getPanelProps as PanelsContextType<TPanelRegistry>['getPanelProps'],
      // Echo back the FINAL config values used
      panelWidth: finalPanelWidth,
      maxPanels: maxPanels,
      maxVisiblePanels: finalMaxVisiblePanels,
      mainViewMinWidth: finalMainViewMinWidth,
      breakpoint: breakpoint,
      stackedPanelWidth: stackedPanelWidth,
      // Echo the original callback prop type
      onDockedPanelsChange: configProps.onDockedPanelsChange,
    }),
    [
      PanelsResult,
      activePanelType,
      containerWidth,
      openPanel,
      handleClose,
      handleActivateRequest,
      getPanelProps,
      finalPanelWidth,
      maxPanels,
      finalMaxVisiblePanels,
      finalMainViewMinWidth,
      breakpoint,
      stackedPanelWidth,
      configProps.onDockedPanelsChange, // Original callback is the dependency
    ]
  );

  // --- Render Provider without wrapper div ---
  return (
    <PanelsContext.Provider value={contextValue as PanelsContextType<any>}>
      {children}
    </PanelsContext.Provider>
  );
}

// Ensure the context itself is exported
export { PanelsContext };
export type { PanelsContextType };
