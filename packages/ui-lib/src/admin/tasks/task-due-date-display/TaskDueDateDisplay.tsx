/**
 * Presentational due date line for tasks — UI only (minimal template).
 * Compact row with calendar affordance; tone reflects urgency (no data fetching).
 */
import { CalendarClock } from "lucide-react";

import { cn } from "@/lib/utils";

export type TaskDueDateTone = "default" | "soon" | "overdue" | "none";

const toneClass: Record<TaskDueDateTone, string> = {
  default: "text-muted-foreground",
  soon: "text-amber-700 dark:text-amber-400",
  overdue: "text-destructive",
  none: "text-muted-foreground",
};

export type TaskDueDateDisplayProps = {
  className?: string;
  /** Absolute date, e.g. "Mar 25, 2026" */
  primaryLabel?: string;
  /** Relative or secondary line, e.g. "Due tomorrow" */
  secondaryLabel?: string;
  tone?: TaskDueDateTone;
};

export function TaskDueDateDisplay({
  className,
  primaryLabel,
  secondaryLabel,
  tone = "default",
}: TaskDueDateDisplayProps) {
  const empty = !primaryLabel?.trim() && !secondaryLabel?.trim();

  return (
    <div
      className={cn(
        "inline-flex max-w-full items-start gap-2 text-sm",
        toneClass[empty ? "none" : tone],
        className,
      )}
    >
      <CalendarClock className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0">
        {empty ? (
          <span className="text-muted-foreground">No due date</span>
        ) : (
          <>
            {primaryLabel ? (
              <p className="truncate font-medium text-foreground">{primaryLabel}</p>
            ) : null}
            {secondaryLabel ? (
              <p className={cn("truncate", primaryLabel ? "text-xs opacity-90" : "font-medium")}>
                {secondaryLabel}
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
