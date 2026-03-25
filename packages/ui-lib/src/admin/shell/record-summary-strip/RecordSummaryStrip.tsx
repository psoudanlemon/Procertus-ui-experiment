/**
 * Presentational RecordSummaryStrip — key fields for the current record in a compact **Card** (data-panel template).
 *
 * Optional **Button** actions on the right; no data fetching.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@procertus-ui/ui";

export type RecordSummaryItem = {
  label: string;
  value: ReactNode;
};

export type RecordSummaryStripProps = {
  className?: string;
  items: RecordSummaryItem[];
  actions?: ReactNode;
};

export function RecordSummaryStrip({ className, items, actions }: RecordSummaryStripProps) {
  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardContent className="flex flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <dl className="grid min-w-0 flex-1 grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:flex lg:flex-row lg:flex-wrap lg:items-start lg:gap-x-8">
          {items.map((item, i) => (
            <div key={i} className="min-w-0 space-y-0.5">
              <dt className="text-xs font-medium text-muted-foreground">{item.label}</dt>
              <dd className="text-sm font-medium wrap-break-word text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-t pt-3 sm:border-t-0 sm:pt-0">
            {actions}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
