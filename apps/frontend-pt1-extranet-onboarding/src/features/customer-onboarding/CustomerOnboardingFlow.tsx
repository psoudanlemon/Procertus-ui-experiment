import {
  OnboardingFlowProvider,
  OnboardingFlowView,
  createLocalStorageOnboardingFlowPersistence,
  ONBOARDING_FLOW_STORAGE_KEY,
  ONBOARDING_REGISTRATION_COMPLETE_PATH,
  useOnboardingFlow,
  useOnboardingFlowApi,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";
import { useCallback, useEffect, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { resetTrajectFlow } from "../traject/traject-submission-context";

export { ONBOARDING_REGISTRATION_COMPLETE_PATH } from "@procertus-ui/ui-certification";

const WEGWIJZER_PATH = "/welcome";

export function CustomerOnboardingFlow() {
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
      <CustomerOnboardingFlowBody />
    </OnboardingFlowProvider>
  );
}

function CustomerOnboardingFlowBody() {
  const navigate = useNavigate();
  const { redirectToRegistrationComplete, viewProps } = useOnboardingFlow({ navigate });
  const { flowState } = useOnboardingFlowState();
  const api = useOnboardingFlowApi();

  // Customer onboarding only runs once a certification request has been configured upstream
  // in the TrajectConfigureFlow. Without drafts there is nothing to onboard against.
  const hasDrafts = flowState.drafts.length > 0;

  useEffect(() => {
    if (!hasDrafts) return;
    if (flowState.step === "request") {
      api.goToOnboardingStep("origin");
    }
  }, [hasDrafts, flowState.step, api]);

  // Annuleren = volledige reset. Gebruiker zegt expliciet "ik weet het niet, ik begin opnieuw",
  // dus traject + klantgegevens worden gewist en we sturen ze terug naar de Wegwijzer.
  const handleCancel = useCallback(() => {
    resetTrajectFlow(api);
    navigate(WEGWIJZER_PATH);
  }, [api, navigate]);
  const cancelAction = useMemo(
    () => ({ label: "Annuleren", onClick: handleCancel }),
    [handleCancel],
  );
  const isFirstStep = flowState.step === "origin";

  if (redirectToRegistrationComplete) {
    return <Navigate to={ONBOARDING_REGISTRATION_COMPLETE_PATH} replace />;
  }

  if (!hasDrafts) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  if (flowState.step === "request") {
    return null;
  }

  return (
    <OnboardingFlowView
      {...viewProps}
      hideRequestStep
      backAction={isFirstStep ? undefined : viewProps.backAction}
      cancelAction={cancelAction}
    />
  );
}
