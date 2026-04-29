import { getPrototypeOrganizationProfile, type MockPrototypeProfilePatch } from "@procertus-ui/ui-pt1-prototype";

import { mergeStoredOnboardingCustomerContext } from "../profile/mergeStoredOnboardingCustomerContext";
import { buildOrganizationProfileOverlay, recordToOrgProfileForm } from "./org-profile-change";
import type { OrganizationProfileChangePayload } from "./types";

export function applyOrganizationProfileChange(
  proposed: OrganizationProfileChangePayload,
  deps: {
    organizationId: string;
    patchProfile: (p: MockPrototypeProfilePatch) => void;
    setOrgDemoAddressOverride: (organizationId: string, address: string) => void;
  },
): void {
  const { organizationId, patchProfile, setOrgDemoAddressOverride } = deps;
  const form = recordToOrgProfileForm(proposed);
  const base = getPrototypeOrganizationProfile(organizationId);
  const profileOverlay = base ? buildOrganizationProfileOverlay(form) : undefined;
  patchProfile({
    organizationNames: { [organizationId]: form.orgName },
    ...(profileOverlay ? { organizationProfiles: { [organizationId]: profileOverlay } } : {}),
  });
  setOrgDemoAddressOverride(organizationId, form.demoAddress);
  mergeStoredOnboardingCustomerContext({
    organizationName: form.organizationName,
    vatNumber: form.vatNumber,
    country: form.country,
    addressStreet: form.addressStreet,
    addressHouseNumber: form.addressHouseNumber,
    addressPostalCode: form.addressPostalCode,
    addressCity: form.addressCity,
  });
}
