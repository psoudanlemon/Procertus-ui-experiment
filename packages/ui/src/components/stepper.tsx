import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type StepperOrientation = "horizontal" | "vertical";
type StepState = "active" | "completed" | "inactive" | "loading";
type StepIndicators = {
  active?: ReactNode;
  completed?: ReactNode;
  inactive?: ReactNode;
  loading?: ReactNode;
};

interface StepperContextValue {
  activeStep: number;
  setActiveStep: (step: number) => void;
  stepsCount: number;
  orientation: StepperOrientation;
  registerTrigger: (node: HTMLButtonElement | null) => void;
  unregisterTrigger: (node: HTMLButtonElement) => void;
  triggerNodes: HTMLButtonElement[];
  focusNext: (currentIdx: number) => void;
  focusPrev: (currentIdx: number) => void;
  focusFirst: () => void;
  focusLast: () => void;
  indicators: StepIndicators;
}

interface StepItemContextValue {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
}

const StepperContext = createContext<StepperContextValue | undefined>(undefined);
const StepItemContext = createContext<StepItemContextValue | undefined>(undefined);

function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("useStepper must be used within a Stepper");
  return ctx;
}

function useStepItem() {
  const ctx = useContext(StepItemContext);
  if (!ctx) throw new Error("useStepItem must be used within a StepperItem");
  return ctx;
}

function countStepperItemsDeep(node: ReactNode): number {
  let n = 0;
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return;
    if ((child.type as { displayName?: string }).displayName === "StepperItem") n += 1;
    n += countStepperItemsDeep((child as ReactElement<{ children?: ReactNode }>).props.children);
  });
  return n;
}

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: StepperOrientation;
  indicators?: StepIndicators;
}

function Stepper({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = "horizontal",
  className,
  children,
  indicators = {},
  ...props
}: StepperProps) {
  const [activeStep, setActiveStep] = useState(defaultValue);
  const [triggerNodes, setTriggerNodes] = useState<HTMLButtonElement[]>([]);

  const registerTrigger = useCallback((node: HTMLButtonElement | null) => {
    if (!node) return;
    setTriggerNodes((prev) => (prev.includes(node) ? prev : [...prev, node]));
  }, []);

  const unregisterTrigger = useCallback((node: HTMLButtonElement) => {
    setTriggerNodes((prev) => prev.filter((b) => b !== node));
  }, []);

  const handleSetActiveStep = useCallback(
    (step: number) => {
      if (value === undefined) {
        setActiveStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange]
  );

  const currentStep = value ?? activeStep;
  const stepsCount = useMemo(() => countStepperItemsDeep(children), [children]);

  const focusTrigger = (idx: number) => {
    if (triggerNodes[idx]) triggerNodes[idx].focus();
  };
  const focusNext = (currentIdx: number) => {
    if (triggerNodes.length === 0) return;
    focusTrigger((currentIdx + 1) % triggerNodes.length);
  };
  const focusPrev = (currentIdx: number) => {
    if (triggerNodes.length === 0) return;
    focusTrigger((currentIdx - 1 + triggerNodes.length) % triggerNodes.length);
  };
  const focusFirst = () => {
    if (triggerNodes[0]) triggerNodes[0].focus();
  };
  const focusLast = () => {
    const el = triggerNodes[triggerNodes.length - 1];
    if (el) el.focus();
  };

  const contextValue = useMemo<StepperContextValue>(
    () => ({
      activeStep: currentStep,
      setActiveStep: handleSetActiveStep,
      stepsCount,
      orientation,
      registerTrigger,
      unregisterTrigger,
      triggerNodes,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
      indicators,
    }),
    [
      currentStep,
      handleSetActiveStep,
      stepsCount,
      orientation,
      registerTrigger,
      unregisterTrigger,
      triggerNodes,
      indicators,
    ]
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        role="tablist"
        aria-orientation={orientation}
        data-slot="stepper"
        className={cn("w-full", className)}
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}

interface StepperItemProps extends HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper();

  const state: StepState =
    completed || step < activeStep
      ? "completed"
      : activeStep === step
        ? "active"
        : "inactive";

  const isLoading = loading && step === activeStep;

  return (
    <StepItemContext.Provider
      value={{ step, state, isDisabled: disabled, isLoading }}
    >
      <div
        data-slot="stepper-item"
        className={cn(
          "group/step flex items-center justify-center not-last:flex-1 group-data-[orientation=horizontal]/stepper-nav:flex-row group-data-[orientation=vertical]/stepper-nav:flex-col",
          className
        )}
        data-state={state}
        {...(isLoading ? { "data-loading": true } : {})}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  );
}

StepperItem.displayName = "StepperItem";

interface StepperTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function StepperTrigger({ asChild = false, className, children, tabIndex, ...props }: StepperTriggerProps) {
  const { state, isLoading } = useStepItem();
  const stepperCtx = useStepper();
  const { setActiveStep, activeStep, registerTrigger, unregisterTrigger, focusNext, focusPrev, focusFirst, focusLast, triggerNodes } =
    stepperCtx;
  const { step, isDisabled } = useStepItem();
  const isSelected = activeStep === step;
  const id = `stepper-tab-${step}`;
  const panelId = `stepper-panel-${step}`;

  const btnRef = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    const el = btnRef.current;
    if (el) {
      registerTrigger(el);
      return () => unregisterTrigger(el);
    }
    return undefined;
  }, [registerTrigger, unregisterTrigger, step]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const idx = triggerNodes.findIndex((n) => n === e.currentTarget);
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown": {
        e.preventDefault();
        if (idx !== -1) focusNext(idx);
        break;
      }
      case "ArrowLeft":
      case "ArrowUp": {
        e.preventDefault();
        if (idx !== -1) focusPrev(idx);
        break;
      }
      case "Home": {
        e.preventDefault();
        focusFirst();
        break;
      }
      case "End": {
        e.preventDefault();
        focusLast();
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        setActiveStep(step);
        break;
      }
      // No default
    }
  };

  if (asChild) {
    return (
      <span
        data-slot="stepper-trigger"
        data-state={state}
        className={className}
      >
        {children}
      </span>
    );
  }

  return (
    <button
      ref={btnRef}
      type="button"
      role="tab"
      id={id}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={typeof tabIndex === "number" ? tabIndex : isSelected ? 0 : -1}
      data-slot="stepper-trigger"
      data-state={state}
      data-loading={isLoading}
      className={cn(
        "inline-flex cursor-pointer items-center gap-micro rounded-full outline-none",
        "focus-visible:z-10 focus-visible:border-border focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={() => setActiveStep(step)}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
}

function StepperIndicator({ children, className }: ComponentProps<"div">) {
  const { state, isLoading } = useStepItem();
  const { indicators } = useStepper();

  const slot = isLoading
    ? indicators.loading
    : state === "completed"
      ? indicators.completed
      : state === "active"
        ? indicators.active
        : indicators.inactive;

  return (
    <div
      data-slot="stepper-indicator"
      data-state={state}
      className={cn(
        "relative flex size-8 min-h-8 min-w-8 shrink-0 items-center justify-center overflow-hidden rounded-full",
        "border border-border bg-card text-sm font-medium text-muted-foreground ring-1 ring-foreground/10",
        "shadow-proc-tactile",
        "data-[state=active]:border-primary/30 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        "data-[state=completed]:border-primary/25 data-[state=completed]:bg-primary/10 data-[state=completed]:text-primary",
        className
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">{slot ?? children}</div>
    </div>
  );
}

function StepperSeparator({ className }: ComponentProps<"div">) {
  return (
    <div
      data-slot="stepper-separator"
      className={cn(
        "m-0.5 bg-border group-data-[orientation=horizontal]/stepper-nav:mt-0 group-data-[orientation=horizontal]/stepper-nav:mb-0",
        "group-data-[orientation=horizontal]/stepper-nav:h-0.5 group-data-[orientation=horizontal]/stepper-nav:min-w-[0.5rem] group-data-[orientation=horizontal]/stepper-nav:flex-1",
        "group-data-[orientation=vertical]/stepper-nav:h-12 group-data-[orientation=vertical]/stepper-nav:min-h-[0.5rem] group-data-[orientation=vertical]/stepper-nav:w-0.5",
        "rounded-sm",
        className
      )}
    />
  );
}

function StepperTitle({ children, className }: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="stepper-title"
      className={cn("text-sm font-medium leading-tight text-foreground", className)}
    >
      {children}
    </h3>
  );
}

function StepperDescription({ children, className }: ComponentProps<"div">) {
  return (
    <div
      data-slot="stepper-description"
      className={cn("text-sm leading-[1.6] text-muted-foreground", className)}
    >
      {children}
    </div>
  );
}

function StepperNav({ children, className }: ComponentProps<"nav">) {
  const { activeStep, orientation } = useStepper();

  return (
    <nav
      data-slot="stepper-nav"
      data-state={activeStep}
      data-orientation={orientation}
      className={cn(
        "group/stepper-nav inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
        className
      )}
    >
      {children}
    </nav>
  );
}

function StepperPanel({ children, className }: ComponentProps<"div">) {
  const { activeStep } = useStepper();

  return (
    <div data-slot="stepper-panel" data-state={activeStep} className={cn("w-full", className)}>
      {children}
    </div>
  );
}

interface StepperContentProps extends ComponentProps<"div"> {
  value: number;
  forceMount?: boolean;
}

function StepperContent({ value, forceMount, children, className }: StepperContentProps) {
  const { activeStep } = useStepper();
  const isActive = value === activeStep;

  if (!forceMount && !isActive) {
    return null;
  }

  return (
    <div
      data-slot="stepper-content"
      data-state={activeStep}
      className={cn("w-full", !isActive && forceMount && "hidden", className)}
      hidden={!isActive && forceMount}
    >
      {children}
    </div>
  );
}

export {
  useStepper,
  useStepItem,
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
  StepperPanel,
  StepperContent,
  StepperNav,
  type StepperProps,
  type StepperItemProps,
  type StepperTriggerProps,
  type StepperContentProps,
};
