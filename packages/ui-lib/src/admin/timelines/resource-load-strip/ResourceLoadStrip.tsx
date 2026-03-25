/**
 * One row per resource: load segments on a 0–100% axis, colored by utilization level.
 */
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@procertus-ui/ui";

import { clampPct, segmentSpan } from "../percent";

export type ResourceLoadLevel = "low" | "medium" | "high" | "critical";

export type ResourceLoadSegment = {
  start: number;
  end: number;
  level: ResourceLoadLevel;
  label?: string;
};

export type ResourceLoadRow = {
  resourceLabel: string;
  segments: ResourceLoadSegment[];
};

const levelClass: Record<ResourceLoadLevel, string> = {
  low: "bg-chart-2",
  medium: "bg-chart-3",
  high: "bg-chart-4",
  critical: "bg-destructive",
};

export type ResourceLoadStripProps = {
  className?: string;
  title?: string;
  description?: string;
  rows: ResourceLoadRow[];
  rowTrackClassName?: string;
};

export function ResourceLoadStrip({
  className,
  title,
  description,
  rows,
  rowTrackClassName,
}: ResourceLoadStripProps) {
  const body = (
    <div className="space-y-4 px-6 pb-6">
      {rows.map((row, ri) => (
        <div
          key={`${row.resourceLabel}-${ri}`}
          className="grid grid-cols-[minmax(5.5rem,8rem)_1fr] items-center gap-3"
        >
          <span className="truncate text-sm text-muted-foreground">{row.resourceLabel}</span>
          <div
            className={cn(
              "relative h-2.5 w-full overflow-hidden rounded-full bg-muted",
              rowTrackClassName,
            )}
            role="presentation"
          >
            {row.segments.map((seg, si) => {
              const left = clampPct(seg.start);
              const width = segmentSpan(seg.start, seg.end);
              if (width <= 0) {
                return null;
              }
              return (
                <div
                  key={si}
                  className={cn(
                    "absolute top-0 h-full rounded-full opacity-90",
                    levelClass[seg.level],
                  )}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={seg.label}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  if (!title && !description) {
    return <div className={cn("w-full max-w-5xl", className)}>{body}</div>;
  }

  return (
    <Card className={cn("mx-auto w-full max-w-5xl overflow-hidden", className)}>
      <CardHeader>
        {title ? <CardTitle>{title}</CardTitle> : null}
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="px-0 pt-0">{body}</CardContent>
    </Card>
  );
}
