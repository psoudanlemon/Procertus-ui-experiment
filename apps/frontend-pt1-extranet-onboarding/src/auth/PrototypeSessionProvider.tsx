import * as React from "react";

import { PrototypeSessionContext } from "./prototype-session-context";

const STORAGE_KEY = "pt1-prototype-authenticated";

function readStored(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

export function PrototypeSessionProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(readStored);

  const signIn = React.useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setIsAuthenticated(true);
  }, []);

  const signOut = React.useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  const value = React.useMemo(
    () => ({ isAuthenticated, signIn, signOut }),
    [isAuthenticated, signIn, signOut],
  );

  return (
    <PrototypeSessionContext.Provider value={value}>{children}</PrototypeSessionContext.Provider>
  );
}
