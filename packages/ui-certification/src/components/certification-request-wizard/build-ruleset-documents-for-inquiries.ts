import type { DownloadableDocumentListItemData } from "@procertus-ui/ui-lib";

import type { CertificationRequestDraft } from "../../certification-request/types";

function slugForDocumentHref(raw: string): string {
  const s = raw
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return s.length > 0 ? s.slice(0, 48) : "item";
}

function isProductScopedInquiry(draft: CertificationRequestDraft): boolean {
  return Boolean(
    (draft.productId && draft.productId.trim().length > 0) ||
      (draft.productLabel && draft.productLabel.trim().length > 0),
  );
}

function productDedupKey(draft: CertificationRequestDraft): string | null {
  if (!isProductScopedInquiry(draft)) return null;
  const id = draft.productId?.trim();
  if (id && id.length > 0) return id;
  return draft.productLabel?.trim() ?? null;
}

/**
 * Mock downloadable ruleset / PTV / programme documents for review and request detail.
 * PTV rows are emitted once per distinct product among product-scoped inquiries;
 * ATG and EPD programme overviews appear only when those intents are in the package.
 */
export function buildRulesetDocumentsForInquiries(
  inquiries: readonly CertificationRequestDraft[],
): DownloadableDocumentListItemData[] {
  if (inquiries.length === 0) return [];

  const docs: DownloadableDocumentListItemData[] = [];

  const seenProductKeys = new Set<string>();
  for (const d of inquiries) {
    const key = productDedupKey(d);
    if (!key || seenProductKeys.has(key)) continue;
    seenProductKeys.add(key);
    const label = d.productLabel?.trim() || "Product";
    const stream = d.productTypeStreamLabel?.trim();
    docs.push({
      id: `ptv-${slugForDocumentHref(key)}`,
      title: `Producttechnische fiche (PTV) — ${label}`,
      description: stream
        ? `Technische specificaties en toepasselijke normsegmenten voor ${stream} (${label}) voor de productgebonden aanvragen in dit pakket (prototype).`
        : `Technische specificaties en profieldelen voor ${label} voor de productgebonden aanvragen in dit pakket (prototype).`,
      formatHint: "PDF · mock",
      href: `#procertus-ptv-${slugForDocumentHref(key)}`,
    });
  }

  if (inquiries.some((d) => d.entryId === "atg")) {
    docs.push({
      id: "atg-algemeen",
      title: "ATG — algemene informatie en werkprocedure",
      description:
        "Programma-overzicht voor technische goedkeuring (ATG/BUTG) omdat dit pakket minstens één ATG-aanvraag bevat (prototype).",
      formatHint: "PDF · mock",
      href: "#procertus-atg-algemeen",
    });
  }

  if (inquiries.some((d) => d.entryId === "epd")) {
    docs.push({
      id: "epd-algemeen",
      title: "EPD — milieuprofiel en databanken",
      description:
        "Algemene EPD-werkwijze en referenties naar databanken omdat dit pakket minstens één EPD-aanvraag bevat (prototype).",
      formatHint: "PDF · mock",
      href: "#procertus-epd-algemeen",
    });
  }

  const inquiryLabels = Array.from(new Set(inquiries.map((d) => d.shortLabel ?? d.label)));
  docs.push({
    id: "ruleset-matrix",
    title: "Ruleset matrix — geselecteerde certificeringen en attesten",
    description: `Normenkader en regelpaden voor: ${inquiryLabels.join(" · ")}.`,
    formatHint: "PDF · mock",
    href: "#procertus-doc-ruleset-matrix",
  });

  docs.push({
    id: "submission-checklist",
    title: "Indien-checklist aanvraagpakket",
    description:
      "Controlelijst afgestemd op de samenstelling van dit pakket vóór indiening (prototype).",
    formatHint: "PDF · mock",
    href: "#procertus-doc-submission-checklist",
  });

  return docs;
}
