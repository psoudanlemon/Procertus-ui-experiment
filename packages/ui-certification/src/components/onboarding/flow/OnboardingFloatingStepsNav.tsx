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
  /** Optional Tailwind overrides for the desktop step rail `<aside>`. */
  className?: string;
};

/**
 * Desktop: vertical {@link StepLayoutStepper} in an inline `<aside>` (place after the main
 * column inside a horizontal flex row — see onboarding flow shell).
 *
 * Narrow viewports: hide the aside; expose a trailing control (icon + current / total) that opens
 * a sheet with the step list.
 */
export function OnboardingFloatingStepsNav({
  steps,
  activeStep,
  onStepChange,
  interactive = true,
  showDescriptions = true,
  className,
}: OnboardingFloatingStepsNavProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const total = steps.length;
  const current = total === 0 ? 0 : Math.min(activeStep + 1, total);

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
          "sticky top-36 z-[1] self-start px-section py-region",
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
          onStepChange={onStepChange}
        />
      </aside>

      <div className="pointer-events-none fixed end-4 bottom-28 z-40 md:hidden">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="pointer-events-auto h-11 gap-2 rounded-full border border-border bg-card/95 pr-4 pl-3 shadow-proc-xs backdrop-blur-sm min-[420px]:h-10"
          onClick={() => setSheetOpen(true)}
          aria-expanded={sheetOpen}
          aria-haspopup="dialog"
        >
          <HugeiconsIcon
            icon={LeftToRightListBulletIcon}
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={2}
            aria-hidden
          />
          <span
            aria-hidden
            className="tabular-nums text-sm font-medium tracking-tight text-foreground"
          >
            {current}
            <span className="text-muted-foreground">/{total}</span>
          </span>
          <span className="sr-only">
            Open step list. Step {current} of {total}.
          </span>
        </Button>
      </div>

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
              onStepChange={handleMobileNavigate}
            />
          </SheetBody>
        </SheetContent>
      </Sheet>
    </>
  );
}
