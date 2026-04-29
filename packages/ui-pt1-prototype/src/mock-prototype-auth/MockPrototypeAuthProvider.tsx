import * as React from "react";

import type { MockPrototypeProfilePatch, MockPrototypeUserProfilePatch } from "../types/mock-prototype-profile-patch";
import type {
  MockPrototypeOrganization,
  MockPrototypeSession,
  MockPrototypeUser,
} from "../types/mock-prototype-user";
import { mockPrototypeMembershipsForUser } from "../types/mock-prototype-user";
import {
  mergePrototypeOrganizationProfile,
  type MockPrototypeOrganizationProfilePatch,
} from "../lib/merge-prototype-organization-profile";
import { getPrototypeOrganizationProfile } from "../data/mock-prototype-organization-profiles";
import type { PrototypeOrganizationProfile } from "../schema/prototype-profile-schemas";
import { MockPrototypeAuthContext, type MockPrototypeAuthContextValue } from "./mock-prototype-auth-context";

const DEFAULT_STORAGE_KEY = "pt1-mock-prototype-auth-session";
const PROFILE_OVERRIDES_STORAGE_KEY = "pt1-mock-prototype-profile-overrides";

type StoredSession = {
  userId?: string;
  activeOrganizationId?: string;
};

type UserPatch = MockPrototypeUserProfilePatch;

type StoredProfileOverrides = {
  userPatches: Record<string, UserPatch>;
  organizationNames: Record<string, string>;
  organizationProfilePatches: Record<string, MockPrototypeOrganizationProfilePatch>;
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

function readProfileOverrides(): StoredProfileOverrides {
  const empty: StoredProfileOverrides = {
    userPatches: {},
    organizationNames: {},
    organizationProfilePatches: {},
  };
  if (typeof sessionStorage === "undefined") return empty;
  try {
    const raw = sessionStorage.getItem(PROFILE_OVERRIDES_STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<StoredProfileOverrides>;
    return {
      userPatches:
        typeof parsed.userPatches === "object" && parsed.userPatches !== null ? parsed.userPatches : {},
      organizationNames:
        typeof parsed.organizationNames === "object" && parsed.organizationNames !== null
          ? parsed.organizationNames
          : {},
      organizationProfilePatches:
        typeof parsed.organizationProfilePatches === "object" && parsed.organizationProfilePatches !== null
          ? parsed.organizationProfilePatches
          : {},
    };
  } catch {
    return empty;
  }
}

function writeProfileOverrides(payload: StoredProfileOverrides) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(PROFILE_OVERRIDES_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

function resolveOrganizationProfileWithPatches(
  organizationId: string,
  patches: Record<string, MockPrototypeOrganizationProfilePatch>,
): PrototypeOrganizationProfile | undefined {
  const base = getPrototypeOrganizationProfile(organizationId);
  if (!base) return undefined;
  const p = patches[organizationId];
  return p !== undefined && Object.keys(p).length > 0 ? mergePrototypeOrganizationProfile(base, p) : base;
}

function withOrgNames(org: MockPrototypeOrganization, names: Record<string, string>): MockPrototypeOrganization {
  const n = names[org.id];
  return n !== undefined && n.length > 0 ? { ...org, name: n } : org;
}

function mergeUserProfileFields(
  base: Omit<MockPrototypeUser, "homeOrganization" | "representedOrganization" | "organizations">,
  patch: UserPatch | undefined,
): Omit<MockPrototypeUser, "homeOrganization" | "representedOrganization" | "organizations"> {
  if (patch === undefined) return base;
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch) as [keyof UserPatch, unknown][]) {
    if (value === undefined) continue;
    if (key === "role" && value === "") {
      delete out.role;
      continue;
    }
    out[key as string] = value;
  }
  return out as Omit<MockPrototypeUser, "homeOrganization" | "representedOrganization" | "organizations">;
}

function mergeSessionUser(
  base: MockPrototypeUser,
  userId: string,
  overrides: StoredProfileOverrides,
): MockPrototypeUser {
  const p = overrides.userPatches[userId];
  const names = overrides.organizationNames;
  const home = withOrgNames(base.homeOrganization, names);
  const repr = withOrgNames(base.representedOrganization, names);
  const { homeOrganization: _h, representedOrganization: _r, organizations: orgs, ...person } = base;
  const mergedPerson = mergeUserProfileFields(person, p);
  return {
    ...mergedPerson,
    homeOrganization: home,
    representedOrganization: repr,
    organizations: orgs?.map((o) => withOrgNames(o, names)),
  };
}

export type MockPrototypeAuthProviderProps = {
  children: React.ReactNode;
  users: readonly MockPrototypeUser[];
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
  const [profileOverrides, setProfileOverrides] = React.useState<StoredProfileOverrides>(readProfileOverrides);

  const sessionUserIdRef = React.useRef(sessionUserId);
  React.useEffect(() => {
    sessionUserIdRef.current = sessionUserId;
  }, [sessionUserId]);

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
    const memberships = mockPrototypeMembershipsForUser(mergeSessionUser(user, sessionUserId, profileOverrides));
    if (
      activeOrganizationId !== null &&
      !memberships.some((o) => o.id === activeOrganizationId)
    ) {
      setActiveOrganizationId(null);
      writeStoredSession(storageKey, { userId: sessionUserId });
    }
  }, [sessionUserId, userById, activeOrganizationId, storageKey, profileOverrides]);

  const session = React.useMemo((): MockPrototypeSession | null => {
    if (sessionUserId === null) return null;
    const baseUser = userById.get(sessionUserId);
    if (!baseUser) return null;
    const user = mergeSessionUser(baseUser, sessionUserId, profileOverrides);
    const organizations = mockPrototypeMembershipsForUser(user).map((o) =>
      withOrgNames(o, profileOverrides.organizationNames),
    );
    const resolvedId =
      activeOrganizationId !== null && organizations.some((o) => o.id === activeOrganizationId)
        ? activeOrganizationId
        : user.homeOrganization.id;
    const activeOrganization =
      organizations.find((o) => o.id === resolvedId) ?? withOrgNames(user.homeOrganization, profileOverrides.organizationNames);
    return { user, activeOrganization, organizations };
  }, [sessionUserId, userById, activeOrganizationId, profileOverrides]);

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
      const merged = mergeSessionUser(user, sessionUserId, profileOverrides);
      const memberships = mockPrototypeMembershipsForUser(merged);
      if (!memberships.some((o) => o.id === organizationId)) return;
      setActiveOrganizationId(organizationId);
      writeStoredSession(storageKey, {
        userId: sessionUserId,
        activeOrganizationId: organizationId,
      });
    },
    [sessionUserId, userById, profileOverrides, storageKey],
  );

  const patchPrototypeProfile = React.useCallback((patch: MockPrototypeProfilePatch) => {
    const uid = sessionUserIdRef.current;
    if (uid === null) return;
    setProfileOverrides((prev) => {
      const next: StoredProfileOverrides = {
        userPatches: { ...prev.userPatches },
        organizationNames: { ...prev.organizationNames },
        organizationProfilePatches: { ...prev.organizationProfilePatches },
      };
      if (patch.user) {
        next.userPatches[uid] = { ...next.userPatches[uid], ...patch.user };
      }
      if (patch.organizationNames) {
        for (const [id, name] of Object.entries(patch.organizationNames)) {
          if (name.trim().length > 0) next.organizationNames[id] = name.trim();
        }
      }
      if (patch.organizationProfiles) {
        for (const [id, orgPatch] of Object.entries(patch.organizationProfiles)) {
          next.organizationProfilePatches[id] = orgPatch;
        }
      }
      writeProfileOverrides(next);
      return next;
    });
  }, []);

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
      patchPrototypeProfile,
      resolveOrganizationProfile: (organizationId: string) =>
        resolveOrganizationProfileWithPatches(organizationId, profileOverrides.organizationProfilePatches),
    };
  }, [
    users,
    session,
    selectedUserId,
    login,
    logout,
    setActiveOrganization,
    patchPrototypeProfile,
    profileOverrides.organizationProfilePatches,
  ]);

  return <MockPrototypeAuthContext.Provider value={value}>{children}</MockPrototypeAuthContext.Provider>;
}
