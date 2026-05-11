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

import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";
import {
  formalOnboardingStepPath,
  parseFormalOnboardingStepParam,
  shouldClampFormalStepToResume,
} from "../../routes/formal-request-routing";
import { PUBLIC_GUEST_LOGIN_PATH } from "../../routes/guestPaths";
import { usePublicPrototypeRegistryLanguageHeaderProps } from "../../layouts/PublicPrototypeLanguageContext";
import { WelcomePublicHeaderLeading } from "../../layouts/WelcomePublicHeaderLeading";
import { WelcomePublicHeaderTrailing } from "../../layouts/WelcomePublicHeaderTrailing";

export { ONBOARDING_REGISTRATION_COMPLETE_PATH } from "@procertus-ui/ui-certification";

const WEGWIJZER_PATH = "/welcome";
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;

/**
 * Formal onboarding after drafts exist. Expects ancestor {@link OnboardingFlowProvider}
 * ({@link PublicWelcomeOnboardingSessionLayout}).
 */
export function CustomerOnboardingFlow() {
  const navigate = useNavigate();
  const registryLang = usePublicPrototypeRegistryLanguageHeaderProps();
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
    parsedStep == null || shouldClampFormalStepToResume(parsedStep, resumeStep)
      ? formalOnboardingStepPath(resumeStep)
      : null;

  const flowSurfaceStep = parsedStep ?? resumeStep;
  useOnboardingCompanyLookupPrototypeEffects(urlResumeRedirect ? null : flowSurfaceStep);

  const onRegistrationStepChange = useCallback((next: OnboardingStep) => {
    navigate(formalOnboardingStepPath(next));
  }, [navigate]);

  const { redirectToRegistrationComplete, viewProps } = useOnboardingFlow({
    navigate,
    activeStep: flowSurfaceStep,
    onRegistrationStepChange,
    signInUrl: PUBLIC_GUEST_LOGIN_PATH,
    registryHeaderLeadingActions: <WelcomePublicHeaderLeading />,
    registryHeaderTrailingActions: <WelcomePublicHeaderTrailing />,
  });

  const svcParam = searchParams.get("service")?.trim() ?? "";
  useEffect(() => {
    if (!svcParam) return;
    const svc = findWegwijzerService(svcParam);
    if (!svc) return;
    api.setTrajectServiceId(svcParam, svc.entry.label);
  }, [api, svcParam]);

  const hasDrafts = flowState.drafts.length > 0;

  const cancelTarget = flowState.trajectServiceId
    ? TRIAGE_PATH(flowState.trajectServiceId)
    : WEGWIJZER_PATH;
  const cancelAction = useMemo(
    () => ({ label: "Annuleren", onClick: () => navigate(cancelTarget) }),
    [navigate, cancelTarget],
  );
  const isFirstRegistrationStep = viewProps.step === "origin";

  if (redirectToRegistrationComplete) {
    return <Navigate to={ONBOARDING_REGISTRATION_COMPLETE_PATH} replace />;
  }

  if (!hasDrafts) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  if (urlResumeRedirect) {
    return <Navigate to={urlResumeRedirect} replace />;
  }

  return (
    <OnboardingFlowView
      {...viewProps}
      {...registryLang}
      hideRequestStep
      backAction={isFirstRegistrationStep ? undefined : viewProps.backAction}
      cancelAction={cancelAction}
    />
  );
}
