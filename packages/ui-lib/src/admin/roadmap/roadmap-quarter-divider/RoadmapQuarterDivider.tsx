/**
 * Minimal quarter divider for timeline / roadmap views.
 */
import { cn } from "@/lib/utils";
import { Separator } from "@procertus-ui/ui";

export type RoadmapQuarterDividerProps = {
  className?: string;
  /** e.g. Q1 2026 */
  quarterLabel: string;
  /** Optional secondary line (fiscal note, theme). */
  hint?: string;
};

export function RoadmapQuarterDivider({
  className,
  quarterLabel,
  hint,
}: RoadmapQuarterDividerProps) {
  return (
    <div
      className={cn("flex w-full items-center gap-3 py-2", className)}
      role="separator"
      aria-label={hint ? `${quarterLabel}. ${hint}` : quarterLabel}
    >
      <Separator className="shrink-[2] flex-1" />
      <div className="max-w-[min(100%,24rem)] shrink-0 text-center">
        <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {quarterLabel}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-xs text-muted-foreground/90">{hint}</span>
        ) : null}
      </div>
      <Separator className="shrink-[2] flex-1" />
    </div>
  );
}
