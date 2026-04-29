import * as React from "react";

import type { MockPrototypeProfilePatch } from "../types/mock-prototype-profile-patch";
import type { MockPrototypeSession, MockPrototypeUser } from "../types/mock-prototype-user";
import type { PrototypeOrganizationProfile } from "../schema/prototype-profile-schemas";

export type MockPrototypeAuthContextValue = {
  users: readonly MockPrototypeUser[];
  session: MockPrototypeSession | null;
  isAuthenticated: boolean;
  selectedUserId: string | null;
  setSelectedUserId: (userId: string | null) => void;
  login: (userId?: string) => void;
  logout: () => void;
  /** Switches the active prototype organization for the signed-in user (no-op if not authenticated or id unknown). */
  setActiveOrganization: (organizationId: string) => void;
  /**
   * Merges display fields for the signed-in user and/or organization names (by id). Persisted in
   * sessionStorage for this browser tab.
   */
  patchPrototypeProfile: (patch: MockPrototypeProfilePatch) => void;
  /** Static mock org profile merged with demo sessionStorage overlays for that id. */
  resolveOrganizationProfile: (organizationId: string) => PrototypeOrganizationProfile | undefined;
};

export const MockPrototypeAuthContext = React.createContext<MockPrototypeAuthContextValue | undefined>(
  undefined,
);

export function useMockPrototypeAuthContext(): MockPrototypeAuthContextValue {
  const ctx = React.useContext(MockPrototypeAuthContext);
  if (ctx === undefined) {
    throw new Error("Mock prototype auth hooks must be used within MockPrototypeAuthProvider");
  }
  return ctx;
}
