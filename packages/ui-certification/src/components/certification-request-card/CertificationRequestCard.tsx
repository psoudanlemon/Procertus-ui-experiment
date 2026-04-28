import type { KeyboardEvent } from "react";
import { Badge, Card, Separator, cn } from "@procertus-ui/ui";

export type CertificationRequestCardProps = {
  approvalStatusLabel: string;
  className?: string;
  productLabel: string;
  requestId: string;
  statusLabel: string;
  statusVariant?: "outline" | "secondary";
  subtitle: string;
  title: string;
  typeLabel: string;
  valueLabel?: string;
  onOpen?: (requestId: string) => void;
};

export function CertificationRequestCard({
  approvalStatusLabel,
  className,
  productLabel,
  requestId,
  statusLabel,
  statusVariant = "outline",
  subtitle,
  title,
  typeLabel,
  valueLabel,
  onOpen,
}: CertificationRequestCardProps) {
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
        "h-full p-4 transition-colors",
        onOpen && "cursor-pointer hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      {...interactiveProps}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>

        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between gap-2">
            <span>Goedkeuring</span>
            <span className="text-right font-medium text-foreground">{approvalStatusLabel}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>Type</span>
            <span className="text-right font-medium text-foreground">{typeLabel}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>Product</span>
            <span className="text-right font-medium text-foreground">{productLabel}</span>
          </div>
        </div>

        <Separator />

        <div className="mt-auto flex flex-wrap items-center gap-2">
          {valueLabel ? <Badge variant="outline">{valueLabel}</Badge> : null}
          <span className="font-mono text-xs text-muted-foreground">{requestId}</span>
        </div>
      </div>
    </Card>
  );
}
