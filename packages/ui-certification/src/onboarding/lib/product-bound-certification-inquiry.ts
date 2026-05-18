import type { CertificationRequestDraft } from "@procertus-ui/domain-certification";

/** Entries where categorization marks product relation required and primary input is product-selection. */
export const PRODUCT_BOUND_CERTIFICATION_INQUIRY_ENTRY_IDS = new Set<string>([
  "ce",
  "benor",
  "ssd",
  "procertus",
  "epd",
]);

export function isProductBoundCertificationInquiryDraft(draft: CertificationRequestDraft): boolean {
  return PRODUCT_BOUND_CERTIFICATION_INQUIRY_ENTRY_IDS.has(draft.entryId);
}

/** Stable key for grouping multiple inquiries (e.g. CE + BENOR) on the same catalogue product. */
export function productBoundCertificationDedupKey(draft: CertificationRequestDraft): string | null {
  if (!isProductBoundCertificationInquiryDraft(draft)) return null;
  const id = draft.productId?.trim();
  if (id && id.length > 0) return id;
  const label = draft.productLabel?.trim();
  return label && label.length > 0 ? label : null;
}

export type ProductBoundLegalEntityOverviewRow = {
  productKey: string;
  productLabel: string;
  drafts: CertificationRequestDraft[];
};

/** One UI/legal-entity assignment row per distinct product among product-bound inquiries in scope. */
export function productBoundLegalEntityOverviewRows(
  draftsInScope: readonly CertificationRequestDraft[],
): ProductBoundLegalEntityOverviewRow[] {
  const byKey = new Map<string, ProductBoundLegalEntityOverviewRow>();
  for (const d of draftsInScope) {
    const key = productBoundCertificationDedupKey(d);
    if (!key) continue;
    const existing = byKey.get(key);
    if (existing) {
      existing.drafts.push(d);
    } else {
      byKey.set(key, {
        productKey: key,
        productLabel: d.productLabel?.trim() || d.label,
        drafts: [d],
      });
    }
  }
  return Array.from(byKey.values());
}
