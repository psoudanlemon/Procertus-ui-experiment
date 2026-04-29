/** Organization attached to a prototype user (home tenant vs represented party). */
export interface MockPrototypeOrganization {
  id: string;
  name: string;
}

/** App-defined prototype persona with organizational context for mock sessions. */
export interface MockPrototypeUser {
  id: string;
  displayName: string;
  email: string;
  role?: string;
  /** Organization the user belongs to (e.g. employer / PROCERTUS tenant). */
  homeOrganization: MockPrototypeOrganization;
  /** Organization this user represents in the prototype (e.g. auditee / client org). */
  representedOrganization: MockPrototypeOrganization;
  /**
   * When set with more than one entry, the account can switch the active “logged-in” organization in the prototype.
   * Should include {@link homeOrganization}; duplicates by `id` are ignored.
   */
  organizations?: readonly MockPrototypeOrganization[];
}

export interface MockPrototypeSession {
  user: MockPrototypeUser;
  /** Current workspace / tenant selection for this signed-in session. */
  activeOrganization: MockPrototypeOrganization;
  /** Organizations this account may switch among (always at least one). */
  organizations: readonly MockPrototypeOrganization[];
}

/** Resolves the organization list used for switching (defaults to the user’s home org only). */
export function mockPrototypeMembershipsForUser(user: MockPrototypeUser): MockPrototypeOrganization[] {
  const raw = user.organizations?.length ? [...user.organizations] : [user.homeOrganization];
  const byId = new Map<string, MockPrototypeOrganization>();
  for (const org of raw) {
    byId.set(org.id, org);
  }
  return Array.from(byId.values());
}
