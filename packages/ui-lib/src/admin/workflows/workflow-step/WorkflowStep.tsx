/**
 * Single workflow step row — list-item layout with visual state (pending / current / completed / error).
 */
import { AlertCircle, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@procertus-ui/ui";

export type WorkflowStepVisualState = "pending" | "current" | "completed" | "error";

export type WorkflowStepProps = {
  className?: string;
  /** 1-based display index */
  stepNumber: number;
  label: string;
  description?: string;
  state: WorkflowStepVisualState;
};

function stateBadge(state: WorkflowStepVisualState): {
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
} {
  switch (state) {
    case "current":
      return { label: "Current", variant: "default" };
    case "completed":
      return { label: "Done", variant: "secondary" };
    case "error":
      return { label: "Issue", variant: "destructive" };
    default:
      return { label: "Pending", variant: "outline" };
  }
}

function StepGlyph({ stepNumber, state }: { stepNumber: number; state: WorkflowStepVisualState }) {
  const base =
    "flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold";

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
          "border-primary bg-background text-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background",
        )}
        aria-current="step"
      >
        {stepNumber}
      </span>
    );
  }
  return (
    <span
      className={cn(base, "border-muted-foreground/30 bg-muted/40 text-muted-foreground")}
      aria-hidden
    >
      {stepNumber}
    </span>
  );
}

export function WorkflowStep({
  className,
  stepNumber,
  label,
  description,
  state,
}: WorkflowStepProps) {
  const badge = stateBadge(state);

  return (
    <div
      className={cn(
        "flex w-full max-w-xl items-start gap-3 rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm",
        state === "current" && "ring-2 ring-primary/15",
        state === "error" && "border-destructive/40",
        className,
      )}
    >
      <StepGlyph stepNumber={stepNumber} state={state} />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={cn("font-medium", state === "pending" && "text-muted-foreground")}>
            {label}
          </p>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  );
}
