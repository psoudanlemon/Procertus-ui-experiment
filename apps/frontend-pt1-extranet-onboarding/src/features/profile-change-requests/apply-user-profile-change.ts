import type { MockPrototypeProfilePatch } from "@procertus-ui/ui-pt1-prototype";

import { mergeStoredOnboardingCustomerContext } from "../profile/mergeStoredOnboardingCustomerContext";
import type { UserProfileChangePayload } from "./types";

/**
 * Applies an accepted user profile change (same effect as the former direct-save path).
 */
export function applyUserProfileChange(
  proposed: UserProfileChangePayload,
  deps: {
    patchProfile: (p: MockPrototypeProfilePatch) => void;
    homeOrganizationId: string;
    representedOrganizationId: string;
  },
): void {
  const { patchProfile, homeOrganizationId, representedOrganizationId } = deps;
  const g = (k: string) => proposed[k] ?? "";
  patchProfile({
    user: {
      displayName: g("displayName"),
      givenName: g("givenName"),
      familyName: g("familyName"),
      email: g("email"),
      workEmail: g("workEmail"),
      phone: g("phone"),
      mobilePhone: g("mobilePhone"),
      jobTitle: g("jobTitle"),
      department: g("department"),
      locale: g("locale"),
      timeZone: g("timeZone"),
      preferredLanguage: g("preferredLanguage"),
      salutation: g("salutation"),
      employeeReference: g("employeeReference"),
      role: g("role"),
      notes: g("notes"),
    },
    organizationNames: {
      [homeOrganizationId]: g("homeOrgName"),
      [representedOrganizationId]: g("reprOrgName"),
    },
  });
  mergeStoredOnboardingCustomerContext({
    representativeFirstName: g("representativeFirstName"),
    representativeLastName: g("representativeLastName"),
    representativeTitlePreset: g("representativeTitlePreset"),
    representativeTitle: g("representativeTitle"),
    representativeEmail: g("representativeEmail"),
    representativeRolePreset: g("representativeRolePreset"),
    representativeRole: g("representativeRole"),
  });
}
