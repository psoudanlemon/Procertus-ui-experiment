import {
  DownloadableItemGrid,
  cn,
  type DownloadableItemData,
} from "@procertus-ui/ui";

import type { CertificationRequestDraft } from "../../certification-request/types";
import type { ProductSummaryGroup } from "./build-validation-documents";

const CERT_RELEVANCE_LABEL: Record<string, string> = {
  benor: "BENOR",
  ce: "CE-markering",
  ssd: "SSD",
  procertus: "PROCERTUS-attest",
  atg: "ATG technische goedkeuring",
  "innovation-attest": "Innovation attest",
  epd: "EPD-milieuverklaring",
  partijkeuring: "Partijkeuring",
  "product-certification": "Productcertificatie",
};

function joinLabels(labels: string[]): string {
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} en ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} en ${labels[labels.length - 1]}`;
}

function relevanceDescription(
  entryIds: ReadonlySet<string>,
  totalTrajects: number,
): string {
  if (entryIds.size === totalTrajects) {
    return totalTrajects === 1
      ? "Relevant voor het aangevraagde traject."
      : "Relevant voor alle aangevraagde trajecten.";
  }
  const labels = Array.from(entryIds).map(
    (id) => CERT_RELEVANCE_LABEL[id] ?? id.toUpperCase(),
  );
  return `Relevant voor: ${joinLabels(labels)}.`;
}

export type ProductDocumentationLibraryProps = {
  className?: string;
  /** Per-product gegroepeerde drafts; zie {@link groupDraftsByProduct}. */
  groups: ProductSummaryGroup[];
  /** Bouwt de ruwe documentenlijst per draft (PTV's, normen, reglementen, ...). */
  documentsForDraft: (draft: CertificationRequestDraft) => DownloadableItemData[];
};

/**
 * Documentatie-bibliotheek voor het validatiescherm. Organiseert alle
 * documenten per uniek product en dedupliceert binnen elk product: hetzelfde
 * bestand (gematcht op `id`) wordt slechts één keer getoond, met een
 * contextuele description-line die aangeeft voor welke certificatietrajecten
 * het relevant is.
 */
export function ProductDocumentationLibrary({
  className,
  groups,
  documentsForDraft,
}: ProductDocumentationLibraryProps) {
  return (
    <div className={cn("flex flex-col gap-region", className)}>
      {groups.map((group) => {
        const totalTrajects = group.drafts.length;
        const docMap = new Map<
          string,
          { doc: DownloadableItemData; entryIds: Set<string> }
        >();
        for (const draft of group.drafts) {
          for (const doc of documentsForDraft(draft)) {
            const existing = docMap.get(doc.id);
            if (existing) existing.entryIds.add(draft.entryId);
            else docMap.set(doc.id, { doc, entryIds: new Set([draft.entryId]) });
          }
        }
        const enriched = Array.from(docMap.values()).map(({ doc, entryIds }) => ({
          ...doc,
          description: relevanceDescription(entryIds, totalTrajects),
        }));
        if (enriched.length === 0) return null;
        return (
          <section
            key={group.productId}
            className="flex flex-col gap-component"
            aria-labelledby={`docs-${group.productId}`}
          >
            <h3
              id={`docs-${group.productId}`}
              className="m-0 text-base font-semibold leading-tight tracking-tight text-foreground"
            >
              {group.productLabel}
            </h3>
            <DownloadableItemGrid items={enriched} />
          </section>
        );
      })}
    </div>
  );
}
