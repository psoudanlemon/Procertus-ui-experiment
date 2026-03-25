/**
 * Presentational DeadlinePill — compact due-date chip (minimal).
 */
import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@procertus-ui/ui";

const toneToVariant = {
  default: "secondary" as const,
  muted: "outline" as const,
  warning: "outline" as const,
  critical: "destructive" as const,
};

export type DeadlinePillProps = {
  className?: string;
  /** e.g. "Due Mar 28" or "5 days left" */
  label: string;
  tone?: keyof typeof toneToVariant;
};

export function DeadlinePill({ className, label, tone = "default" }: DeadlinePillProps) {
  const variant = toneToVariant[tone];
  return (
    <Badge
      variant={variant}
      className={cn(
        "gap-1 font-normal tabular-nums",
        tone === "warning" && "border-amber-500/50 text-amber-900 dark:text-amber-100",
        className,
      )}
    >
      <CalendarDays className="size-3 shrink-0 opacity-70" aria-hidden />
      {label}
    </Badge>
  );
}
