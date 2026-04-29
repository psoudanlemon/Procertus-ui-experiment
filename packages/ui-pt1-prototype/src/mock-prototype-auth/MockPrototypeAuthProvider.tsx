import * as React from "react";

import type { MockPrototypeSession, MockPrototypeUser } from "../types/mock-prototype-user";
import { mockPrototypeMembershipsForUser } from "../types/mock-prototype-user";
import { MockPrototypeAuthContext, type MockPrototypeAuthContextValue } from "./mock-prototype-auth-context";

const DEFAULT_STORAGE_KEY = "pt1-mock-prototype-auth-session";

type StoredSession = {
  userId?: string;
  activeOrganizationId?: string;
};

function readStoredSession(storageKey: string): StoredSession {
  if (typeof sessionStorage === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredSession;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredSession(storageKey: string, payload: StoredSession | null) {
  if (typeof sessionStorage === "undefined") return;
  if (payload === null || !payload.userId) {
    sessionStorage.removeItem(storageKey);
    return;
  }
  const out: StoredSession = { userId: payload.userId };
  if (payload.activeOrganizationId) {
    out.activeOrganizationId = payload.activeOrganizationId;
  }
  sessionStorage.setItem(storageKey, JSON.stringify(out));
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
  const initial = readStoredSession(storageKey);
  const [sessionUserId, setSessionUserId] = React.useState<string | null>(
    () => (typeof initial.userId === "string" ? initial.userId : null),
  );
  const [activeOrganizationId, setActiveOrganizationId] = React.useState<string | null>(
    () => (typeof initial.activeOrganizationId === "string" ? initial.activeOrganizationId : null),
  );
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);

  const userById = React.useMemo(() => new Map(users.map((u) => [u.id, u] as const)), [users]);

  React.useEffect(() => {
    if (sessionUserId !== null && !userById.has(sessionUserId)) {
      setSessionUserId(null);
      setActiveOrganizationId(null);
      writeStoredSession(storageKey, null);
    }
  }, [sessionUserId, userById, storageKey]);

  React.useEffect(() => {
    if (sessionUserId === null) return;
    const user = userById.get(sessionUserId);
    if (!user) return;
    const memberships = mockPrototypeMembershipsForUser(user);
    if (
      activeOrganizationId !== null &&
      !memberships.some((o) => o.id === activeOrganizationId)
    ) {
      setActiveOrganizationId(null);
      writeStoredSession(storageKey, { userId: sessionUserId });
    }
  }, [sessionUserId, userById, activeOrganizationId, storageKey]);

  const session = React.useMemo((): MockPrototypeSession | null => {
    if (sessionUserId === null) return null;
    const user = userById.get(sessionUserId);
    if (!user) return null;
    const organizations = mockPrototypeMembershipsForUser(user);
    const resolvedId =
      activeOrganizationId !== null && organizations.some((o) => o.id === activeOrganizationId)
        ? activeOrganizationId
        : user.homeOrganization.id;
    const activeOrganization =
      organizations.find((o) => o.id === resolvedId) ?? user.homeOrganization;
    return { user, activeOrganization, organizations };
  }, [sessionUserId, userById, activeOrganizationId]);

  const login = React.useCallback(
    (explicitUserId?: string) => {
      const id = explicitUserId ?? selectedUserId;
      if (id === null || id === "") return;
      const user = userById.get(id);
      if (!user) return;
      setSessionUserId(id);
      setActiveOrganizationId(null);
      writeStoredSession(storageKey, { userId: id });
    },
    [selectedUserId, userById, storageKey],
  );

  const logout = React.useCallback(() => {
    setSessionUserId(null);
    setActiveOrganizationId(null);
    writeStoredSession(storageKey, null);
  }, [storageKey]);

  const setActiveOrganization = React.useCallback(
    (organizationId: string) => {
      if (sessionUserId === null) return;
      const user = userById.get(sessionUserId);
      if (!user) return;
      const memberships = mockPrototypeMembershipsForUser(user);
      if (!memberships.some((o) => o.id === organizationId)) return;
      setActiveOrganizationId(organizationId);
      writeStoredSession(storageKey, {
        userId: sessionUserId,
        activeOrganizationId: organizationId,
      });
    },
    [sessionUserId, userById, storageKey],
  );

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
      setActiveOrganization,
    };
  }, [users, session, selectedUserId, login, logout, setActiveOrganization]);

  return <MockPrototypeAuthContext.Provider value={value}>{children}</MockPrototypeAuthContext.Provider>;
}
