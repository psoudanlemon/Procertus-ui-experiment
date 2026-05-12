import {
  BUNDLE_CERT_META,
  BUNDLE_CERT_ORDER,
  BundleAssembleActionBar,
  BundleAssembleBody,
  BundleAssembleProvider,
  TrajectPageFrame,
  type BundleCertKey,
  type BundleProduct,
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
  // De eerste draft per product (de primaire-cert draft uit de configure-stap) is gezaghebbend
  // voor de cosmetische product-metadata; volgende extras-drafts dragen dezelfde metadata.
  const baseDraftByProduct = useMemo(() => {
    const map = new Map<string, CertificationRequestDraft>();
    for (const draft of snapshot.drafts) {
      const productId = draft.productId;
      if (!productId || map.has(productId)) continue;
      map.set(productId, draft);
    }
    return map;
  }, [snapshot.drafts]);

  const products: readonly BundleProduct[] = useMemo(() => {
    if (!serviceId || !isBundleCert(serviceId)) return [];
    const extras = BUNDLE_CERT_ORDER.filter((c) => c !== serviceId);
    return Array.from(baseDraftByProduct, ([productId, draft]) => ({
      id: productId,
      label: draft.productLabel ?? productId,
      categoryTrail: draft.productPath ?? draft.productTypeStreamLabel ?? "",
      extraCerts: extras,
    } satisfies BundleProduct));
  }, [serviceId, baseDraftByProduct]);

  // Bij terugkomst vanuit "Aanvraag controleren" lezen we de eerder gekozen extra
  // certificaties terug uit de gepersisteerde drafts, zodat de checkboxen per product
  // ge-prevuld zijn en de gebruiker zijn werk niet opnieuw moet doen.
  const initialSelections = useMemo<Record<string, readonly BundleCertKey[]>>(() => {
    if (!serviceId || !isBundleCert(serviceId)) return {};
    const primary: BundleCertKey = serviceId;
    const result: Record<string, BundleCertKey[]> = {};
    for (const draft of snapshot.drafts) {
      const productId = draft.productId;
      if (!productId) continue;
      const entryId = draft.entryId as string;
      if (entryId === primary) continue;
      if (!isBundleCert(entryId)) continue;
      const list = result[productId] ?? (result[productId] = []);
      if (!list.includes(entryId)) list.push(entryId);
    }
    return result;
  }, [serviceId, snapshot.drafts]);

  const handleBack = useCallback(() => {
    if (!serviceId) return;
    navigate(PRODUCT_SELECTION_PATH(serviceId));
  }, [navigate, serviceId]);

  const handleCancel = useCallback(() => {
    navigate(WEGWIJZER_PATH);
  }, [navigate]);

  // Regenereer de draftlijst idempotent vanuit (product × huidige selectie): per product
  // exact één primaire-cert draft + één draft per aangevinkte extra cert. Niet flatMappen
  // over `snapshot.drafts`, anders zouden eerder toegevoegde extras blijven plakken bij
  // een terug-trip vanuit "Aanvraag controleren".
  const handleContinue = useCallback(
    (selections: Record<string, readonly BundleCertKey[]>) => {
      if (!serviceId || !isBundleCert(serviceId)) return;
      const primaryCert: BundleCertKey = serviceId;

      const expanded: CertificationRequestDraft[] = [];
      for (const draft of snapshot.drafts) {
        if (!draft.productId) expanded.push(draft);
      }
      for (const [productId, base] of Array.from(baseDraftByProduct.entries())) {
        const primaryDraft: CertificationRequestDraft =
          base.entryId === primaryCert
            ? base
            : {
                ...base,
                id: `${productId}-${primaryCert}`,
                entryId: primaryCert as CertificationEntryId,
                label: BUNDLE_CERT_META[primaryCert].title,
                shortLabel: BUNDLE_CERT_META[primaryCert].shortTitle,
              };
        expanded.push(primaryDraft);
        for (const cert of selections[productId] ?? []) {
          if (cert === primaryCert) continue;
          expanded.push({
            ...base,
            id: `${productId}-${cert}`,
            entryId: cert as CertificationEntryId,
            label: BUNDLE_CERT_META[cert].title,
            shortLabel: BUNDLE_CERT_META[cert].shortTitle,
          });
        }
      }

      persistTrajectHandoff({ drafts: expanded, serviceId });
      navigate(REQUEST_REVIEW_PATH(serviceId));
    },
    [navigate, serviceId, snapshot.drafts, baseDraftByProduct],
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
      initialSelections={initialSelections}
      onBack={handleBack}
      onCancel={handleCancel}
      onContinue={handleContinue}
    >
      <TrajectPageFrame
        bodyGap="section"
        kicker={service.entry.label}
        title="Voeg per product certificaten toe"
        description="Bekijk elk van uw geselecteerde producten en voeg waar nodig nog extra certificaten toe, zodat je meteen alle benodigdheden voor elk product kan indienen"
        actionBar={<BundleAssembleActionBar />}
      >
        <BundleAssembleBody />
      </TrajectPageFrame>
    </BundleAssembleProvider>
  );
}
