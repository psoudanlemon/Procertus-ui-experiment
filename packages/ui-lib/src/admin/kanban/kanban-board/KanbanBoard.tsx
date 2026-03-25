/**
 * Presentational KanbanBoard — horizontal lane container for columns.
 *
 * v1 is **layout only**: no drag-and-drop library. Use `isDragging` from the parent
 * when you wire real DnD later to show a subtle board-level affordance.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type KanbanBoardProps = {
  className?: string;
  children: ReactNode;
  title?: string;
  description?: string;
  /** Visual hint while a drag is in progress (parent-controlled). */
  isDragging?: boolean;
};

export function KanbanBoard({
  className,
  children,
  title,
  description,
  isDragging = false,
}: KanbanBoardProps) {
  return (
    <section className={cn("w-full", className)} aria-label={title ?? "Kanban board"}>
      {title || description ? (
        <header className="mb-4 space-y-1">
          {title ? <h2 className="text-lg font-semibold tracking-tight">{title}</h2> : null}
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </header>
      ) : null}
      <div
        className={cn(
          "flex min-h-[min(70vh,32rem)] gap-4 overflow-x-auto pb-2 [scrollbar-gutter:stable]",
          isDragging && "rounded-xl bg-muted/20 ring-2 ring-dashed ring-primary/25",
        )}
      >
        {children}
      </div>
    </section>
  );
}
