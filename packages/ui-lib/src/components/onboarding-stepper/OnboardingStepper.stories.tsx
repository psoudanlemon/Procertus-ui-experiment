import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { StepLayout, useStepLayout } from "../step-layout";
import { OnboardingStepper, type OnboardingStepperStep } from "./OnboardingStepper";

const stepDefs: OnboardingStepperStep[] = [
  { id: "a", title: "Account", description: "Create credentials" },
  { id: "b", title: "Profile", description: "Organization details" },
  { id: "c", title: "Review", description: "Confirm and submit" },
];

const meta = {
  title: "UILib/OnboardingStepper",
  component: OnboardingStepper,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Horizontal or vertical process stepper that pairs with `StepLayout` and `useStepLayout` (0-based `activeStep` ↔ 1-based primitive step). Built on the ReUI / `@procertus-ui/ui` stepper with Procertus colors, `shadow-proc-tactile` indicators, and Hugeicons (completed).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingStepper>;

export default meta;

function HorizontalWithStepLayout() {
  const [prereq, setPrereq] = useState([true, true, true]);
  const canAdvance = (i: number) => prereq[i] === true;
  const flow = useStepLayout({ totalSteps: 3, canAdvanceFrom: canAdvance });
  const s = stepDefs[flow.activeStep];
  if (!s) {
    return null;
  }
  return (
    <StepLayout
      stepperPosition="top"
      stepper={
        <OnboardingStepper
          steps={stepDefs}
          activeStep={flow.activeStep}
          onStepChange={flow.goToStep}
          orientation="horizontal"
          interactive
        />
      }
      variant="onboarding"
      title={s.title}
      description={s.description}
      backAction={flow.isFirst ? undefined : { label: "Back", onClick: flow.goBack }}
      primaryAction={{
        label: flow.isLast ? "Done" : "Next",
        onClick: () => (flow.isLast ? undefined : flow.goForward()),
        disabled: flow.isLast ? !flow.stepAdvanceAllowed : !flow.canGoForward,
      }}
    >
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 rounded border"
          checked={prereq[flow.activeStep]}
          onChange={() =>
            setPrereq((p) => {
              const n = [...p];
              n[flow.activeStep] = !n[flow.activeStep];
              return n;
            })
          }
        />
        Prerequisite for this step
      </label>
    </StepLayout>
  );
}

export const WithStepLayout = {
  render: () => <HorizontalWithStepLayout />,
} as unknown as StoryObj<typeof meta>;

function VerticalReadOnly() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 md:flex-row">
      <OnboardingStepper
        className="shrink-0"
        steps={stepDefs}
        activeStep={1}
        interactive={false}
        orientation="vertical"
      />
      <p className="text-sm text-muted-foreground">Vertical, display-only. Main content would sit in `StepLayout` with `stepperPosition="start"` to the right.</p>
    </div>
  );
}

export const VerticalDisplayOnly = {
  render: () => <VerticalReadOnly />,
} as unknown as StoryObj<typeof meta>;
