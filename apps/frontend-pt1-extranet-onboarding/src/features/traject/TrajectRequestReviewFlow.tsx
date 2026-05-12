import { Button } from "@procertus-ui/ui";
import {
  ProductDocumentationLibrary,
  ProductInquiryMatrix,
  TrajectPageFrame,
  TrajectStoryFooter,
  buildProductDocumentsForDraft,
  groupDraftsByProduct,
  type CertificationRequestDraft,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";
import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";

const WEGWIJZER_PATH = "/welcome";
const BUNDLE_ASSEMBLE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}/pakket`;
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;

/** Een draft telt als "echt productgebonden" als er een productId óf productLabel op staat. */
function isProductBoundDraft(draft: CertificationRequestDraft): boolean {
  return Boolean(draft.productId?.trim() || draft.productLabel?.trim());
}

export function TrajectRequestReviewFlow() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);
  const { flowState } = useOnboardingFlowState();
  const inquiries: CertificationRequestDraft[] = flowState.drafts;
  const productGroups = useMemo(() => groupDraftsByProduct(inquiries), [inquiries]);
  const hasProducts = useMemo(() => inquiries.some(isProductBoundDraft), [inquiries]);
  const isNonProductBound = service?.entry.productRelation === "optional";

  const handleCancel = useCallback(() => navigate(WEGWIJZER_PATH), [navigate]);
  const handleBack = useCallback(() => {
    if (!serviceId) return;
    if (isNonProductBound) {
      navigate(WEGWIJZER_PATH);
      return;
    }
    navigate(BUNDLE_ASSEMBLE_PATH(serviceId));
  }, [isNonProductBound, navigate, serviceId]);
  const handleContinue = useCallback(() => {
    if (!serviceId) return;
    navigate(TRIAGE_PATH(serviceId));
  }, [navigate, serviceId]);

  /** Zelfde als pakket-samenstellen: terug naar de wegwijzer om een bijkomend certificaattype te kiezen. */
  const handleAddMore = useCallback(() => {
    navigate(WEGWIJZER_PATH);
  }, [navigate]);

  if (!serviceId || !service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }
  if (inquiries.length === 0) {
    return <Navigate to={BUNDLE_ASSEMBLE_PATH(serviceId)} replace />;
  }

  return (
    <TrajectPageFrame
      bodyGap="section"
      kicker={service.entry.label}
      title="Controleer je aanvraagpakket"
      description={
        hasProducts
          ? "Lees de onderstaande samenvatting van je geselecteerde producten en de bijbehorende documentatie aandachtig na ter validatie voordat je verder gaat naar je keuze (informatie of formeel traject)."
          : "Valideer het overzicht van je geselecteerde traject(en) hieronder voordat je verder gaat naar je keuze (informatie of formeel traject)."
      }
      actionBar={
        <TrajectStoryFooter
          onCancel={handleCancel}
          onBack={handleBack}
          onContinue={handleContinue}
          cancelLabel="Annuleren"
          backLabel="Terug"
          continueLabel="Bevestig"
        />
      }
    >
      <div className="flex flex-col gap-component">
        <section
          className="flex flex-col gap-component rounded-xl border border-border bg-card p-section text-card-foreground"
          aria-labelledby="aanvraag-matrix-heading"
        >
          <div className="flex flex-col">
            <h2
              id="aanvraag-matrix-heading"
              className="m-0 text-heading-lg font-semibold text-heading-foreground"
            >
              Overzicht aanvragen
            </h2>
            <p className="m-0 text-sm text-muted-foreground">
              {inquiries.length} {inquiries.length === 1 ? "certificaat" : "certificaten"}{" "}
              aangevraagd over {productGroups.length}{" "}
              {productGroups.length === 1 ? "product" : "producten"}.
            </p>
          </div>
          <ProductInquiryMatrix groups={productGroups} primaryEntryId={service.entry.id} />
        </section>

        <div className="flex flex-wrap items-center gap-component">
          <Button type="button" variant="outline" size="sm" onClick={handleAddMore}>
            Nog certificatie toevoegen
          </Button>
        </div>

        {hasProducts ? (
          <ProductDocumentationLibrary
            groups={productGroups}
            documentsForDraft={buildProductDocumentsForDraft}
          />
        ) : null}
      </div>
    </TrajectPageFrame>
  );
}
