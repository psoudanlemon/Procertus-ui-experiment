import {
  OnboardingFlowProvider,
  OnboardingFlowView,
  createLocalStorageOnboardingFlowPersistence,
  ONBOARDING_FLOW_STORAGE_KEY,
  ONBOARDING_REGISTRATION_COMPLETE_PATH,
  useOnboardingFlow,
} from "@procertus-ui/ui-certification";
import { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export { ONBOARDING_REGISTRATION_COMPLETE_PATH } from "@procertus-ui/ui-certification";

export function OnboardingFlow() {
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
      <OnboardingFlowBody />
    </OnboardingFlowProvider>
  );
}

function OnboardingFlowBody() {
  const navigate = useNavigate();
  const { redirectToRegistrationComplete, viewProps } = useOnboardingFlow({ navigate });

  if (redirectToRegistrationComplete) {
    return <Navigate to={ONBOARDING_REGISTRATION_COMPLETE_PATH} replace />;
  }

  return <OnboardingFlowView {...viewProps} />;
}
