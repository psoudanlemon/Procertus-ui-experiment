/**
 * Compact legend: swatch + label rows from props (minimal presentation).
 */
import { cn } from "@/lib/utils";

export type TimelineLegendItem = {
  id?: string;
  label: string;
  /** Tailwind class for the color chip, e.g. `bg-primary` or `bg-chart-2`. */
  swatchClassName: string;
};

export type TimelineLegendProps = {
  className?: string;
  items: TimelineLegendItem[];
  orientation?: "horizontal" | "vertical";
  legendTitle?: string;
};

export function TimelineLegend({
  className,
  items,
  orientation = "horizontal",
  legendTitle,
}: TimelineLegendProps) {
  return (
    <div
      className={cn(
        "text-sm",
        orientation === "horizontal" && "flex flex-wrap items-center gap-x-4 gap-y-2",
        orientation === "vertical" && "flex flex-col gap-2",
        className,
      )}
      role="list"
    >
      {legendTitle ? (
        <p className="w-full text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {legendTitle}
        </p>
      ) : null}
      {items.map((item, i) => (
        <div
          key={item.id ?? `${item.label}-${i}`}
          className="flex items-center gap-2"
          role="listitem"
        >
          <span
            className={cn(
              "size-2.5 shrink-0 rounded-sm border border-border/60",
              item.swatchClassName,
            )}
            aria-hidden
          />
          <span className="text-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
