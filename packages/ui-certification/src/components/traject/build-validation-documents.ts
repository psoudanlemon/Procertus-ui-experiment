import type { DownloadableItemData } from "@procertus-ui/ui";

import type { CertificationRequestDraft } from "../../certification-request/types";
import type { RequestValidationDocument } from "./RequestValidationCard";

function slugFor(raw: string): string {
  const s = raw
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return s.length > 0 ? s.slice(0, 48) : "item";
}

/**
 * Per-draft PTV / norm references shown inside each {@link RequestValidationCard}.
 * Currently emits two mock entries per product-scoped inquiry so the validation
 * surface looks complete in the prototype.
 */
export function buildProductDocumentsForDraft(
  draft: CertificationRequestDraft,
): RequestValidationDocument[] {
  const productKey = draft.productId?.trim() || draft.productLabel?.trim();
  if (!productKey) return [];
  const slug = slugFor(`${draft.entryId}-${productKey}`);
  const productLabel = draft.productLabel?.trim() ?? "dit product";
  const stream = draft.productTypeStreamLabel?.trim();
  return [
    {
      id: `ptv-${slug}`,
      title: `PTV — ${productLabel}`,
      description: stream
        ? `Producttechnische voorschriften en normsegmenten voor ${stream} (${productLabel}).`
        : `Producttechnische voorschriften en normsegmenten voor ${productLabel}.`,
      formatHint: "PDF · mock",
      href: `#procertus-ptv-${slug}`,
    },
    {
      id: `norm-${slug}`,
      title: `Toepasselijke normen — ${productLabel}`,
      description:
        "Lijst van geharmoniseerde normen waarop deze certificatie steunt voor dit product.",
      formatHint: "PDF · mock",
      href: `#procertus-norm-${slug}`,
    },
  ];
}

/**
 * Generic process documents that apply to the entire request package, regardless
 * of the individual product / certificate combinations.
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
