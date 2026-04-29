import type { MockPrototypeSession } from "@procertus-ui/ui-pt1-prototype";
import {
  getPrototypeOrganizationProfile,
  type PrototypeOrganizationProfile,
} from "@procertus-ui/ui-pt1-prototype";

import type { StoredOnboardingContexts } from "../profile/readStoredOnboardingContext";
import { companySlice, referenceSliceFromProfile } from "./org-profile-change";
import { flattenStringRecord } from "./flatten";
import type { OrganizationProfileChangePayload } from "./types";

/** Current “approved” organization profile snapshot for diffing (matches edit dialog seed). */
export function buildOrganizationProfileChangeBaseline(
  session: MockPrototypeSession,
  stored: StoredOnboardingContexts,
  resolveOrganizationProfile: (organizationId: string) => PrototypeOrganizationProfile | undefined,
  demoAddressLine: string,
): OrganizationProfileChangePayload {
  const active = session.activeOrganization;
  const snap = stored.flowContext ?? stored.completedSnapshotContext ?? {};
  const merged = resolveOrganizationProfile(active.id);
  const base = getPrototypeOrganizationProfile(active.id);
  const ref = merged ?? base;
  const form = {
    orgName: active.name,
    demoAddress: demoAddressLine,
    ...companySlice(snap),
    ...referenceSliceFromProfile(ref),
  };
  return flattenStringRecord(form as unknown as Record<string, unknown>);
}
