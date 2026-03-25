/**
 * Presentational KanbanWipLimitBadge — lane WIP readout (minimal).
 *
 * When `limit` is set and `current` exceeds it, the badge uses the destructive tone.
 */
import { cn } from "@/lib/utils";
import { Badge } from "@procertus-ui/ui";

export type KanbanWipLimitBadgeProps = {
  className?: string;
  current: number;
  /** Omit for “no cap” — only `current` is shown. */
  limit?: number;
};

export function KanbanWipLimitBadge({ className, current, limit }: KanbanWipLimitBadgeProps) {
  const over = limit !== undefined && current > limit;
  const label = limit === undefined ? String(current) : `${current} / ${limit}`;

  return (
    <Badge
      variant={over ? "destructive" : "secondary"}
      className={cn("tabular-nums", className)}
      aria-label={
        limit === undefined
          ? `${current} items in column`
          : over
            ? `Work in progress ${current} of ${limit}, over limit`
            : `Work in progress ${current} of ${limit}`
      }
    >
      {label}
    </Badge>
  );
}
