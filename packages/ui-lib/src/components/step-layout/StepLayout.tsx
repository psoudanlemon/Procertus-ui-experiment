/**
 * **Step page** layout: optional **stepper** region, header (title, optional description, step
 * label), body, footer (back, optional secondary, primary). Presentational only — wire step
 * state with {@link useStepLayout} and pass flags into actions.
 *
 * **Design system:** `shadow-proc-xs`, semantic tokens, `Card` / `Button`, `H1` from
 * `@procertus-ui/ui` (see Shadow, Elevation, Color, Radius, Typography). No promotional
 * gradient on the default surface unless you add it in `children` or a custom `className`.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button, Card, CardContent, CardFooter, CardHeader, H1, P, Separator } from "@procertus-ui/ui";

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
   * Optional process UI (e.g. `OnboardingStepper` or `Stepper` from `@procertus-ui/ui`).
   * - `top` — full width above the title block in the header.
   * - `start` — start-aligned rail (e.g. vertical stepper) beside the title + body + footer on `md+`.
   */
  stepper?: ReactNode;
  /**
   * Where to place `stepper`. Ignored if `stepper` is not set.
   * @default "top"
   */
  stepperPosition?: "top" | "start";
  title: ReactNode;
  description?: ReactNode;
  /** e.g. “Step 2 of 6” — not a second heading. */
  stepLabel?: string;
  children?: ReactNode;
  backAction?: StepLayoutAction;
  primaryAction: StepLayoutAction;
  secondaryAction?: StepLayoutAction;
};

const variantClass: Record<NonNullable<StepLayoutProps["variant"]>, string> = {
  onboarding: "max-w-2xl",
  wizard: "max-w-xl",
};

const headerClass: Record<NonNullable<StepLayoutProps["variant"]>, string> = {
  onboarding: "gap-2 pt-2",
  wizard: "gap-1.5 py-1",
};

const titleClass: Record<NonNullable<StepLayoutProps["variant"]>, string | undefined> = {
  onboarding: undefined,
  wizard: "text-heading-lg",
};

const descClass: Record<NonNullable<StepLayoutProps["variant"]>, string> = {
  onboarding: "text-base leading-[1.6]",
  wizard: "text-sm leading-[1.6]",
};

const contentClass: Record<NonNullable<StepLayoutProps["variant"]>, string> = {
  onboarding: "space-y-4 pt-6",
  wizard: "space-y-3 py-4 pt-4",
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
      <H1 className={titleClass[variant]}>{title}</H1>
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

export function StepLayout({
  className,
  variant = "onboarding",
  layout = "default",
  flush = false,
  stepper,
  stepperPosition = "top",
  title,
  description,
  stepLabel,
  children,
  backAction,
  primaryAction,
  secondaryAction,
}: StepLayoutProps) {
  const isFill = layout === "fill" || layout === "fill-parent";
  const isViewportFill = layout === "fill";
  const isParentFill = layout === "fill-parent";
  const hasStepper = stepper != null;
  const rail = hasStepper && stepperPosition === "start";

  const cardClass = cn(
    "w-full overflow-hidden shadow-proc-xs",
    isFill
      ? "flex min-h-0 flex-col !py-0 ring-0"
      : cn("mx-auto", variantClass[variant]),
    isFill && "rounded-none",
    isFill && "bg-transparent shadow-none ring-0",
    !isFill && "rounded-xl",
  );

  const mainColumn = (
    <>
      <CardHeader
        className={cn(
          headerClass[variant],
          isFill && "shrink-0",
        )}
      >
        {!rail && hasStepper ? (
          <div className="w-full pb-2 not-empty:mb-0">{stepper}</div>
        ) : null}
        <StepLayoutHeaderBlock
          variant={variant}
          title={title}
          description={description}
          stepLabel={stepLabel}
        />
      </CardHeader>
      <Separator className={isFill ? "shrink-0" : undefined} />
      <CardContent
        className={cn(
          contentClass[variant],
          isFill && "min-h-0 flex-1 overflow-y-auto",
        )}
      >
        {children}
      </CardContent>
      <CardFooter
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
          "min-h-11 sm:min-h-0",
          variant === "wizard" ? "py-3" : "py-4",
          isFill && "shrink-0 bg-transparent",
        )}
      >
        <div className="flex w-full min-h-11 min-w-0 items-center sm:min-h-0">
          {backAction ? (
            <Button
              type="button"
              variant="outline"
              disabled={backAction.disabled}
              onClick={backAction.onClick}
            >
              {backAction.label}
            </Button>
          ) : (
            <span className="hidden sm:block sm:min-w-0" aria-hidden />
          )}
        </div>
        <div className="flex w-full flex-wrap justify-end gap-2 sm:w-auto">
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
          <Button
            type="button"
            disabled={primaryAction.disabled || primaryAction.loading}
            onClick={primaryAction.onClick}
            aria-busy={primaryAction.loading === true}
          >
            {primaryAction.label}
          </Button>
        </div>
      </CardFooter>
    </>
  );

  if (rail) {
    return (
      <Card
        className={cn(
          cardClass,
          isViewportFill && "h-svh",
          isParentFill && "h-full min-h-0",
          "flex flex-col gap-0 md:flex-row",
          className,
        )}
      >
        <div
          className={cn(
            "shrink-0 border-border md:w-56 md:min-w-48 md:max-w-xs md:border-r",
            isFill ? "border-b p-4 md:max-h-none md:overflow-y-auto" : "border-b p-4 md:overflow-y-auto",
            isParentFill && "min-h-0",
          )}
        >
          {stepper}
        </div>
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col",
            isFill && "min-h-0 flex-1",
          )}
        >
          {mainColumn}
        </div>
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
      {mainColumn}
    </Card>
  );
}
