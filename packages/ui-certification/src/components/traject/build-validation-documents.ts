import type { DownloadableItemData } from "@procertus-ui/ui";

import type { CertificationRequestDraft } from "../../certification-request/types";
import type { ProductSummaryDocument } from "./ProductSummaryCard";

function slugFor(raw: string): string {
  const s = raw
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return s.length > 0 ? s.slice(0, 48) : "item";
}

function productKeyFor(draft: CertificationRequestDraft): string | undefined {
  const key = draft.productId?.trim() || draft.productLabel?.trim();
  return key && key.length > 0 ? key : undefined;
}

/**
 * Documenten die {@link ProductSummaryCard} per traject (draft) toont.
 * Levert per draft:
 * 1. Twee productgebonden refs (PTV + normen) met **stabiele, product-gebaseerde
 *    ids** zodat ze identiek zijn voor elk certificatietraject van hetzelfde
 *    product — de kaart kan deze dan in de "Gezamenlijke documenten"-sectie
 *    samenbrengen.
 * 2. Eén certificatiespecifiek reglement waarvan de id wel `entryId` bevat,
 *    zodat dit per traject onder de bijbehorende badge blijft staan.
 */
export function buildProductDocumentsForDraft(
  draft: CertificationRequestDraft,
): ProductSummaryDocument[] {
  const productKey = productKeyFor(draft);
  if (!productKey) return [];
  const productSlug = slugFor(productKey);
  const productLabel = draft.productLabel?.trim() ?? "dit product";
  const stream = draft.productTypeStreamLabel?.trim();
  const entrySlug = slugFor(draft.entryId);
  const entryShort = draft.shortLabel?.trim() ?? draft.entryId.toUpperCase();
  return [
    {
      id: `ptv-${productSlug}`,
      title: `PTV — ${productLabel}`,
      description: stream
        ? `Producttechnische voorschriften en normsegmenten voor ${stream} (${productLabel}).`
        : `Producttechnische voorschriften en normsegmenten voor ${productLabel}.`,
      formatHint: "PDF · mock",
      href: `#procertus-ptv-${productSlug}`,
    },
    {
      id: `norm-${productSlug}`,
      title: `Toepasselijke normen — ${productLabel}`,
      description:
        "Lijst van geharmoniseerde normen waarop de aangevraagde certificaten voor dit product steunen.",
      formatHint: "PDF · mock",
      href: `#procertus-norm-${productSlug}`,
    },
    {
      id: `reglement-${entrySlug}-${productSlug}`,
      title: `Certificatiereglement — ${entryShort}`,
      description: `Specifieke reglementsbepalingen voor ${entryShort} op ${productLabel}.`,
      formatHint: "PDF · mock",
      href: `#procertus-reglement-${entrySlug}-${productSlug}`,
    },
  ];
}

/**
 * Algemene procesdocumenten die op het hele aanvraagpakket van toepassing zijn,
 * onafhankelijk van de afzonderlijke product- en certificaatcombinaties.
 */
export function buildGeneralProcessDocuments(
  inquiries: readonly CertificationRequestDraft[],
): DownloadableItemData[] {
  const inquiryLabels = Array.from(new Set(inquiries.map((d) => d.shortLabel ?? d.label)));
  return [
    {
      id: "algemeen-reglement",
      title: "Algemeen reglement",
      description:
        "Het overkoepelende reglement van PROCERTUS waarmee je akkoord gaat door de aanvraag in te dienen.",
      formatHint: "PDF · mock",
      href: "#procertus-doc-reglement",
    },
    {
      id: "tarievenlijst",
      title: "Tarievenlijst",
      description:
        "Actuele tarieven voor audits, prestaties en certificatie-handelingen die op dit pakket van toepassing zijn.",
      formatHint: "PDF · mock",
      href: "#procertus-doc-tarieven",
    },
    {
      id: "ruleset-matrix",
      title: "Ruleset matrix — geselecteerde certificeringen",
      description: `Normenkader en regelpaden voor: ${inquiryLabels.join(" · ")}.`,
      formatHint: "PDF · mock",
      href: "#procertus-doc-ruleset-matrix",
    },
    {
      id: "indien-checklist",
      title: "Indien-checklist aanvraagpakket",
      description:
        "Controlelijst afgestemd op de samenstelling van dit pakket vóór indiening.",
      formatHint: "PDF · mock",
      href: "#procertus-doc-submission-checklist",
    },
  ];
}

/**
 * Unieke product die voorkomt in het aanvraagpakket, samen met alle drafts
 * (certificatietrajecten) die op dat product van toepassing zijn.
 */
export type ProductSummaryGroup = {
  productId: string;
  productLabel: string;
  productPath?: string;
  productTypeStreamLabel?: string;
  drafts: CertificationRequestDraft[];
};

/**
 * Groepeert een platte lijst drafts per uniek product, met behoud van de
 * volgorde waarin elk product voor het eerst voorkomt. Producten met
 * meerdere trajecten houden alle drafts in `drafts` zodat
 * {@link ProductSummaryCard} ze als één kaart kan renderen.
 */
export function groupDraftsByProduct(
  drafts: readonly CertificationRequestDraft[],
): ProductSummaryGroup[] {
  const map = new Map<string, ProductSummaryGroup>();
  for (const draft of drafts) {
    const productKey =
      draft.productId?.trim() || draft.productLabel?.trim() || draft.id;
    let group = map.get(productKey);
    if (!group) {
      group = {
        productId: productKey,
        productLabel: draft.productLabel?.trim() ?? productKey,
        productPath: draft.productPath,
        productTypeStreamLabel: draft.productTypeStreamLabel,
        drafts: [],
      };
      map.set(productKey, group);
    } else if (!group.productTypeStreamLabel && draft.productTypeStreamLabel) {
      group.productTypeStreamLabel = draft.productTypeStreamLabel;
    }
    group.drafts.push(draft);
  }
  return Array.from(map.values());
}
