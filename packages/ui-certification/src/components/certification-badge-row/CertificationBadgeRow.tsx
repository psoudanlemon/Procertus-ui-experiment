/**
 * **Props-only** certification / attestation chips. Parent normalizes domain data (e.g. CE,
 * BENOR, SSD, ATG, EPD) into these items — this component does not read the decision JSON.
 * Use `presentation: "chip"` for certifiable values, `muted` for low emphasis, and
 * `not-offered` for empty / not-by-us / “(x)” style lines (copy is still parent-driven).
 */
import type { ReactNode } from "react";

import { Badge, cn } from "@procertus-ui/ui";

export type CertificationBadgePresentation = "chip" | "muted" | "not-offered";

export type CertificationBadgeItem = {
  id: string;
  shortLabel: string;
  presentation: CertificationBadgePresentation;
  /**
   * Chip text or a legible “not available” / symbol explanation for `not-offered`.
   */
  text?: string;
  /** When `not-offered`, optional extra line (e.g. source cell explanation). */
  subline?: string;
};

export type CertificationBadgeRowProps = {
  className?: string;
  items: CertificationBadgeItem[];
  /** Renders when `items` is empty. */
  emptyMessage?: string;
  /** Start slot: e.g. a “Certification” label. */
  leading?: ReactNode;
};

export function CertificationBadgeRow({
  className,
  items,
  emptyMessage = "No certification information.",
  leading,
}: CertificationBadgeRowProps) {
  if (items.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)} role="status">
        {emptyMessage}
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col gap-component", className)}>
      {leading ? (
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {leading}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-micro">
        {items.map((it) => {
          const variant = it.presentation === "chip" ? "secondary" : "outline";
          return (
            <Badge
              key={it.id}
              variant={variant}
              className="max-w-full font-normal"
              data-presentation={it.presentation}
              title={it.subline}
            >
              <span className="font-medium">{it.shortLabel}</span>
              {it.text ? (
                <span
                  className={cn(
                    "ml-micro font-normal",
                    it.presentation === "not-offered"
                      ? "text-muted-foreground"
                      : "opacity-90",
                  )}
                >
                  : {it.text}
                </span>
              ) : null}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
