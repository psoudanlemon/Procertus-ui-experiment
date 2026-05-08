import {
  CertificationRequestWizard,
  ONBOARDING_CERTIFICATION_STORE_STORAGE_KEY,
  TrajectLayout,
  type CertificationRequestDraft,
} from "@procertus-ui/ui-certification";
import { useCallback } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { persistTrajectHandoff, resetTrajectFlow } from "./traject-submission-context";

const WEGWIJZER_PATH = "/welcome";
const SIGNIN_PATH = "/welcome/login";
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;

export function TrajectConfigureFlow() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();

  // Annuleren = volledige reset. Gebruiker zegt expliciet "ik weet het niet, ik begin opnieuw",
  // dus traject + klantgegevens worden gewist en we sturen ze terug naar de Wegwijzer. Geen
  // OnboardingFlowProvider gemount, dus we wissen alleen localStorage.
  const handleCancel = useCallback(() => {
    resetTrajectFlow();
    navigate(WEGWIJZER_PATH);
  }, [navigate]);

  // Wizard-output rechtstreeks doorschrijven naar de OnboardingFlow-state in localStorage.
  // CustomerOnboardingFlow leest deze state bij mount en pakt het traject op vanaf "origin".
  const handleComplete = useCallback(
    (drafts: CertificationRequestDraft[]) => {
      if (!serviceId) return;
      persistTrajectHandoff({ drafts, serviceId });
      navigate(TRIAGE_PATH(serviceId), { replace: true });
    },
    [navigate, serviceId],
  );

  if (!serviceId) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  return (
    <TrajectLayout onSignInClick={() => navigate(SIGNIN_PATH)}>
      <CertificationRequestWizard
        mode="onboarding"
        backendKind="localStorage"
        storageKey={ONBOARDING_CERTIFICATION_STORE_STORAGE_KEY}
        sessionId="pt1:onboarding:certification-request"
        onCancel={handleCancel}
        onComplete={handleComplete}
        stepLayoutChromeStyle="bare"
      />
    </TrajectLayout>
  );
}
