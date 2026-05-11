import { cn } from "@procertus-ui/ui";
import {
  PRODUCT_REQUEST_NOTE_MAX_LENGTH,
  PRODUCT_REQUEST_NOTE_MAX_LENGTH_LONG,
  ProductDocumentationLibrary,
  ProductInquiryMatrix,
  ProductRequestNoteField,
  TrajectLayout,
  TrajectStoryFooter,
  buildProductDocumentsForDraft,
  groupDraftsByProduct,
  isProductRequestNoteComplete,
  type CertificationRequestDraft,
} from "@procertus-ui/ui-certification";
import { useCallback, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { APP_FOOTER } from "../../layouts/footerConfig";
import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";
import { readOnboardingFlowSnapshot } from "./traject-submission-context";

const WEGWIJZER_PATH = "/welcome";
const SIGNIN_PATH = "/welcome/login";
const BUNDLE_ASSEMBLE_PATH = (serviceId: string) =>
  `/welcome/aanvraag/${serviceId}/pakket`;
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;

/** Een draft telt als "echt productgebonden" als er een productId óf productLabel op staat. */
function isProductBoundDraft(draft: CertificationRequestDraft): boolean {
  return Boolean(draft.productId?.trim() || draft.productLabel?.trim());
}

/**
 * SessionStorage-sleutel voor de begeleidende-brief textarea zodat terug-navigatie
 * de eerder ingetypte tekst herstelt. Per service apart bewaard.
 */
const NOTE_STORAGE_KEY = (serviceId: string) => `procertus.request-review.note.${serviceId}`;

function readPersistedNote(serviceId: string | undefined): string {
  if (!serviceId || typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(NOTE_STORAGE_KEY(serviceId)) ?? "";
  } catch {
    return "";
  }
}

function writePersistedNote(serviceId: string | undefined, value: string) {
  if (!serviceId || typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(NOTE_STORAGE_KEY(serviceId), value);
  } catch {
    // Storage kan onbeschikbaar zijn (privémodus, quota) — stille fallback.
  }
}

export function TrajectRequestReviewFlow() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);

  const snapshot = useMemo(() => readOnboardingFlowSnapshot(), []);
  const inquiries: CertificationRequestDraft[] = snapshot.drafts;
  const productGroups = useMemo(() => groupDraftsByProduct(inquiries), [inquiries]);
  const hasProducts = useMemo(
    () => inquiries.some(isProductBoundDraft),
    [inquiries],
  );
  // Niet-productgebonden certificaten (`productRelation === "optional"` in de
  // wegwijzer) springen via de detail-card-CTA rechtstreeks naar dit scherm,
  // zonder product- of bundle-stap. De begeleidende brief is dan het enige
  // dossier-element, en daarom verplicht.
  const isNonProductBound = service?.entry.productRelation === "optional";
  const noteRequired = isNonProductBound === true || !hasProducts;
  const [note, setNoteState] = useState<string>(() => readPersistedNote(serviceId));
  const setNote = useCallback(
    (value: string) => {
      setNoteState(value);
      writePersistedNote(serviceId, value);
    },
    [serviceId],
  );

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
      title={
        hasProducts ? "Controleer je aanvraagpakket" : `Beschrijf je ${service.entry.shortLabel}-aanvraag`
      }
      description={
        hasProducts
          ? "Lees de onderstaande samenvatting van je geselecteerde producten en de bijbehorende documentatie aandachtig na ter validatie voordat je de aanvraag indient."
          : `Geef in onderstaande brief de context en details van je ${service.entry.shortLabel}-aanvraag mee. Een PROCERTUS-expert neemt je dossier op basis daarvan op.`
      }
      actionBar={
        <TrajectStoryFooter
          onCancel={handleCancel}
          onBack={handleBack}
          onContinue={handleContinue}
          cancelLabel="Annuleren"
          backLabel="Terug"
          continueLabel="Bevestig"
          continueDisabled={!isProductRequestNoteComplete(note, noteRequired)}
        />
      }
    >
      <div className="flex flex-col gap-component">
        <section
          className={cn(
            "flex flex-col gap-component rounded-xl border bg-card p-section text-card-foreground transition-colors",
            "focus-within:ring-3 focus-within:ring-ring/50",
            note.trim().length > 0 ? "border-primary/50" : "border-border",
          )}
          aria-labelledby="begeleidende-brief-heading"
        >
          <h2
            id="begeleidende-brief-heading"
            className="m-0 text-heading-lg font-semibold text-heading-foreground"
          >
            Begeleidende brief
          </h2>
          <ProductRequestNoteField
            value={note}
            onChange={setNote}
            required={noteRequired}
            maxLength={
              hasProducts
                ? PRODUCT_REQUEST_NOTE_MAX_LENGTH
                : PRODUCT_REQUEST_NOTE_MAX_LENGTH_LONG
            }
            rows={hasProducts ? 6 : 16}
            bordered={false}
            aria-labelledby="begeleidende-brief-heading"
          />
        </section>

        {hasProducts ? (
          <>
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
                  {inquiries.length}{" "}
                  {inquiries.length === 1 ? "certificaat" : "certificaten"} aangevraagd over{" "}
                  {productGroups.length}{" "}
                  {productGroups.length === 1 ? "product" : "producten"}.
                </p>
              </div>
              <ProductInquiryMatrix
                groups={productGroups}
                primaryEntryId={service.entry.id}
              />
            </section>

            <ProductDocumentationLibrary
              groups={productGroups}
              documentsForDraft={buildProductDocumentsForDraft}
            />
          </>
        ) : null}
      </div>
    </TrajectLayout>
  );
}
