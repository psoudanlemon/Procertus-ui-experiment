import {
  defaultProcertusCategorizationDoc,
  findNodeById,
  getAvailableBundleProductCertKeys,
  getAvailableEntries,
  getCertValue,
  hasCertifiableChip,
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
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";
import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";
import { draftBelongsToTrajectRoot, reduceTrajectHandoffState } from "./traject-submission-context";

const WEGWIJZER_PATH = "/welcome";
const PRODUCT_SELECTION_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}/start`;
const REQUEST_REVIEW_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}/controleren`;

function isBundleCert(value: string): value is BundleCertKey {
  return (BUNDLE_CERT_ORDER as readonly string[]).includes(value);
}

export function TrajectBundleAssembleFlow() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);
  const { flowState, setFlowState } = useOnboardingFlowState();

  const categorizationDoc = defaultProcertusCategorizationDoc;
  const categorizationEntries = useMemo(
    () => getAvailableEntries(categorizationDoc),
    [categorizationDoc],
  );

  // Alle producten op dit traject met minstens één bundle-cert-concept (configure, extras,
  // terugkeer van review). Label/pad: bij voorkeur draft met entryId === route; anders
  // eender welke bundle-draft. Matrix-hoofdcert per rij is altijd `serviceId` (wegwijzer).
  // Welke extra’s kiesbaar zijn volgt uit `getAvailableBundleProductCertKeys` (masterdata).
  const baseDraftByProduct = useMemo(() => {
    const map = new Map<string, CertificationRequestDraft>();
    if (!serviceId || !isBundleCert(serviceId)) return map;

    const byProduct = new Map<string, CertificationRequestDraft[]>();
    for (const draft of flowState.drafts) {
      if (!draftBelongsToTrajectRoot(draft, serviceId)) continue;
      const productId = draft.productId?.trim();
      if (!productId) continue;
      if (!isBundleCert(draft.entryId as string)) continue;
      const list = byProduct.get(productId) ?? [];
      list.push(draft);
      byProduct.set(productId, list);
    }

    byProduct.forEach((drafts, productId) => {
      const withPrimary = drafts.find(
        (d: CertificationRequestDraft) => (d.entryId as string) === serviceId,
      );
      map.set(productId, withPrimary ?? drafts[0]!);
    });
    return map;
  }, [flowState.drafts, serviceId]);

  const products: readonly BundleProduct[] = useMemo(() => {
    if (!serviceId || !isBundleCert(serviceId)) return [];
    const rows: BundleProduct[] = Array.from(baseDraftByProduct, ([productId, draft]) => {
      const node = findNodeById(categorizationDoc, productId);
      const availableBundleCerts = getAvailableBundleProductCertKeys(node, categorizationEntries);
      const ceRaw =
        node?.kind === "product" && node.certification != null
          ? getCertValue(node.certification, "ce")
          : "";
      const ceAvailabilityRaw = hasCertifiableChip(ceRaw) ? ceRaw : undefined;
      return {
        id: productId,
        label: draft.productLabel ?? productId,
        categoryTrail: draft.productPath ?? draft.productTypeStreamLabel ?? "",
        availableBundleCerts,
        rowPrimaryCert: serviceId,
        ceAvailabilityRaw,
      } satisfies BundleProduct;
    }).filter((p) => p.availableBundleCerts.includes(serviceId));
    return rows.sort((a, b) => a.label.localeCompare(b.label, "nl"));
  }, [serviceId, baseDraftByProduct, categorizationDoc, categorizationEntries]);

  const initialSelections = useMemo<Record<string, readonly BundleCertKey[]>>(() => {
    if (!serviceId || !isBundleCert(serviceId)) return {};
    const allowed = new Map(products.map((p) => [p.id, new Set(p.availableBundleCerts)]));
    const result: Record<string, BundleCertKey[]> = {};
    for (const draft of flowState.drafts) {
      if (!draftBelongsToTrajectRoot(draft, serviceId)) continue;
      const productId = draft.productId?.trim();
      if (!productId) continue;
      const entryId = draft.entryId as string;
      if (!isBundleCert(entryId)) continue;
      if (entryId === serviceId) continue;
      if (!allowed.get(productId)?.has(entryId)) continue;
      const list = result[productId] ?? (result[productId] = []);
      if (!list.includes(entryId)) list.push(entryId);
    }
    return result;
  }, [serviceId, flowState.drafts, products]);

  const handleBack = useCallback(() => {
    if (!serviceId) return;
    navigate(PRODUCT_SELECTION_PATH(serviceId));
  }, [navigate, serviceId]);

  const handleAddMore = useCallback(() => {
    navigate(WEGWIJZER_PATH);
  }, [navigate]);

  const handleCancel = useCallback(() => {
    navigate(WEGWIJZER_PATH);
  }, [navigate]);

  // Regenereer de draftlijst idempotent vanuit (product × huidige selectie): per product
  // exact één primaire-cert draft + één draft per aangevinkte extra cert. Niet flatMappen
  // over `flowState.drafts`, anders zouden eerder toegevoegde extras blijven plakken bij
  // een terug-trip vanuit "Aanvraag controleren".
  const handleContinue = useCallback(
    (selections: Record<string, readonly BundleCertKey[]>) => {
      if (!serviceId || !isBundleCert(serviceId)) return;
      const primaryCert: BundleCertKey = serviceId;

      const tag = (d: CertificationRequestDraft): CertificationRequestDraft => ({
        ...d,
        trajectRootServiceId: d.trajectRootServiceId ?? serviceId,
      });

      setFlowState((prev) => {
        // Alleen productbundel opnieuw uit `selections`; niet-productgebonden drafts blijven via
        // `reduceTrajectHandoffState` staan (anders zouden ze dubbel in de merge zitten).
        const expanded: CertificationRequestDraft[] = [];
        const shownIds = new Set(products.map((p) => p.id));
        for (const [productId, base] of Array.from(baseDraftByProduct.entries())) {
          if (!shownIds.has(productId)) continue;
          const rootTag = base.trajectRootServiceId ?? serviceId;
          const primaryDraft: CertificationRequestDraft =
            base.entryId === primaryCert
              ? tag({ ...base, trajectRootServiceId: rootTag })
              : tag({
                  ...base,
                  id: `${productId}-${primaryCert}`,
                  entryId: primaryCert as CertificationEntryId,
                  label: BUNDLE_CERT_META[primaryCert].title,
                  shortLabel: BUNDLE_CERT_META[primaryCert].shortTitle,
                  trajectRootServiceId: rootTag,
                });
          expanded.push(primaryDraft);
          for (const cert of selections[productId] ?? []) {
            if (cert === primaryCert) continue;
            expanded.push(
              tag({
                ...base,
                id: `${productId}-${cert}`,
                entryId: cert as CertificationEntryId,
                label: BUNDLE_CERT_META[cert].title,
                shortLabel: BUNDLE_CERT_META[cert].shortTitle,
                trajectRootServiceId: rootTag,
              }),
            );
          }
        }
        return reduceTrajectHandoffState(prev, { drafts: expanded, serviceId });
      });
      navigate(REQUEST_REVIEW_PATH(serviceId));
    },
    [navigate, serviceId, baseDraftByProduct, products, setFlowState],
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
      backLabel="Meer producten"
      onCancel={handleCancel}
      onAddMore={handleAddMore}
      addMoreLabel="Nog certificatie toevoegen"
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
