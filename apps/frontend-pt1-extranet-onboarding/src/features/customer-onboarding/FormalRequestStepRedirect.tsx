import {
  ONBOARDING_REGISTRATION_COMPLETE_PATH,
  deriveFormalOnboardingResumeStep,
  readOnboardingRegistrationCompletePayload,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";
import { useMemo } from "react";
import { Navigate } from "react-router-dom";

import { formalOnboardingStepPath } from "../../routes/formal-request-routing";

const WEGWIJZER_PATH = "/welcome";

/**
 * `/welcome/formal-request` without a step segment: sends users to the step implied by stored flow
 * data (drafts + context), or away when the session cannot continue here.
 *
 * {@link deriveFormalOnboardingResumeStep} keeps resume on **customer** until “wettelijke
 * vertegenwoordiger” is answered (Ja/Nee), so users are never sent to company or later without that choice.
 */
export function FormalRequestStepRedirect() {
  const { flowState, resolvedContext } = useOnboardingFlowState();

  const registrationCompletePayload = useMemo(
    () => readOnboardingRegistrationCompletePayload(),
    [],
  );

  const resumeStep = useMemo(
    () => deriveFormalOnboardingResumeStep(flowState, resolvedContext),
    [flowState, resolvedContext],
  );

  const target = useMemo(
    () => formalOnboardingStepPath(resumeStep),
    [resumeStep],
  );

  if (registrationCompletePayload) {
    return <Navigate to={ONBOARDING_REGISTRATION_COMPLETE_PATH} replace />;
  }

  if (flowState.drafts.length === 0) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  const mayEnterFormal =
    flowState.formalRequestPackageCommitted || flowState.requestOrigin !== "";

  if (!mayEnterFormal) {
    const sid = flowState.trajectServiceId.trim();
    return (
      <Navigate
        to={sid ? `/welcome/aanvraag/${sid}` : WEGWIJZER_PATH}
        replace
      />
    );
  }

  return <Navigate to={target} replace />;
}
