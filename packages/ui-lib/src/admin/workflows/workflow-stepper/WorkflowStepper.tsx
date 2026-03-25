/**
 * Horizontal workflow stepper — visual state from props only (pending / current / completed / error).
 */
import { AlertCircle, Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type WorkflowStepperStepState = "pending" | "current" | "completed" | "error";

export type WorkflowStepperStep = {
  id: string;
  label: string;
  description?: string;
  state: WorkflowStepperStepState;
};

export type WorkflowStepperProps = {
  className?: string;
  /** Accessible name for the step list */
  "aria-label"?: string;
  steps: readonly WorkflowStepperStep[];
};

function StepCircle({ index, state }: { index: number; state: WorkflowStepperStepState }) {
  const base =
    "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors";

  if (state === "completed") {
    return (
      <span className={cn(base, "border-primary bg-primary text-primary-foreground")} aria-hidden>
        <Check className="size-4" strokeWidth={2.5} />
      </span>
    );
  }

  if (state === "error") {
    return (
      <span
        className={cn(base, "border-destructive bg-destructive/10 text-destructive")}
        aria-hidden
      >
        <AlertCircle className="size-4" />
      </span>
    );
  }

  if (state === "current") {
    return (
      <span
        className={cn(
          base,
          "border-primary bg-background text-primary ring-2 ring-primary/25 ring-offset-2 ring-offset-background",
        )}
        aria-current="step"
      >
        {index + 1}
      </span>
    );
  }

  return (
    <span
      className={cn(base, "border-muted-foreground/35 bg-muted/40 text-muted-foreground")}
      aria-hidden
    >
      {index + 1}
    </span>
  );
}

function StepBlock({ step, index }: { step: WorkflowStepperStep; index: number }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <StepCircle index={index} state={step.state} />
      <div className="max-w-[14rem] px-1">
        <p
          className={cn(
            "text-sm font-medium leading-tight",
            step.state === "pending" && "text-muted-foreground",
            step.state === "error" && "text-destructive",
          )}
        >
          {step.label}
        </p>
        {step.description ? (
          <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
        ) : null}
      </div>
    </div>
  );
}

export function WorkflowStepper({
  className,
  "aria-label": ariaLabel = "Workflow progress",
  steps,
}: WorkflowStepperProps) {
  return (
    <nav aria-label={ariaLabel} className={cn("w-full", className)}>
      <ol className="m-0 flex list-none flex-col gap-6 p-0 md:hidden">
        {steps.map((step, i) => (
          <li key={step.id}>
            <StepBlock step={step} index={i} />
          </li>
        ))}
      </ol>

      <ol className="m-0 hidden list-none items-start p-0 md:flex md:w-full">
        {steps.flatMap((step, i) => {
          const next = steps[i + 1];
          const lineComplete = step.state === "completed" && next !== undefined;

          const nodes = [
            <li key={step.id} className="flex min-w-0 flex-1 flex-col">
              <StepBlock step={step} index={i} />
            </li>,
          ];

          if (next) {
            nodes.push(
              <li
                key={`${step.id}-connector`}
                className="flex min-w-[0.5rem] flex-1 items-start justify-center self-stretch pt-[1.125rem]"
                aria-hidden
              >
                <div
                  className={cn(
                    "h-0.5 w-full rounded-full",
                    lineComplete ? "bg-primary" : "bg-border",
                  )}
                />
              </li>,
            );
          }

          return nodes;
        })}
      </ol>
    </nav>
  );
}
