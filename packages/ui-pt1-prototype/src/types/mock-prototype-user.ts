import type {
  MockPrototypeSession,
  MockPrototypeUser,
  PrototypeOrganizationRef,
} from "../schema/prototype-profile-schemas";

/** Session organization row (id + display name). */
export type MockPrototypeOrganization = PrototypeOrganizationRef;

export type { MockPrototypeSession, MockPrototypeUser };

/** Resolves the organization list used for switching (defaults to the user’s home org only). */
export function mockPrototypeMembershipsForUser(user: MockPrototypeUser): MockPrototypeOrganization[] {
  const raw = user.organizations?.length ? [...user.organizations] : [user.homeOrganization];
  const byId = new Map<string, MockPrototypeOrganization>();
  for (const org of raw) {
    byId.set(org.id, org);
  }
  return Array.from(byId.values());
}
