/**
 * Presentational MilestoneNode — single step on a horizontal milestone rail (minimal).
 */
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import type { MilestoneTimelineSegmentStatus } from "../types";
import { DeadlinePill } from "../deadline-pill/DeadlinePill";

export type MilestoneNodeProps = {
  className?: string;
  title: string;
  caption?: string;
  status: MilestoneTimelineSegmentStatus;
  deadlineLabel?: string;
  deadlineTone?: "default" | "muted" | "warning" | "critical";
};

function statusDotClass(status: MilestoneTimelineSegmentStatus): string {
  switch (status) {
    case "complete":
      return "border-primary bg-primary text-primary-foreground";
    case "current":
      return "border-primary bg-background ring-2 ring-primary ring-offset-2 ring-offset-background";
    case "at-risk":
      return "border-destructive bg-destructive/15 text-destructive";
    default:
      return "border-muted-foreground/30 bg-muted text-muted-foreground";
  }
}

export function MilestoneNode({
  className,
  title,
  caption,
  status,
  deadlineLabel,
  deadlineTone,
}: MilestoneNodeProps) {
  return (
    <div
      className={cn(
        "flex min-w-[7.5rem] max-w-[10rem] flex-col items-center gap-2 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
          statusDotClass(status),
        )}
        aria-hidden
      >
        {status === "complete" ? <Check className="size-4" strokeWidth={2.5} aria-hidden /> : null}
      </div>
      <div className="space-y-1">
        <p className="text-sm leading-tight font-medium text-foreground">{title}</p>
        {caption ? <p className="text-xs text-muted-foreground">{caption}</p> : null}
        {deadlineLabel ? (
          <DeadlinePill label={deadlineLabel} tone={deadlineTone} className="mx-auto" />
        ) : null}
      </div>
    </div>
  );
}
