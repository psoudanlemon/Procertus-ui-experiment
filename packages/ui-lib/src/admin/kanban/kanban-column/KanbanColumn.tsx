/**
 * Presentational KanbanColumn — fixed-width lane with sticky header and scrollable body.
 *
 * Pass a column header (e.g. `KanbanColumnHeader` + `KanbanWipLimitBadge`) as `header`
 * and stack `KanbanCard` (or custom nodes) in `children`.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type KanbanColumnProps = {
  className?: string;
  /** Sticky top region — title row, WIP badge, etc. */
  header: ReactNode;
  /** Scrollable card stack */
  children: ReactNode;
  /** Visual hint when this column is part of an active drag (parent-controlled). */
  isDragging?: boolean;
};

export function KanbanColumn({
  className,
  header,
  children,
  isDragging = false,
}: KanbanColumnProps) {
  return (
    <div
      className={cn(
        "flex w-72 min-w-72 shrink-0 flex-col rounded-xl border border-border/80 bg-muted/25 shadow-sm",
        isDragging && "bg-muted/40 ring-2 ring-primary/35",
        className,
      )}
    >
      <div className="shrink-0 border-b border-border/60 bg-card/80 px-3 py-2 backdrop-blur-sm">
        {header}
      </div>
      <div className="flex min-h-[10rem] flex-1 flex-col gap-2 overflow-y-auto p-2">{children}</div>
    </div>
  );
}
