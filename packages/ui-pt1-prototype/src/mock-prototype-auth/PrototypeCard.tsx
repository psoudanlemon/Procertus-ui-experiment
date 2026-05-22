import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@procertus-ui/ui";

import { cn } from "../lib/utils";

export type PrototypeCardProps = {
  children: React.ReactNode;
  /** Optional heading inside the prototype chrome. */
  title?: React.ReactNode;
  /** Optional supporting copy below the title (muted body style). */
  description?: React.ReactNode;
  /** Optional fine print below the description (smaller, muted — e.g. prototype hints). */
  notice?: React.ReactNode;
  /** When false, hides the corner "Demo" badge. @default true */
  showDemoBadge?: boolean;
  /** Label text for the demo badge. @default "Demo" */
  demoBadgeLabel?: React.ReactNode;
  /** Accessible longer description for the badge (`title` attribute). */
  demoBadgeTitle?: string;
  /**
   * When true, the title row becomes a trigger and description / notice /
   * children collapse below it. Requires a `title` to act as trigger label.
   * @default false
   */
  collapsible?: boolean;
  /** Initial open state when `collapsible`. @default false */
  defaultOpen?: boolean;
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
  collapsible = false,
  defaultOpen = false,
  className,
  cardContentClassName,
}: PrototypeCardProps) {
  const hasHeader = Boolean(title ?? description ?? notice);
  const canCollapse = collapsible && Boolean(title);

  const demoBadge = showDemoBadge ? (
    <Badge
      variant="outline"
      title={demoBadgeTitle}
      className="border-transparent bg-prototype text-prototype-foreground hover:bg-prototype"
    >
      {demoBadgeLabel}
    </Badge>
  ) : null;

  const frameClassName = cn(
    "relative gap-0 border-2 border-dashed border-prototype shadow-none ring-0",
    /* Tinted surface from semantic tokens so light/dark both read as a subtle prototype wash */
    "bg-[color-mix(in_oklch,var(--prototype)_14%,var(--card))]",
    /* In dark, --prototype is very dark; use foreground hue for a visible dashed frame */
    "dark:border-prototype-foreground/40",
    className,
  );

  if (canCollapse) {
    return (
      <Collapsible defaultOpen={defaultOpen} asChild>
        <Card className={frameClassName}>
          <CardHeader className="gap-1">
            <CollapsibleTrigger
              className={cn(
                "group/prototype-trigger flex w-full items-center gap-3 rounded-md text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
              )}
            >
              <CardTitle className="min-w-0 flex-1 text-prototype-foreground">{title}</CardTitle>
              {demoBadge}
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                className="size-4 shrink-0 text-prototype-foreground transition-transform group-data-[state=closed]/prototype-trigger:-rotate-90"
                aria-hidden
              />
            </CollapsibleTrigger>
          </CardHeader>

          <CollapsibleContent>
            {description || notice ? (
              <div className="px-6 pt-1 pb-0">
                {description ? (
                  <CardDescription className="leading-6">{description}</CardDescription>
                ) : null}
                {notice ? (
                  <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{notice}</div>
                ) : null}
              </div>
            ) : null}

            <CardContent className={cn("space-y-4 pt-4", cardContentClassName)}>
              {children}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

  return (
    <Card className={frameClassName}>
      {demoBadge && !title ? (
        <div className="absolute top-3 right-3 z-10">{demoBadge}</div>
      ) : null}

      {hasHeader ? (
        <CardHeader className="gap-1">
          {title ? (
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-prototype-foreground">{title}</CardTitle>
              {demoBadge}
            </div>
          ) : null}
          {description ? (
            <CardDescription className="leading-6">{description}</CardDescription>
          ) : null}
          {notice ? (
            <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{notice}</div>
          ) : null}
        </CardHeader>
      ) : null}

      <CardContent className={cn("space-y-4", hasHeader && "pt-4", cardContentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
