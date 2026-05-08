import {
  OnboardingFlowProvider,
  OnboardingRequestStep,
  createLocalStorageOnboardingFlowPersistence,
  ONBOARDING_FLOW_STORAGE_KEY,
  ONBOARDING_REGISTRATION_COMPLETE_PATH,
  useOnboardingFlow,
  useOnboardingFlowApi,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";
import { useEffect, useMemo, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const WEGWIJZER_PATH = "/welcome";
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;

export function TrajectConfigureFlow() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const persistence = useMemo(
    () => createLocalStorageOnboardingFlowPersistence({ storageKey: ONBOARDING_FLOW_STORAGE_KEY }),
    [],
  );

  if (!serviceId) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  return (
    <OnboardingFlowProvider
      persistence={persistence}
      navigate={navigate}
      registrationCompletePath={ONBOARDING_REGISTRATION_COMPLETE_PATH}
    >
      <TrajectConfigureFlowBody serviceId={serviceId} />
    </OnboardingFlowProvider>
  );
}

function TrajectConfigureFlowBody({ serviceId }: { serviceId: string }) {
  const navigate = useNavigate();
  const api = useOnboardingFlowApi();
  const { flowState } = useOnboardingFlowState();
  const { viewProps } = useOnboardingFlow({ navigate });
  const seenRequestStep = useRef(false);

  useEffect(() => {
    api.setTrajectServiceId(serviceId);
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
