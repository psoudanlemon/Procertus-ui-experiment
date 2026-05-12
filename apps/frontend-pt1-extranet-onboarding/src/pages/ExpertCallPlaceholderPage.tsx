import { useMemo, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { DensityProvider } from "@procertus-ui/ui";
import {
  ExpertCallBookingView,
  TrajectLayout,
  TrajectStoryFooter,
} from "@procertus-ui/ui-certification";

import { APP_FOOTER } from "../layouts/footerConfig";
import { PUBLIC_GUEST_LOGIN_PATH } from "../routes/guestPaths";
import { useSyncOnboardingTrajectFromServiceId } from "../features/onboarding/use-sync-onboarding-traject-from-service-id";
import { findWegwijzerService } from "../features/wegwijzer/wegwijzer-services";
import {
  TRAJECT_ENTRY_POINT_QUERY_PARAM,
  isTrajectEntryPoint,
  readOnboardingFlowSnapshot,
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

  const fromParam = searchParams.get(TRAJECT_ENTRY_POINT_QUERY_PARAM);
  const entryPoint: TrajectEntryPoint | undefined = isTrajectEntryPoint(fromParam)
    ? fromParam
    : undefined;

  const flowSnapshot = useMemo(() => readOnboardingFlowSnapshot(), []);
  const prefill = flowSnapshot.context;

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
      const triageQuery = entryPoint
        ? `?${TRAJECT_ENTRY_POINT_QUERY_PARAM}=${entryPoint}`
        : "";
      navigate(`/welcome/aanvraag/${entry.id}${triageQuery}`);
    } else {
      navigate(WEGWIJZER_PATH);
    }
  };

  return (
    <DensityProvider density="spacious">
      <TrajectLayout
        onSignInClick={() => navigate(PUBLIC_GUEST_LOGIN_PATH)}
        footer={APP_FOOTER}
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
        <ExpertCallBookingView
          idPrefix="expert-call"
          storageKey={`procertus.expert-call.${entry?.id ?? "hero"}`}
          onCanSubmitChange={setCanSubmit}
          prefill={{
            firstName: prefill.representativeFirstName || undefined,
            lastName: prefill.representativeLastName || undefined,
            email: prefill.representativeEmail || undefined,
            company: prefill.organizationName || undefined,
          }}
        />
      </TrajectLayout>
    </DensityProvider>
  );
}
