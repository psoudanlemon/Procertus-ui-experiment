import type { DownloadableItemData } from "@procertus-ui/ui";

import type { CertificationRequestDraft } from "../../certification-request/types";

export type ProductSummaryDocument = DownloadableItemData;

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

type CertExtraDoc = {
  /** Suffix toegevoegd aan de id voor stabiele dedup binnen een product. */
  idSuffix: string;
  title: string;
  /** Body-tekst. Mag `{productLabel}` als token bevatten. */
  description: string;
};

/**
 * Cert-specifieke documenten die *bovenop* de gedeelde PTV + normen komen. Niet
 * elk certificatietraject heeft eigen paperwork: BENOR, SSD en PROCERTUS leunen
 * volledig op de PTV en de geharmoniseerde normen, dus die staan hier niet.
 */
const CERT_EXTRA_DOC: Record<string, CertExtraDoc> = {
  ce: {
    idSuffix: "prestatieverklaring",
    title: "Voorbeeld prestatieverklaring (DoP)",
    description:
      "Modelblad voor de prestatieverklaring volgens EU 305/2011, in te vullen per partij {productLabel}.",
  },
  atg: {
    idSuffix: "atg-dossier",
    title: "ATG-aanvraagdossier",
    description:
      "Aanvraagformulier en richtlijnen voor de technische goedkeuringsprocedure voor {productLabel}.",
  },
  epd: {
    idSuffix: "epd-datablad",
    title: "EPD-datablad — sjabloon",
    description:
      "Sjabloon voor de milieu-productverklaring met de te leveren LCA-indicatoren voor {productLabel}.",
  },
  "innovation-attest": {
    idSuffix: "innovatie-dossier",
    title: "Innovatie-dossier — projectkader",
    description:
      "Beschrijving van het innovatieproject en de prestaties die voor {productLabel} af te testen zijn.",
  },
  partijkeuring: {
    idSuffix: "steekproefprotocol",
    title: "Steekproefprotocol partijkeuring",
    description:
      "Procedure en steekproefkader voor de partijkeuring op de aangeboden lots {productLabel}.",
  },
};

/**
 * Documenten die {@link ProductDocumentationLibrary} per draft genereert en
 * vervolgens binnen het product dedupliceert. Levert maximaal drie items:
 * 1. PTV per product (gedeeld) — productspecifieke technische voorschriften.
 * 2. Toepasselijke normen per product (gedeeld) — geharmoniseerd normenkader.
 * 3. Eventueel één cert-specifiek document voor certificaten met een eigen
 *    procedure (CE-prestatieverklaring, ATG-dossier, EPD-datablad,
 *    innovatie-dossier, steekproefprotocol). BENOR, SSD en PROCERTUS halen
 *    alles uit de gedeelde PTV/normen en krijgen géén extra item, zodat een
 *    product zelden méér dan drie unieke documenten heeft.
 */
export function buildProductDocumentsForDraft(
  draft: CertificationRequestDraft,
): ProductSummaryDocument[] {
  const productKey = productKeyFor(draft);
  if (!productKey) return [];
  const productSlug = slugFor(productKey);
  const productLabel = draft.productLabel?.trim() ?? "dit product";
  const stream = draft.productTypeStreamLabel?.trim();
  const docs: ProductSummaryDocument[] = [
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
  ];
  const extra = CERT_EXTRA_DOC[draft.entryId];
  if (extra) {
    docs.push({
      id: `${extra.idSuffix}-${productSlug}`,
      title: extra.title,
      description: extra.description.replace("{productLabel}", productLabel),
      formatHint: "PDF · mock",
      href: `#procertus-${extra.idSuffix}-${productSlug}`,
    });
  }
  return docs;
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
 * meerdere trajecten houden alle drafts in `drafts` zodat ze als één kaart
 * gerenderd kunnen worden.
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
