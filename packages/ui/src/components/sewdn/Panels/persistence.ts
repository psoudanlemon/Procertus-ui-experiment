import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

  return useMemo(
    () => ({
      getOpenPanelTypes,
      getPanelPropsMap,
      getActivePanelType,
      setOpenPanelTypes,
      setPanelPropsMap,
      setActivePanelType,
      subscribe,
    }),
    [
      getOpenPanelTypes,
      getPanelPropsMap,
      getActivePanelType,
      setOpenPanelTypes,
      setPanelPropsMap,
      setActivePanelType,
      subscribe,
    ]
  );
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

// 3. URL Query Persistence
const URL_TYPES_PARAM = 'panels';
const URL_ACTIVE_TYPE_PARAM = 'activePanel';
const URL_PROPS_PARAM = 'panelProps';

export function useUrlQueryPersistence(): PersistenceLayer {
  const location = useLocation();
  const navigate = useNavigate();

  // Read panel state from URL query params.
  const { openPanelTypes, activePanelType, panelPropsMap } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const typeString = params.get(URL_TYPES_PARAM);
    const types = typeString ? typeString.split(',') : [];
    const activeType = params.get(URL_ACTIVE_TYPE_PARAM) || null;
    const propsString = params.get(URL_PROPS_PARAM);
    let propsMap: Record<string, SerializableProps> = {};

    if (propsString) {
      try {
        propsMap = JSON.parse(propsString) as Record<string, SerializableProps>;
      } catch (error) {
        console.error('Error parsing panel props from URL query', error);
      }
    }

    return { openPanelTypes: types, activePanelType: activeType, panelPropsMap: propsMap };
  }, [location.search]);

  const stateRef = useRef({
    openPanelTypes,
    activePanelType,
    panelPropsMap,
  });

  useEffect(() => {
    stateRef.current = {
      openPanelTypes,
      activePanelType,
      panelPropsMap,
    };
  }, [activePanelType, openPanelTypes, panelPropsMap]);

  const getOpenPanelTypes = useCallback(() => openPanelTypes, [openPanelTypes]);
  const getActivePanelType = useCallback(() => activePanelType, [activePanelType]);
  const getPanelPropsMap = useCallback(() => panelPropsMap, [panelPropsMap]);

  const updateUrl = useCallback(
    (
      newTypes: string[],
      newActiveType: string | null,
      newPropsMap: Record<string, SerializableProps>
    ) => {
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

      const sanitizedPropsMap = JSON.parse(JSON.stringify(newPropsMap)) as Record<string, SerializableProps>;
      if (Object.keys(sanitizedPropsMap).length > 0) {
        params.set(URL_PROPS_PARAM, JSON.stringify(sanitizedPropsMap));
      } else {
        params.delete(URL_PROPS_PARAM);
      }

      const queryString = params.toString();
      navigate(`${location.pathname}${queryString ? `?${queryString}` : ''}`, { replace: true });
    },
    [location.search, location.pathname, navigate]
  );

  const setOpenPanelTypes = useCallback(
    (types: string[]) => {
      stateRef.current = { ...stateRef.current, openPanelTypes: types };
      updateUrl(types, stateRef.current.activePanelType, stateRef.current.panelPropsMap);
    },
    [updateUrl]
  );

  const setPanelPropsMap = useCallback(
    (propsMap: Record<string, SerializableProps>) => {
      stateRef.current = { ...stateRef.current, panelPropsMap: propsMap };
      updateUrl(stateRef.current.openPanelTypes, stateRef.current.activePanelType, propsMap);
    },
    [updateUrl]
  );

  const setActivePanelType = useCallback(
    (type: string | null) => {
      stateRef.current = { ...stateRef.current, activePanelType: type };
      updateUrl(stateRef.current.openPanelTypes, type, stateRef.current.panelPropsMap);
    },
    [updateUrl]
  );

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
