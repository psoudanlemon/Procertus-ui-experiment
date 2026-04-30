import type { KeyboardEvent } from "react";
import {
  Badge,
  Card,
  cn,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@procertus-ui/ui";

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
      <ItemGroup className="w-full gap-2">
        {inquiries.slice(0, 3).map((inquiry) => (
          <Item
            key={inquiry.id}
            role="listitem"
            variant="outline"
            size="sm"
            className="min-w-0 border-border/70 bg-muted/25 shadow-proc-xs"
          >
            <ItemContent>
              <ItemTitle className="line-clamp-2 font-semibold">{inquiry.label}</ItemTitle>
              <ItemDescription className="line-clamp-2 text-xs">
                {inquiry.productLabel ?? "Niet-productgebonden"}
              </ItemDescription>
            </ItemContent>
            <ItemActions className="shrink-0 flex-wrap justify-end gap-1">
              {inquiry.shortLabel ? <Badge variant="outline">{inquiry.shortLabel}</Badge> : null}
              {inquiry.value ? <Badge variant="outline">{inquiry.value}</Badge> : null}
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
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
        "h-full overflow-visible p-4 transition-[box-shadow,background-color,border-color]",
        rejected && "border-destructive/30 bg-card",
        onOpen &&
          "cursor-pointer hover:ring-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50",
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
