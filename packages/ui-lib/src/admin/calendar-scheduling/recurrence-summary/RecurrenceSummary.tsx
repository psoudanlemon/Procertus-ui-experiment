/**
 * Compact read-only summary of a recurrence rule (copy supplied by parent).
 */
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@procertus-ui/ui";

export type RecurrenceSummaryProps = {
  className?: string;
  /** Short heading (e.g. “Repeats”). */
  title: string;
  /** Primary human-readable line (e.g. “Every weekday”). */
  summary: string;
  /** Optional second line (e.g. “Until Dec 31, 2026”). */
  detail?: string;
  /** e.g. keyboard-selected — purely visual */
  emphasized?: boolean;
};

export function RecurrenceSummary({
  className,
  title,
  summary,
  detail,
  emphasized = false,
}: RecurrenceSummaryProps) {
  return (
    <Card
      className={cn(
        "mx-auto w-full max-w-md transition-shadow",
        emphasized && "ring-2 ring-ring ring-offset-2 ring-offset-background",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-sm font-medium text-foreground">{summary}</CardDescription>
      </CardHeader>
      {detail ? (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">{detail}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}
