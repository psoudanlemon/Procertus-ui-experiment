import {
  OnboardingRequestStep,
  useOnboardingFlow,
  useOnboardingFlowApi,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";
import { useEffect, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useSyncOnboardingTrajectFromServiceId } from "../onboarding/use-sync-onboarding-traject-from-service-id";

const WEGWIJZER_PATH = "/welcome";
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;

/**
 * Wizard-only step bundled with triage/start under {@link PublicWelcomeOnboardingSessionLayout}.
 */
export function TrajectConfigureFlow() {
  const { serviceId } = useParams<{ serviceId: string }>();

  if (!serviceId) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  return <TrajectConfigureFlowBody serviceId={serviceId} />;
}

function TrajectConfigureFlowBody({ serviceId }: { serviceId: string }) {
  const navigate = useNavigate();
  useSyncOnboardingTrajectFromServiceId(serviceId);
  const api = useOnboardingFlowApi();
  const { flowState } = useOnboardingFlowState();
  const { viewProps } = useOnboardingFlow({ navigate });
  const seenRequestStep = useRef(false);

  useEffect(() => {
    api.goToOnboardingStep("request");
  }, [api, serviceId]);

  useEffect(() => {
    if (flowState.step === "request") {
      seenRequestStep.current = true;
      return;
    }
    if (seenRequestStep.current) {
      navigate(TRIAGE_PATH(serviceId), { replace: true });
    }
  }, [flowState.step, navigate, serviceId]);

  return (
    <OnboardingRequestStep
      pageTitle={viewProps.certificationPhaseTitle}
      pageDescription={viewProps.certificationPhaseDescription}
      onSignInClick={viewProps.onSignInClick}
      certificationWizardProps={viewProps.certificationWizardProps}
    />
  );
}
