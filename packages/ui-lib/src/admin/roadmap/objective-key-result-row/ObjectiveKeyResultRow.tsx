/**
 * Presentational OKR row — one key result with progress and status (no data fetching).
 */
import { MoreHorizontal } from "lucide-react";

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

export type ObjectiveKeyResultRowIntent = "default" | "emphasis" | "muted" | "danger";

export type ObjectiveKeyResultRowStatus = {
  label: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
};

export type ObjectiveKeyResultRowProps = {
  className?: string;
  intent?: ObjectiveKeyResultRowIntent;
  selected?: boolean;
  /** Identifier (e.g. KR 2.1). */
  keyResultId: string;
  title: string;
  /** 0–100; clamped for display. */
  progressPercent: number;
  status?: ObjectiveKeyResultRowStatus;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onAddCheckIn?: () => void;
  onArchive?: () => void;
};

const intentClass: Record<ObjectiveKeyResultRowIntent, string> = {
  default: "border-border bg-card",
  emphasis: "border-primary/30 bg-card ring-2 ring-primary/15",
  muted: "border-transparent bg-muted/50 text-muted-foreground",
  danger: "border-destructive/35 bg-card",
};

function clampPercent(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

export function ObjectiveKeyResultRow({
  className,
  intent = "default",
  selected = false,
  keyResultId,
  title,
  progressPercent,
  status,
  menuOpen,
  onMenuOpenChange,
  onEdit,
  onAddCheckIn,
  onArchive,
}: ObjectiveKeyResultRowProps) {
  const pct = clampPercent(progressPercent);

  return (
    <div
      data-selected={selected ? "" : undefined}
      className={cn(
        "flex w-full max-w-xl items-start gap-3 rounded-xl border p-3 text-card-foreground shadow-sm transition-colors",
        intentClass[intent],
        selected && "bg-accent/25",
        className,
      )}
    >
      <span className="mt-0.5 w-14 shrink-0 font-mono text-xs font-medium text-muted-foreground tabular-nums">
        {keyResultId}
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2 gap-y-1">
          <p className="min-w-0 flex-1 font-medium leading-snug">{title}</p>
          {status ? (
            <Badge variant={status.variant ?? "outline"} className="shrink-0">
              {status.label}
            </Badge>
          ) : null}
        </div>
        <div className="space-y-1">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground tabular-nums">{pct}% complete</p>
        </div>
      </div>
      <DropdownMenu open={menuOpen} onOpenChange={onMenuOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Key result actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {onEdit ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onEdit();
              }}
            >
              Edit
            </DropdownMenuItem>
          ) : null}
          {onAddCheckIn ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onAddCheckIn();
              }}
            >
              Add check-in
            </DropdownMenuItem>
          ) : null}
          {onArchive ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  onArchive();
                }}
              >
                Archive
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
