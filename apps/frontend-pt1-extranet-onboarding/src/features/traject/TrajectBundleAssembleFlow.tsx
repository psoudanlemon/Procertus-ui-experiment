import {
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
        kicker={service.entry.label}
        title="Voeg per product certificaten toe"
        description="Bekijk elk van uw geselecteerde producten en voeg waar nodig nog extra certificaten toe, zodat je meteen alle benodigdheden voor elk product kan indienen"
        actionBar={<BundleAssembleActionBar />}
      >
        <BundleAssembleBody />
      </TrajectLayout>
    </BundleAssembleProvider>
  );
}
