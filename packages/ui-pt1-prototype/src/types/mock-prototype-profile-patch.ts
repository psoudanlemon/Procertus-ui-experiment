import type { PrototypeUserProfile } from "../schema/prototype-profile-schemas";
import type { MockPrototypeOrganizationProfilePatch } from "../lib/merge-prototype-organization-profile";

/** Partial updates applied on top of static mock user profile fields (not organization refs). */
export type MockPrototypeUserProfilePatch = Partial<Omit<PrototypeUserProfile, "id">>;

/** Merges into persisted prototype profile overrides (session user fields + organization display names by id). */
export type MockPrototypeProfilePatch = {
  user?: MockPrototypeUserProfilePatch;
  organizationNames?: Record<string, string>;
  /** Demo overlays for static reference org profiles (by organization id). */
  organizationProfiles?: Record<string, MockPrototypeOrganizationProfilePatch>;
};
