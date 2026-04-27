import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/use-local-storage';
import { useLocation, useNavigate } from 'react-router-dom';

// --- Serializable Types ---
// Basic definition - might need refinement based on exact needs
type SerializablePrimitive = string | number | boolean | null | undefined;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SerializableObject extends Record<string, SerializableValue> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SerializableArray extends Array<SerializableValue> {}
type SerializableValue = SerializablePrimitive | SerializableObject | SerializableArray;

// Type for the props map values
export type SerializableProps = Record<string, SerializableValue> | undefined;

// --- Updated Interface ---
export interface PersistenceLayer {
  getOpenPanelTypes: () => string[];
  getPanelPropsMap: () => Record<string, SerializableProps>;
  getActivePanelType: () => string | null;
  setOpenPanelTypes: (types: string[]) => void;
  setPanelPropsMap: (propsMap: Record<string, SerializableProps>) => void;
  setActivePanelType: (type: string | null) => void;
  subscribe: (callback: () => void) => () => void;
}

// --- Implementations ---

// 1. No Persistence
export function useNoPersistence(): PersistenceLayer {
  const [openPanelTypes, setOpenPanelTypesState] = useState<string[]>([]);
  const [panelPropsMap, setPanelPropsMapState] = useState<Record<string, SerializableProps>>({});
  const [activePanelType, setActivePanelTypeState] = useState<string | null>(null);

  const getOpenPanelTypes = useCallback(() => openPanelTypes, [openPanelTypes]);
  const getPanelPropsMap = useCallback(() => panelPropsMap, [panelPropsMap]);
  const getActivePanelType = useCallback(() => activePanelType, [activePanelType]);

  const setOpenPanelTypes = useCallback((types: string[]) => {
    setOpenPanelTypesState(types);
  }, []);
  const setPanelPropsMap = useCallback((propsMap: Record<string, SerializableProps>) => {
    setPanelPropsMapState(propsMap);
  }, []);
  const setActivePanelType = useCallback((type: string | null) => {
    setActivePanelTypeState(type);
  }, []);

  const subscribe = useCallback((_callback: () => void) => () => {}, []);

  return {
    getOpenPanelTypes,
    getPanelPropsMap,
    getActivePanelType,
    setOpenPanelTypes,
    setPanelPropsMap,
    setActivePanelType,
    subscribe,
  };
}

// 2. LocalStorage Persistence
export function useLocalStoragePersistence(localStorageKey: string): PersistenceLayer {
  const [openPanelTypes, setOpenPanelTypes] = useLocalStorage<string[]>(
    `${localStorageKey}-types`,
    []
  );
  const [panelPropsMapStr, setPanelPropsMapStr] = useLocalStorage<string>(
    `${localStorageKey}-propsMap`,
    '{}'
  );
  const [activePanelType, setActivePanelType] = useLocalStorage<string | null>(
    `${localStorageKey}-activeType`,
    null
  );

  // Deserialize props map, casting to the SerializableProps type
  const panelPropsMap = useMemo((): Record<string, SerializableProps> => {
    try {
      return JSON.parse(panelPropsMapStr) as Record<string, SerializableProps>;
    } catch (e) {
      console.error('Error parsing propsMap from localStorage', e);
      return {};
    }
  }, [panelPropsMapStr]);

  const getOpenPanelTypes = useCallback(() => openPanelTypes, [openPanelTypes]);
  const getPanelPropsMap = useCallback(() => panelPropsMap, [panelPropsMap]);
  const getActivePanelType = useCallback(() => activePanelType, [activePanelType]);

  // Accept SerializableProps and serialize
  const setPanelPropsMap = useCallback(
    (propsMap: Record<string, SerializableProps>) => {
      try {
        // Ensure functions aren't accidentally included before stringifying
        const sanitizedPropsMap = JSON.parse(JSON.stringify(propsMap));
        setPanelPropsMapStr(JSON.stringify(sanitizedPropsMap));
      } catch (e) {
        console.error('Error serializing propsMap for localStorage', e);
      }
    },
    [setPanelPropsMapStr]
  );

  const setOpenPanelTypesLocal = setOpenPanelTypes;
  const setActivePanelTypeLocal = setActivePanelType;
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('local-storage', callback);
    window.addEventListener('storage', callback);
    return () => {
      window.removeEventListener('local-storage', callback);
      window.removeEventListener('storage', callback);
    };
  }, []);

  return {
    getOpenPanelTypes,
    getPanelPropsMap,
    getActivePanelType,
    setOpenPanelTypes: setOpenPanelTypesLocal,
    setPanelPropsMap,
    setActivePanelType: setActivePanelTypeLocal,
    subscribe,
  };
}

// 3. URL Query Persistence (Simplified: Only stores types and active type)
const URL_TYPES_PARAM = 'panels';
const URL_ACTIVE_TYPE_PARAM = 'activePanel';

export function useUrlQueryPersistence(): PersistenceLayer {
  const location = useLocation();
  const navigate = useNavigate();
  const [_, forceUpdate] = useState({});

  // Read types and active type from URL
  const { openPanelTypes, activePanelType } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const typeString = params.get(URL_TYPES_PARAM);
    const types = typeString ? typeString.split(',') : [];
    const activeType = params.get(URL_ACTIVE_TYPE_PARAM) || null;
    return { openPanelTypes: types, activePanelType: activeType };
  }, [location.search]);

  // This layer cannot persist props map
  const getPanelPropsMap = useCallback((): Record<string, SerializableProps> => {
    console.warn('useUrlQueryPersistence does not persist panel props.');
    return {};
  }, []);
  const setPanelPropsMap = useCallback((_propsMap: Record<string, SerializableProps>) => {
    console.warn('useUrlQueryPersistence does not persist panel props.');
  }, []);

  const getOpenPanelTypes = useCallback(() => openPanelTypes, [openPanelTypes]);
  const getActivePanelType = useCallback(() => activePanelType, [activePanelType]);

  const updateUrl = useCallback(
    (newTypes: string[], newActiveType: string | null) => {
      const params = new URLSearchParams(location.search);
      if (newTypes.length > 0) {
        params.set(URL_TYPES_PARAM, newTypes.join(','));
      } else {
        params.delete(URL_TYPES_PARAM);
      }
      if (newActiveType) {
        params.set(URL_ACTIVE_TYPE_PARAM, newActiveType);
      } else {
        params.delete(URL_ACTIVE_TYPE_PARAM);
      }
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    },
    [location.search, location.pathname, navigate]
  );

  const setOpenPanelTypes = useCallback(
    (types: string[]) => {
      updateUrl(types, activePanelType);
    },
    [activePanelType, updateUrl]
  );

  const setActivePanelType = useCallback(
    (type: string | null) => {
      updateUrl(openPanelTypes, type);
    },
    [openPanelTypes, updateUrl]
  );

  const subscribe = useCallback((_callback: () => void) => {
    forceUpdate({});
    return () => {};
  }, []);

  return {
    getOpenPanelTypes,
    getPanelPropsMap,
    getActivePanelType,
    setOpenPanelTypes,
    setPanelPropsMap,
    setActivePanelType,
    subscribe,
  };
}
