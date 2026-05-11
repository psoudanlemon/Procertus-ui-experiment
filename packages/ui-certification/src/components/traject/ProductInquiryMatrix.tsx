import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@procertus-ui/ui";

import type { ProductSummaryGroup } from "./build-validation-documents";

/**
 * Primary cert columns (deze worden eerst getoond in de matrix wanneer ze
 * voorkomen in de pakketdrafts). Niet-primary entryIds (atg, epd, ...) volgen
 * daarna in de volgorde waarin ze voor het eerst opduiken.
 */
const PRIMARY_CERT_ORDER = ["benor", "ce", "ssd", "procertus"] as const;

const CERT_COLUMN_LABEL: Record<string, string> = {
  benor: "BENOR",
  ce: "CE",
  ssd: "SSD",
  procertus: "PROCERTUS",
  atg: "ATG",
  "innovation-attest": "Innovation",
  epd: "EPD",
  partijkeuring: "Partijkeuring",
  "product-certification": "Product",
};

const CERT_COLUMN_TITLE: Record<string, string> = {
  benor: "BENOR-certificatie",
  ce: "CE-markering",
  ssd: "SSD-certificaat",
  procertus: "PROCERTUS-attest",
  atg: "ATG technische goedkeuring",
  "innovation-attest": "Innovation attest",
  epd: "EPD-milieuverklaring",
  partijkeuring: "Partijkeuring",
  "product-certification": "Productcertificatie",
};

function deriveCertOrder(groups: ProductSummaryGroup[]): string[] {
  const present = new Set<string>();
  for (const group of groups) {
    for (const draft of group.drafts) {
      present.add(draft.entryId);
    }
  }
  const ordered: string[] = [];
  for (const cert of PRIMARY_CERT_ORDER) {
    if (present.has(cert)) ordered.push(cert);
  }
  for (const cert of present) {
    if (!ordered.includes(cert)) ordered.push(cert);
  }
  return ordered;
}

export type ProductInquiryMatrixProps = {
  className?: string;
  /** Per-product gegroepeerde drafts; zie {@link groupDraftsByProduct}. */
  groups: ProductSummaryGroup[];
};

/**
 * Read-only matrix-overzicht van de aangevraagde certificaties. Eén rij per
 * uniek product, één kolom per certificatietraject dat in het pakket
 * voorkomt. Een tick-icoon op het kruispunt geeft aan dat het traject voor dat
 * product is aangevraagd. Geen kaartchrome, alleen een strakke tabel met
 * border-b op de rijen.
 */
export function ProductInquiryMatrix({ className, groups }: ProductInquiryMatrixProps) {
  const certOrder = deriveCertOrder(groups);

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Overzicht van aangevraagde certificaties per product.
        </caption>
        <thead>
          <tr className="border-b border-border">
            <th
              scope="col"
              className="py-component pe-component text-start text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Product
            </th>
            {certOrder.map((cert) => (
              <th
                key={cert}
                scope="col"
                title={CERT_COLUMN_TITLE[cert] ?? cert}
                className="px-component py-component text-center text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                {CERT_COLUMN_LABEL[cert] ?? cert.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            const requested = new Set(group.drafts.map((draft) => draft.entryId));
            return (
              <tr
                key={group.productId}
                className="border-b border-border/60 last:border-b-0"
              >
                <th
                  scope="row"
                  className="py-component pe-component text-start text-sm font-medium text-foreground"
                >
                  {group.productLabel}
                </th>
                {certOrder.map((cert) => {
                  const isRequested = requested.has(cert);
                  const columnTitle = CERT_COLUMN_TITLE[cert] ?? cert;
                  return (
                    <td
                      key={cert}
                      className="px-component py-component text-center"
                    >
                      {isRequested ? (
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          aria-label={`${columnTitle} aangevraagd voor ${group.productLabel}`}
                          className="mx-auto size-4 text-foreground"
                          strokeWidth={2.25}
                        />
                      ) : (
                        <span
                          aria-label={`${columnTitle} niet aangevraagd voor ${group.productLabel}`}
                          className="text-muted-foreground/40"
                        >
                          ·
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
