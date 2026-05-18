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
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";
import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";
import {
  draftBelongsToTrajectRoot,
  reduceTrajectHandoffState,
} from "./traject-submission-context";

const WEGWIJZER_PATH = "/welcome";
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;
const BUNDLE_ASSEMBLE_PATH = (serviceId: string) =>
  `/welcome/aanvraag/${serviceId}/pakket`;
const REQUEST_REVIEW_PATH = (serviceId: string) =>
  `/welcome/aanvraag/${serviceId}/controleren`;

// Wegwijzer-routes in {@link BUNDLE_CERT_ORDER} krijgen na productselectie de stap
// "Voeg per product certificaten toe" (zelfde als BENOR/CE/SSD/… ). Overige services
// gaan rechtstreeks naar Triage.
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
  const { flowState, setFlowState } = useOnboardingFlowState();

  // Wanneer de gebruiker via "Terug" terugkeert vanuit het bundle-assemble scherm, zijn
  // de drafts in de provider al bijgewerkt; initialSelectedIds volgt live state.
  const initialSelectedIds = useMemo<readonly string[]>(() => {
    if (!serviceId) return [];
    return Array.from(
      new Set(
        flowState.drafts
          .filter(
            (d) =>
              Boolean(d.productId?.trim()) &&
              draftBelongsToTrajectRoot(d, serviceId) &&
              d.entryId === serviceId,
          )
          .map((d) => d.productId!),
      ),
    );
  }, [serviceId, flowState.drafts]);

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
            trajectRootServiceId: serviceId,
          },
        ];
      });
      if (drafts.length === 0) return;
      setFlowState((prev) => reduceTrajectHandoffState(prev, { drafts, serviceId }));
      const nextPath = isBundleCertService(serviceId)
        ? BUNDLE_ASSEMBLE_PATH(serviceId)
        : TRIAGE_PATH(serviceId);
      navigate(nextPath, { replace: true });
    },
    [navigate, productIndex, service, serviceId, setFlowState],
  );

  // Escape route wanneer de gebruiker zijn product niet terugvindt in de catalogus.
  // We slaan de bundle-stap over en gaan naar "Aanvraag controleren": een placeholder-draft
  // zonder productId én zonder productLabel laat daar het overzicht per traject toe (zonder
  // documentatiebibliotheek voor productbundels).
  const handleProductNotFound = useCallback(() => {
    if (!serviceId || !service) return;
    const placeholder: CertificationRequestDraft = {
      id: `${serviceId}-product-not-found`,
      entryId: serviceId as CertificationEntryId,
      label: service.entry.label,
      shortLabel: service.entry.shortLabel,
      trajectRootServiceId: serviceId,
    };
    setFlowState((prev) => reduceTrajectHandoffState(prev, { drafts: [placeholder], serviceId }));
    navigate(REQUEST_REVIEW_PATH(serviceId), { replace: true });
  }, [navigate, service, serviceId, setFlowState]);

  if (!serviceId || !service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  return (
    <ProductSelectionBasketProvider
      doc={defaultProcertusCategorizationDoc}
      productRouteEntryId={
        service.entry.productAvailabilityKey != null ? service.entry.id : undefined
      }
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
