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
import { findWegwijzerService } from "../features/wegwijzer/wegwijzer-services";
import {
  TRAJECT_ENTRY_POINT_QUERY_PARAM,
  isTrajectEntryPoint,
  readOnboardingFlowSnapshot,
  type TrajectEntryPoint,
} from "../features/traject/traject-submission-context";

const LOGIN_PATH = "/welcome/login";
const WEGWIJZER_PATH = "/welcome";

const CATEGORY_LABEL = {
  certification: "Productcertificatie",
  attest: "Attest",
  document: "Document",
  inspection: "Keuring",
} as const;

export function InfoRequestPlaceholderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = useParams<{ serviceId: string }>();
  const [searchParams] = useSearchParams();
  const service = findWegwijzerService(serviceId);
  const [canSubmit, setCanSubmit] = useState(false);

  const fromParam = searchParams.get(TRAJECT_ENTRY_POINT_QUERY_PARAM);
  const entryPoint: TrajectEntryPoint | undefined = isTrajectEntryPoint(fromParam)
    ? fromParam
    : undefined;

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
    if (location.key !== "default") {
      navigate(-1);
    } else {
      const triageQuery = entryPoint
        ? `?${TRAJECT_ENTRY_POINT_QUERY_PARAM}=${entryPoint}`
        : "";
      navigate(`/welcome/aanvraag/${entry.id}${triageQuery}`);
    }
  };

  return (
    <DensityProvider density="spacious">
      <TrajectLayout
        onSignInClick={() => navigate(LOGIN_PATH)}
        footer={APP_FOOTER}
        kicker={CATEGORY_LABEL[entry.category]}
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
      </TrajectLayout>
    </DensityProvider>
  );
}
