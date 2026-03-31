import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

/** Color appearance: light, dark, or follow the OS (system). */
export type Mode = "dark" | "light" | "system";

type ModeProviderProps = {
  children: ReactNode;
  defaultMode?: Mode;
  storageKey?: string;
};

type ModeProviderState = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const ModeProviderContext = createContext<ModeProviderState | undefined>(undefined);

export function ModeProvider({
  children,
  defaultMode = "system",
  storageKey = "vite-ui-mode",
  ...props
}: ModeProviderProps) {
  const [mode, setModeState] = useState<Mode>(
    () => (localStorage.getItem(storageKey) as Mode) || defaultMode,
  );

  useLayoutEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (mode === "system") {
      const resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(resolved);
      return;
    }

    root.classList.add(mode);
  }, [mode]);

  const setMode = useCallback(
    (next: Mode) => {
      setModeState((prev: Mode) => {
        if (prev === next) return prev;
        localStorage.setItem(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  const value: ModeProviderState = { mode, setMode };

  return (
    <ModeProviderContext.Provider {...props} value={value}>
      {children}
    </ModeProviderContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeProviderContext);

  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }

  return context;
}
