import {
  ONBOARDING_FLOW_STORAGE_KEY,
  ONBOARDING_REGISTRATION_COMPLETE_PATH,
  OnboardingFlowProvider,
  createLocalStorageOnboardingFlowPersistence,
} from "@procertus-ui/ui-certification";
import { useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";

/**
 * Single {@link OnboardingFlowProvider} for all extranet routes that accumulate onboarding
 * context (triage → certification wizard → formal registration · informal flows sharing the service).
 * Persists {@link ONBOARDING_FLOW_STORAGE_KEY}.
 */
export function PublicWelcomeOnboardingSessionLayout() {
  const navigate = useNavigate();
  const persistence = useMemo(
    () => createLocalStorageOnboardingFlowPersistence({ storageKey: ONBOARDING_FLOW_STORAGE_KEY }),
    [],
  );

  return (
    <OnboardingFlowProvider
      persistence={persistence}
      navigate={navigate}
      registrationCompletePath={ONBOARDING_REGISTRATION_COMPLETE_PATH}
    >
      <Outlet />
    </OnboardingFlowProvider>
  );
}
