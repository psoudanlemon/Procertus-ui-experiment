import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DensityProvider } from "@procertus-ui/ui";
import {
  ExpertCallBookingView,
  TrajectPageFrame,
  TrajectStoryFooter,
  useOnboardingFlowApi,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";

import { useSyncOnboardingTrajectFromServiceId } from "../features/onboarding/use-sync-onboarding-traject-from-service-id";
import { findWegwijzerService } from "../features/wegwijzer/wegwijzer-services";
import {
  TRAJECT_ENTRY_POINT_QUERY_PARAM,
  isTrajectEntryPoint,
  type TrajectEntryPoint,
} from "../features/traject/traject-submission-context";

const WEGWIJZER_PATH = "/welcome";

const CATEGORY_LABEL = {
  certification: "Productcertificatie",
  attest: "Attest",
  document: "Document",
  inspection: "Keuring",
} as const;

export function ExpertCallPlaceholderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = useParams<{ serviceId: string }>();
  const [searchParams] = useSearchParams();
  useSyncOnboardingTrajectFromServiceId(serviceId);
  const service = findWegwijzerService(serviceId);
  const [canSubmit, setCanSubmit] = useState(false);
  const api = useOnboardingFlowApi();
  const { flowState, resolvedContext } = useOnboardingFlowState();

  const fromParam = searchParams.get(TRAJECT_ENTRY_POINT_QUERY_PARAM);
  const entryPoint: TrajectEntryPoint | undefined = isTrajectEntryPoint(fromParam)
    ? fromParam
    : undefined;

  const expertCallEntryId = service?.entry?.id;

  useEffect(() => {
    if (flowState.requestOrigin) return;
    api.setGuestIntakeChannel("expert-call", expertCallEntryId);
  }, [api, flowState.requestOrigin, expertCallEntryId]);

  if (serviceId && !service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  const entry = service?.entry;

  const handleCancel = () => {
    if (entry) {
      navigate(`${WEGWIJZER_PATH}?service=${entry.id}`);
    } else {
      navigate(WEGWIJZER_PATH);
    }
  };

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else if (entry) {
      const triageQuery = entryPoint ? `?${TRAJECT_ENTRY_POINT_QUERY_PARAM}=${entryPoint}` : "";
      navigate(`/welcome/aanvraag/${entry.id}${triageQuery}`);
    } else {
      navigate(WEGWIJZER_PATH);
    }
  };

  return (
    <TrajectPageFrame
      kicker={entry ? CATEGORY_LABEL[entry.category] : undefined}
      title="Plan een expert call"
      description="Eén uur live met een PROCERTUS-expert om uw vraag, uw dossier en de juiste route samen door te nemen."
      bodyGap="section"
      actionBar={
        <TrajectStoryFooter
          onCancel={handleCancel}
          onBack={handleBack}
          onContinue={() => {}}
          continueLabel="Verzenden"
          continueDisabled={!canSubmit}
        />
      }
    >
      <DensityProvider density="spacious">
        <ExpertCallBookingView
          alwaysShowSchedule
          idPrefix="expert-call"
          storageKey={`procertus.expert-call.${entry?.id ?? "hero"}`}
          onCanSubmitChange={setCanSubmit}
          onPersistedSnapshotChange={api.patchInformalIntakeCapture}
          prefill={{
            firstName: resolvedContext.representativeFirstName || undefined,
            lastName: resolvedContext.representativeLastName || undefined,
            email: resolvedContext.representativeEmail || undefined,
            company: resolvedContext.organizationName || undefined,
          }}
        />
      </DensityProvider>
    </TrajectPageFrame>
  );
}
