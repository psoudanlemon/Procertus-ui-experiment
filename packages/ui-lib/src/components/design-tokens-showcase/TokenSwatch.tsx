import { cn } from "@/lib/utils";

export type TokenSwatchProps = {
  /** Human-readable token / utility name */
  label: string;
  /** Tailwind classes applied to the color tile (e.g. `bg-primary text-primary-foreground`) */
  swatchClassName: string;
  /** Optional helper under the label */
  hint?: string;
  className?: string;
};

/**
 * Single semantic color tile + label — for design-token galleries.
 */
export function TokenSwatch({ label, swatchClassName, hint, className }: TokenSwatchProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className={cn(
          "flex min-h-16 items-end justify-end rounded-lg border border-border p-3 text-xs font-medium shadow-[var(--shadow-proc-xs)]",
          swatchClassName,
        )}
      >
        <span className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] text-foreground tabular-nums ring-1 ring-border">
          Aa
        </span>
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-foreground">{label}</p>
        {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}
