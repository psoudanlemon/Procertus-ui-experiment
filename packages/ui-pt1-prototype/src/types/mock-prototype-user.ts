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
}

export interface MockPrototypeSession {
  user: MockPrototypeUser;
}
