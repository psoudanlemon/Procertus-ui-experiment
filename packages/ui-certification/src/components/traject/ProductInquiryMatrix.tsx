import { Cancel01Icon, Delete02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, cn } from "@procertus-ui/ui";

import type { ProductSummaryGroup } from "./build-validation-documents";
import { inquiryMatrixColumnLabelFor } from "./inquiry-matrix-column-label";
import { ProductCategoryTrail } from "./ProductCategoryTrail";

/**
 * Matrix-modus vanaf de `@xl` container-query (theme default: 36rem ≈ 576px bij
 * 16px root). Tailwind v4 gebruikt `@xl/inquiry:…` voor benoemde containers,
 * niet het oude `@[576px]/inquiry`-patroon.
 */

function categoryTrailWithoutLeaf(path: string | undefined, label: string): string {
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

function requestedCertsOrderedForGroup(
  group: ProductSummaryGroup,
  certOrder: readonly string[],
): { entryId: string; label: string }[] {
  const requested = new Set<string>(group.drafts.map((d) => d.entryId));
  return certOrder
    .filter((id) => requested.has(id))
    .map((entryId) => ({ entryId, label: inquiryMatrixColumnLabelFor(entryId) }));
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
  /**
   * Optionele verwijderactie per productrij (alle trajecten voor dat product).
   * Toont een prullenbak-knop in de laatste kolom.
   */
  onRemoveProductRow?: (productId: string) => void;
};

/**
 * Read-only overzicht: brede container = tabelmatrix met ticks; smalle
 * container = lijst per product met pillen voor toegevoegde certificaattypes.
 */
export function ProductInquiryMatrix({
  className,
  groups,
  primaryEntryId,
  onRemoveProductRow,
}: ProductInquiryMatrixProps) {
  const certOrder = deriveCertOrder(groups, primaryEntryId);
  const showActions = onRemoveProductRow != null;

  return (
    <div className={cn("@container/inquiry min-w-0 w-full", className)}>
      <p className="sr-only" id="product-inquiry-matrix-summary">
        Overzicht van aangevraagde certificaties per product.
        {showActions ? " U kunt productrijen verwijderen via de actieknop." : ""}
        Op smalle panelen wordt een compacte lijst getoond; op bredere panelen een matrix.
      </p>

      <ul
        className={cn(
          "m-0 flex w-full list-none flex-col gap-component p-0",
          "block @xl/inquiry:hidden",
        )}
        aria-describedby="product-inquiry-matrix-summary"
      >
        {groups.map((group) => {
          const certs = requestedCertsOrderedForGroup(group, certOrder);
          const trail = categoryTrailWithoutLeaf(group.productPath, group.productLabel);
          return (
            <li
              key={group.productId}
              className="w-full rounded-lg border border-border/70 bg-card px-component py-component text-card-foreground shadow-sm"
            >
              <div className="flex w-full min-w-0 items-start justify-between gap-component">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground">{group.productLabel}</div>
                  {trail ? (
                    <div className="mt-micro">
                      <ProductCategoryTrail trail={trail} />
                    </div>
                  ) : null}
                  <p className="mt-component mb-micro text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Toegevoegde certificaattypes
                  </p>
                  {certs.length === 0 ? (
                    <p className="m-0 text-sm text-muted-foreground">
                      Geen certificaattypes gekoppeld.
                    </p>
                  ) : (
                    <ul
                      className="m-0 flex list-none flex-wrap gap-micro p-0"
                      aria-label="Certificaattypes voor dit product"
                    >
                      {certs.map(({ entryId, label }) => (
                        <li key={entryId}>
                          <span className="inline-flex max-w-full items-center rounded-md border border-border/80 bg-muted/50 px-2 py-1 text-xs font-medium leading-snug text-foreground">
                            {label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {showActions ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label={`Verwijder alle aanvragen voor ${group.productLabel}`}
                    onClick={() => onRemoveProductRow(group.productId)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-4" aria-hidden />
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <div className={cn("w-full overflow-x-auto", "hidden @xl/inquiry:block")}>
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            Matrix: overzicht van aangevraagde certificaties per product.
            {showActions ? " Actiekolom verwijdert alle trajecten voor een product." : ""}
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
                const col = inquiryMatrixColumnLabelFor(cert);
                return (
                  <th
                    key={cert}
                    scope="col"
                    title={col}
                    className="whitespace-nowrap px-component py-component text-center text-xs font-semibold text-muted-foreground"
                  >
                    {col}
                  </th>
                );
              })}
              {showActions ? (
                <th
                  scope="col"
                  className="w-12 px-component py-component text-end text-xs font-semibold text-muted-foreground"
                >
                  <span className="sr-only">Acties</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const requested = new Set<string>(group.drafts.map((draft) => draft.entryId));
              return (
                <tr key={group.productId} className="border-b border-border/60 last:border-b-0">
                  <th
                    scope="row"
                    className="py-component pe-component text-start text-sm font-medium text-foreground"
                  >
                    {group.productLabel}
                    {(() => {
                      const trail = categoryTrailWithoutLeaf(group.productPath, group.productLabel);
                      return trail ? <ProductCategoryTrail trail={trail} /> : null;
                    })()}
                  </th>
                  {certOrder.map((cert) => {
                    const isRequested = requested.has(cert);
                    const columnTitle = inquiryMatrixColumnLabelFor(cert);
                    return (
                      <td key={cert} className="px-component py-component text-center">
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
                  {showActions ? (
                    <td className="px-micro py-component text-end align-middle">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Verwijder alle aanvragen voor ${group.productLabel} uit het mandje`}
                        onClick={() => onRemoveProductRow(group.productId)}
                      >
                        <HugeiconsIcon icon={Delete02Icon} className="size-4" aria-hidden />
                      </Button>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
