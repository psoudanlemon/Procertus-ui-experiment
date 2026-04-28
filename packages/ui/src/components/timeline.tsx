import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type HTMLAttributes,
} from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

type TimelineOrientation = "horizontal" | "vertical";
type TimelineState = "active" | "completed" | "inactive";
type TimelineIndicatorVariant = "outlined" | "filled";

interface TimelineContextValue {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: TimelineOrientation;
}

interface TimelineItemContextValue {
  step: number;
  state: TimelineState;
}

const TimelineContext = createContext<TimelineContextValue | undefined>(
  undefined
);
const TimelineItemContext = createContext<TimelineItemContextValue | undefined>(
  undefined
);

function useTimeline() {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error("useTimeline must be used within a Timeline");
  return ctx;
}

function useTimelineItem() {
  const ctx = useContext(TimelineItemContext);
  if (!ctx) throw new Error("useTimelineItem must be used within a TimelineItem");
  return ctx;
}

interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: TimelineOrientation;
}

function Timeline({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = "vertical",
  className,
  children,
  ...props
}: TimelineProps) {
  const [activeStep, setInternalStep] = useState(defaultValue);

  const setActiveStep = useCallback(
    (step: number) => {
      if (value === undefined) {
        setInternalStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange]
  );

  const currentStep = value ?? activeStep;

  const contextValue = useMemo<TimelineContextValue>(
    () => ({
      activeStep: currentStep,
      setActiveStep,
      orientation,
    }),
    [currentStep, setActiveStep, orientation]
  );

  return (
    <TimelineContext.Provider value={contextValue}>
      <div
        className={cn(
          "group/timeline flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
          className
        )}
        data-orientation={orientation}
        data-slot="timeline"
        {...props}
      >
        {children}
      </div>
    </TimelineContext.Provider>
  );
}

function TimelineContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-sm leading-[1.4] text-muted-foreground", className)}
      data-slot="timeline-content"
      {...props}
    />
  );
}

interface TimelineDateProps extends HTMLAttributes<HTMLTimeElement> {
  asChild?: boolean;
}

function TimelineDate({
  asChild = false,
  className,
  ...props
}: TimelineDateProps) {
  const Comp = asChild ? Slot.Root : "time";

  return (
    <Comp
      className={cn(
        "mb-micro block text-xs font-medium text-muted-foreground group-data-[orientation=vertical]/timeline:max-sm:h-4",
        className
      )}
      data-slot="timeline-date"
      {...props}
    />
  );
}

function TimelineHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} data-slot="timeline-header" {...props} />
  );
}

const indicatorVariantClasses: Record<TimelineIndicatorVariant, string> = {
  outlined:
    "border border-border bg-card text-foreground ring-1 ring-foreground/10",
  filled: "border-0 bg-primary text-primary-foreground",
};

interface TimelineIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  variant?: TimelineIndicatorVariant;
}

function TimelineIndicator({
  asChild = false,
  variant = "outlined",
  className,
  children,
  ...props
}: TimelineIndicatorProps) {
  const { state } = useTimelineItem();
  const Comp = asChild ? Slot.Root : "div";

  const isReached = state === "active" || state === "completed";

  return (
    <Comp
      aria-hidden="true"
      className={cn(
        "absolute flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        // Indicator size scales with density: base 8px + density-scaled component padding
        // (8/12/16px), giving 16/20/24px circles. Item rail margin, separator length and
        // separator offset all derive from the same calc so geometry stays correct.
        "size-[calc(0.5rem+var(--spacing-component))] min-h-[calc(0.5rem+var(--spacing-component))] min-w-[calc(0.5rem+var(--spacing-component))]",
        "text-[10px] font-medium shadow-proc-xs",
        indicatorVariantClasses[variant],
        // Outlined variant border picks up the primary color on reached steps so it matches
        // the filled separator leading into the active step.
        variant === "outlined" && isReached && "border-primary ring-primary/15",
        // Filled variant fades to "disabled" intensity when the step hasn't been reached yet,
        // mirroring `disabled:opacity-50` on the primary button.
        variant === "filled" && !isReached && "opacity-50",
        // Visible center sits at -(S/2 + gap) from the item edge, where S is the indicator
        // size and gap = var(--spacing-component); with -translate-x/y-1/2 the `left`/`top`
        // value below equals the visible center.
        "group-data-[orientation=horizontal]/timeline:top-[calc(-0.25rem-1.5*var(--spacing-component))] group-data-[orientation=horizontal]/timeline:left-0 group-data-[orientation=horizontal]/timeline:-translate-y-1/2",
        "group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=vertical]/timeline:left-[calc(-0.25rem-1.5*var(--spacing-component))] group-data-[orientation=vertical]/timeline:-translate-x-1/2",
        className
      )}
      data-slot="timeline-indicator"
      data-state={state}
      data-variant={variant}
      {...props}
    >
      {children}
    </Comp>
  );
}

interface TimelineItemProps extends HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
}

function TimelineItem({
  step,
  completed = false,
  className,
  ...props
}: TimelineItemProps) {
  const { activeStep } = useTimeline();

  const state: TimelineState =
    completed || step < activeStep
      ? "completed"
      : step === activeStep
        ? "active"
        : "inactive";

  const itemContextValue = useMemo<TimelineItemContextValue>(
    () => ({ step, state }),
    [step, state]
  );

  return (
    <TimelineItemContext.Provider value={itemContextValue}>
      <div
        className={cn(
          "group/timeline-item relative flex flex-1 flex-col gap-micro",
          // Fill the separator leading into a reached step (active or completed).
          "has-[+[data-state=completed]]:**:data-[slot=timeline-separator]:bg-primary",
          "has-[+[data-state=active]]:**:data-[slot=timeline-separator]:bg-primary",
          // Rail margin = indicator size + gap, so content begins right after the rail.
          "group-data-[orientation=horizontal]/timeline:mt-[calc(0.5rem+2*var(--spacing-component))] group-data-[orientation=horizontal]/timeline:not-last:pe-region",
          "group-data-[orientation=vertical]/timeline:ms-[calc(0.5rem+2*var(--spacing-component))] group-data-[orientation=vertical]/timeline:not-last:pb-region",
          className
        )}
        data-slot="timeline-item"
        data-state={state}
        {...props}
      />
    </TimelineItemContext.Provider>
  );
}

function TimelineSeparator({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute self-start rounded-sm bg-border",
        // Separator center aligns with the indicator center (-translate by half its own
        // 2px width). 0.25rem breathing gap above and below so the line doesn't crowd the
        // indicator. Length = 100% minus indicator and the two breathing gaps.
        "group-data-[orientation=horizontal]/timeline:top-[calc(-0.25rem-1.5*var(--spacing-component))] group-data-[orientation=horizontal]/timeline:h-0.5 group-data-[orientation=horizontal]/timeline:w-[calc(100%-1rem-var(--spacing-component))] group-data-[orientation=horizontal]/timeline:translate-x-[calc(0.75rem+var(--spacing-component))] group-data-[orientation=horizontal]/timeline:-translate-y-1/2",
        "group-data-[orientation=vertical]/timeline:left-[calc(-0.25rem-1.5*var(--spacing-component))] group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-var(--spacing-component))] group-data-[orientation=vertical]/timeline:w-0.5 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=vertical]/timeline:translate-y-[calc(0.75rem+var(--spacing-component))]",
        className
      )}
      data-slot="timeline-separator"
      {...props}
    />
  );
}

function TimelineTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-sm font-medium leading-tight text-foreground", className)}
      data-slot="timeline-title"
      {...props}
    />
  );
}

export {
  useTimeline,
  useTimelineItem,
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
  type TimelineProps,
  type TimelineItemProps,
  type TimelineIndicatorProps,
  type TimelineIndicatorVariant,
};
