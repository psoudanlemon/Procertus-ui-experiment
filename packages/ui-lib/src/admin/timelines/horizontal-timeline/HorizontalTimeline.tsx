/**
 * Horizontal timeline track: colored segments on a 0–100% axis (no date parsing).
 * Card shell matches the data-panel template — title, optional description, track + tick labels.
 */
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@procertus-ui/ui";

import { clampPct, segmentSpan } from "../percent";

export type HorizontalTimelineSegment = {
  start: number;
  end: number;
  intent?: "default" | "primary" | "success" | "warning" | "muted";
  label?: string;
};

export type HorizontalTimelineTick = {
  at: number;
  label: string;
};

const segmentIntentClass: Record<NonNullable<HorizontalTimelineSegment["intent"]>, string> = {
  default: "bg-primary/55",
  primary: "bg-primary",
  success: "bg-chart-2",
  warning: "bg-chart-4",
  muted: "bg-muted-foreground/30",
};

export type HorizontalTimelineProps = {
  className?: string;
  title?: string;
  description?: string;
  segments: HorizontalTimelineSegment[];
  ticks?: HorizontalTimelineTick[];
  trackClassName?: string;
};

export function HorizontalTimeline({
  className,
  title,
  description,
  segments,
  ticks,
  trackClassName,
}: HorizontalTimelineProps) {
  const body = (
    <div className="space-y-3 px-6 pb-6">
      <div
        className={cn("relative h-3 w-full overflow-hidden rounded-full bg-muted", trackClassName)}
        role="presentation"
      >
        {segments.map((seg, i) => {
          const left = clampPct(seg.start);
          const width = segmentSpan(seg.start, seg.end);
          if (width <= 0) {
            return null;
          }
          const intent = seg.intent ?? "default";
          return (
            <div
              key={i}
              className={cn("absolute top-0 h-full rounded-sm", segmentIntentClass[intent])}
              style={{ left: `${left}%`, width: `${width}%` }}
              title={seg.label}
            />
          );
        })}
      </div>
      {ticks?.length ? (
        <div className="relative h-5 w-full text-xs text-muted-foreground">
          {ticks.map((t, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${clampPct(t.at)}%` }}
            >
              {t.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );

  if (!title && !description) {
    return <div className={cn("w-full max-w-5xl", className)}>{body}</div>;
  }

  return (
    <Card className={cn("mx-auto w-full max-w-5xl overflow-hidden", className)}>
      {title || description ? (
        <CardHeader>
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
      ) : null}
      <CardContent className="px-0 pt-0">{body}</CardContent>
    </Card>
  );
}
