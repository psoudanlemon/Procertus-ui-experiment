import { Alert, AlertDescription, AlertTitle, DownloadableItemList } from "@procertus-ui/ui";
import {
  RequestValidationCard,
  TrajectLayout,
  TrajectStoryFooter,
  buildGeneralProcessDocuments,
  buildProductDocumentsForDraft,
  useForceScrollConfirmation,
  type CertificationRequestDraft,
} from "@procertus-ui/ui-certification";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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

  const generalDocuments = useMemo(() => buildGeneralProcessDocuments(inquiries), [inquiries]);

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
          className="flex max-w-5xl flex-col gap-component"
          aria-labelledby="aanvraag-pakket-heading"
        >
          <div className="flex flex-col gap-micro">
            <h2
              id="aanvraag-pakket-heading"
              className="m-0 text-heading-md font-semibold leading-tight tracking-tight"
            >
              Aanvragen in dit pakket
            </h2>
            <p className="m-0 text-sm text-muted-foreground">
              {inquiries.length} {inquiries.length === 1 ? "aanvraag" : "aanvragen"} worden samen
              gebundeld.
            </p>
          </div>
          <div className="flex flex-col gap-component">
            {inquiries.map((draft) => (
              <RequestValidationCard
                key={draft.id}
                draft={draft}
                documents={buildProductDocumentsForDraft(draft)}
              />
            ))}
          </div>
        </section>

        <section
          className="flex max-w-5xl flex-col gap-component"
          aria-labelledby="aanvraag-algemeen-heading"
        >
          <div className="flex flex-col gap-micro">
            <h2
              id="aanvraag-algemeen-heading"
              className="m-0 text-heading-md font-semibold leading-tight tracking-tight"
            >
              Algemene procesinformatie
            </h2>
            <p className="m-0 text-sm text-muted-foreground">
              Documenten die gelden voor het volledige aanvraagpakket.
            </p>
          </div>
          <DownloadableItemList items={generalDocuments} />
          <Alert variant="info" className="max-w-5xl">
            <HugeiconsIcon icon={Clock01Icon} />
            <AlertTitle>Doorlooptijd: 8 tot 12 weken</AlertTitle>
            <AlertDescription>
              Vanaf indiening van een volledig dossier verloopt het traject in 8 tot 12 weken:
              ontvankelijkheidsanalyse, initiële audit, analyse van de proefresultaten en finale
              beslissing.
            </AlertDescription>
          </Alert>
          <div ref={sentinelRef} aria-hidden className="h-px w-full" />
        </section>
      </div>
    </TrajectLayout>
  );
}
