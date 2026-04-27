import { Tick01Icon } from "@hugeicons/core-free-icons";
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
  <HugeiconsIcon icon={Tick01Icon} className="size-3.5 shrink-0 text-primary" />
);

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
      indicators={{
        completed: completedIcon,
      }}
    >
      <StepperNav
        className={cn(
          "gap-0",
          orientation === "horizontal" && "items-start",
          orientation === "vertical" && "items-stretch"
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
  return (
    <StepperItem
      className={cn(orientation === "vertical" && "w-full", orientation === "horizontal" && "min-w-0 flex-1")}
      step={n}
      disabled={!interactive || !available}
    >
      <StepperTrigger
        className={cn(
          "max-w-full min-w-0",
          (!interactive || !available) && "pointer-events-none cursor-default",
          !available && "opacity-55",
          orientation === "vertical" && "w-full"
        )}
      >
        <StepperIndicator>{n}</StepperIndicator>
        <div className="min-w-0 flex-1 text-start">
          <StepperTitle className="line-clamp-2 font-semibold text-foreground">{step.title}</StepperTitle>
          {step.description ? (
            <p className="mt-0.5 line-clamp-2 text-xs leading-[1.6] text-muted-foreground">{step.description}</p>
          ) : null}
        </div>
      </StepperTrigger>
      {isLast ? null : <StepperSeparator />}
    </StepperItem>
  );
}
