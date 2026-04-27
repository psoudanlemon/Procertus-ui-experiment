import React, { useCallback, useMemo, useRef, useEffect } from 'react';
// Note: This requires a way to update the URL, typically via a router's navigate function.
// We'll assume a `useNavigate` hook exists from a router library (like react-router-dom)
// or a manual `window.history.pushState` approach if no router is present.
// For simplicity, this example might not fully implement the URL update part
// without knowing the exact routing setup.
import { useLocation, useNavigate } from 'react-router-dom'; // EXAMPLE: using react-router-dom
import { usePanels as useDetailPanels } from './usePanels';
import type {
  PanelData,
  UseDetailPanelsArgs,
  UseDetailPanelsReturn,
} from './types';

const PANEL_ID_QUERY_PARAM = 'panels';
const ACTIVE_PANEL_QUERY_PARAM = 'activePanel';

// Omit the state/callback props AND containerWidth
type UseUrlQueryDetailPanelsOptions = Omit<
  UseDetailPanelsArgs,
  'panels' | 'activePanelId' | 'onClose' | 'onActivateRequest' | 'containerWidth' // Remove containerWidth
> & {
  // containerWidth is no longer needed here
};

// Explicitly define the expanded return type
interface UseUrlQueryDetailPanelsReturn extends UseDetailPanelsReturn {
  addPanel: (id: string, content: React.ReactNode) => void;
}

export function useUrlQueryDetailPanels({
  maxPanels,
  ...restOptions
}: UseUrlQueryDetailPanelsOptions): UseUrlQueryDetailPanelsReturn {
  const panelContentMap = useRef<Map<string, React.ReactNode>>(new Map());
  const containerWidth =
    typeof window === 'undefined' ? 0 : window.innerWidth;
  const location = useLocation(); // from react-router-dom
  const navigate = useNavigate(); // from react-router-dom

  // --- Read state from URL ---
  const { currentPanelIds, activePanelId } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const panelString = params.get(PANEL_ID_QUERY_PARAM);
    const panelIds = panelString ? panelString.split(',') : [];
    const activeId = params.get(ACTIVE_PANEL_QUERY_PARAM) || null;
    return { currentPanelIds: panelIds, activePanelId: activeId };
  }, [location.search]);

  // --- Helper to update URL ---
  const updateUrlParams = useCallback(
    (newPanelIds: string[], newActiveId: string | null) => {
      const params = new URLSearchParams(location.search);
      if (newPanelIds.length > 0) {
        params.set(PANEL_ID_QUERY_PARAM, newPanelIds.join(','));
      } else {
        params.delete(PANEL_ID_QUERY_PARAM);
      }

      if (newActiveId) {
        params.set(ACTIVE_PANEL_QUERY_PARAM, newActiveId);
      } else {
        params.delete(ACTIVE_PANEL_QUERY_PARAM);
      }

      // Use navigate to update URL without full page reload
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    },
    [location.search, location.pathname, navigate]
  );

  // Reconstruct PanelData array for the core hook
  const panelsData = useMemo((): PanelData[] => {
    const data: PanelData[] = [];
    for (const id of currentPanelIds) {
      const content = panelContentMap.current.get(id);
      if (content) {
        data.push({ id, content });
      }
    }
    return data;
  }, [currentPanelIds]);

  // Internal handlers that update URL state
  const handleClose = useCallback(
    (id: string) => {
      panelContentMap.current.delete(id);
      const newPanelIds = currentPanelIds.filter(panelId => panelId !== id);
      const newActiveId = activePanelId === id ? null : activePanelId;
      updateUrlParams(newPanelIds, newActiveId);
    },
    [currentPanelIds, activePanelId, updateUrlParams]
  );

  const handleActivateRequest = useCallback(
    (id: string) => {
      const newActiveId = activePanelId === id ? null : id;
      updateUrlParams(currentPanelIds, newActiveId);
    },
    [currentPanelIds, activePanelId, updateUrlParams]
  );

  // The new function exposed by this hook
  const addPanel = useCallback(
    (id: string, content: React.ReactNode) => {
      if (maxPanels && currentPanelIds.length >= maxPanels && !currentPanelIds.includes(id)) {
        console.warn(
          `DetailPanels (URL Query): Max panels (${maxPanels}) reached. Cannot add new panel "${id}".`
        );
        return;
      }

      panelContentMap.current.set(id, content);

      const newPanelIds = currentPanelIds.includes(id) ? currentPanelIds : [...currentPanelIds, id];
      const newActiveId = activePanelId; // Keep current active panel
      updateUrlParams(newPanelIds, newActiveId);
    },
    [currentPanelIds, activePanelId, updateUrlParams, maxPanels]
  );

  // UseEffect to potentially clean up content map if IDs change externally
  useEffect(() => {
    const currentIdsSet = new Set(currentPanelIds);
    const mappedIds = Array.from(panelContentMap.current.keys());
    for (const mappedId of mappedIds) {
      if (!currentIdsSet.has(mappedId)) {
        panelContentMap.current.delete(mappedId);
      }
    }
  }, [currentPanelIds]);

  // Call the original hook with managed state read from URL
  // This internal call still needs containerWidth, which the Provider will manage.
  const detailPanelsResult = useDetailPanels({
    panels: panelsData,
    activePanelId, // Directly use the value read from URL
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
