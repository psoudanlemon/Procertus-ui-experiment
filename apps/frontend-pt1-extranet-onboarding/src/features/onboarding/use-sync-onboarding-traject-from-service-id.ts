import { useOnboardingFlowApi } from "@procertus-ui/ui-certification";
import { useEffect } from "react";

import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";

/**
 * Persist Wegwijzer service id + display label onto {@link OnboardingFlowState} whenever this
 * route segment is tied to an entry (triage · traject wizard · placeholders).
 */
export function useSyncOnboardingTrajectFromServiceId(serviceId: string | undefined) {
  const api = useOnboardingFlowApi();
  useEffect(() => {
    const id = serviceId?.trim();
    if (!id) return;
    const svc = findWegwijzerService(id);
    if (!svc) return;
    api.setTrajectServiceId(id, svc.entry.label);
  }, [api, serviceId]);
}
