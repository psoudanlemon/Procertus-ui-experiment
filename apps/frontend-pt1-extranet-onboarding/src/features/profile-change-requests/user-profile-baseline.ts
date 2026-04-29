import type { CustomerContext } from "@procertus-ui/ui-certification";
import type { MockPrototypeUser } from "@procertus-ui/ui-pt1-prototype";

import type { StoredOnboardingContexts } from "../profile/readStoredOnboardingContext";
import { flattenStringRecord } from "./flatten";
import type { UserProfileChangePayload } from "./types";

function onboardingSlice(ctx: Partial<CustomerContext> | null | undefined) {
  return {
    representativeFirstName: ctx?.representativeFirstName ?? "",
    representativeLastName: ctx?.representativeLastName ?? "",
    representativeTitlePreset: ctx?.representativeTitlePreset ?? "",
    representativeTitle: ctx?.representativeTitle ?? "",
    representativeEmail: ctx?.representativeEmail ?? "",
    representativeRolePreset: ctx?.representativeRolePreset ?? "",
    representativeRole: ctx?.representativeRole ?? "",
  };
}

/** Current “approved” user profile snapshot for change-request diffing (matches edit dialog seed). */
export function buildUserProfileChangeBaseline(
  user: MockPrototypeUser,
  stored: StoredOnboardingContexts,
): UserProfileChangePayload {
  const flowCtx = stored.flowContext ?? stored.completedSnapshotContext ?? {};
  const { id: _id, homeOrganization, representedOrganization, organizations: _orgs, ...profile } = user;
  void _id;
  void _orgs;
  const form = {
    ...profile,
    role: profile.role ?? "",
    homeOrgName: homeOrganization.name,
    reprOrgName: representedOrganization.name,
    ...onboardingSlice(flowCtx),
  };
  return flattenStringRecord(form as unknown as Record<string, unknown>);
}
