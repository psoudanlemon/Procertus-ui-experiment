import { cn } from "@procertus-ui/ui";

/** Styling for person-capture sections (indiener / wettelijke vertegenwoordiger). */
export type PersonFormCardVariant = "chromeless" | "default" | "emphasized";

const FRAMED_BASE = "space-y-4 rounded-lg p-4";

/**
 * - `chromeless`: no border, padding, or background — only vertical spacing between header and
 *   fields. Default for the wettelijke vertegenwoordiger block.
 * - `default`: light framed panel (border + neutral background).
 * - `emphasized`: muted surface + standard border — use for the indiener card when someone other
 *   than the legal representative completes the request (two person blocks on screen).
 */
export function personFormCardClassName(variant: PersonFormCardVariant): string {
  if (variant === "chromeless") {
    return "space-y-4";
  }
  return cn(
    FRAMED_BASE,
    variant === "emphasized"
      ? "border border-border bg-muted/15 shadow-sm"
      : "border border-border/60 bg-background",
  );
}
