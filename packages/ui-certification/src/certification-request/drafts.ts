import type {
  CertificationEntryId,
  CertificationRequestDraft,
  CertificationRequestIntentId,
} from "@procertus-ui/domain-certification";

import { chipDisplay } from "../helpers";
import type { AvailableEntry } from "../types";
import { entryLabelForIntent, getCertificationProductAvailability } from "./product-tree";
import {
  OPTIONAL_PRODUCT_INTENTS,
  PRODUCT_CERTIFICATION_ENTRY_IDS,
  PRODUCT_REQUIRED_INTENTS,
  type ProductIndexEntry,
} from "./types";

/** Row still on intent id (placeholder from {@link makeDraftFromIntent} / first wizard step). */
const CERTIFICATION_INTENT_ENTRY_IDS = new Set<CertificationRequestIntentId>([
  "product-certification",
  "atg",
  "innovation-attest",
  "procertus",
  "epd",
  "partijkeuring",
]);

/**
 * True when at least one inquiry still needs the details step (product tree and/or freeform context)
 * before drafts/review. Mirrors when {@link useCertificationRequest} would have `canContinueDetails === false`
 * for the persisted draft rows alone (no live UI selection).
 */
export function certificationInquiriesNeedDetailsStep(
  drafts: readonly CertificationRequestDraft[],
): boolean {
  if (drafts.length === 0) return false;
  return drafts.some((draft) => {
    const entryId = draft.entryId;
    const looksLikeIntentOnlyRow = CERTIFICATION_INTENT_ENTRY_IDS.has(
      entryId as CertificationRequestIntentId,
    );
    const hasProduct = draft.productId != null;
    const hasSubstantialContext = (draft.context?.trim().length ?? 0) >= 12;
    const hasCertificationEntry = PRODUCT_CERTIFICATION_ENTRY_IDS.has(entryId as CertificationEntryId);

    if (hasCertificationEntry && hasProduct) return false;
    if (looksLikeIntentOnlyRow && hasSubstantialContext) return false;
    if (looksLikeIntentOnlyRow && hasProduct) return false;
    if (looksLikeIntentOnlyRow && !hasProduct && !hasSubstantialContext) return true;
    return false;
  });
}

export function getIntentDraftLabels({
  intent,
  availableEntries,
}: {
  intent: CertificationRequestIntentId;
  availableEntries: readonly AvailableEntry[];
}) {
  const entry = availableEntries.find((candidate) => candidate.id === intent);
  const label = entry?.label ?? intent;
  const shortLabel = entry?.shortLabel ?? label;
  return { label, shortLabel };
}

export function createDraftsForProduct({
  selectedEntryIds,
  availableEntries,
  product,
}: {
  selectedEntryIds: readonly string[];
  availableEntries: readonly AvailableEntry[];
  product: ProductIndexEntry;
}): CertificationRequestDraft[] {
  return selectedEntryIds.flatMap((entryId) => {
    const entry = availableEntries.find((candidate) => candidate.id === entryId);
    if (!entry) return [];
    const availability = getCertificationProductAvailability(product.node, entry);
    if (!availability.available) return [];
    return [
      {
        id: `${product.node.id}-${entry.id}`,
        entryId: entry.id as CertificationEntryId,
        label: entry.label,
        shortLabel: entry.shortLabel,
        productId: product.node.id,
        productTypeStreamLabel: product.node.productTypeStreamLabel,
        productLabel: product.node.label,
        productPath: product.path.slice(0, -1).join(" › "),
        value: availability.value ? chipDisplay(entry.shortLabel, availability.value) : undefined,
      },
    ];
  });
}

export function createContextDraft({
  intent,
  availableEntries,
  requestText,
  selectedProduct,
}: {
  intent: CertificationRequestIntentId;
  availableEntries: readonly AvailableEntry[];
  requestText: string;
  selectedProduct?: ProductIndexEntry;
}): CertificationRequestDraft[] {
  const entry = availableEntries.find((candidate) => candidate.id === intent);
  const label = entry?.label ?? entryLabelForIntent(intent, availableEntries) ?? intent;
  const shortLabel = entry?.shortLabel ?? label;
  return [
    {
      id: selectedProduct ? `${selectedProduct.node.id}-${intent}` : `context-${intent}`,
      entryId: intent,
      label,
      shortLabel,
      productId: selectedProduct?.node.id,
      productTypeStreamLabel: selectedProduct?.node.productTypeStreamLabel,
      productLabel: selectedProduct?.node.label,
      productPath: selectedProduct?.path.slice(0, -1).join(" › "),
      context: requestText,
    },
  ];
}

export function intentForDraft(
  draft: CertificationRequestDraft | undefined,
): CertificationRequestIntentId | undefined {
  if (!draft) return undefined;
  if (PRODUCT_CERTIFICATION_ENTRY_IDS.has(draft.entryId)) {
    return "product-certification";
  }
  if (PRODUCT_REQUIRED_INTENTS.has(draft.entryId as CertificationRequestIntentId)) {
    return draft.entryId as CertificationRequestIntentId;
  }
  if (OPTIONAL_PRODUCT_INTENTS.has(draft.entryId as CertificationRequestIntentId)) {
    return draft.entryId as CertificationRequestIntentId;
  }
  if (draft.entryId === "innovation-attest") {
    return "innovation-attest";
  }
  return undefined;
}
