import {
  Badge,
  DownloadableItem,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  cn,
  type DownloadableItemData,
} from "@procertus-ui/ui";
import type { ReactNode } from "react";

import { ProductCategoryTrail } from "./ProductCategoryTrail";

export type ProductSummaryDocument = DownloadableItemData;

export type ProductSummaryCertification = {
  /** Stable id (typically the originating draft id) for keying and aria. */
  id: string;
  /** Entry id used to derive a default badge label (e.g. "benor", "ce", "atg"). */
  entryId: string;
  /** Override for the badge text. Defaults to a humanized form of `entryId`. */
  label?: ReactNode;
  /**
   * Optional cert-specific metadata appended as an outline badge (e.g. CE
   * prestatieniveau `"Niveau 1+"`). Skipped when empty.
   */
  value?: string;
  /**
   * Documents tied to this certificatietraject. Docs that appear identically
   * (matched by `id`) across every cert in the card are lifted into a
   * shared "Gezamenlijke documenten" section to avoid repetition.
   */
  documents?: DownloadableItemData[];
};

export type ProductSummaryCardProps = {
  className?: string;
  product: {
    id: string;
    label: string;
    /** Root-to-leaf categoriepad, segmenten gescheiden door `/`, `>` of `›`. */
    path?: string;
    /** Producttype-stream (bv. `"411"`, `"BR01"`) — eenmaal getoond in de header. */
    code?: string;
  };
  certifications: ProductSummaryCertification[];
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

function badgeLabelFor(cert: ProductSummaryCertification): ReactNode {
  return cert.label ?? ENTRY_LABELS[cert.entryId] ?? cert.entryId;
}

function splitProductPath(productPath: string | undefined, productLabel: string) {
  if (!productPath) return { breadcrumb: [] as string[], leaf: productLabel };
  const parts = productPath
    .split(/\s*[/›>]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return { breadcrumb: [], leaf: productLabel };
  const last = parts[parts.length - 1];
  const trimmed =
    last && last.toLocaleLowerCase("nl-BE") === productLabel.toLocaleLowerCase("nl-BE")
      ? parts.slice(0, -1)
      : parts;
  return { breadcrumb: trimmed, leaf: productLabel };
}

function partitionDocuments(certifications: ProductSummaryCertification[]): {
  shared: DownloadableItemData[];
  perCert: Map<string, DownloadableItemData[]>;
} {
  const perCert = new Map<string, DownloadableItemData[]>();
  for (const cert of certifications) {
    perCert.set(cert.id, [...(cert.documents ?? [])]);
  }
  if (certifications.length <= 1) return { shared: [], perCert };

  const occurrences = new Map<
    string,
    { doc: DownloadableItemData; certIds: Set<string> }
  >();
  for (const cert of certifications) {
    for (const doc of cert.documents ?? []) {
      const entry = occurrences.get(doc.id);
      if (entry) entry.certIds.add(cert.id);
      else occurrences.set(doc.id, { doc, certIds: new Set([cert.id]) });
    }
  }

  const total = certifications.length;
  const shared: DownloadableItemData[] = [];
  const sharedIds = new Set<string>();
  for (const { doc, certIds } of occurrences.values()) {
    if (certIds.size === total) {
      shared.push(doc);
      sharedIds.add(doc.id);
    }
  }
  if (shared.length === 0) return { shared: [], perCert };

  for (const [certId, docs] of perCert) {
    perCert.set(
      certId,
      docs.filter((doc) => !sharedIds.has(doc.id)),
    );
  }
  return { shared, perCert };
}

/**
 * Compacte, dichte documentenlijst: per item één `[icoon] [titel + subtekst]
 * [download]`-rij. Tot en met twee items stapelen we verticaal; vanaf drie
 * items schakelen we op md+ over naar een twee-kolommen grid om de
 * kaartbreedte te benutten zonder dat de rijen onnodig lang worden.
 */
function CompactDocumentList({
  items,
  ariaLabel,
}: {
  items: DownloadableItemData[];
  ariaLabel: string;
}) {
  const useGrid = items.length > 2;
  return (
    <div
      role="list"
      aria-label={ariaLabel}
      className={cn(
        "grid gap-micro",
        useGrid ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1",
      )}
    >
      {items.map((doc) => (
        <DownloadableItem key={doc.id} variant="row" {...doc} />
      ))}
    </div>
  );
}

const SUBSECTION_HEADING_CLASS =
  "m-0 text-xs font-bold uppercase tracking-wider text-muted-foreground";

/**
 * Product-level overzichtskaart voor het validatiescherm. Toont één productkop
 * (naam, categoriepad, producttype-code) en eronder elke aangevraagde
 * certificatie als eigen traject-rij met badge en eigen documenten. Documenten
 * die identiek zijn over alle trajecten worden automatisch verplaatst naar een
 * "Gezamenlijke documenten"-sectie bovenaan om dubbele blokken te vermijden.
 */
export function ProductSummaryCard({
  className,
  product,
  certifications,
}: ProductSummaryCardProps) {
  const { breadcrumb, leaf } = splitProductPath(product.path, product.label);
  const { shared, perCert } = partitionDocuments(certifications);
  const trajectCount = certifications.length;
  const multipleTrajects = trajectCount > 1;

  return (
    <article
      className={cn(
        "flex flex-col gap-component rounded-xl border border-border bg-card p-section text-card-foreground",
        className,
      )}
      aria-label={`Productaanvraag — ${leaf}`}
    >
      <header className="flex flex-wrap items-center gap-component">
        <h3 className="m-0 min-w-0 text-heading-sm font-semibold leading-tight tracking-tight text-foreground">
          {leaf}
          {breadcrumb.length > 0 ? (
            <ProductCategoryTrail trail={breadcrumb.join(" > ")} />
          ) : null}
        </h3>
        {product.code ? (
          <HoverCard openDelay={150} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Badge variant="outline" className="ms-auto cursor-help font-medium">
                {product.code}
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent side="top" className="text-xs">
              <p className="m-0 mb-1 font-semibold text-foreground">Producttype-stream</p>
              <p className="m-0 text-muted-foreground">
                Interne code voor de subgroep van producten waarvoor de aangevraagde
                certificaten binnen het normenkader van toepassing zijn.
              </p>
            </HoverCardContent>
          </HoverCard>
        ) : null}
      </header>

      {shared.length > 0 ? (
        <section
          className="flex flex-col gap-micro rounded-md border border-border/40 bg-muted/30 p-component"
          aria-label="Gezamenlijke documenten"
        >
          <p className={SUBSECTION_HEADING_CLASS}>Gezamenlijke documenten</p>
          <CompactDocumentList items={shared} ariaLabel="Gezamenlijke documenten" />
        </section>
      ) : null}

      <section
        className="flex flex-col"
        aria-label={trajectCount === 1 ? "Aangevraagd traject" : "Aangevraagde trajecten"}
      >
        {certifications.map((cert, index) => {
          const docs = perCert.get(cert.id) ?? [];
          const trajectLabel = `Aanvraag voor ${ENTRY_LABELS[cert.entryId] ?? cert.entryId}`;
          return (
            <div
              key={cert.id}
              className={cn(
                "flex flex-col gap-micro",
                multipleTrajects && index > 0 && "mt-component border-t border-border/60 pt-component",
              )}
            >
              <div className="flex flex-wrap items-center gap-micro">
                <Badge variant="secondary" className="font-medium">
                  Aanvraag voor {badgeLabelFor(cert)}
                </Badge>
                {cert.value ? (
                  <HoverCard openDelay={150} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <Badge variant="outline" className="cursor-help font-medium">
                        {cert.value}
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent side="top" className="text-xs">
                      <p className="m-0 mb-1 font-semibold text-foreground">AVCP-systeem</p>
                      <p className="m-0 text-muted-foreground">
                        Het beoordelings- en verificatieniveau voor prestatiebestendigheid
                        onder CE-markering. Bepaalt de rol van een aangemelde instantie in de
                        conformiteitsbeoordeling.
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                ) : null}
              </div>
              {docs.length > 0 ? (
                <CompactDocumentList items={docs} ariaLabel={trajectLabel} />
              ) : null}
            </div>
          );
        })}
      </section>
    </article>
  );
}
