import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@procertus-ui/ui";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@procertus-ui/ui";
import { useMemo } from "react";

export type OnboardingStepperStep = {
  id: string;
  title: string;
  description?: string;
  /** When false, the step remains visible but cannot be activated yet. */
  available?: boolean;
};

export type OnboardingStepperProps = {
  className?: string;
  /**
   * Stepper orientation. Horizontal fits `StepLayout` with `stepperPosition="top"`; vertical
   * suits a narrow side rail with `StepLayout` and `stepperPosition="start"`.
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Steps in order. The ReUI / primitive step index is **1-based**; this component maps
   * to and from the **0-based** `activeStep` used by `useStepLayout`.
   */
  steps: OnboardingStepperStep[];
  /**
   * Current step index, **0-based** (same as `useStepLayout` → `activeStep`).
   */
  activeStep: number;
  /**
   * Called with the new **0-based** index when the user moves focus by activating a
   * step. Omit to make the nav display-only (still works with a controlled `activeStep` from a parent).
   */
  onStepChange?: (index: number) => void;
  /**
   * If false, step triggers do not call `onStepChange` and are inert. Use for progress-only UI.
   */
  interactive?: boolean;
};

const completedIcon = (
  <HugeiconsIcon
    icon={Tick02Icon}
    strokeWidth={2.5}
    className="size-3.5 shrink-0 text-primary-foreground"
  />
);

const indicators = { completed: completedIcon };

// Indicator size scales with density: base 32px + a density-scaled component padding
// (8/12/16px), giving roughly 40/44/48px circles. Every dependent measurement (line
// center alignment, label `top`) is derived from the same calc so geometry stays correct.
const indicatorClass =
  "size-[calc(2rem+var(--spacing-component))] min-h-[calc(2rem+var(--spacing-component))] min-w-[calc(2rem+var(--spacing-component))]";

// Horizontal: line center = half the indicator size minus half the line thickness (1px).
const horizontalSeparatorClass =
  "group-data-[orientation=horizontal]/stepper-nav:mt-[calc((2rem+var(--spacing-component))/2-1px)]";

// Horizontal trigger is a fixed-size box around the indicator so the connecting line
// lands at the same gap from every indicator. The label group is positioned absolutely
// below so its width never affects the trigger.
const horizontalTriggerClass =
  "relative w-fit min-h-20 shrink-0 flex-col items-center justify-start rounded-md px-section";
const horizontalLabelClass =
  "absolute left-1/2 top-[calc(2rem+var(--spacing-component)*2)] -translate-x-1/2 text-center";

// Vertical: indicator + text group on a row, separator shifted right to align with the
// indicator's center. `my-component` keeps line breathing room density-aware (8–12px).
const verticalSeparatorClass =
  "group-data-[orientation=vertical]/stepper-nav:ml-[calc((2rem+var(--spacing-component))/2-1px)] group-data-[orientation=vertical]/stepper-nav:my-component";

export function OnboardingStepper({
  className,
  steps,
  activeStep,
  onStepChange,
  orientation = "horizontal",
  interactive = true,
}: OnboardingStepperProps) {
  const value1 = useMemo(
    () => Math.min(steps.length, Math.max(1, activeStep + 1)),
    [activeStep, steps.length]
  );

  if (steps.length === 0) {
    return null;
  }

  return (
    <Stepper
      className={cn(orientation === "vertical" && "w-full max-w-56 sm:max-w-none", className)}
      value={value1}
      onValueChange={
        onStepChange && interactive
          ? (v) => {
              const target = v - 1;
              if (steps[target]?.available === false) {
                return;
              }
              onStepChange(target);
            }
          : undefined
      }
      orientation={orientation}
      indicators={indicators}
    >
      <StepperNav
        className={cn(
          orientation === "horizontal" && "items-start justify-between gap-0",
          orientation === "vertical" && "items-stretch gap-0"
        )}
      >
        {steps.map((s, i) => {
          const n = i + 1;
          return (
            <OnboardingStepperItem
              key={s.id}
              n={n}
              step={s}
              interactive={interactive}
              isLast={i === steps.length - 1}
              orientation={orientation}
            />
          );
        })}
      </StepperNav>
    </Stepper>
  );
}

type ItemProps = {
  n: number;
  step: OnboardingStepperStep;
  interactive: boolean;
  isLast: boolean;
  orientation: "horizontal" | "vertical";
};

function OnboardingStepperItem({ n, step, interactive, isLast, orientation }: ItemProps) {
  const available = step.available !== false;
  const inert = !interactive || !available;

  if (orientation === "vertical") {
    return (
      <StepperItem
        className="w-full !items-stretch !justify-start"
        step={n}
        disabled={!available}
      >
        <div className="flex items-center gap-component">
          <StepperTrigger
            className={cn(
              "shrink-0 !rounded-md",
              inert && "pointer-events-none cursor-default",
              !available && "opacity-55"
            )}
          >
            <StepperIndicator className={indicatorClass}>{n}</StepperIndicator>
          </StepperTrigger>
          <div className={cn("min-w-0 flex-1 text-left", !available && "opacity-55")}>
            <StepperTitle className="line-clamp-2 font-semibold text-foreground">
              {step.title}
            </StepperTitle>
            {step.description ? (
              <p className="whitespace-nowrap text-xs leading-[1.4] text-muted-foreground">
                {step.description}
              </p>
            ) : null}
          </div>
        </div>
        {isLast ? null : <StepperSeparator className={verticalSeparatorClass} />}
      </StepperItem>
    );
  }

  return (
    <StepperItem className="items-start" step={n} disabled={inert}>
      <StepperTrigger
        className={cn(
          horizontalTriggerClass,
          inert && "pointer-events-none cursor-default",
          !available && "opacity-55"
        )}
      >
        <StepperIndicator className={indicatorClass}>{n}</StepperIndicator>
        <div className={horizontalLabelClass}>
          <StepperTitle className="line-clamp-2 font-semibold text-foreground">
            {step.title}
          </StepperTitle>
          {step.description ? (
            <p className="whitespace-nowrap text-xs leading-[1.4] text-muted-foreground">
              {step.description}
            </p>
          ) : null}
        </div>
      </StepperTrigger>
      {isLast ? null : <StepperSeparator className={horizontalSeparatorClass} />}
    </StepperItem>
  );
}
