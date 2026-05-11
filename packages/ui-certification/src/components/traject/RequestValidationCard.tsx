import {
  Badge,
  DownloadableItemGrid,
  cn,
  type DownloadableItemData,
} from "@procertus-ui/ui";
import type { ReactNode } from "react";

import type { CertificationRequestDraft } from "../../certification-request/types";

export type RequestValidationDocument = DownloadableItemData;

export type RequestValidationCardProps = {
  className?: string;
  draft: CertificationRequestDraft;
  /** Documents specific to this product / certificate combination (PTVs, normen). Rendered as a responsive download grid. */
  documents?: DownloadableItemData[];
  /** Override for the certificate-type badge label. Defaults to a humanized form of `draft.entryId`. */
  certificateLabel?: ReactNode;
};

const ENTRY_LABELS: Record<string, string> = {
  "product-certification": "productcertificatie",
  benor: "BENOR-certificatie",
  ce: "CE-markering",
  ssd: "SSD-certificaat",
  procertus: "PROCERTUS-attest",
  atg: "ATG technische goedkeuring",
  "innovation-attest": "innovation attest",
  epd: "EPD-milieuverklaring",
  partijkeuring: "partijkeuring",
};

function certificateLabelFor(draft: CertificationRequestDraft): string {
  return ENTRY_LABELS[draft.entryId] ?? draft.shortLabel ?? draft.label;
}

function splitProductPath(productPath: string | undefined, productLabel: string | undefined) {
  if (!productPath) return { breadcrumb: [] as string[], leaf: productLabel ?? "" };
  const parts = productPath
    .split(/\s*[/›>]\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return { breadcrumb: [], leaf: productLabel ?? "" };
  const last = parts[parts.length - 1];
  const trimmed =
    productLabel && last && last.toLocaleLowerCase("nl-BE") === productLabel.toLocaleLowerCase("nl-BE")
      ? parts.slice(0, -1)
      : parts;
  return { breadcrumb: trimmed, leaf: productLabel ?? last ?? "" };
}

export function RequestValidationCard({
  className,
  draft,
  documents = [],
  certificateLabel,
}: RequestValidationCardProps) {
  const { breadcrumb, leaf } = splitProductPath(draft.productPath, draft.productLabel);
  const certLabel = certificateLabel ?? certificateLabelFor(draft);

  return (
    <article
      className={cn(
        "flex flex-col gap-section rounded-xl border border-border bg-background p-section text-base",
        className,
      )}
      aria-label={`Aanvraag ${typeof certLabel === "string" ? certLabel : ""} — ${leaf}`}
    >
      <header className="flex flex-col gap-micro">
        {breadcrumb.length > 0 ? (
          <p
            className="m-0 flex flex-wrap items-center gap-micro text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            aria-label="Productcategorie"
          >
            {breadcrumb.map((part, index) => (
              <span key={`${part}-${index}`} className="inline-flex items-center gap-micro">
                {index > 0 ? (
                  <span aria-hidden className="text-muted-foreground/60">
                    ›
                  </span>
                ) : null}
                <span>{part}</span>
              </span>
            ))}
          </p>
        ) : null}
        <h3 className="m-0 text-heading-sm font-semibold leading-tight tracking-tight text-foreground">
          {leaf}
        </h3>
        <div className="mt-micro flex flex-wrap items-center gap-micro">
          <Badge variant="secondary" className="font-medium">
            Aanvraag voor {certLabel}
          </Badge>
          {draft.productTypeStreamLabel ? (
            <Badge variant="outline" className="font-medium">
              {draft.productTypeStreamLabel}
            </Badge>
          ) : null}
          {draft.entryId === "ce" && draft.value ? (
            <Badge variant="outline" className="font-medium">
              {draft.value}
            </Badge>
          ) : null}
        </div>
      </header>

      {documents.length > 0 ? (
        <section
          className="flex flex-col gap-component border-t border-border pt-section"
          aria-label="Productspecifieke documentatie"
        >
          <div className="flex flex-col gap-micro">
            <p className="m-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Productspecifieke documentatie
            </p>
            <p className="m-0 text-sm text-muted-foreground">
              PTV's en normen die gelden voor dit product binnen deze certificatie.
            </p>
          </div>
          <DownloadableItemGrid items={documents} />
        </section>
      ) : null}
    </article>
  );
}
