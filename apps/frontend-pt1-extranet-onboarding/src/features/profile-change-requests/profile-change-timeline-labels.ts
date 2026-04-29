import type { CertificationRequestLifecycleStepId } from "@procertus-ui/ui-certification";

import type { ProfileChangeRequest } from "./types";

const formatShort = (value: string) =>
  new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

/** Date hints under the horizontal lifecycle (aligned with certification request cards). */
export function profileChangeTimelineDateLabels(
  request: ProfileChangeRequest,
): Partial<Record<CertificationRequestLifecycleStepId, string>> {
  const labels: Partial<Record<CertificationRequestLifecycleStepId, string>> = {
    submitted: formatShort(request.createdAt),
  };
  if (request.status === "validated") {
    labels["in-progress"] = formatShort(request.updatedAt);
  }
  return labels;
}
