import type { ProfileChangeRequest } from "./types";
import { isPendingProfileChangeStatus } from "./types";

/** Open request that still needs validation / acceptance (at most one per subject in normal use). */
export function findPendingProfileChangeRequestForUser(
  requests: ProfileChangeRequest[],
  userId: string,
): ProfileChangeRequest | undefined {
  return requests.find(
    (r) => r.kind === "user" && r.subjectUserId === userId && isPendingProfileChangeStatus(r.status),
  );
}

export function findPendingProfileChangeRequestForOrganization(
  requests: ProfileChangeRequest[],
  organizationId: string,
): ProfileChangeRequest | undefined {
  return requests.find(
    (r) =>
      r.kind === "organization" &&
      r.subjectOrganizationId === organizationId &&
      isPendingProfileChangeStatus(r.status),
  );
}
