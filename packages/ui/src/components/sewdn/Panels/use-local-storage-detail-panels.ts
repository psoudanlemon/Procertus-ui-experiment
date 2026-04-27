import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { useLocalStorage } from '../hooks/use-local-storage';
import { usePanels as useDetailPanels } from './usePanels';
import type {
  PanelData,
  UseDetailPanelsArgs,
  UseDetailPanelsReturn,
} from './types';

// Omit the state/callback props AND containerWidth
type UseLocalStorageDetailPanelsOptions = Omit<
  UseDetailPanelsArgs,
  'panels' | 'activePanelId' | 'onClose' | 'onActivateRequest' | 'containerWidth' // Remove containerWidth
> & {
  localStorageKey: string;
  // containerWidth is no longer needed here
};

// Explicitly define the expanded return type
interface UseLocalStorageDetailPanelsReturn extends UseDetailPanelsReturn {
  addPanel: (id: string, content: React.ReactNode) => void;
  // Optional: Add function to manually provide initial content mapping
  // setInitialContent: (id: string, content: React.ReactNode) => void;
}

export function useLocalStorageDetailPanels({
  localStorageKey,
  // containerWidth, // Removed
  maxPanels,
  ...restOptions
}: UseLocalStorageDetailPanelsOptions): UseLocalStorageDetailPanelsReturn {
  const panelContentMap = useRef<Map<string, React.ReactNode>>(new Map());
  const containerWidth =
    typeof window === 'undefined' ? 0 : window.innerWidth;

  const [storedPanelIds, setStoredPanelIds] = useLocalStorage<string[]>(
    `${localStorageKey}-ids`,
    []
  );
  const [activePanelId, setActivePanelId] = useLocalStorage<string | null>(
    `${localStorageKey}-activeId`,
    null
  );

  // Reconstruct PanelData array for the core hook
  const panelsData = useMemo((): PanelData[] => {
    const data: PanelData[] = [];
    for (const id of storedPanelIds) {
      const content = panelContentMap.current.get(id);
      if (content) {
        data.push({ id, content });
      }
    }
    return data;
    // This relies on the content map being populated correctly via addPanel
    // or potentially an initial population mechanism.
  }, [storedPanelIds]);

  // Internal handlers that update local storage
  const handleClose = useCallback(
    (id: string) => {
      panelContentMap.current.delete(id); // Clean up content map
      setStoredPanelIds(prev => prev.filter(panelId => panelId !== id));
      if (activePanelId === id) {
        setActivePanelId(null);
      }
    },
    [activePanelId, setActivePanelId, setStoredPanelIds]
  );

  const handleActivateRequest = useCallback(
    (id: string) => {
      setActivePanelId(prev => (prev === id ? null : id));
    },
    [setActivePanelId]
  );

  // The new function exposed by this hook
  const addPanel = useCallback(
    (id: string, content: React.ReactNode) => {
      if (maxPanels && storedPanelIds.length >= maxPanels && !storedPanelIds.includes(id)) {
        console.warn(
          `DetailPanels (localStorage): Max panels (${maxPanels}) reached. Cannot add new panel "${id}".`
        );
        return;
      }

      panelContentMap.current.set(id, content); // Store/update content mapping

      setStoredPanelIds(prev => {
        if (prev.includes(id)) {
          return prev; // Already exists, content map updated above
        }
        return [...prev, id]; // Add new panel ID
      });
    },
    [setStoredPanelIds, storedPanelIds, maxPanels]
  );

  // UseEffect to potentially clean up content map if IDs change externally
  // or on unmount (though unmount cleanup might be tricky with localStorage)
  useEffect(() => {
    const currentIds = new Set(storedPanelIds);
    // Fix for iterator issue: Convert keys to array first
    const mappedIds = Array.from(panelContentMap.current.keys());
    for (const mappedId of mappedIds) {
      if (!currentIds.has(mappedId)) {
        panelContentMap.current.delete(mappedId);
      }
    }
  }, [storedPanelIds]);

  // This internal call still needs containerWidth, which the Provider will manage.
  // We'll adjust the Provider next to pass it correctly.
  const detailPanelsResult = useDetailPanels({
    panels: panelsData,
    // containerWidth will be passed by the Provider
    activePanelId,
    onClose: handleClose,
    onActivateRequest: handleActivateRequest,
    maxPanels,
    ...restOptions,
    containerWidth,
  });

  return {
    ...detailPanelsResult,
    addPanel,
  };
}
