import {
  BUNDLE_CERT_META,
  BUNDLE_CERT_ORDER,
  BundleAssembleActionBar,
  BundleAssembleBody,
  BundleAssembleProvider,
  TrajectLayout,
  type BundleCertKey,
  type BundleProduct,
  type CertificationEntryId,
  type CertificationRequestDraft,
} from "@procertus-ui/ui-certification";
import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { APP_FOOTER } from "../../layouts/footerConfig";
import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";
import {
  persistTrajectHandoff,
  readOnboardingFlowSnapshot,
} from "./traject-submission-context";

const WEGWIJZER_PATH = "/welcome";
const SIGNIN_PATH = "/welcome/login";
const PRODUCT_SELECTION_PATH = (serviceId: string) =>
  `/welcome/aanvraag/${serviceId}/start`;
const REQUEST_REVIEW_PATH = (serviceId: string) =>
  `/welcome/aanvraag/${serviceId}/controleren`;

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
  // certificaties zijn de andere bundle-certs (BENOR/CE/SSD/PROCERTUS) minus de hoofdcertificatie.
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

  // Expandeer per product de hoofd-cert draft + één extra draft per aangevinkt extra certificaat,
  // zodat het validatiescherm één kaart per (product, certificaat)-combinatie kan tonen.
  const handleContinue = useCallback(
    (selections: Record<string, readonly BundleCertKey[]>) => {
      if (!serviceId || !isBundleCert(serviceId)) return;
      const primaryCert: BundleCertKey = serviceId;
      const expanded: CertificationRequestDraft[] = snapshot.drafts.flatMap((draft) => {
        const productId = draft.productId;
        if (!productId) return [draft];
        const extras = selections[productId] ?? [];
        const extraDrafts = extras
          .filter((cert) => cert !== primaryCert)
          .map<CertificationRequestDraft>((cert) => ({
            ...draft,
            id: `${productId}-${cert}`,
            entryId: cert as CertificationEntryId,
            label: BUNDLE_CERT_META[cert].title,
            shortLabel: BUNDLE_CERT_META[cert].shortTitle,
          }));
        return [draft, ...extraDrafts];
      });
      persistTrajectHandoff({ drafts: expanded, serviceId });
      navigate(REQUEST_REVIEW_PATH(serviceId));
    },
    [navigate, serviceId, snapshot.drafts],
  );

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
