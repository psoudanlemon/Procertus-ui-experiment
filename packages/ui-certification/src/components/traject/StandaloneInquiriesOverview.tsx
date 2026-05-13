import { Delete02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, cn } from "@procertus-ui/ui";

import type { CertificationRequestDraft } from "../../certification-request/types";
import { inquiryMatrixColumnLabelFor } from "./inquiry-matrix-column-label";

export type StandaloneInquiriesOverviewProps = {
  className?: string;
  /** Aanvragen zonder gekoppeld catalogus-product (bv. innovatie-attest). */
  drafts: readonly CertificationRequestDraft[];
  onRemoveDraft?: (draftId: string) => void;
};

function rowLabelFor(draft: CertificationRequestDraft): string {
  const custom = draft.label?.trim();
  if (custom) return custom;
  return inquiryMatrixColumnLabelFor(draft.entryId as string);
}

/**
 * Niet-productgebonden aanvragen in dezelfde lay-outmodus als {@link ProductInquiryMatrix}:
 * smal = kaarten; breed (`@xl/inquiry`) = tabel zonder aparte thead (sectietitel volstaat).
 */
export function StandaloneInquiriesOverview({
  className,
  drafts,
  onRemoveDraft,
}: StandaloneInquiriesOverviewProps) {
  if (drafts.length === 0) return null;

  const showActions = onRemoveDraft != null;

  return (
    <div
      className={cn("@container/inquiry min-w-0 w-full flex flex-col gap-component", className)}
      role="region"
      aria-labelledby="standalone-inquiries-heading"
    >
      <p className="sr-only" id="standalone-inquiries-table-summary">
        Overzicht van aanvragen zonder gekoppeld product uit de catalogus.
        {showActions ? " U kunt een rij verwijderen via de actieknop." : ""}
      </p>

      <div className="flex flex-col gap-micro">
        <h3
          id="standalone-inquiries-heading"
          className="m-0 text-sm font-semibold tracking-tight text-foreground"
        >
          Andere aanvragen
        </h3>
        <p className="m-0 text-xs text-muted-foreground">
          Zonder gekoppeld product uit de productcatalogus.
        </p>
      </div>

      <ul
        className={cn(
          "m-0 flex w-full list-none flex-col gap-component p-0",
          "block @xl/inquiry:hidden",
        )}
        aria-describedby="standalone-inquiries-table-summary"
      >
        {drafts.map((draft) => {
          const label = rowLabelFor(draft);
          return (
            <li
              key={draft.id}
              className="w-full rounded-lg border border-border/70 bg-card px-component py-component text-card-foreground shadow-sm"
            >
              <div className="flex w-full min-w-0 items-center justify-between gap-component">
                <p className="m-0 min-w-0 flex-1 text-sm font-medium leading-snug text-foreground">
                  {label}
                </p>
                <div className="flex shrink-0 items-center gap-micro">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    aria-label={`${label} opgenomen in het aanvraagpakket`}
                    className="size-4 text-primary"
                    strokeWidth={2.25}
                  />
                  {showActions ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Verwijder aanvraag: ${label}`}
                      onClick={() => onRemoveDraft?.(draft.id)}
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="size-4" aria-hidden />
                    </Button>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={cn("w-full overflow-x-auto", "hidden @xl/inquiry:block")}>
        <table
          className="w-full border-collapse text-sm"
          aria-describedby="standalone-inquiries-table-summary"
        >
          <caption className="sr-only">
            Overzicht van aanvragen zonder gekoppeld product; één kolom voor het type en een vinkje
            indien opgenomen.
            {showActions ? " Verwijderen via actiekolom." : ""}
          </caption>
          <tbody>
            {drafts.map((draft) => {
              const label = rowLabelFor(draft);
              return (
                <tr key={draft.id} className="border-b border-border/60 last:border-b-0">
                  <th
                    scope="row"
                    className="py-component pe-component text-start text-sm font-medium text-foreground"
                  >
                    {label}
                  </th>
                  <td className="w-px whitespace-nowrap px-component py-component text-center">
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      aria-label={`${label} opgenomen in het aanvraagpakket`}
                      className="mx-auto size-4 text-primary"
                      strokeWidth={2.25}
                    />
                  </td>
                  {showActions ? (
                    <td className="w-12 px-micro py-component text-end align-middle">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Verwijder ${label} uit het mandje`}
                        onClick={() => onRemoveDraft?.(draft.id)}
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
