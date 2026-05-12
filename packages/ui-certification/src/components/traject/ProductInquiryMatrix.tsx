import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@procertus-ui/ui";

import { defaultProcertusCategorizationDoc } from "../../categorization-data";
import type { AvailableEntry } from "../../types";
import type { ProductSummaryGroup } from "./build-validation-documents";
import { ProductCategoryTrail } from "./ProductCategoryTrail";

function categoryTrailWithoutLeaf(
  path: string | undefined,
  label: string,
): string {
  if (!path) return "";
  const parts = path
    .split(/\s*[/›>]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return "";
  const last = parts[parts.length - 1];
  const trimmed =
    last && last.toLocaleLowerCase("nl-BE") === label.toLocaleLowerCase("nl-BE")
      ? parts.slice(0, -1)
      : parts;
  return trimmed.join(" > ");
}

/**
 * Primary cert columns (deze worden eerst getoond in de matrix wanneer ze
 * voorkomen in de pakketdrafts). Niet-primary entryIds (atg, epd, ...) volgen
 * daarna in de volgorde waarin ze voor het eerst opduiken.
 */
const PRIMARY_CERT_ORDER = ["benor", "ce", "ssd", "procertus"] as const;

/**
 * Single source of truth voor certificaatnamen: dezelfde
 * `availableEntries` die ook de Wegwijzer-pillbar en master-card titels
 * voeden, zodat kolomheaders in de aanvraag-matrix dezelfde nomenclatuur
 * gebruiken (bv. "BENOR-certificatie", "CE-markering", "Innovatie-attest").
 */
const ENTRIES_BY_ID = new Map<string, AvailableEntry>(
  (defaultProcertusCategorizationDoc.meta.availableEntries ?? []).map(
    (entry) => [entry.id, entry],
  ),
);

/**
 * Fallback voor wizard-entry-points die niet als `availableEntry` zijn
 * geregistreerd (bv. `product-certification` is een intent, niet één van de
 * concrete certificaten).
 */
const FALLBACK_COLUMN_LABEL: Record<string, string> = {
  "product-certification": "Productcertificatie",
};

function columnLabelFor(entryId: string): string {
  return (
    ENTRIES_BY_ID.get(entryId)?.label ??
    FALLBACK_COLUMN_LABEL[entryId] ??
    entryId.toUpperCase()
  );
}

function deriveCertOrder(
  groups: ProductSummaryGroup[],
  primaryEntryId: string | undefined,
): string[] {
  const present = new Set<string>();
  for (const group of groups) {
    for (const draft of group.drafts) {
      present.add(draft.entryId);
    }
  }
  const ordered: string[] = [];
  if (primaryEntryId && present.has(primaryEntryId)) {
    ordered.push(primaryEntryId);
  }
  for (const cert of PRIMARY_CERT_ORDER) {
    if (present.has(cert) && !ordered.includes(cert)) ordered.push(cert);
  }
  for (const cert of Array.from(present)) {
    if (!ordered.includes(cert)) ordered.push(cert);
  }
  return ordered;
}

export type ProductInquiryMatrixProps = {
  className?: string;
  /** Per-product gegroepeerde drafts; zie {@link groupDraftsByProduct}. */
  groups: ProductSummaryGroup[];
  /**
   * EntryId van de primaire certificatie van het traject (de cert waarin de
   * gebruiker zich bevindt, bv. `"benor"`). Wordt als eerste kolom getoond
   * zodat de "hoofd"-certificatie bovenaan de matrix leesbaar blijft.
   */
  primaryEntryId?: string;
};

/**
 * Read-only matrix-overzicht van de aangevraagde certificaties. Eén rij per
 * uniek product, één kolom per certificatietraject dat in het pakket
 * voorkomt. Een tick-icoon op het kruispunt geeft aan dat het traject voor dat
 * product is aangevraagd. Geen kaartchrome, alleen een strakke tabel met
 * border-b op de rijen.
 */
export function ProductInquiryMatrix({
  className,
  groups,
  primaryEntryId,
}: ProductInquiryMatrixProps) {
  const certOrder = deriveCertOrder(groups, primaryEntryId);

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
              className="py-component pe-component text-start text-xs font-semibold text-muted-foreground"
            >
              Gekozen producten
            </th>
            {certOrder.map((cert) => {
              const columnLabel = columnLabelFor(cert);
              return (
                <th
                  key={cert}
                  scope="col"
                  title={columnLabel}
                  className="whitespace-nowrap px-component py-component text-center text-xs font-semibold text-muted-foreground"
                >
                  {columnLabel}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            const requested = new Set<string>(
              group.drafts.map((draft) => draft.entryId),
            );
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
                  {(() => {
                    const trail = categoryTrailWithoutLeaf(
                      group.productPath,
                      group.productLabel,
                    );
                    return trail ? <ProductCategoryTrail trail={trail} /> : null;
                  })()}
                </th>
                {certOrder.map((cert) => {
                  const isRequested = requested.has(cert);
                  const columnTitle = columnLabelFor(cert);
                  return (
                    <td
                      key={cert}
                      className="px-component py-component text-center"
                    >
                      {isRequested ? (
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          aria-label={`${columnTitle} aangevraagd voor ${group.productLabel}`}
                          className="mx-auto size-4 text-primary"
                          strokeWidth={2.25}
                        />
                      ) : (
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          aria-label={`${columnTitle} niet aangevraagd voor ${group.productLabel}`}
                          className="mx-auto size-4 text-muted-foreground/40"
                          strokeWidth={2}
                        />
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
