'use client';

import {
  ReactNode,
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { SnackbarProps as OriginalSnackbarProps } from './Snackbar'; // Assuming original props are needed

// Define the shape of a snackbar instance within the provider
interface SnackbarInstance
  extends Omit<OriginalSnackbarProps, 'position' | 'align' | 'className' | 'maxWidth'> {
  id: string;
  duration?: number; // Duration in ms
}

// Interface for tracked timer info
interface SnackbarTimerInfo {
  dismissAt: number; // Timestamp when it should dismiss
  timerId: NodeJS.Timeout | null;
}

// Export the context type
export interface SnackbarContextType {
  snackbars: SnackbarInstance[];
  addSnackbar: (options: Omit<SnackbarInstance, 'id'>) => void;
  removeSnackbar: (id: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

const DEFAULT_DURATION = 5000;
const DEFAULT_MAX_VISIBLE = 5; // Default if not provided

// Add props interface for SnackbarProvider
export interface SnackbarProviderProps {
  children: ReactNode;
  maxVisible?: number; // Allow configuring max visible
}

export function SnackbarProvider({
  children,
  maxVisible = DEFAULT_MAX_VISIBLE, // Use prop or default
}: SnackbarProviderProps) {
  const [snackbars, setSnackbars] = useState<SnackbarInstance[]>([]);
  const activeTimers = useRef<Map<string, SnackbarTimerInfo>>(new Map());

  // Define removeSnackbar first, ensuring it has stable dependencies
  const removeSnackbar = useCallback((id: string) => {
    if (activeTimers.current.has(id)) {
      const info = activeTimers.current.get(id)!;
      if (info.timerId) {
        clearTimeout(info.timerId);
      }
      activeTimers.current.delete(id);
    }
    setSnackbars(prev => prev.filter(s => s.id !== id));
  }, []); // Empty dependency array - only uses refs and setState

  // Helper function to schedule timeout (stable dependencies)
  const scheduleTimeout = useCallback(
    (id: string, dismissAt: number) => {
      // Ensure no duplicate timers if logic runs quickly
      const existingInfo = activeTimers.current.get(id);
      if (existingInfo?.timerId) {
        clearTimeout(existingInfo.timerId);
      }

      const delay = dismissAt - Date.now();
      if (delay > 0) {
        const newTimerId = setTimeout(() => {
          removeSnackbar(id);
        }, delay);
        activeTimers.current.set(id, { dismissAt, timerId: newTimerId });
      } else {
        // Already past dismiss time, remove immediately
        removeSnackbar(id);
      }
    },
    [removeSnackbar]
  );

  // Simplified addSnackbar - just updates state
  const addSnackbar = useCallback(
    (options: Omit<SnackbarInstance, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const duration = options.duration ?? DEFAULT_DURATION;
      const newSnackbar: SnackbarInstance = {
        ...options,
        id,
        duration, // Store actual duration used
      };
      setSnackbars(prev => [...prev, newSnackbar]);
      // Timer logic moved to useEffect
    },
    [] // No dependencies needed
  );

  // Effect to recalculate ALL staggered timers whenever snackbars change
  useEffect(() => {
    // 1. Clear all existing timers before recalculating
    activeTimers.current.forEach(info => {
      if (info.timerId) {
        clearTimeout(info.timerId);
      }
    });
    // We don't clear the map here, scheduleTimeout will overwrite or remove entries

    const now = Date.now();
    // Determine the base dismissal time for the "visible" group
    const visibleGroupDismissAt = now + DEFAULT_DURATION;

    // 2. Calculate and schedule new timers for all current snackbars
    snackbars.forEach((snackbar, index) => {
      const reverseIndex = snackbars.length - 1 - index; // 0 = newest
      let dismissAt: number;

      if (reverseIndex < maxVisible) {
        // Items within the visible limit dismiss together after default duration
        dismissAt = visibleGroupDismissAt;
      } else {
        // Items beyond the limit dismiss sequentially after the visible group
        // Calculate depth into the overlap zone (1 for the first overlapping item)
        const overlapDepth = reverseIndex - maxVisible + 1;
        // Dismissal time is the visible group's time + staggered duration
        dismissAt = visibleGroupDismissAt + overlapDepth * DEFAULT_DURATION;
      }

      scheduleTimeout(snackbar.id, dismissAt);
    });

    // Effect cleanup (optional but good practice)
    return () => {
      activeTimers.current.forEach(info => {
        if (info.timerId) {
          clearTimeout(info.timerId);
        }
      });
      // Don't clear the map here on re-run, only on unmount
    };
    // Depend on snackbars array identity, schedule function, and maxVisible
  }, [snackbars, scheduleTimeout, maxVisible]);

  // Cleanup effect for unmounting - clear all timers
  useEffect(() => {
    return () => {
      activeTimers.current.forEach(info => {
        if (info.timerId) {
          clearTimeout(info.timerId);
        }
      });
      activeTimers.current.clear();
    };
  }, []); // Run only on mount/unmount

  const contextValue = useMemo(
    () => ({
      snackbars,
      addSnackbar,
      removeSnackbar,
    }),
    [snackbars, addSnackbar, removeSnackbar] // addSnackbar is stable now
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      {/* Render the container here or expect user to render it */}
      {/* Consider adding a default SnackbarContainer render here */}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
