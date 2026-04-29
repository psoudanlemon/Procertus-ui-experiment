import {
  AnonymousOnboardingFlowView,
  ONBOARDING_REGISTRATION_COMPLETE_PATH,
  useAnonymousOnboardingFlow,
} from "@procertus-ui/ui-certification";
import { Navigate, useNavigate } from "react-router-dom";

export { ONBOARDING_REGISTRATION_COMPLETE_PATH } from "@procertus-ui/ui-certification";

export function AnonymousOnboardingFlow() {
  const navigate = useNavigate();
  const { redirectToRegistrationComplete, viewProps } = useAnonymousOnboardingFlow({
    navigate,
  });
  if (redirectToRegistrationComplete) {
    return <Navigate to={ONBOARDING_REGISTRATION_COMPLETE_PATH} replace />;
  }
  return <AnonymousOnboardingFlowView {...viewProps} />;
}
