import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { H2, cn } from "@procertus-ui/ui";
import {
  PRODUCT_REQUEST_NOTE_MAX_LENGTH_LONG,
  ExpertCallBookingView,
  TrajectPageFrame,
  TrajectStoryFooter,
  ProductInquiryMatrix,
  ProductRequestNoteField,
  StandaloneInquiriesOverview,
  groupDraftsByProduct,
  isProductBoundDraft,
  standaloneInquiryDrafts,
  useOnboardingFlowApi,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";

import { useSyncOnboardingTrajectFromServiceId } from "../features/onboarding/use-sync-onboarding-traject-from-service-id";
import {
  buildInfoRequestSubmittedSnapshot,
  persistInfoRequestSubmittedSnapshot,
} from "../features/info-request/info-request-submitted-snapshot";
import { resetTrajectFlow } from "../features/traject/traject-submission-context";
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
    () => groupDraftsByProduct(flowState.drafts.filter(isProductBoundDraft)),
    [flowState.drafts],
  );
  const standaloneInquiries = useMemo(
    () => standaloneInquiryDrafts(flowState.drafts),
    [flowState.drafts],
  );
  const showInquiryOverview = productGroups.length > 0 || standaloneInquiries.length > 0;

  const informationalEntryId = service?.entry.id;

  useEffect(() => {
    api.unlockSubmissionNoteFromInformationalPath();
  }, [api]);

  useEffect(() => {
    if (!informationalEntryId || flowState.requestOrigin) return;
    api.setGuestIntakeChannel("informational", informationalEntryId);
  }, [api, flowState.requestOrigin, informationalEntryId]);

  const submissionNote = flowState.submissionNote ?? "";

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
    const bookingKey = `procertus.info-request.${entry.id}`;
    const snapshot = buildInfoRequestSubmittedSnapshot({
      flowState,
      serviceId: entry.id,
      serviceLabel: entry.label,
      bookingSessionStorageKey: bookingKey,
    });
    persistInfoRequestSubmittedSnapshot(snapshot);
    try {
      window.sessionStorage.removeItem(bookingKey);
    } catch {
      // sessionStorage may be unavailable — ignore.
    }
    resetTrajectFlow(api);
    navigate(`/welcome/info-request/${entry.id}/verzonden`, { replace: true });
  };

  return (
    <TrajectPageFrame
      kicker={"vrijblijvend"}
      title="Je vraag naar meer informatie"
      description="Laat je gegevens hieronder achter. We bekijken je vraag en nemen snel contact met je op."
      bodyGap="section"
      actionBar={
        <TrajectStoryFooter
          mode="in-flow"
          onCancel={handleCancel}
          onBack={handleBack}
          onContinue={handleSubmit}
          continueLabel="Aanvraag verzenden"
          continueDisabled={!canSubmit}
        />
      }
    >
      {showInquiryOverview ? (
        <section
          className="flex flex-col gap-component rounded-xl border border-border bg-card p-section text-card-foreground"
          aria-labelledby="info-request-matrix-heading"
        >
          <div className="flex flex-col">
            <H2 id="info-request-matrix-heading" className="m-0">
              Waarover wil je informatie?
            </H2>
            <p className="m-0 text-sm text-muted-foreground">
              {productGroups.length > 0 && standaloneInquiries.length === 0 ? (
                <>
                  Informatie over {flowState.drafts.length}{" "}
                  {flowState.drafts.length === 1 ? "certificaat" : "certificaten"} aan te vragen
                  over {productGroups.length} {productGroups.length === 1 ? "product" : "producten"}
                  .
                </>
              ) : null}
              {productGroups.length > 0 && standaloneInquiries.length > 0 ? (
                <>
                  Informatie over {flowState.drafts.length}{" "}
                  {flowState.drafts.length === 1 ? "certificaat" : "certificaten"}:{" "}
                  {flowState.drafts.length - standaloneInquiries.length} gekoppeld aan{" "}
                  {productGroups.length} {productGroups.length === 1 ? "product" : "producten"} en{" "}
                  {standaloneInquiries.length}{" "}
                  {standaloneInquiries.length === 1 ? "aanvraag" : "aanvragen"} zonder gekoppeld
                  product.
                </>
              ) : null}
              {productGroups.length === 0 && standaloneInquiries.length > 0 ? (
                <>
                  Informatie over {standaloneInquiries.length}{" "}
                  {standaloneInquiries.length === 1 ? "certificaat" : "certificaten"} zonder
                  gekoppeld product uit de catalogus.
                </>
              ) : null}
            </p>
          </div>
          {productGroups.length > 0 ? (
            <ProductInquiryMatrix groups={productGroups} primaryEntryId={entry.id} />
          ) : null}
          <StandaloneInquiriesOverview drafts={standaloneInquiries} />
        </section>
      ) : null}

      <section
        className={cn(
          "flex flex-col gap-component rounded-xl border bg-card p-section text-card-foreground transition-colors",
          "focus-within:ring-3 focus-within:ring-ring/50",
          submissionNote.trim().length > 0 ? "border-primary/50" : "border-border",
        )}
        aria-labelledby="info-request-note-heading"
      >
        <H2 id="info-request-note-heading" className="m-0">
          Begeleidende toelichting
        </H2>
        <ProductRequestNoteField
          value={submissionNote}
          onChange={(v) => api.setSubmissionNote(v)}
          required={false}
          maxLength={PRODUCT_REQUEST_NOTE_MAX_LENGTH_LONG}
          rows={8}
          bordered={false}
          autoFocus={false}
          aria-labelledby="info-request-note-heading"
          placeholder="Beschrijf hier de context van je vraag of een concreet aandachtspunt."
        />
      </section>

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
    </TrajectPageFrame>
  );
}
