/**
 * Presentational ProjectStatsRow — compact KPI strip for a project (data-panel).
 */
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@procertus-ui/ui";

export type ProjectStatItem = {
  id: string;
  label: string;
  value: string;
  hint?: string;
};

export type ProjectStatsRowProps = {
  className?: string;
  title?: string;
  description?: string;
  stats: ProjectStatItem[];
};

export function ProjectStatsRow({ className, title, description, stats }: ProjectStatsRowProps) {
  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      {(title ?? description) ? (
        <CardHeader className="pb-2">
          {title ? <CardTitle className="text-lg">{title}</CardTitle> : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn((title ?? description) && "pt-0")}>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.id} className="rounded-lg border border-border/80 bg-muted/20 px-3 py-2.5">
              <dt className="text-xs font-medium text-muted-foreground">{s.label}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight">
                {s.value}
              </dd>
              {s.hint ? <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p> : null}
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
