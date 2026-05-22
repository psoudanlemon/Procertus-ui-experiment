/**
 * Two card shapes that present a route forward in a flow:
 *
 *   • `DecisionCard` (default) — vertical card with icon tile, title,
 *     description, optional check-bullets, and a trailing-icon CTA. Two tones:
 *     `primary` (raised, command surface) and `muted` (quiet, secondary
 *     surface). Used as a pair on decision moments like Triage.
 *
 *   • `DecisionCardCallout` — gradient side-route nudge with a title,
 *     description, and a CTA button. Horizontal on tablet+, vertical on
 *     mobile (or always vertical via `orientation="vertical"` when the
 *     callout sits in a narrow grid cell). The whole card is the click
 *     target via a stretched-link inside the CTA.
 *
 * Both accept a `cta.asChild` slot so consumers can wire their own
 * `<Link>` / `<button>` element without re-implementing button styling.
 */
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { Children, cloneElement, isValidElement } from "react";
import { ArrowRight02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import { Button, Card, CardContent, CardDescription, CardHeader, H2, H3 } from "@procertus-ui/ui";

export type DecisionCardTone = "primary" | "muted";

export type DecisionCardCta = {
  label: ReactNode;
  /** Trailing icon for `DecisionCard`, leading icon for `DecisionCardCallout`. Defaults to `ArrowRight` on option cards, omitted on callouts. Pass `null` to suppress. */
  icon?: IconSvgElement | null;
  /** When true, `children` is the interactive wrapper (e.g. `<Link>`, `<button>`). Required to make the card actionable. */
  asChild?: boolean;
  /** Single React element used as the interactive wrapper when `asChild` is true. */
  children?: ReactNode;
};

export type DecisionCardProps = Omit<ComponentProps<typeof Card>, "title" | "children"> & {
  tone?: DecisionCardTone;
  icon?: IconSvgElement;
  title: ReactNode;
  description?: ReactNode;
  bullets?: readonly ReactNode[];
  cta: DecisionCardCta;
};

export type DecisionCardCalloutProps = Omit<ComponentProps<typeof Card>, "title" | "children"> & {
  title: ReactNode;
  description?: ReactNode;
  cta: DecisionCardCta;
  /** Horizontal lays title/description left and the CTA right on `sm:` and up. Vertical stacks them, with the CTA `self-start`. Use vertical when the callout sits in a narrow grid cell. */
  orientation?: "horizontal" | "vertical";
};

function renderCtaInner(cta: DecisionCardCta, fallbackIcon: IconSvgElement | null) {
  const iconCandidate = cta.icon === undefined ? fallbackIcon : cta.icon;
  return (
    <>
      {cta.label}
      {iconCandidate ? <HugeiconsIcon icon={iconCandidate} className="size-4" /> : null}
    </>
  );
}

function CtaSlot({
  cta,
  fallbackIcon,
  iconPosition,
  variant,
  className,
}: {
  cta: DecisionCardCta;
  fallbackIcon: IconSvgElement | null;
  iconPosition: "leading" | "trailing";
  variant: "default" | "outline";
  className?: string;
}) {
  const iconCandidate = cta.icon === undefined ? fallbackIcon : cta.icon;
  const inner = (
    <>
      {iconPosition === "leading" && iconCandidate ? (
        <HugeiconsIcon icon={iconCandidate} className="size-4" />
      ) : null}
      {cta.label}
      {iconPosition === "trailing" && iconCandidate ? (
        <HugeiconsIcon icon={iconCandidate} className="size-4" />
      ) : null}
    </>
  );
  if (cta.asChild && cta.children) {
    const onlyChild = Children.only(cta.children) as ReactElement<{ children?: ReactNode }>;
    if (!isValidElement(onlyChild)) {
      return (
        <Button variant={variant} className={className}>
          {inner}
        </Button>
      );
    }
    const wrapped = cloneElement(onlyChild, undefined, inner);
    return (
      <Button asChild variant={variant} className={className}>
        {wrapped}
      </Button>
    );
  }
  return (
    <Button variant={variant} className={className}>
      {inner}
    </Button>
  );
}

export function DecisionCard({
  tone = "muted",
  icon,
  title,
  description,
  bullets,
  cta,
  className,
  ...props
}: DecisionCardProps) {
  const isPrimary = tone === "primary";
  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-section py-section",
        isPrimary ? "shadow-proc-md ring-2 ring-primary/30" : "shadow-proc-xs",
        className,
      )}
      data-decision-card-tone={tone}
      {...props}
    >
      <CardHeader className="!flex flex-row items-start gap-section px-section">
        {icon ? (
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-md",
              isPrimary
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground",
            )}
            aria-hidden
          >
            <HugeiconsIcon icon={icon} className="size-6" />
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col">
          <H2>{title}</H2>
          {description ? (
            <CardDescription className="text-sm leading-normal">{description}</CardDescription>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-section px-section">
        {bullets && bullets.length > 0 ? (
          <ul className="flex flex-col gap-micro">
            {bullets.map((bullet, idx) => (
              <li
                key={idx}
                className="flex items-start gap-micro text-sm leading-normal"
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="mt-0.5 size-4 shrink-0 text-accent-foreground"
                  aria-hidden
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <CtaSlot
          cta={cta}
          fallbackIcon={ArrowRight02Icon}
          iconPosition="trailing"
          variant={isPrimary ? "default" : "outline"}
          className="w-full justify-between"
        />
      </CardContent>
    </Card>
  );
}

export function DecisionCardCallout({
  title,
  description,
  cta,
  orientation = "horizontal",
  className,
  ...props
}: DecisionCardCalloutProps) {
  const isHorizontal = orientation === "horizontal";
  return (
    <Card
      className={cn(
        "relative flex cursor-pointer flex-col px-section py-section",
        isHorizontal
          ? "gap-component sm:flex-row sm:items-center sm:justify-between sm:gap-section"
          : "gap-section",
        className,
      )}
      style={{ background: "var(--gradient-neutral)" }}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-micro">
        <H3>{title}</H3>
        {description ? (
          <p className="text-sm leading-normal text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <CtaSlot
        cta={withStretchedLink(cta)}
        fallbackIcon={null}
        iconPosition="leading"
        variant="outline"
        className={cn(
          "bg-background group-hover/card:rounded-tl-[4px] group-hover/card:rounded-tr-[var(--cmd-deep)] group-hover/card:rounded-br-[4px] group-hover/card:rounded-bl-[var(--cmd-deep)] group-hover/card:bg-muted group-hover/card:text-foreground",
          isHorizontal ? "w-full sm:w-auto sm:shrink-0" : "self-start",
        )}
      />
    </Card>
  );
}

function withStretchedLink(cta: DecisionCardCta): DecisionCardCta {
  if (!cta.asChild || !cta.children) return cta;
  const onlyChild = Children.only(cta.children);
  if (!isValidElement<{ className?: string }>(onlyChild)) return cta;
  const merged = cn(
    "before:absolute before:inset-0 before:content-['']",
    onlyChild.props.className,
  );
  return {
    ...cta,
    children: cloneElement(onlyChild, { className: merged }),
  };
}
