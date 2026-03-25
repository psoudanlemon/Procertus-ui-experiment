/**
 * Presentational release train card — one scheduled cut / deployment window on the roadmap.
 */
import { MoreHorizontal, TrainFront } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@procertus-ui/ui";

export type ReleaseTrainCardIntent = "default" | "emphasis" | "muted" | "danger";

export type ReleaseTrainCardStatus = {
  label: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
};

export type ReleaseTrainCardProps = {
  className?: string;
  intent?: ReleaseTrainCardIntent;
  selected?: boolean;
  /** Short code (e.g. R24.3). */
  trainCode: string;
  title: string;
  /** Window or milestone copy (e.g. Mar 3–14). */
  windowLabel?: string;
  phaseBadge?: string;
  status?: ReleaseTrainCardStatus;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onViewDetails?: () => void;
  onMoveWindow?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
};

const intentClass: Record<ReleaseTrainCardIntent, string> = {
  default: "border-border bg-card",
  emphasis: "border-primary/30 bg-card ring-2 ring-primary/15",
  muted: "border-transparent bg-muted/50 text-muted-foreground",
  danger: "border-destructive/35 bg-card",
};

export function ReleaseTrainCard({
  className,
  intent = "default",
  selected = false,
  trainCode,
  title,
  windowLabel,
  phaseBadge,
  status,
  menuOpen,
  onMenuOpenChange,
  onViewDetails,
  onMoveWindow,
  onDuplicate,
  onRemove,
}: ReleaseTrainCardProps) {
  return (
    <div
      data-selected={selected ? "" : undefined}
      className={cn(
        "flex w-full max-w-xl items-center gap-3 rounded-xl border p-3 text-card-foreground shadow-sm transition-colors",
        intentClass[intent],
        selected && "bg-accent/25",
        className,
      )}
    >
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
        aria-hidden
      >
        <TrainFront className="size-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-medium text-muted-foreground tabular-nums">
            {trainCode}
          </span>
          <p className="truncate font-medium">{title}</p>
          {phaseBadge ? <Badge variant="secondary">{phaseBadge}</Badge> : null}
          {status ? <Badge variant={status.variant ?? "outline"}>{status.label}</Badge> : null}
        </div>
        {windowLabel ? (
          <p className="truncate text-sm text-muted-foreground">{windowLabel}</p>
        ) : null}
      </div>
      <DropdownMenu open={menuOpen} onOpenChange={onMenuOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Release actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {onViewDetails ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onViewDetails();
              }}
            >
              View details
            </DropdownMenuItem>
          ) : null}
          {onMoveWindow ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onMoveWindow();
              }}
            >
              Move window
            </DropdownMenuItem>
          ) : null}
          {onDuplicate ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onDuplicate();
              }}
            >
              Duplicate
            </DropdownMenuItem>
          ) : null}
          {onRemove ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  onRemove();
                }}
              >
                Remove from roadmap
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
