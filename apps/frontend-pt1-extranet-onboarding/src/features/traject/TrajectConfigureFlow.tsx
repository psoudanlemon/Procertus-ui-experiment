import {
  BUNDLE_CERT_ORDER,
  ProductSelectionBasketActionBar,
  ProductSelectionBasketBody,
  ProductSelectionBasketMobileSummaryBar,
  ProductSelectionBasketProvider,
  TrajectPageFrame,
  buildProductIndex,
  defaultProcertusCategorizationDoc,
  type BundleCertKey,
  type CertificationEntryId,
  type CertificationRequestDraft,
} from "@procertus-ui/ui-certification";
import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";
import {
  persistTrajectHandoff,
  readOnboardingFlowSnapshot,
} from "./traject-submission-context";

const WEGWIJZER_PATH = "/welcome";
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;
const BUNDLE_ASSEMBLE_PATH = (serviceId: string) =>
  `/welcome/aanvraag/${serviceId}/pakket`;
const REQUEST_REVIEW_PATH = (serviceId: string) =>
  `/welcome/aanvraag/${serviceId}/controleren`;

// Alleen wegwijzer-services die als hoofdcertificatie binnen het bundle-pakket vallen
// (BENOR/CE/SSD/PROCERTUS) krijgen de extra "Voeg trajecten toe"-stap. Andere services
// (ATG, Partijkeuring, …) hebben geen bundle-extras en gaan rechtstreeks naar Triage.
function isBundleCertService(value: string): value is BundleCertKey {
  return (BUNDLE_CERT_ORDER as readonly string[]).includes(value);
}

/**
 * Product selection wizard under {@link PublicAppShell}.
 */
export function TrajectConfigureFlow() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);

  // Wanneer de gebruiker via "Terug" terugkeert vanuit het bundle-assemble scherm, lezen we
  // de eerder gepersisteerde drafts opnieuw in zodat de productselectie ge-prevuld is.
  const initialSelectedIds = useMemo<readonly string[]>(() => {
    const snapshot = readOnboardingFlowSnapshot();
    if (!serviceId || snapshot.trajectServiceId !== serviceId) return [];
    const ids = snapshot.drafts.flatMap((d) => (d.productId ? [d.productId] : []));
    return Array.from(new Set(ids));
  }, [serviceId]);

  // "Terug" houdt de reeds gemaakte productselectie en eventuele klantgegevens vast: we
  // navigeren enkel terug naar de wegwijzer zodat de gebruiker zonder informatieverlies
  // van service kan wisselen of zijn keuze kan heroverwegen. Dit is de eerste stap in
  // de flow, dus "Terug" neemt de rol "naar het voorgaande scherm" over (geen aparte
  // annuleer-actie nodig).
  const handleBack = useCallback(() => {
    navigate(WEGWIJZER_PATH);
  }, [navigate]);

  // Productindex bouwen we eenmalig: lookup per geselecteerd product zodat we node-label,
  // path en stream-label op elke draft kunnen zetten zonder de boom opnieuw te traversen.
  const productIndex = useMemo(
    () => buildProductIndex(defaultProcertusCategorizationDoc.clusters),
    [],
  );

  const handleContinue = useCallback(
    (selectedIds: readonly string[]) => {
      if (!serviceId || !service) return;
      const drafts: CertificationRequestDraft[] = selectedIds.flatMap((productId) => {
        const product = productIndex.get(productId);
        if (!product || product.node.kind !== "product") return [];
        return [
          {
            id: `${productId}-${serviceId}`,
            entryId: serviceId as CertificationEntryId,
            label: service.entry.label,
            shortLabel: service.entry.shortLabel,
            productId,
            productTypeStreamLabel: product.node.productTypeStreamLabel,
            productLabel: product.node.label,
            productPath: product.path.slice(0, -1).join(" › "),
          },
        ];
      });
      if (drafts.length === 0) return;
      persistTrajectHandoff({ drafts, serviceId });
      const nextPath = isBundleCertService(serviceId)
        ? BUNDLE_ASSEMBLE_PATH(serviceId)
        : TRIAGE_PATH(serviceId);
      navigate(nextPath, { replace: true });
    },
    [navigate, productIndex, service, serviceId],
  );

  // Escape route wanneer de gebruiker zijn product niet terugvindt in de catalogus.
  // We slaan de bundle-stap over en sturen rechtstreeks naar "Aanvraag controleren"
  // in zijn non-product-bound variant: een placeholder-draft zonder productId én
  // zonder productLabel zorgt dat `isProductBoundDraft` false geeft, waardoor de
  // review-pagina enkel de begeleidende brief toont. Dat is hier het volledige
  // dossier: een expert leest de brief en helpt het juiste product te bepalen.
  const handleProductNotFound = useCallback(() => {
    if (!serviceId || !service) return;
    const placeholder: CertificationRequestDraft = {
      id: `${serviceId}-product-not-found`,
      entryId: serviceId as CertificationEntryId,
      label: service.entry.label,
      shortLabel: service.entry.shortLabel,
    };
    persistTrajectHandoff({ drafts: [placeholder], serviceId });
    navigate(REQUEST_REVIEW_PATH(serviceId), { replace: true });
  }, [navigate, service, serviceId]);

  if (!serviceId || !service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  return (
    <ProductSelectionBasketProvider
      doc={defaultProcertusCategorizationDoc}
      initialSelectedIds={initialSelectedIds}
      onBack={handleBack}
      onContinue={handleContinue}
      onProductNotFound={handleProductNotFound}
    >
      <TrajectPageFrame
        bodyGap="section"
        kicker={service.entry.label}
        title="Selecteer de producten die je wil certificeren"
        description="Doorzoek de hele catalogus of blader stapsgewijs door categorieën."
        aboveActionBar={
          <ProductSelectionBasketMobileSummaryBar className="md:hidden" />
        }
        actionBar={<ProductSelectionBasketActionBar />}
      >
        <ProductSelectionBasketBody />
      </TrajectPageFrame>
    </ProductSelectionBasketProvider>
  );
}
