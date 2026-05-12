/**
 * **Step page** layout: optional **stepper** region, header (title, optional description, step
 * label), body, footer (back, optional secondary, primary). Presentational only — wire step
 * state with {@link useStepLayout} and pass flags into actions.
 *
 * **Design system:** `shadow-proc-xs`, semantic tokens, `Card` / `Button`, `H1` from
 * `@procertus-ui/ui` (see Shadow, Elevation, Color, Radius, Typography). No promotional
 * gradient on the default surface unless you add it in `children` or a custom `className`.
 */
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FadingScrollList } from "@/components/ui/fading-scroll-list";
import { H1 } from "@/components/ui/heading";
import { P } from "@/components/ui/typography";

import { StepLayoutStepper, type StepLayoutStep } from "../step-layout-stepper";

export type { StepLayoutStep };

export type StepLayoutAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export type StepLayoutProps = {
  className?: string;
  /**
   * Wider “onboarding” reading width vs compact “wizard” step.
   */
  variant?: "onboarding" | "wizard";
  /**
   * `default` — centered max-width card.
   * `fill` — full width and viewport height (`100svh`).
   * `fill-parent` — full width/height of the available parent container.
   * Fill layouts keep header/footer visible while the main body scrolls internally.
   */
  layout?: "default" | "fill" | "fill-parent";
  /**
   * Removes only the outer rail padding. Internal header/content/footer spacing remains intact.
   * Useful when the parent surface already owns the edge spacing and the step layout should
   * stretch flush to the available region.
   */
  flush?: boolean;
  /**
   * Steps for the built-in stepper. When supplied (and `stepper` slot is omitted) StepLayout
   * renders its standard `StepLayoutStepper` automatically. Pair with `activeStep` and
   * `onStepChange` to drive navigation.
   */
  steps?: StepLayoutStep[];
  /** 0-based active step index for the built-in stepper. Required when `steps` is set. */
  activeStep?: number;
  /** Called with the new 0-based index when the user activates a step in the built-in stepper. */
  onStepChange?: (index: number) => void;
  /** When false, built-in stepper triggers are inert (progress-only display). Default: true. */
  interactive?: boolean;
  /**
   * Slot for a custom progress UI. Wins over `steps` when both are provided. Use this for
   * non-default shapes like a compact mobile timeline.
   * - `top` — full width above the title block in the header.
   * - `start` — start-aligned rail (e.g. vertical stepper) beside the title + body + footer on `md+`.
   */
  stepper?: ReactNode;
  /**
   * Where to place the stepper. Ignored if neither `stepper` slot nor `steps` is set. Also
   * sets the built-in stepper's orientation: `top` → horizontal, `start` → vertical.
   * @default "top"
   */
  stepperPosition?: "top" | "start";
  /**
   * `card` — single surface, header flush with the body (default).
   * `banded` — with a horizontal top stepper, the stepper sits on a muted strip; title/description
   * stay on the main surface; the footer mirrors the strip. Without that strip, padding follows the
   * banded content rhythm while the footer keeps the tinted strip.
   * `bare` — no surface chrome: header, body and footer flow flush with the parent (no border,
   * background, shadow, or rail padding). Use when the page already supplies its own chrome.
   */
  chromeStyle?: "card" | "banded" | "bare";
  title: ReactNode;
  description?: ReactNode;
  /** e.g. “Step 2 of 6” — not a second heading. */
  stepLabel?: string;
  children?: ReactNode;
  backAction?: StepLayoutAction;
  /** Omitted when there is no footer CTA (e.g. terminal “check your email” step). */
  primaryAction?: StepLayoutAction;
  secondaryAction?: StepLayoutAction;
  /** Ghost-styled escape hatch rendered at the far-left of the footer (e.g. “Cancel”). */
  cancelAction?: StepLayoutAction;
  /**
   * Tailwind `min-h-*` class. Applied to the default-layout Card so the wizard keeps a
   * stable height across steps. Card becomes `flex flex-col` and the body grows to push
   * the footer to the bottom. Ignored in `fill`/`fill-parent` layouts (those already pin
   * the footer via the viewport / parent).
   */
  minHeight?: string;
  /**
   * Stable key for the active step. When supplied and changed, the title block and
   * body slide-fade in to soften the transition. Direction (forward vs backward)
   * is inferred from numeric keys, so passing the active step index from
   * {@link useStepLayout} gives the most natural feel.
   *
   * Uses the **Deliberate** motion tier (`duration-500`) paired with the expressive easing
   * curve, `slide-in-from-right-2` / `slide-in-from-left-2`, and `fade-in-0`. The longer
   * 500ms dwell makes step navigation feel considered rather than reactive. Honours
   * `prefers-reduced-motion` globally.
   */
  stepKey?: string | number;
};

const variantClass: Record<NonNullable<StepLayoutProps["variant"]>, string> = {
  onboarding: "max-w-7xl",
  wizard: "max-w-7xl",
};

const cardGapClass: Record<NonNullable<StepLayoutProps["variant"]>, string> = {
  onboarding: "gap-region",
  wizard: "gap-region",
};

const cardTopPadClass: Record<NonNullable<StepLayoutProps["variant"]>, string> = {
  onboarding: "sm:pt-boundary",
  wizard: "sm:pt-boundary",
};

const titleGroupClass = "flex flex-col gap-micro";

const titleClass: Record<NonNullable<StepLayoutProps["variant"]>, string | undefined> = {
  onboarding: undefined,
  wizard: "text-heading-lg",
};

const descClass: Record<NonNullable<StepLayoutProps["variant"]>, string> = {
  onboarding: "text-base leading-[1.6]",
  wizard: "text-sm leading-[1.6]",
};

function StepLayoutHeaderBlock({
  variant: variantIn,
  title,
  description,
  stepLabel,
}: Pick<StepLayoutProps, "variant" | "title" | "description" | "stepLabel">) {
  const variant = variantIn ?? "onboarding";
  return (
    <>
      {stepLabel ? (
        <p
          className="text-xs font-semibold uppercase leading-normal tracking-widest text-muted-foreground"
          aria-hidden={false}
        >
          {stepLabel}
        </p>
      ) : null}
      {title != null && title !== "" ? <H1 className={titleClass[variant]}>{title}</H1> : null}
      {description ? (
        typeof description === "string" ? (
          <P className={cn("text-muted-foreground", descClass[variant])}>{description}</P>
        ) : (
          <div className={cn("text-muted-foreground", descClass[variant])}>{description}</div>
        )
      ) : null}
    </>
  );
}

function StepLayoutFooterActions({
  cancelAction,
  backAction,
  primaryAction,
  secondaryAction,
}: Pick<StepLayoutProps, "cancelAction" | "backAction" | "primaryAction" | "secondaryAction">) {
  return (
    <>
      {cancelAction ? (
        <Button
          type="button"
          variant="ghost"
          className="mr-auto"
          disabled={cancelAction.disabled}
          onClick={cancelAction.onClick}
        >
          {cancelAction.label}
        </Button>
      ) : null}
      {backAction ? (
        <Button
          type="button"
          variant="outline"
          disabled={backAction.disabled}
          onClick={backAction.onClick}
        >
          {backAction.label}
        </Button>
      ) : null}
      {secondaryAction ? (
        <Button
          type="button"
          variant="outline"
          disabled={secondaryAction.disabled}
          onClick={secondaryAction.onClick}
        >
          {secondaryAction.label}
        </Button>
      ) : null}
      {primaryAction ? (
        <Button
          type="button"
          disabled={primaryAction.disabled || primaryAction.loading}
          onClick={primaryAction.onClick}
          aria-busy={primaryAction.loading === true}
        >
          {primaryAction.label}
        </Button>
      ) : null}
    </>
  );
}

export function StepLayout({
  className,
  variant = "onboarding",
  layout = "default",
  flush: _flush = false,
  stepper,
  steps,
  activeStep,
  onStepChange,
  interactive = true,
  stepperPosition = "top",
  chromeStyle = "card",
  title,
  description,
  stepLabel,
  children,
  backAction,
  primaryAction,
  secondaryAction,
  cancelAction,
  minHeight,
  stepKey,
}: StepLayoutProps) {
  const isFill = layout === "fill" || layout === "fill-parent";
  const isViewportFill = layout === "fill";
  const isParentFill = layout === "fill-parent";
  const resolvedStepper: ReactNode =
    stepper ??
    (steps && steps.length > 0 && activeStep !== undefined ? (
      <StepLayoutStepper
        steps={steps}
        activeStep={activeStep}
        onStepChange={onStepChange}
        interactive={interactive}
        orientation={stepperPosition === "start" ? "vertical" : "horizontal"}
      />
    ) : null);
  const hasStepper = resolvedStepper != null;
  const rail = hasStepper && stepperPosition === "start";
  const stableHeight = !isFill && !rail && minHeight != null;
  const banded = chromeStyle === "banded";
  const bare = chromeStyle === "bare";
  /** Horizontal stepper only: muted chrome strip separates from body; title sits below without the band. */
  const bandedTopStepStrip = banded && !rail && hasStepper && stepperPosition === "top";

  const footerActions = (
    <StepLayoutFooterActions
      cancelAction={cancelAction}
      backAction={backAction}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
    />
  );

  const prevStepKeyRef = useRef(stepKey);
  const directionRef = useRef<"forward" | "backward">("forward");
  if (stepKey !== undefined && prevStepKeyRef.current !== stepKey) {
    if (typeof stepKey === "number" && typeof prevStepKeyRef.current === "number") {
      directionRef.current = stepKey > prevStepKeyRef.current ? "forward" : "backward";
    }
    prevStepKeyRef.current = stepKey;
  }
  const animateStep = stepKey !== undefined;
  const stepAnimClass = animateStep
    ? cn(
        "animate-in fade-in-0 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        directionRef.current === "forward" ? "slide-in-from-right-2" : "slide-in-from-left-2",
      )
    : undefined;

  const cardClass = cn(
    "w-full overflow-hidden",
    !bare && "shadow-proc-xs",
    banded ? "gap-0 pt-0" : cardGapClass[variant],
    !rail && !banded && !bare && cardTopPadClass[variant],
    bare && "!p-0",
    isFill ? "flex min-h-0 flex-col" : cn("mx-auto", variantClass[variant]),
    rail && "!py-0",
    isViewportFill && !rail && "!pb-0",
    isViewportFill && "rounded-none bg-transparent shadow-none ring-0",
    bare && "rounded-none border-0 bg-transparent shadow-none ring-0",
    !isViewportFill && !bare && "rounded-xl",
    stableHeight && cn("flex flex-col", minHeight),
  );

  const bandedStepStripNode = bandedTopStepStrip ? (
    <CardHeader
      className={cn(
        "flex flex-col border-b bg-muted/40 !gap-0 !px-region !pt-region !pb-section",
        isFill && "shrink-0",
      )}
    >
      <div className="mx-auto w-[90%]">{resolvedStepper}</div>
    </CardHeader>
  ) : null;

  const titleHeaderNode = (
    <CardHeader
      className={cn(
        "flex flex-col gap-region",
        rail
          ? "!px-0"
          : bare
            ? "!p-0"
            : banded && !rail
              ? cn(
                  "!px-region",
                  "!pb-section",
                  bandedTopStepStrip ? "!pt-region" : cn(cardTopPadClass[variant], "pt-region"),
                )
              : "sm:px-boundary",
        isFill && "shrink-0",
      )}
    >
      <div
        key={animateStep ? `title-${stepKey}` : undefined}
        className={cn(titleGroupClass, stepAnimClass)}
      >
        <StepLayoutHeaderBlock
          variant={variant}
          title={title}
          description={description}
          stepLabel={stepLabel}
        />
      </div>
    </CardHeader>
  );

  const railContentClass = "space-y-section !px-0";
  const stackedContentClass = banded
    ? "space-y-region p-region"
    : bare
      ? "space-y-section !p-0"
      : "space-y-section sm:px-boundary sm:pb-section";

  const contentNode = (
    <CardContent
      className={cn(
        isFill
          ? "flex min-h-0 flex-1 flex-col !p-0 max-w-7xl"
          : rail
            ? railContentClass
            : cn(stackedContentClass, stableHeight && "flex-1"),
      )}
    >
      {isFill ? (
        <FadingScrollList
          fadeColor={isViewportFill ? "from-background" : "from-card"}
          wrapperClassName="flex min-h-0 flex-1 flex-col"
          className={cn(rail ? railContentClass : stackedContentClass, "min-h-0 flex-1")}
        >
          {animateStep ? (
            <div key={`body-${stepKey}`} className={cn("space-y-section", stepAnimClass)}>
              {children}
            </div>
          ) : (
            children
          )}
        </FadingScrollList>
      ) : animateStep ? (
        <div
          key={`body-${stepKey}`}
          className={cn(banded ? "space-y-region" : "space-y-section", stepAnimClass)}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </CardContent>
  );

  const footerNode = (
    <CardFooter
      className={cn(
        "flex flex-row flex-wrap items-center justify-end gap-component",
        "min-h-11",
        banded ? "border-t bg-muted/40 p-region" : "p-section",
        bare && "!px-0 !pb-0",
        isFill && "shrink-0",
        isViewportFill && "bg-transparent",
      )}
    >
      {footerActions}
    </CardFooter>
  );

  if (rail) {
    return (
      <Card
        className={cn(
          cardClass,
          isViewportFill && "h-svh",
          isParentFill && "h-full min-h-0",
          "flex flex-col !gap-0",
          className,
        )}
      >
        <div className={cn("flex min-w-0 flex-col md:flex-row", isFill && "min-h-0 flex-1")}>
          <div
            className={cn(
              "shrink-0 border-border md:w-56 md:min-w-48 md:max-w-xs md:border-r",
              isFill
                ? "border-b p-section md:max-h-none md:border-b-0 md:overflow-y-auto"
                : "border-b p-section md:border-b-0 md:overflow-y-auto",
              isParentFill && "min-h-0",
            )}
          >
            {resolvedStepper}
          </div>
          <div
            className={cn(
              "flex min-h-0 min-w-0 flex-1 flex-col p-section",
              cardGapClass[variant],
              isFill && "min-h-0 flex-1",
            )}
          >
            {titleHeaderNode}
            {contentNode}
          </div>
        </div>
        {footerNode}
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        cardClass,
        isViewportFill && "h-svh flex flex-col",
        isParentFill && "h-full min-h-0 flex flex-col",
        className,
      )}
    >
      {bandedStepStripNode}
      {hasStepper && stepperPosition === "top" && !banded ? (
        <div className="mx-auto w-[90%]">{resolvedStepper}</div>
      ) : null}
      {titleHeaderNode}
      {contentNode}
      {footerNode}
    </Card>
  );
}
