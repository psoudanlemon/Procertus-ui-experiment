import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/stepper";

export type StepLayoutStep = {
  id: string;
  title: string;
  description?: string;
  /** When false, the step remains visible but cannot be activated yet. */
  available?: boolean;
  /**
   * Force the "completed" visual state (checkmark) regardless of position
   * relative to `activeStep`. Use for steps that were already filled in by
   * the user but currently sit ahead of the active step (i.e. user navigated
   * back). Steps before `activeStep` are completed automatically.
   */
  completed?: boolean;
};

export type StepLayoutStepperProps = {
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
  steps: StepLayoutStep[];
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
  /**
   * When false, hides each step’s secondary line (`step.description`). Primary titles stay visible.
   * @default true
   */
  showDescriptions?: boolean;
  /**
   * When false, steps whose index is greater than `activeStep` are not clickable
   * **unless** they are marked `completed` (already filled in earlier and now sit
   * ahead because the user navigated back). New forward steps must go through the
   * wizard's own primary action so that required validation cannot be skipped.
   * Default: true.
   */
  allowSkipAhead?: boolean;
};

const completedIcon = (
  <HugeiconsIcon
    icon={Tick02Icon}
    strokeWidth={2.5}
    className="size-3.5 shrink-0 text-current"
  />
);

const indicators = { completed: completedIcon };

// Indicator size scales with density: base 32px + a density-scaled micro padding
// (4/4/8px), giving roughly 36/36/40px circles. Horizontal connector line vertical
// placement uses the same sizing calc so geometry stays aligned.
const indicatorClass =
  "size-[calc(2rem+var(--spacing-micro))] min-h-[calc(2rem+var(--spacing-micro))] min-w-[calc(2rem+var(--spacing-micro))]";

// Horizontal: line center = half the indicator size minus half the line thickness (1px).
const horizontalSeparatorClass =
  "group-data-[orientation=horizontal]/stepper-nav:mt-[calc((2rem+var(--spacing-micro))/2-1px)]";

// Horizontal: each segment shares space between label column (`grow-[999]`) and the
// connector line (`flex-1` on `StepperSeparator` ≈ ~1× grow), so long labels wrap inside
// the segment instead of overflowing into neighbors.
const horizontalTriggerClass =
  "relative flex w-full min-w-0 shrink-0 flex-col items-center rounded-md px-section";

const horizontalColumnClass =
  "flex min-h-16 min-w-0 grow-[999] shrink basis-0 flex-col items-center pt-px";

const horizontalLabelGroupClass = "mt-2 w-full min-w-0 text-pretty text-center wrap-break-word";

// Vertical: indicator + text group on a row, separator shifted right to align with the
// indicator's center. `my-component` keeps line breathing room density-aware (8–12px).
const verticalSeparatorClass =
  "group-data-[orientation=vertical]/stepper-nav:ml-[calc((2rem+var(--spacing-micro))/2-1px)] group-data-[orientation=vertical]/stepper-nav:my-component";

export function StepLayoutStepper({
  className,
  steps,
  activeStep,
  onStepChange,
  orientation = "horizontal",
  interactive = true,
  showDescriptions = true,
  allowSkipAhead = true,
}: StepLayoutStepperProps) {
  const value1 = useMemo(
    () => Math.min(steps.length, Math.max(1, activeStep + 1)),
    [activeStep, steps.length]
  );

  if (steps.length === 0) {
    return null;
  }

  return (
    <Stepper
      className={cn(
        orientation === "vertical" && "flex w-full max-w-56 items-start justify-start sm:max-w-none",
        className,
      )}
      value={value1}
      onValueChange={
        onStepChange && interactive
          ? (v) => {
              const target = v - 1;
              if (steps[target]?.available === false) {
                return;
              }
              if (!allowSkipAhead && target > activeStep && steps[target]?.completed !== true) {
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
          const nextStep = steps[i + 1];
          const nextReached =
            nextStep !== undefined &&
            (i + 1 <= activeStep || nextStep.completed === true);
          return (
            <StepLayoutStepperItem
              key={s.id}
              n={n}
              step={s}
              interactive={interactive}
              inertAhead={!allowSkipAhead && i > activeStep && s.completed !== true}
              aheadCompleted={i > activeStep && s.completed === true}
              lineCovered={nextReached}
              isLast={i === steps.length - 1}
              orientation={orientation}
              showDescriptions={showDescriptions}
            />
          );
        })}
      </StepperNav>
    </Stepper>
  );
}

type ItemProps = {
  n: number;
  step: StepLayoutStep;
  interactive: boolean;
  /** Step sits past `activeStep` with skip-ahead disabled — block clicks without dimming. */
  inertAhead: boolean;
  /** Step was visited (forced `completed`) but currently sits ahead of `activeStep`. */
  aheadCompleted: boolean;
  /** True when the next step in the list has been reached (active or completed). */
  lineCovered: boolean;
  isLast: boolean;
  orientation: "horizontal" | "vertical";
  showDescriptions: boolean;
};

const aheadCompletedIndicatorClass =
  "!bg-card !text-primary !border-primary !ring-primary/10 !shadow-none";

function StepLayoutStepperItem({
  n,
  step,
  interactive,
  inertAhead,
  aheadCompleted,
  lineCovered,
  isLast,
  orientation,
  showDescriptions,
}: ItemProps) {
  const available = step.available !== false;
  const inert = !interactive || !available || inertAhead;
  const separatorOverride = lineCovered ? "!bg-primary" : "!bg-border";

  if (orientation === "vertical") {
    return (
      <StepperItem
        className="w-full min-w-0 !items-stretch !justify-start"
        step={n}
        disabled={!available}
        completed={step.completed}
      >
        <StepperTrigger
          className={cn(
            "flex w-full items-center gap-component text-left !rounded-md",
            inert && "pointer-events-none cursor-default",
            !available && "opacity-55"
          )}
        >
          <StepperIndicator
            className={cn(indicatorClass, "shrink-0", aheadCompleted && aheadCompletedIndicatorClass)}
          >
            {n}
          </StepperIndicator>
          <div className="min-w-0 flex-1">
            <StepperTitle className="wrap-break-word font-semibold leading-snug text-foreground whitespace-normal">
              {step.title}
            </StepperTitle>
            {showDescriptions && step.description ? (
              <p className="text-xs leading-[1.4] text-muted-foreground whitespace-normal wrap-break-word">
                {step.description}
              </p>
            ) : null}
          </div>
        </StepperTrigger>
        {isLast ? null : <StepperSeparator className={cn(verticalSeparatorClass, separatorOverride)} />}
      </StepperItem>
    );
  }

  return (
    <StepperItem className="min-w-0 items-start" step={n} disabled={inert} completed={step.completed}>
      <div className={horizontalColumnClass}>
        <StepperTrigger
          className={cn(
            horizontalTriggerClass,
            inert && "pointer-events-none cursor-default",
            !available && "opacity-55"
          )}
        >
          <StepperIndicator
            className={cn(indicatorClass, aheadCompleted && aheadCompletedIndicatorClass)}
          >
            {n}
          </StepperIndicator>
          <div className={horizontalLabelGroupClass}>
            <StepperTitle className="wrap-break-word font-semibold leading-snug text-foreground whitespace-normal">
              {step.title}
            </StepperTitle>
            {showDescriptions && step.description ? (
              <p className="mt-1 text-xs leading-[1.4] text-muted-foreground whitespace-normal wrap-break-word">
                {step.description}
              </p>
            ) : null}
          </div>
        </StepperTrigger>
      </div>
      {isLast ? null : <StepperSeparator className={cn(horizontalSeparatorClass, separatorOverride)} />}
    </StepperItem>
  );
}
