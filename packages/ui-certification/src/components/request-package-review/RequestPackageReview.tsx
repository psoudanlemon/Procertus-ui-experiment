/**
 * Read-only **request package** summary before submit. Parents pass rows built from customer context +
 * draft lines; optional **requester context** (who submits, for which company) appears when `requester`
 * is set — omit it for anonymous onboarding previews where registratie nog volgt.
 */
import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@procertus-ui/ui";

export type RequestPackageRow = {
  id: string;
  /** e.g. “Product type” */
  label: string;
  /** e.g. stream id or free text. */
  value: ReactNode;
};

/** Person submitting the package and the company the package belongs to. */
export type RequestPackageRequesterContext = {
  requesterName: string;
  requesterEmail?: string;
  organizationName: string;
  /** VAT, legal seat, workspace, etc. */
  organizationDetails?: ReactNode;
};

/** Optional copy overrides (e.g. i18n). English defaults apply when omitted. */
export type RequestPackageReviewRequesterPresentation = {
  context: RequestPackageRequesterContext;
  /** @default "Requester & organization" */
  sectionTitle?: string;
  /** @default "Submitted by" */
  requesterLabel?: string;
  /** @default "Email" */
  requesterEmailLabel?: string;
  /** @default "Organization" */
  organizationLabel?: string;
};

export type RequestPackageReviewProps = {
  className?: string;
  title?: string;
  description?: string;
  /** Optional intro above the table. */
  notice?: ReactNode;
  /** Rendered after `notice`, before the key/value rows table (e.g. summary person matrix). */
  beforeRows?: ReactNode;
  /** Key/value rows. */
  rows: RequestPackageRow[];
  /** Renders when `rows` is empty. */
  emptyState?: ReactNode;
  /** Who is submitting and for which company — shown above `notice` / table when set. */
  requester?: RequestPackageReviewRequesterPresentation;
  /** Smaller type; monospace for item labels and values in the rows table. */
  rowsDensity?: "default" | "compactMono";
  /**
   * Omit title and description — use when the surrounding step layout already shows the page
   * heading (avoids duplicate nested headings).
   */
  omitHeader?: boolean;
  /** Drop the surrounding Card chrome so the summary sits flush in its parent. */
  chromeless?: boolean;
};

const DEFAULT_SECTION = "Requester & organization";
const DEFAULT_LABEL_REQUESTER = "Submitted by";
const DEFAULT_LABEL_EMAIL = "Email";
const DEFAULT_LABEL_ORG = "Organization";

export function RequestPackageReview({
  className,
  title,
  description,
  notice,
  beforeRows,
  rows,
  emptyState,
  requester,
  rowsDensity = "default",
  omitHeader = false,
  chromeless,
}: RequestPackageReviewProps) {
  const rc = requester?.context;
  const sectionTitle = requester?.sectionTitle ?? DEFAULT_SECTION;
  const requesterLabel = requester?.requesterLabel ?? DEFAULT_LABEL_REQUESTER;
  const requesterEmailLabel = requester?.requesterEmailLabel ?? DEFAULT_LABEL_EMAIL;
  const organizationLabel = requester?.organizationLabel ?? DEFAULT_LABEL_ORG;
  const showHeader = !omitHeader && !chromeless && Boolean(title || description);

  const body = (
    <>
      {rc ? (
        <Card
          variant="subtle"
          className="bg-muted/20 p-section"
          aria-labelledby="request-package-requester-heading"
        >
          <h3
            id="request-package-requester-heading"
            className="m-0 text-base font-semibold leading-snug tracking-tight text-foreground"
          >
            {sectionTitle}
          </h3>
          <div className="grid gap-section sm:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-section">
              <div className="flex flex-col gap-micro">
                <p className="m-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {requesterLabel}
                </p>
                <p className="m-0 text-base font-semibold leading-snug text-foreground">
                  {rc.requesterName}
                </p>
              </div>
              {rc.requesterEmail ? (
                <div className="flex flex-col gap-micro">
                  <p className="m-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {requesterEmailLabel}
                  </p>
                  <p className="m-0 min-w-0 wrap-break-word">
                    <a
                      href={`mailto:${rc.requesterEmail}`}
                      className="text-base font-normal text-primary underline-offset-2 hover:underline"
                    >
                      {rc.requesterEmail}
                    </a>
                  </p>
                </div>
              ) : null}
            </div>
            <div className="flex min-w-0 flex-col gap-section">
              <div className="flex flex-col gap-micro">
                <p className="m-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {organizationLabel}
                </p>
                <p className="m-0 text-base font-semibold leading-snug text-foreground">
                  {rc.organizationName}
                </p>
              </div>
              {rc.organizationDetails ? (
                <div className="text-base font-normal text-muted-foreground [&_p]:m-0 [&_p+p]:mt-micro">
                  {rc.organizationDetails}
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      ) : null}

      {notice ? (
        <div className="text-base font-normal text-muted-foreground">{notice}</div>
      ) : null}
      {beforeRows ? <div className="min-w-0">{beforeRows}</div> : null}
      {rows.length === 0 ? (
        (emptyState ?? (
          <p
            className="m-0 text-base font-normal text-muted-foreground"
            role="status"
          >
            Nothing to review — add at least one request.
          </p>
        ))
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <Table
            className={cn(
              rowsDensity === "compactMono"
                ? "text-xs leading-snug tabular-nums"
                : "text-base",
            )}
          >
            <TableHeader>
              <TableRow>
                <TableHead
                  className={cn(
                    "w-2/5 font-semibold",
                    rowsDensity === "compactMono" &&
                      "font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
                  )}
                >
                  Item
                </TableHead>
                <TableHead
                  className={cn(
                    "font-semibold",
                    rowsDensity === "compactMono" &&
                      "font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
                  )}
                >
                  Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell
                    className={cn(
                      "align-top whitespace-nowrap text-base font-normal text-muted-foreground",
                      rowsDensity === "compactMono" &&
                        "font-mono text-[11px] leading-relaxed text-muted-foreground",
                    )}
                  >
                    {r.label}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "min-w-0 whitespace-normal wrap-break-word align-top text-base font-semibold text-foreground",
                      rowsDensity === "compactMono" &&
                        "font-mono text-[11px] font-normal leading-relaxed text-foreground",
                    )}
                  >
                    {r.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );

  if (chromeless) {
    return <div className={cn("flex flex-col gap-section", className)}>{body}</div>;
  }

  return (
    <Card className={cn("w-full max-w-2xl overflow-hidden text-base lg:max-w-4xl xl:max-w-5xl", className)}>
      {showHeader ? (
        <CardHeader>
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
      ) : null}
      <CardContent className="flex flex-col gap-section">{body}</CardContent>
    </Card>
  );
}
