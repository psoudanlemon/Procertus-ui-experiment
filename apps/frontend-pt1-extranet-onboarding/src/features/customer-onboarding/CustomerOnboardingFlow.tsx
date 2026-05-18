import {
  ONBOARDING_REGISTRATION_COMPLETE_PATH,
  OnboardingFlowView,
  deriveFormalOnboardingResumeStep,
  useOnboardingCompanyLookupPrototypeEffects,
  useOnboardingFlow,
  useOnboardingFlowApi,
  useOnboardingFlowState,
  type OnboardingStep,
} from "@procertus-ui/ui-certification";
import { useCallback, useEffect, useMemo } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  formalOnboardingStepPath,
  parseFormalOnboardingStepParam,
  shouldClampFormalStepToResume,
} from "../../routes/formal-request-routing";
import { PUBLIC_GUEST_LOGIN_PATH } from "../../routes/guestPaths";
import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";
import { resetTrajectFlow } from "../traject/traject-submission-context";

export { ONBOARDING_REGISTRATION_COMPLETE_PATH } from "@procertus-ui/ui-certification";

const WEGWIJZER_PATH = "/welcome";

/**
 * Formal onboarding after drafts exist. Expects ancestor {@link OnboardingFlowProvider}
 * from {@link PublicAppShell}.
 *
 * URL steps ahead of {@link deriveFormalOnboardingResumeStep} are clamped backward; resume stays on
 * **customer** until the legal‑representative choice (Ja/Nee) is set.
 */
export function CustomerOnboardingFlow() {
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const [searchParams] = useSearchParams();
  const { flowState, resolvedContext } = useOnboardingFlowState();
  const api = useOnboardingFlowApi();

  const resumeStep = useMemo(
    () => deriveFormalOnboardingResumeStep(flowState, resolvedContext),
    [flowState, resolvedContext],
  );

  const parsedStep = parseFormalOnboardingStepParam(stepId);
  const urlResumeRedirect =
    parsedStep == null ||
    shouldClampFormalStepToResume(parsedStep, resumeStep, flowState.drafts)
      ? formalOnboardingStepPath(resumeStep)
      : null;

  const flowSurfaceStep = parsedStep ?? resumeStep;
  useOnboardingCompanyLookupPrototypeEffects(urlResumeRedirect ? null : flowSurfaceStep);

  const onRegistrationStepChange = useCallback(
    (next: OnboardingStep) => {
      navigate(formalOnboardingStepPath(next));
    },
    [navigate],
  );

  const { redirectToRegistrationComplete, viewProps } = useOnboardingFlow({
    navigate,
    activeStep: flowSurfaceStep,
    onRegistrationStepChange,
    signInUrl: PUBLIC_GUEST_LOGIN_PATH,
  });

  const svcParam = searchParams.get("service")?.trim() ?? "";
  useEffect(() => {
    if (!svcParam) return;
    const svc = findWegwijzerService(svcParam);
    if (!svc) return;
    api.setTrajectServiceId(svcParam, svc.entry.label);
  }, [api, svcParam]);

  const hasDrafts = flowState.drafts.length > 0;

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
  const isFirstRegistrationStep = viewProps.step === "origin";

  if (redirectToRegistrationComplete) {
    return <Navigate to={ONBOARDING_REGISTRATION_COMPLETE_PATH} replace />;
  }

  if (!hasDrafts) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  const mayEnterFormal =
    flowState.formalRequestPackageCommitted || flowState.requestOrigin !== "";
  if (!mayEnterFormal) {
    const sid = flowState.trajectServiceId.trim();
    return <Navigate to={sid ? `/welcome/aanvraag/${sid}` : WEGWIJZER_PATH} replace />;
  }

  if (urlResumeRedirect) {
    return <Navigate to={urlResumeRedirect} replace />;
  }

  return (
    <OnboardingFlowView
      {...viewProps}
      embeddedRegistryShell
      backAction={isFirstRegistrationStep ? undefined : viewProps.backAction}
      cancelAction={cancelAction}
      onSummaryEditInquiriesClick={() => navigate(WEGWIJZER_PATH)}
    />
  );
}
