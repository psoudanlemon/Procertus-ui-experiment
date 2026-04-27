import type {
  CertificationEntryId,
  CertificationRequestDraft,
  CertificationRequestIntentId,
} from "@procertus-ui/domain-certification";

import { chipDisplay } from "../helpers";
import type { AvailableEntry } from "../types";
import {
  OPTIONAL_PRODUCT_INTENTS,
  PRODUCT_CERTIFICATION_ENTRY_IDS,
  PRODUCT_REQUIRED_INTENTS,
  type ProductIndexEntry,
} from "./types";
import { entryLabelForIntent, getCertificationProductAvailability } from "./product-tree";

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
