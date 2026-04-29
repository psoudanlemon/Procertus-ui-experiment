import * as React from "react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@procertus-ui/ui";

import { cn } from "../lib/utils";

export type PrototypeCardProps = {
  children: React.ReactNode;
  /** Optional heading inside the prototype chrome. */
  title?: React.ReactNode;
  /** Optional supporting copy below the title (muted body style). */
  description?: React.ReactNode;
  /** Optional fine print below the description (smaller, muted — e.g. prototype hints). */
  notice?: React.ReactNode;
  /** When false, hides the corner “Demo” badge. @default true */
  showDemoBadge?: boolean;
  /** Label text for the demo badge. @default "Demo" */
  demoBadgeLabel?: React.ReactNode;
  /** Accessible longer description for the badge (`title` attribute). */
  demoBadgeTitle?: string;
  className?: string;
  /** Applied to the inner content region that wraps optional header + `children`. */
  cardContentClassName?: string;
};

/**
 * Framed region for prototype-only UI: dotted border, muted wash, optional “Demo” badge,
 * and optional title / description / notice blocks above variable `children`.
 */
export function PrototypeCard({
  children,
  title,
  description,
  notice,
  showDemoBadge = true,
  demoBadgeLabel = "Demo",
  demoBadgeTitle = "Alleen in deze prototype-build: kies een demo-gebruiker.",
  className,
  cardContentClassName,
}: PrototypeCardProps) {
  const hasHeader = Boolean(title ?? description ?? notice);

  return (
    <Card
      className={cn(
        "relative gap-0 border-2 border-dashed border-prototype shadow-none ring-0",
        /* Tinted surface from semantic tokens so light/dark both read as a subtle prototype wash */
        "bg-[color-mix(in_oklch,var(--prototype)_14%,var(--card))]",
        /* In dark, --prototype is very dark; use foreground hue for a visible dashed frame */
        "dark:border-prototype-foreground/40",
        className,
      )}
    >
      {showDemoBadge ? (
        <Badge
          variant="outline"
          title={demoBadgeTitle}
          className="absolute top-3 right-3 z-10 border-transparent bg-prototype text-prototype-foreground hover:bg-prototype"
        >
          {demoBadgeLabel}
        </Badge>
      ) : null}

      {hasHeader ? (
        <CardHeader className="gap-1 px-section pb-0 pt-section">
          {title ? <CardTitle className="text-prototype-foreground">{title}</CardTitle> : null}
          {description ? (
            <CardDescription className="leading-6">{description}</CardDescription>
          ) : null}
          {notice ? (
            <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{notice}</div>
          ) : null}
        </CardHeader>
      ) : null}

      <CardContent
        className={cn(
          "space-y-4 px-section",
          hasHeader ? "pb-section pt-4" : "py-section",
          cardContentClassName,
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
