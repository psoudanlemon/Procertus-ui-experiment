import { useCallback, useMemo, useState } from "react";

export type UseStepLayoutOptions = {
  totalSteps: number;
  initialStep?: number;
  /**
   * Whether the user may leave the current step for the next one. Implement
   * prerequisites per step (forms valid, consents, selections) here.
   */
  canAdvanceFrom?: (activeStep: number) => boolean;
};

export function useStepLayout({
  totalSteps: totalStepsIn,
  initialStep = 0,
  canAdvanceFrom = () => true,
}: UseStepLayoutOptions) {
  const totalSteps = Math.max(1, Math.floor(totalStepsIn));

  const [activeStep, setActiveStep] = useState(() => {
    const c = Math.min(Math.max(0, initialStep), totalSteps - 1);
    return c;
  });

  const isFirst = activeStep <= 0;
  const isLast = activeStep >= totalSteps - 1;

  const canGoBack = !isFirst;

  /** When false, do not advance to the next step; “Next” / final “Done/Submit” stay blocked. */
  const stepAdvanceAllowed = useMemo(
    () => canAdvanceFrom(activeStep),
    [activeStep, canAdvanceFrom],
  );

  const canGoForward = !isLast && stepAdvanceAllowed;

  const goBack = useCallback(() => {
    setActiveStep((s) => (s > 0 ? s - 1 : s));
  }, []);

  const goForward = useCallback(() => {
    setActiveStep((s) => {
      if (s >= totalSteps - 1) return s;
      if (!canAdvanceFrom(s)) return s;
      return s + 1;
    });
  }, [totalSteps, canAdvanceFrom]);

  const goToStep = useCallback(
    (step: number) => {
      const next = Math.min(Math.max(0, Math.floor(step)), totalSteps - 1);
      setActiveStep(next);
    },
    [totalSteps],
  );

  return {
    activeStep,
    totalSteps,
    isFirst,
    isLast,
    canGoBack,
    canGoForward,
    stepAdvanceAllowed,
    goBack,
    goForward,
    goToStep,
  };
}
