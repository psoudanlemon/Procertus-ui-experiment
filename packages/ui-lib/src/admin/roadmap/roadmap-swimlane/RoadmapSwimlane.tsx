/**
 * Presentational roadmap swimlane — groups release work in a labeled column/section.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@procertus-ui/ui";

export type RoadmapSwimlaneAccent = "default" | "primary" | "muted";

export type RoadmapSwimlaneProps = {
  className?: string;
  /** Lane title (e.g. product area or team). */
  laneLabel: string;
  /** Optional supporting line (capacity, theme). */
  laneMeta?: string;
  /** Short tag (e.g. train count). */
  badge?: string;
  accent?: RoadmapSwimlaneAccent;
  children?: ReactNode;
};

const accentBar: Record<RoadmapSwimlaneAccent, string> = {
  default: "bg-border",
  primary: "bg-primary",
  muted: "bg-muted-foreground/40",
};

export function RoadmapSwimlane({
  className,
  laneLabel,
  laneMeta,
  badge,
  accent = "default",
  children,
}: RoadmapSwimlaneProps) {
  return (
    <section
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
        className,
      )}
      aria-label={laneLabel}
    >
      <header className="flex items-stretch gap-0 border-b bg-muted/20">
        <span className={cn("w-1 shrink-0 self-stretch", accentBar[accent])} aria-hidden />
        <div className="min-w-0 flex-1 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold leading-tight tracking-tight">{laneLabel}</h3>
            {badge ? (
              <Badge variant="secondary" className="font-normal">
                {badge}
              </Badge>
            ) : null}
          </div>
          {laneMeta ? <p className="mt-1 text-sm text-muted-foreground">{laneMeta}</p> : null}
        </div>
      </header>
      <div className="flex min-h-[4.5rem] flex-col gap-3 p-4">{children}</div>
    </section>
  );
}
