/**
 * Single event marker on a 0–100% horizontal axis — dot, diamond, or flag-style stem.
 * Parent should provide a positioned track; this component is a full-width overlay layer.
 */
import { cn } from "@/lib/utils";

import { clampPct } from "../percent";

export type TimelineEventMarkerVariant = "dot" | "diamond" | "flag";

export type TimelineEventMarkerProps = {
  className?: string;
  /** Position on the track, 0–100. */
  position: number;
  label?: string;
  variant?: TimelineEventMarkerVariant;
  emphasized?: boolean;
};

export function TimelineEventMarker({
  className,
  position,
  label,
  variant = "dot",
  emphasized = false,
}: TimelineEventMarkerProps) {
  const left = clampPct(position);

  const core = (
    <div
      className={cn(
        "shrink-0 rounded-full bg-primary shadow-sm ring-2 ring-background",
        variant === "dot" && "size-2.5",
        variant === "diamond" && "size-2.5 rotate-45 rounded-sm bg-chart-3 ring-chart-3/30",
        variant === "flag" && "size-2.5 rounded-sm",
        emphasized && "ring-primary ring-offset-2 ring-offset-background",
      )}
      aria-hidden
    />
  );

  return (
    <div
      className={cn("pointer-events-none relative h-8 w-full", className)}
      role="img"
      aria-label={label ?? `Event at ${left}%`}
    >
      <div
        className="absolute bottom-0 flex flex-col items-center gap-0.5"
        style={{ left: `${left}%`, transform: "translateX(-50%)" }}
      >
        {variant === "flag" ? (
          <div className="flex flex-col items-center">
            <div className="h-4 w-px bg-primary/80" />
            {core}
          </div>
        ) : (
          core
        )}
        {label ? (
          <span className="max-w-[8rem] truncate text-center text-[10px] font-medium text-foreground">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
