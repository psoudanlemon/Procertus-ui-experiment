"use client";

import { LeftToRightListBulletIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import {
  Button,
  cn,
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  StepLayoutStepper,
  type StepLayoutStep,
} from "@procertus-ui/ui";

export type OnboardingFloatingStepsMobileCardLeadProps = {
  steps: StepLayoutStep[];
  activeStep: number;
  /** Opens the sheet that lists every step (wired to {@link OnboardingFloatingStepsNav}). */
  onOpenStepsSheet: () => void;
  /** Mirrors controlled sheet state for `aria-expanded`. */
  stepsSheetOpen?: boolean;
  className?: string;
};

/**
 * Compact step summary + sheet trigger for **narrow viewports only** — render via
 * {@link StepLayout} `mobileCardLead`; the wrapper header is `md:hidden`.
 */
export function OnboardingFloatingStepsMobileCardLead({
  steps,
  activeStep,
  onOpenStepsSheet,
  stepsSheetOpen = false,
  className,
}: OnboardingFloatingStepsMobileCardLeadProps) {
  const total = steps.length;
  const current = total === 0 ? 0 : Math.min(activeStep + 1, total);

  if (total === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-row flex-wrap items-center justify-between gap-component",
        className,
      )}
    >
      <p className="min-w-0 text-sm leading-snug">
        <span className="text-muted-foreground">Stap </span>
        <span className="font-semibold tabular-nums text-foreground">{current}</span>
        <span className="text-muted-foreground"> van {total}</span>
      </p>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="h-9 shrink-0 gap-2 px-3"
        onClick={onOpenStepsSheet}
        aria-expanded={stepsSheetOpen}
        aria-haspopup="dialog"
        aria-label={`Alle stappen tonen. Huidige stap ${current} van ${total}.`}
      >
        <HugeiconsIcon
          icon={LeftToRightListBulletIcon}
          className="size-4 shrink-0 text-muted-foreground"
          strokeWidth={2}
          aria-hidden
        />
        Stappen
      </Button>
    </div>
  );
}

export type OnboardingFloatingStepsNavProps = {
  steps: StepLayoutStep[];
  activeStep: number;
  onStepChange: (index: number) => void;
  interactive?: boolean;
  /**
   * Renders {@link StepLayoutStep.description} beneath each primary label.
   * @default true for this onboarding navigator.
   */
  showDescriptions?: boolean;
  /**
   * Forwarded to {@link StepLayoutStepper}: when false, steps past `activeStep`
   * are not clickable unless they're marked `completed`. Onboarding gates forward
   * navigation through the wizard's primary action.
   * @default false
   */
  allowSkipAhead?: boolean;
  /** Optional Tailwind overrides for the desktop step rail `<aside>`. */
  className?: string;
} & (
  | {
      /**
       * Controlled sheet visibility — pair with {@link OnboardingFloatingStepsMobileCardLead}
       * inside {@link StepLayout} `mobileCardLead`.
       */
      sheetOpen: boolean;
      onSheetOpenChange: (open: boolean) => void;
    }
  | {
      sheetOpen?: undefined;
      onSheetOpenChange?: undefined;
    }
);

/**
 * Desktop (`md+`): vertical {@link StepLayoutStepper} in an inline `<aside>` (place before the main
 * column — see onboarding flow shell).
 *
 * Narrow viewports: hide the aside; use {@link OnboardingFloatingStepsMobileCardLead} in
 * {@link StepLayout} `mobileCardLead` plus controlled `sheetOpen` / `onSheetOpenChange` here so the
 * full step list opens in a sheet (no floating FAB).
 */
export function OnboardingFloatingStepsNav({
  steps,
  activeStep,
  onStepChange,
  interactive = true,
  showDescriptions = true,
  allowSkipAhead = false,
  className,
  sheetOpen: sheetOpenProp,
  onSheetOpenChange,
}: OnboardingFloatingStepsNavProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const controlled =
    sheetOpenProp !== undefined && onSheetOpenChange !== undefined;
  const sheetOpen = controlled ? sheetOpenProp : internalOpen;

  const setSheetOpen = (next: boolean) => {
    if (controlled) {
      onSheetOpenChange(next);
    } else {
      setInternalOpen(next);
    }
  };

  const total = steps.length;

  if (total === 0) {
    return null;
  }

  const handleMobileNavigate = (index: number) => {
    onStepChange(index);
    setSheetOpen(false);
  };

  return (
    <>
      <aside
        className={cn(
          "hidden shrink-0 md:block md:basis-[20rem] md:grow-0 md:overflow-visible xl:basis-[22rem]",
          "rounded-xl border border-border bg-card shadow-proc-xs",
          "p-region md:self-start",
          className,
        )}
        aria-label="Stappen traject"
      >
        <StepLayoutStepper
          className="w-full max-w-none!"
          steps={steps}
          activeStep={activeStep}
          interactive={interactive}
          orientation="vertical"
          showDescriptions={showDescriptions}
          allowSkipAhead={allowSkipAhead}
          onStepChange={onStepChange}
        />
      </aside>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          showCloseButton
          className="flex max-h-dvh flex-col [--sheet-side-width:min(22rem,calc(100vw-1rem))]"
        >
          <SheetHeader className="shrink-0 px-section pt-section pb-0">
            <SheetTitle>Stappen</SheetTitle>
          </SheetHeader>
          <SheetBody className="min-h-0 px-section pt-section pb-region">
            <StepLayoutStepper
              className="w-full max-w-none!"
              steps={steps}
              activeStep={activeStep}
              interactive={interactive}
              orientation="vertical"
              showDescriptions={showDescriptions}
              allowSkipAhead={allowSkipAhead}
              onStepChange={handleMobileNavigate}
            />
          </SheetBody>
        </SheetContent>
      </Sheet>
    </>
  );
}
