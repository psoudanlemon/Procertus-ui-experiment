import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type PrototypeSurfaceMarqueeProps = {
  className?: string;
};

/**
 * Composed strip showcasing **surface gradients** and **radius** tokens from the default theme.
 */
export function PrototypeSurfaceMarquee({ className }: PrototypeSurfaceMarqueeProps) {
  return (
    <div
      className={cn(
        "grid gap-component rounded-2xl border border-border bg-card p-section shadow-[var(--shadow-proc-sm)] sm:grid-cols-3",
        className,
      )}
    >
      {(
        [
          { label: "Primary wash", style: { background: "var(--gradient-primary)" } },
          { label: "Accent wash", style: { background: "var(--gradient-accent)" } },
          { label: "Blend", style: { background: "var(--gradient-blend)" } },
        ] as const
      ).map((tile) => (
        <div
          key={tile.label}
          className="relative flex min-h-[5.5rem] flex-col justify-between overflow-hidden rounded-xl border border-border/60 p-component"
          style={tile.style}
        >
          <Badge variant="secondary" className="w-fit bg-background/70 text-foreground backdrop-blur-sm">
            {tile.label}
          </Badge>
          <p className="text-[11px] font-medium text-foreground/80 drop-shadow-sm">CSS var surface</p>
        </div>
      ))}
    </div>
  );
}
