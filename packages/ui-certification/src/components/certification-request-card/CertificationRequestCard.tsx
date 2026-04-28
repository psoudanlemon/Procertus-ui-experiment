import type { KeyboardEvent } from "react";
import { Badge, Card, cn } from "@procertus-ui/ui";

export type {
  CertificationRequestLifecycleStatus,
  CertificationRequestLifecycleStepId,
} from "../certification-request-lifecycle-timeline";

import {
  CertificationRequestLifecycleTimeline,
  type CertificationRequestLifecycleStatus,
  type CertificationRequestLifecycleStepId,
} from "../certification-request-lifecycle-timeline";

export type CertificationRequestCardInquiry = {
  id: string;
  label: string;
  shortLabel?: string;
  productLabel?: string;
  productPath?: string;
  value?: string;
  context?: string;
  statusLabel?: string;
};

export type CertificationRequestCardProps = {
  className?: string;
  inquiries: readonly CertificationRequestCardInquiry[];
  lifecycleDateLabels: Partial<Record<CertificationRequestLifecycleStepId, string>>;
  requestId: string;
  status: CertificationRequestLifecycleStatus;
  statusLabel: string;
  statusVariant?: "outline" | "secondary";
  onOpen?: (requestId: string) => void;
};

function InquirySummary({ inquiries }: { inquiries: readonly CertificationRequestCardInquiry[] }) {
  return (
    <div className="space-y-3">
      <ul className="grid gap-2" role="list">
        {inquiries.slice(0, 3).map((inquiry) => (
          <li
            key={inquiry.id}
            className="min-w-0 rounded-lg border border-border/70 bg-muted/25 p-3 shadow-proc-xs"
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold text-foreground">
                  {inquiry.label}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {inquiry.productLabel ?? "Niet-productgebonden"}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-1">
                {inquiry.shortLabel ? <Badge variant="outline">{inquiry.shortLabel}</Badge> : null}
                {inquiry.value ? <Badge variant="outline">{inquiry.value}</Badge> : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {inquiries.length > 3 ? (
        <p className="text-xs text-muted-foreground">
          +{inquiries.length - 3} extra aanvragen in dit pakket
        </p>
      ) : null}
    </div>
  );
}

export function CertificationRequestCard({
  className,
  inquiries,
  lifecycleDateLabels,
  requestId,
  status,
  statusLabel,
  statusVariant = "outline",
  onOpen,
}: CertificationRequestCardProps) {
  const rejected = status === "rejected";
  const cancelled = status === "cancelled";
  const interactiveProps = onOpen
    ? {
        role: "button",
        tabIndex: 0,
        onClick: () => onOpen(requestId),
        onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen(requestId);
          }
        },
      }
    : {};

  return (
    <Card
      className={cn(
        "h-full overflow-visible p-4 transition-colors",
        rejected && "border-destructive/30 bg-destructive/5",
        onOpen &&
          "cursor-pointer hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      {...interactiveProps}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">{requestId}</span>
          <Badge variant={rejected || cancelled ? "destructive" : statusVariant}>
            {statusLabel}
          </Badge>
        </div>

        <div className="pt-region">
          <CertificationRequestLifecycleTimeline dateLabels={lifecycleDateLabels} status={status} />
        </div>

        <InquirySummary inquiries={inquiries} />
      </div>
    </Card>
  );
}
