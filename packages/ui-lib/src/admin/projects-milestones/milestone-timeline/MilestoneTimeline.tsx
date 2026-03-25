/**
 * Presentational MilestoneTimeline — horizontal segment rail (composed, not a Gantt).
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@procertus-ui/ui";

import { MilestoneNode } from "../milestone-node/MilestoneNode";
import type { MilestoneTimelineSegment } from "../types";

export type MilestoneTimelineProps = {
  className?: string;
  title?: string;
  description?: string;
  /** Ordered left-to-right milestone segments; parents own sorting/filtering. */
  segments: MilestoneTimelineSegment[];
  /** Optional actions (e.g. “Add milestone”) rendered in the header row. */
  actions?: ReactNode;
};

export function MilestoneTimeline({
  className,
  title,
  description,
  segments,
  actions,
}: MilestoneTimelineProps) {
  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      {(title ?? description ?? actions) ? (
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            {title ? <CardTitle className="text-lg">{title}</CardTitle> : null}
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn("pb-6", (title ?? description ?? actions) && "pt-0")}>
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5">
          <div className="flex min-w-min items-start px-1">
            {segments.map((seg, index) => (
              <div key={seg.id} className="flex items-start">
                <MilestoneNode
                  title={seg.title}
                  caption={seg.caption}
                  status={seg.status}
                  deadlineLabel={seg.deadlineLabel}
                  deadlineTone={seg.deadlineTone}
                />
                {index < segments.length - 1 ? (
                  <div
                    className="mx-2 mt-[1.125rem] hidden h-0.5 min-w-[2rem] flex-1 bg-border sm:block"
                    aria-hidden
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
