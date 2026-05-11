import {
  ProductDocumentationLibrary,
  ProductInquiryMatrix,
  TrajectLayout,
  TrajectStoryFooter,
  buildProductDocumentsForDraft,
  groupDraftsByProduct,
  useForceScrollConfirmation,
  type CertificationRequestDraft,
} from "@procertus-ui/ui-certification";
import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { APP_FOOTER } from "../../layouts/footerConfig";
import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";
import { readOnboardingFlowSnapshot } from "./traject-submission-context";

const WEGWIJZER_PATH = "/welcome";
const SIGNIN_PATH = "/welcome/login";
const BUNDLE_ASSEMBLE_PATH = (serviceId: string) =>
  `/welcome/aanvraag/${serviceId}/pakket`;
const REGISTRATION_COMPLETE_PATH = "/registratie-voltooid";

export function TrajectRequestReviewFlow() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);

  const snapshot = useMemo(() => readOnboardingFlowSnapshot(), []);
  const inquiries: CertificationRequestDraft[] = snapshot.drafts;
  const productGroups = useMemo(() => groupDraftsByProduct(inquiries), [inquiries]);

  const { sentinelRef, hasReachedBottom } = useForceScrollConfirmation();

  const handleCancel = useCallback(() => navigate(WEGWIJZER_PATH), [navigate]);
  const handleBack = useCallback(() => {
    if (!serviceId) return;
    navigate(BUNDLE_ASSEMBLE_PATH(serviceId));
  }, [navigate, serviceId]);
  const handleContinue = useCallback(() => {
    navigate(REGISTRATION_COMPLETE_PATH, { replace: true });
  }, [navigate]);

  if (!serviceId || !service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }
  if (inquiries.length === 0) {
    return <Navigate to={BUNDLE_ASSEMBLE_PATH(serviceId)} replace />;
  }

  return (
    <TrajectLayout
      onSignInClick={() => navigate(SIGNIN_PATH)}
      footer={APP_FOOTER}
      bodyGap="section"
      kicker={service.entry.label}
      title="Controleer je aanvraagpakket"
      description="Lees de onderstaande samenvatting van je geselecteerde producten en de bijbehorende documentatie aandachtig na ter validatie voordat je de aanvraag indient."
      actionBar={
        <div className="flex w-full flex-col gap-micro">
          {!hasReachedBottom ? (
            <p
              className="m-0 text-xs font-medium text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              Scroll naar beneden om te kunnen bevestigen.
            </p>
          ) : null}
          <TrajectStoryFooter
            onCancel={handleCancel}
            onBack={handleBack}
            onContinue={handleContinue}
            cancelLabel="Annuleren"
            backLabel="Terug"
            continueLabel="Bevestig en verzend"
            continueDisabled={!hasReachedBottom}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-region">
        <section
          className="flex flex-col gap-component"
          aria-labelledby="aanvraag-matrix-heading"
        >
          <div className="flex flex-wrap items-baseline gap-x-component gap-y-micro">
            <h2
              id="aanvraag-matrix-heading"
              className="m-0 text-lg font-semibold leading-tight tracking-tight text-foreground"
            >
              Overzicht aanvragen
            </h2>
            <p className="m-0 text-sm text-muted-foreground">
              {inquiries.length}{" "}
              {inquiries.length === 1 ? "certificaat" : "certificaten"} aangevraagd over{" "}
              {productGroups.length}{" "}
              {productGroups.length === 1 ? "product" : "producten"}.
            </p>
          </div>
          <ProductInquiryMatrix groups={productGroups} />
        </section>

        <section
          className="flex flex-col gap-section"
          aria-labelledby="documentatie-heading"
        >
          <h2
            id="documentatie-heading"
            className="m-0 text-lg font-semibold leading-tight tracking-tight text-foreground"
          >
            Uw documentatie-pakket
          </h2>
          <ProductDocumentationLibrary
            groups={productGroups}
            documentsForDraft={buildProductDocumentsForDraft}
          />
        </section>

        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      </div>
    </TrajectLayout>
  );
}
