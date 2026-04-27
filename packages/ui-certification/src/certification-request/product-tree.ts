import {
  CERTIFICATION_LABEL_META,
  CERTIFICATION_LABEL_ORDER,
  PRODUCT_ATTESTATION_META,
  PRODUCT_ATTESTATION_ORDER,
} from "../constants";
import {
  chipDisplay,
  getCertValue,
  getProductAttestationValue,
  hasCertifiableChip,
  statusTextWhenNoChip,
} from "../helpers";
import type {
  AvailableEntry,
  AvailableEntryKey,
  CertificationLabelKey,
  ProductAttestationKey,
  TreeNode,
} from "../types";
import {
  PRODUCT_CERTIFICATION_ENTRY_IDS,
  type CertificationProductTreeNode,
  type CertificationRequestIntentId,
  type ProductAvailability,
  type ProductIndexEntry,
} from "./types";

function isCertificationKey(key: AvailableEntryKey): key is CertificationLabelKey {
  return CERTIFICATION_LABEL_ORDER.includes(key as CertificationLabelKey);
}

function isAttestationKey(key: AvailableEntryKey): key is ProductAttestationKey {
  return PRODUCT_ATTESTATION_ORDER.includes(key as ProductAttestationKey);
}

export function normalizeCertificationQuery(value: string) {
  return value.trim().toLocaleLowerCase("nl-BE");
}

function pathMatches(path: readonly string[], query: string) {
  if (!query) return true;
  return path.some((part) => part.toLocaleLowerCase("nl-BE").includes(query));
}

export function entryLabelForIntent(
  intent: CertificationRequestIntentId | undefined,
  availableEntries: readonly AvailableEntry[],
) {
  if (!intent) return undefined;
  if (intent === "product-certification") return "Productcertificatie";
  return availableEntries.find((entry) => entry.id === intent)?.label ?? intent;
}

export function buildProductIndex(
  nodes: readonly TreeNode[],
  prefix: string[] = [],
): Map<string, ProductIndexEntry> {
  const index = new Map<string, ProductIndexEntry>();
  for (const node of nodes) {
    const path = [...prefix, node.label];
    if (node.kind === "product") {
      index.set(node.id, { node, path });
    } else {
      buildProductIndex(node.children ?? [], path).forEach((entry, id) => {
        index.set(id, entry);
      });
    }
  }
  return index;
}

export function getCertificationProductAvailability(
  node: TreeNode,
  entry: AvailableEntry,
): ProductAvailability {
  const key = entry.productAvailabilityKey;
  if (node.kind !== "product" || !key) {
    return { available: false, reason: "Deze aanvraagroute is niet productgebonden." };
  }
  if (isCertificationKey(key) && node.certification) {
    const value = getCertValue(node.certification, key);
    return hasCertifiableChip(value)
      ? { available: true, value }
      : { available: false, value, reason: statusTextWhenNoChip(value) };
  }
  if (isAttestationKey(key) && node.attestations) {
    const value = getProductAttestationValue(node.attestations, key);
    return hasCertifiableChip(value)
      ? { available: true, value }
      : { available: false, value, reason: statusTextWhenNoChip(value) };
  }
  return { available: false, reason: "Niet beschikbaar voor dit producttype." };
}

export function getAvailableProductEntries(
  node: TreeNode | undefined,
  entries: readonly AvailableEntry[],
) {
  if (!node) return [];
  return entries
    .filter((entry) => entry.productAvailabilityKey != null)
    .map((entry) => ({ entry, availability: getCertificationProductAvailability(node, entry) }))
    .filter(({ availability }) => availability.available);
}

export function primaryIntentAvailability(
  node: TreeNode,
  intent: CertificationRequestIntentId | undefined,
  entries: readonly AvailableEntry[],
) {
  if (!intent) return { available: true, label: "Selecteerbaar" };
  if (intent === "product-certification") {
    const hasProductCertification = entries
      .filter((entry) => PRODUCT_CERTIFICATION_ENTRY_IDS.has(entry.id))
      .some((entry) => getCertificationProductAvailability(node, entry).available);
    return hasProductCertification
      ? { available: true, label: "Productcertificatie mogelijk" }
      : {
          available: false,
          label: "Niet beschikbaar",
          reason: "Geen CE-, BENOR- of SSD-traject beschikbaar voor dit producttype.",
        };
  }
  const selectedEntry = entries.find((entry) => entry.id === intent);
  if (!selectedEntry?.productAvailabilityKey) {
    return { available: true, label: "Contextaanvraag" };
  }
  const availability = getCertificationProductAvailability(node, selectedEntry);
  return availability.available
    ? { available: true, label: `${selectedEntry.shortLabel} beschikbaar` }
    : {
        available: false,
        label: "Niet beschikbaar",
        reason: `${selectedEntry.shortLabel}: ${availability.reason ?? "niet aangeboden voor dit producttype."}`,
      };
}

export function toCertificationProductTreeNodes({
  nodes,
  entries,
  intent,
  selectedProductId,
  query,
  hideUnavailableProducts,
  pathPrefix = [],
}: {
  nodes: readonly TreeNode[];
  entries: readonly AvailableEntry[];
  intent: CertificationRequestIntentId | undefined;
  selectedProductId: string | undefined;
  query: string;
  hideUnavailableProducts: boolean;
  pathPrefix?: string[];
}): CertificationProductTreeNode[] {
  return nodes.flatMap((node): CertificationProductTreeNode[] => {
    const path = [...pathPrefix, node.label];
    if (node.kind === "product") {
      if (!pathMatches(path, query)) return [];
      const availability = primaryIntentAvailability(node, intent, entries);
      if (hideUnavailableProducts && !availability.available) return [];
      return [
        {
          kind: "product",
          id: node.id,
          label: node.label,
          productTypeId: node.productTypeStreamLabel,
          description: path.slice(0, -1).join(" › "),
          selectable: true,
          selected: selectedProductId === node.id,
        },
      ];
    }

    const children = toCertificationProductTreeNodes({
      nodes: node.children ?? [],
      entries,
      intent,
      selectedProductId,
      query,
      hideUnavailableProducts,
      pathPrefix: path,
    });
    if (children.length === 0) return [];
    return [{ kind: "group", id: node.id, label: node.label, children }];
  });
}

export function getCertificationOptionText(entry: AvailableEntry, value: string | undefined) {
  const meta = isCertificationKey(entry.id)
    ? CERTIFICATION_LABEL_META[entry.id]
    : isAttestationKey(entry.id)
      ? PRODUCT_ATTESTATION_META[entry.id]
      : undefined;
  const suffix = value ? ` Beschikbaarheid: ${chipDisplay(entry.shortLabel, value)}.` : "";
  return `${meta?.description ?? entry.description}${suffix}`;
}
