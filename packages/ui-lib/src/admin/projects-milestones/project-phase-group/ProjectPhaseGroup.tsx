/**
 * Presentational ProjectPhaseGroup — groups milestones under a phase (section).
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@procertus-ui/ui";

export type ProjectPhaseGroupProps = {
  className?: string;
  /** Small kicker, e.g. "Phase 2". */
  label?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function ProjectPhaseGroup({
  className,
  label,
  title,
  description,
  children,
}: ProjectPhaseGroupProps) {
  return (
    <Card
      className={cn(
        "w-full overflow-hidden border-l-4 border-l-primary/40 pl-1 shadow-none",
        className,
      )}
    >
      <CardHeader className="gap-1 pb-2">
        {label ? (
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
        ) : null}
        <CardTitle className="text-xl">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      {children ? <CardContent className="pt-0">{children}</CardContent> : null}
    </Card>
  );
}
