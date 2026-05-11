import {
  OnboardingRequestStep,
  useOnboardingFlow,
} from "@procertus-ui/ui-certification";
import type { CertificationRequestDraft } from "@procertus-ui/ui-certification";
import { useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useSyncOnboardingTrajectFromServiceId } from "../onboarding/use-sync-onboarding-traject-from-service-id";
import { ActiveInquiryContinueAlert } from "../../layouts/ActiveInquiryContinueAlert";
import { usePublicPrototypeRegistryLanguageHeaderProps } from "../../layouts/PublicPrototypeLanguageContext";
import { WelcomePublicHeaderLeading } from "../../layouts/WelcomePublicHeaderLeading";
import { WelcomePublicHeaderTrailing } from "../../layouts/WelcomePublicHeaderTrailing";
import { PUBLIC_GUEST_LOGIN_PATH } from "../../routes/guestPaths";

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
  const registryLang = usePublicPrototypeRegistryLanguageHeaderProps();
  useSyncOnboardingTrajectFromServiceId(serviceId);
  const { viewProps } = useOnboardingFlow({
    navigate,
    activeStep: "request",
    onRegistrationStepChange: () => {},
    signInUrl: PUBLIC_GUEST_LOGIN_PATH,
    registryHeaderLeadingActions: <WelcomePublicHeaderLeading />,
    registryHeaderTrailingActions: <WelcomePublicHeaderTrailing />,
  });

  const certificationWizardProps = useMemo(
    () => ({
      ...viewProps.certificationWizardProps,
      onComplete: (nextDrafts: CertificationRequestDraft[]) => {
        viewProps.certificationWizardProps.onComplete(nextDrafts);
        navigate(TRIAGE_PATH(serviceId), { replace: true });
      },
    }),
    [navigate, serviceId, viewProps.certificationWizardProps],
  );

  return (
    <OnboardingRequestStep
      pageTitle={viewProps.certificationPhaseTitle}
      pageDescription={viewProps.certificationPhaseDescription}
      onSignInClick={viewProps.onSignInClick}
      certificationWizardProps={certificationWizardProps}
      headerLeadingActions={viewProps.registryHeaderLeadingActions}
      headerTrailingActions={viewProps.registryHeaderTrailingActions}
      loginUrl={viewProps.signInUrl}
      guestLanguagePlacement={viewProps.guestLanguagePlacement}
      sessionBanner={<ActiveInquiryContinueAlert />}
      {...registryLang}
    />
  );
}
