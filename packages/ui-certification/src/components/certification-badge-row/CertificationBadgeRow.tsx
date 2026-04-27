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
          if (it.presentation === "not-offered" || it.presentation === "muted") {
            return (
              <div
                key={it.id}
                className="inline-flex min-w-0 max-w-full flex-col gap-micro rounded-md border px-component py-micro text-left text-xs leading-snug"
                data-presentation={it.presentation}
              >
                <span className="font-medium text-foreground">{it.shortLabel}</span>
                {it.text ? (
                  <span
                    className={
                      it.presentation === "not-offered"
                        ? "text-muted-foreground"
                        : "text-muted-foreground/90"
                    }
                  >
                    {it.text}
                  </span>
                ) : null}
                {it.subline ? (
                  <span className="text-[11px] text-muted-foreground">{it.subline}</span>
                ) : null}
              </div>
            );
          }
          return (
            <Badge
              key={it.id}
              variant="secondary"
              className="max-w-full font-normal"
              title={it.subline}
            >
              <span className="font-medium">{it.shortLabel}</span>
              {it.text ? <span className="ml-micro font-normal opacity-90">: {it.text}</span> : null}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
