import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { DensityProvider } from "@procertus-ui/ui";
import {
  ExpertCallBookingView,
  TrajectPageFrame,
  TrajectStoryFooter,
} from "@procertus-ui/ui-certification";

import { useSyncOnboardingTrajectFromServiceId } from "../features/onboarding/use-sync-onboarding-traject-from-service-id";
import { findWegwijzerService } from "../features/wegwijzer/wegwijzer-services";
import { readOnboardingFlowSnapshot } from "../features/traject/traject-submission-context";

const WEGWIJZER_PATH = "/welcome";

const CATEGORY_LABEL = {
  certification: "Productcertificatie",
  attest: "Attest",
  document: "Document",
  inspection: "Keuring",
} as const;

export function InfoRequestPlaceholderPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  useSyncOnboardingTrajectFromServiceId(serviceId);
  const service = findWegwijzerService(serviceId);
  const [canSubmit, setCanSubmit] = useState(false);

  const flowSnapshot = useMemo(() => readOnboardingFlowSnapshot(), []);
  const prefill = flowSnapshot.context;

  if (!service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  const { entry } = service;

  const handleCancel = () => {
    navigate(`${WEGWIJZER_PATH}?service=${entry.id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    try {
      window.sessionStorage.removeItem(`procertus.info-request.${entry.id}`);
    } catch {
      // sessionStorage may be unavailable — ignore.
    }
    navigate(`/welcome/info-request/${entry.id}/verzonden`, { replace: true });
  };

  return (
    <TrajectPageFrame
      kicker={CATEGORY_LABEL[entry.category]}
      title="Een informatieve aanvraag"
      description="Gelieve uw gegevens achter te laten. Wij bekijken uw aanvraag en nemen binnenkort met u contact op om deze verder te bespreken."
      bodyGap="section"
      actionBar={
        <TrajectStoryFooter
          onCancel={handleCancel}
          onBack={handleBack}
          onContinue={handleSubmit}
          continueLabel="Aanvraag verzenden"
          continueDisabled={!canSubmit}
        />
      }
    >
      <DensityProvider density="spacious">
        <ExpertCallBookingView
          idPrefix="info-request"
          storageKey={`procertus.info-request.${entry.id}`}
          onCanSubmitChange={setCanSubmit}
          prefill={{
            firstName: prefill.representativeFirstName || undefined,
            lastName: prefill.representativeLastName || undefined,
            email: prefill.representativeEmail || undefined,
            company: prefill.organizationName || undefined,
          }}
        />
      </DensityProvider>
    </TrajectPageFrame>
  );
}
