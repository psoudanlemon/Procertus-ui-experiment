/**
 * SLA countdown — minimal readout; parent supplies remaining copy (no timers in-ui).
 */
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";

export type SlaCountdownTone = "neutral" | "warning" | "critical";

export type SlaCountdownDisplayProps = {
  className?: string;
  /** e.g. "Time until SLA breach" */
  label: string;
  /** e.g. "2h 14m" — computed by parent */
  remainingLabel: string;
  tone?: SlaCountdownTone;
  /** Secondary line (e.g. absolute deadline) */
  caption?: string;
};

const toneClass: Record<SlaCountdownTone, string> = {
  neutral: "border-border bg-card text-card-foreground",
  warning: "border-amber-500/40 bg-amber-500/5 text-amber-950 dark:text-amber-100",
  critical: "border-destructive/50 bg-destructive/10 text-destructive",
};

export function SlaCountdownDisplay({
  className,
  label,
  remainingLabel,
  tone = "neutral",
  caption,
}: SlaCountdownDisplayProps) {
  return (
    <div
      className={cn(
        "inline-flex min-w-[12rem] max-w-md flex-col gap-1 rounded-lg border px-3 py-2 shadow-sm",
        toneClass[tone],
        className,
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Clock className="size-3.5 shrink-0" aria-hidden />
        <span>{label}</span>
      </div>
      <p className="text-lg font-semibold tabular-nums tracking-tight">{remainingLabel}</p>
      {caption ? <p className="text-xs text-muted-foreground">{caption}</p> : null}
    </div>
  );
}
