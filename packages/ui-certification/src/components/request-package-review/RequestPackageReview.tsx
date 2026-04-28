/**
 * Read-only **request package** summary before submit. Parents pass rows built from
 * customer context + draft lines; optional **requester context** (who submits, for which
 * company) is surfaced prominently — no `fetch` here.
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
  title: string;
  description?: string;
  /** Optional intro above the table. */
  notice?: ReactNode;
  /** Key/value rows. */
  rows: RequestPackageRow[];
  /** Renders when `rows` is empty. */
  emptyState?: ReactNode;
  /** Who is submitting and for which company — shown above `notice` / table when set. */
  requester?: RequestPackageReviewRequesterPresentation;
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
  rows,
  emptyState,
  requester,
}: RequestPackageReviewProps) {
  const rc = requester?.context;
  const sectionTitle = requester?.sectionTitle ?? DEFAULT_SECTION;
  const requesterLabel = requester?.requesterLabel ?? DEFAULT_LABEL_REQUESTER;
  const requesterEmailLabel = requester?.requesterEmailLabel ?? DEFAULT_LABEL_EMAIL;
  const organizationLabel = requester?.organizationLabel ?? DEFAULT_LABEL_ORG;

  return (
    <Card className={cn("w-full max-w-2xl overflow-hidden text-base leading-[1.6]", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-section">
        {rc ? (
          <section
            className="rounded-xl border border-border/60 bg-muted/20 p-section"
            aria-labelledby="request-package-requester-heading"
          >
            <h3
              id="request-package-requester-heading"
              className="m-0 text-base font-semibold leading-snug tracking-tight text-foreground"
            >
              {sectionTitle}
            </h3>
            <div className="mt-component grid gap-section sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-component">
                <div className="flex flex-col gap-micro">
                  <p className="m-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {requesterLabel}
                  </p>
                  <p className="m-0 text-base font-bold leading-snug text-foreground">{rc.requesterName}</p>
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
              <div className="flex min-w-0 flex-col gap-component">
                <div className="flex flex-col gap-micro">
                  <p className="m-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {organizationLabel}
                  </p>
                  <p className="m-0 text-base font-bold leading-snug text-foreground">{rc.organizationName}</p>
                </div>
                {rc.organizationDetails ? (
                  <div className="text-base font-normal leading-[1.6] text-muted-foreground [&_p]:m-0 [&_p+p]:mt-micro">
                    {rc.organizationDetails}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {notice ? <div className="text-base font-normal leading-[1.6] text-muted-foreground">{notice}</div> : null}
        {rows.length === 0 ? (
          (emptyState ?? (
            <p className="m-0 text-base font-normal leading-[1.6] text-muted-foreground" role="status">
              Nothing to review — add at least one request.
            </p>
          ))
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/50">
            <Table className="text-base leading-[1.6]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/5 font-semibold">Item</TableHead>
                  <TableHead className="font-semibold">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="align-top whitespace-nowrap text-base font-normal text-muted-foreground">
                      {r.label}
                    </TableCell>
                    <TableCell className="min-w-0 whitespace-normal wrap-break-word align-top text-base font-bold text-foreground">
                      {r.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
