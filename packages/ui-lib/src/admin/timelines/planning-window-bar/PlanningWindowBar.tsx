/**
 * Planning windows as semi-transparent bands with dashed borders on a 0–100% axis.
 * Optional background segments (e.g. blackout) render under allowed windows.
 */
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@procertus-ui/ui";

import { clampPct, segmentSpan } from "../percent";

export type PlanningWindowSegment = {
  start: number;
  end: number;
  label?: string;
  intent?: "default" | "primary" | "success";
};

const backgroundIntentClass: Record<NonNullable<PlanningWindowSegment["intent"]>, string> = {
  default: "bg-muted-foreground/15",
  primary: "bg-destructive/20",
  success: "bg-chart-2/25",
};

const windowIntentClass: Record<NonNullable<PlanningWindowSegment["intent"]>, string> = {
  default: "border-primary/40 bg-primary/10",
  primary: "border-primary bg-primary/15",
  success: "border-chart-2 bg-chart-2/15",
};

export type PlanningWindowBarProps = {
  className?: string;
  title?: string;
  description?: string;
  windows: PlanningWindowSegment[];
  backgroundSegments?: PlanningWindowSegment[];
  trackClassName?: string;
};

export function PlanningWindowBar({
  className,
  title,
  description,
  windows,
  backgroundSegments,
  trackClassName,
}: PlanningWindowBarProps) {
  const track = (
    <div
      className={cn(
        "relative h-10 w-full overflow-hidden rounded-lg border border-border bg-muted/40",
        trackClassName,
      )}
      role="presentation"
    >
      {backgroundSegments?.map((seg, i) => {
        const left = clampPct(seg.start);
        const width = segmentSpan(seg.start, seg.end);
        if (width <= 0) {
          return null;
        }
        const intent = seg.intent ?? "default";
        return (
          <div
            key={`bg-${i}`}
            className={cn("absolute top-1 bottom-1 rounded-md", backgroundIntentClass[intent])}
            style={{ left: `${left}%`, width: `${width}%` }}
            title={seg.label}
          />
        );
      })}
      {windows.map((win, i) => {
        const left = clampPct(win.start);
        const width = segmentSpan(win.start, win.end);
        if (width <= 0) {
          return null;
        }
        const intent = win.intent ?? "default";
        return (
          <div
            key={`win-${i}`}
            className={cn(
              "absolute top-1 bottom-1 rounded-md border-2 border-dashed",
              windowIntentClass[intent],
            )}
            style={{ left: `${left}%`, width: `${width}%` }}
            title={win.label}
          />
        );
      })}
    </div>
  );

  const inner = <div className="space-y-2 px-6 pb-6">{track}</div>;

  if (!title && !description) {
    return <div className={cn("w-full max-w-5xl", className)}>{inner}</div>;
  }

  return (
    <Card className={cn("mx-auto w-full max-w-5xl overflow-hidden", className)}>
      <CardHeader>
        {title ? <CardTitle>{title}</CardTitle> : null}
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="px-0 pt-0">{inner}</CardContent>
    </Card>
  );
}
