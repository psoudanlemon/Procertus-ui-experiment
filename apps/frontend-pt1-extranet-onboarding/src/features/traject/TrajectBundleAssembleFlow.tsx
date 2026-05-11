import {
  BUNDLE_CERT_META,
  BUNDLE_CERT_ORDER,
  BundleAssembleActionBar,
  BundleAssembleBody,
  BundleAssembleProvider,
  TrajectLayout,
  type BundleCertKey,
  type BundleProduct,
} from "@procertus-ui/ui-certification";
import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { APP_FOOTER } from "../../layouts/footerConfig";
import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";
import { readOnboardingFlowSnapshot } from "./traject-submission-context";

const WEGWIJZER_PATH = "/welcome";
const SIGNIN_PATH = "/welcome/login";
const PRODUCT_SELECTION_PATH = (serviceId: string) =>
  `/welcome/aanvraag/${serviceId}/start`;
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;

function isBundleCert(value: string): value is BundleCertKey {
  return (BUNDLE_CERT_ORDER as readonly string[]).includes(value);
}

export function TrajectBundleAssembleFlow() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);

  const snapshot = useMemo(() => readOnboardingFlowSnapshot(), []);

  // Producten worden afgeleid uit de drafts die TrajectConfigureFlow heeft gepersisteerd.
  // Eén kaart per uniek product, met `productPath` als categoriepad-prefix. Extra
  // certificaties zijn de andere bundle-certs (BENOR/CE/ATG) minus de hoofdcertificatie.
  const products: readonly BundleProduct[] = useMemo(() => {
    if (!serviceId || !isBundleCert(serviceId)) return [];
    const extras = BUNDLE_CERT_ORDER.filter((c) => c !== serviceId);
    const seen = new Set<string>();
    return snapshot.drafts.flatMap((draft) => {
      const productId = draft.productId;
      if (!productId || seen.has(productId)) return [];
      seen.add(productId);
      return [
        {
          id: productId,
          label: draft.productLabel ?? productId,
          categoryTrail: draft.productPath ?? draft.productTypeStreamLabel ?? "",
          extraCerts: extras,
        } satisfies BundleProduct,
      ];
    });
  }, [serviceId, snapshot.drafts]);

  const handleBack = useCallback(() => {
    if (!serviceId) return;
    navigate(PRODUCT_SELECTION_PATH(serviceId));
  }, [navigate, serviceId]);

  const handleCancel = useCallback(() => {
    navigate(WEGWIJZER_PATH);
  }, [navigate]);

  const handleContinue = useCallback(() => {
    if (!serviceId) return;
    // De selectie van extra certificaties wordt voorlopig nog niet teruggeschreven naar de
    // OnboardingFlow-drafts; dat hoort bij een latere data-laag iteratie. De UI-handoff
    // naar Triage blijft consistent met TrajectConfigureFlow.
    navigate(TRIAGE_PATH(serviceId), { replace: true });
  }, [navigate, serviceId]);

  if (!serviceId || !service || !isBundleCert(serviceId)) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }
  if (products.length === 0) {
    return <Navigate to={PRODUCT_SELECTION_PATH(serviceId)} replace />;
  }

  const primaryCert: BundleCertKey = serviceId;
  const primaryLabel = BUNDLE_CERT_META[primaryCert].title;
  const productCount = products.length;
  const productWord = productCount === 1 ? "product" : "producten";

  return (
    <BundleAssembleProvider
      products={products}
      primaryCert={primaryCert}
      onBack={handleBack}
      onCancel={handleCancel}
      onContinue={handleContinue}
    >
      <TrajectLayout
        onSignInClick={() => navigate(SIGNIN_PATH)}
        footer={APP_FOOTER}
        bodyGap="section"
        kicker={
          <span className="inline-flex max-w-full items-center gap-micro self-start rounded-full border border-primary/30 bg-primary/10 px-component py-micro text-xs font-medium text-primary">
            Hoofdcertificatie voor dit pakket:
            <strong className="font-semibold">{primaryLabel}</strong>
          </span>
        }
        title="Stel je aanvraagpakket samen"
        description={`U heeft ${productCount} ${productWord} geselecteerd. Breid uw aanvraag hieronder uit per product om uw dossier in één keer volledig te maken.`}
        actionBar={<BundleAssembleActionBar />}
      >
        <BundleAssembleBody />
      </TrajectLayout>
    </BundleAssembleProvider>
  );
}
