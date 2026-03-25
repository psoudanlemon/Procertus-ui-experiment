/**
 * Presentational KanbanColumnHeader — compact title row for a lane.
 *
 * Use `trailing` for `KanbanWipLimitBadge` or other inline controls.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type KanbanColumnHeaderProps = {
  className?: string;
  title: string;
  /** Shown as muted subtext (e.g. card count). */
  subtitle?: string;
  trailing?: ReactNode;
};

export function KanbanColumnHeader({
  className,
  title,
  subtitle,
  trailing,
}: KanbanColumnHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-2", className)}>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold tracking-tight">{title}</h3>
        {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      {trailing ? <div className="flex shrink-0 items-center">{trailing}</div> : null}
    </div>
  );
}
