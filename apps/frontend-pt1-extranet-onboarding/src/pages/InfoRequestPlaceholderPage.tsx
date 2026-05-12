import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { DensityProvider } from "@procertus-ui/ui";
import {
  ExpertCallBookingView,
  TrajectPageFrame,
  TrajectStoryFooter,
  ProductInquiryMatrix,
  groupDraftsByProduct,
  useOnboardingFlowApi,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";

import { useSyncOnboardingTrajectFromServiceId } from "../features/onboarding/use-sync-onboarding-traject-from-service-id";
import { findWegwijzerService } from "../features/wegwijzer/wegwijzer-services";

const WEGWIJZER_PATH = "/welcome";

export function InfoRequestPlaceholderPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  useSyncOnboardingTrajectFromServiceId(serviceId);
  const service = findWegwijzerService(serviceId);
  const [canSubmit, setCanSubmit] = useState(false);
  const api = useOnboardingFlowApi();
  const { flowState, resolvedContext } = useOnboardingFlowState();

  const productGroups = useMemo(
    () => groupDraftsByProduct(flowState.drafts),
    [flowState.drafts],
  );
  const hasProductInquiries = useMemo(
    () =>
      flowState.drafts.some(
        (d) => Boolean(d.productId?.trim() || d.productLabel?.trim()),
      ),
    [flowState.drafts],
  );

  const informationalEntryId = service?.entry.id;

  useEffect(() => {
    if (!informationalEntryId || flowState.requestOrigin) return;
    api.setGuestIntakeChannel("informational", informationalEntryId);
  }, [api, flowState.requestOrigin, informationalEntryId]);

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
    api.clearInformalIntakeCapture();
    navigate(`/welcome/info-request/${entry.id}/verzonden`, { replace: true });
  };

  return (
    <TrajectPageFrame
      kicker={"vrijblijvend"}
      title="Uw vraag naar meer informatie"
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
      {hasProductInquiries ? (
        <section
          className="flex flex-col gap-component rounded-xl border border-border bg-card p-section text-card-foreground"
          aria-labelledby="info-request-matrix-heading"
        >
          <div className="flex flex-col">
            <h2
              id="info-request-matrix-heading"
              className="m-0 text-heading-lg font-semibold text-heading-foreground"
            >
              Overzicht aanvragen
            </h2>
            <p className="m-0 text-sm text-muted-foreground">
              {flowState.drafts.length}{" "}
              {flowState.drafts.length === 1 ? "certificaat" : "certificaten"} aangevraagd over{" "}
              {productGroups.length}{" "}
              {productGroups.length === 1 ? "product" : "producten"}.
            </p>
          </div>
          <ProductInquiryMatrix groups={productGroups} primaryEntryId={entry.id} />
        </section>
      ) : null}
      <DensityProvider density="spacious">
        <ExpertCallBookingView
          idPrefix="info-request"
          storageKey={`procertus.info-request.${entry.id}`}
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
