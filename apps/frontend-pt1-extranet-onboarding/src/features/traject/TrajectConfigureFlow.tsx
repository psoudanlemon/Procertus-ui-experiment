import {
  BUNDLE_CERT_ORDER,
  ProductSelectionBasketActionBar,
  ProductSelectionBasketBody,
  ProductSelectionBasketMobileSummaryBar,
  ProductSelectionBasketProvider,
  TrajectLayout,
  buildProductIndex,
  defaultProcertusCategorizationDoc,
  type BundleCertKey,
  type CertificationEntryId,
  type CertificationRequestDraft,
} from "@procertus-ui/ui-certification";
import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { APP_FOOTER } from "../../layouts/footerConfig";
import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";
import { persistTrajectHandoff } from "./traject-submission-context";

const WEGWIJZER_PATH = "/welcome";
const SIGNIN_PATH = "/welcome/login";
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;
const BUNDLE_ASSEMBLE_PATH = (serviceId: string) =>
  `/welcome/aanvraag/${serviceId}/pakket`;

// Alleen wegwijzer-services die als hoofdcertificatie binnen het bundle-pakket vallen
// (BENOR/CE/ATG) krijgen de extra "Voeg trajecten toe"-stap. Andere services (SSD,
// Partijkeuring, …) hebben geen bundle-extras en gaan rechtstreeks naar Triage.
function isBundleCertService(value: string): value is BundleCertKey {
  return (BUNDLE_CERT_ORDER as readonly string[]).includes(value);
}

export function TrajectConfigureFlow() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);

  // "Terug" houdt de reeds gemaakte productselectie en eventuele klantgegevens vast: we
  // navigeren enkel terug naar de wegwijzer zodat de gebruiker zonder informatieverlies
  // van service kan wisselen of zijn keuze kan heroverwegen.
  const handleCancel = useCallback(() => {
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

  if (!serviceId || !service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  return (
    <ProductSelectionBasketProvider
      doc={defaultProcertusCategorizationDoc}
      onCancel={handleCancel}
      onContinue={handleContinue}
    >
      <TrajectLayout
        onSignInClick={() => navigate(SIGNIN_PATH)}
        footer={APP_FOOTER}
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
      </TrajectLayout>
    </ProductSelectionBasketProvider>
  );
}
