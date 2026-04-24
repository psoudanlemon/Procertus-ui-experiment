import * as React from "react";

import type { MockPrototypeSession, MockPrototypeUser } from "../types/mock-prototype-user";
import { MockPrototypeAuthContext, type MockPrototypeAuthContextValue } from "./mock-prototype-auth-context";

const DEFAULT_STORAGE_KEY = "pt1-mock-prototype-auth-session";

function readStoredUserId(storageKey: string): string | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { userId?: string };
    return typeof parsed.userId === "string" ? parsed.userId : null;
  } catch {
    return null;
  }
}

function writeStoredUserId(storageKey: string, userId: string | null) {
  if (typeof sessionStorage === "undefined") return;
  if (userId === null) {
    sessionStorage.removeItem(storageKey);
    return;
  }
  sessionStorage.setItem(storageKey, JSON.stringify({ userId }));
}

export type MockPrototypeAuthProviderProps = {
  children: React.ReactNode;
  users: MockPrototypeUser[];
  /** Session storage key for persisting the signed-in mock user id across reloads. */
  storageKey?: string;
};

export function MockPrototypeAuthProvider({
  children,
  users,
  storageKey = DEFAULT_STORAGE_KEY,
}: MockPrototypeAuthProviderProps) {
  const [sessionUserId, setSessionUserId] = React.useState<string | null>(() => readStoredUserId(storageKey));
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);

  const userById = React.useMemo(() => new Map(users.map((u) => [u.id, u] as const)), [users]);

  React.useEffect(() => {
    if (sessionUserId !== null && !userById.has(sessionUserId)) {
      setSessionUserId(null);
      writeStoredUserId(storageKey, null);
    }
  }, [sessionUserId, userById, storageKey]);

  const session = React.useMemo((): MockPrototypeSession | null => {
    if (sessionUserId === null) return null;
    const user = userById.get(sessionUserId);
    return user ? { user } : null;
  }, [sessionUserId, userById]);

  const login = React.useCallback(
    (explicitUserId?: string) => {
      const id = explicitUserId ?? selectedUserId;
      if (id === null || id === "") return;
      const user = userById.get(id);
      if (!user) return;
      setSessionUserId(id);
      writeStoredUserId(storageKey, id);
    },
    [selectedUserId, userById, storageKey],
  );

  const logout = React.useCallback(() => {
    setSessionUserId(null);
    writeStoredUserId(storageKey, null);
  }, [storageKey]);

  const value = React.useMemo((): MockPrototypeAuthContextValue => {
    const isAuthenticated = session !== null;
    return {
      users,
      session,
      isAuthenticated,
      selectedUserId,
      setSelectedUserId,
      login,
      logout,
    };
  }, [users, session, selectedUserId, login, logout]);

  return <MockPrototypeAuthContext.Provider value={value}>{children}</MockPrototypeAuthContext.Provider>;
}
