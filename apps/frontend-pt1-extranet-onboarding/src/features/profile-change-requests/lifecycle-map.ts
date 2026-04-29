import type { CertificationRequestLifecycleStatus } from "@procertus-ui/ui-certification";

import type { ProfileChangeRequestStatus } from "./types";

/** Map profile change lifecycle to certification timeline component (demo). */
export function profileChangeStatusToCertificationTimeline(
  status: ProfileChangeRequestStatus,
): CertificationRequestLifecycleStatus {
  switch (status) {
    case "submitted":
      return "submitted";
    case "validated":
      return "in-progress";
    case "accepted":
      return "approved";
    case "rejected":
      return "rejected";
    case "canceled":
      return "cancelled";
  }
}

export const PROFILE_CHANGE_STATUS_LABEL: Record<ProfileChangeRequestStatus, string> = {
  submitted: "Ingediend",
  validated: "Gevalideerd",
  accepted: "Geaccepteerd",
  rejected: "Afgewezen",
  canceled: "Geannuleerd",
};
