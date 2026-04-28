import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { OnboardingStepper, type OnboardingStepperStep } from "../onboarding-stepper";
import { StepLayout } from "./StepLayout";
import { useStepLayout } from "./useStepLayout";

const meta = {
  title: "UILib/StepLayout",
  component: StepLayout,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Reusable **step page** layout for multi-step flows in the main content area. Pass a **stepper** via `stepper` and `stepperPosition` (or omit for title-only chrome). Pair with `useStepLayout` for back/next and per-step prerequisites. Align spacing and hierarchy with the Documentation Portal design guidelines.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StepLayout>;

export default meta;

const stepperSteps: OnboardingStepperStep[] = [
  { id: "a", title: "Account", description: "Create credentials" },
  { id: "b", title: "Profile", description: "Organization details" },
  { id: "c", title: "Review", description: "Confirm and submit" },
];

/** Wider max width, calmer type scale — first-run onboarding and similar flows. */
function OnboardingFlowStory() {
  const [perStepOk, setPerStepOk] = useState([false, false, true]);
  const [completed, setCompleted] = useState(false);

  const canAdvanceFrom = useCallback(
    (step: number) => perStepOk[step] === true,
    [perStepOk],
  );

  const flow = useStepLayout({ totalSteps: 3, canAdvanceFrom });
  const step = flow.activeStep;

  const primaryDisabled = flow.isLast
    ? !flow.stepAdvanceAllowed
    : !flow.canGoForward;

  if (completed) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Onboarding complete (story).
      </p>
    );
  }

  return (
    <StepLayout
      variant="onboarding"
      title={["Welcome", "Profile basics", "Review & finish"][step] ?? "Step"}
      description="Supportive copy lives here. Mark the prerequisite below to enable Next, or go Back to change a previous step."
      stepLabel={`Step ${step + 1} of ${flow.totalSteps}`}
      backAction={
        flow.isFirst
          ? undefined
          : { label: "Back", onClick: flow.goBack, disabled: !flow.canGoBack }
      }
      primaryAction={{
        label: flow.isLast ? "Done" : "Next",
        onClick: () => {
          if (flow.isLast) setCompleted(true);
          else flow.goForward();
        },
        disabled: primaryDisabled,
      }}
      secondaryAction={flow.isLast ? { label: "Edit profile", onClick: () => flow.goToStep(1) } : undefined}
    >
      <div className="space-y-component text-sm text-muted-foreground">
        <p>Place step fields, checklists, or any content in this slot. This story uses a single prerequisite flag per step.</p>
        <label className="flex cursor-pointer items-center gap-component text-foreground">
          <input
            type="checkbox"
            className="size-4 rounded border"
            checked={perStepOk[step]}
            onChange={() =>
              setPerStepOk((prev) => {
                const next = [...prev];
                next[step] = !next[step];
                return next;
              })
            }
          />
          Prerequisite for this step
        </label>
      </div>
    </StepLayout>
  );
}

export const OnboardingStep = {
  render: () => <OnboardingFlowStory />,
} as unknown as StoryObj<typeof meta>;

function WithTopStepperStory() {
  const [perStepOk, setPerStepOk] = useState([true, true, true]);
  const canAdvance = (i: number) => perStepOk[i] === true;
  const flow = useStepLayout({ totalSteps: 3, canAdvanceFrom: canAdvance });
  const s = stepperSteps[flow.activeStep];
  if (!s) {
    return null;
  }
  return (
    <StepLayout
      stepperPosition="top"
      stepper={
        <OnboardingStepper
          steps={stepperSteps}
          activeStep={flow.activeStep}
          onStepChange={flow.goToStep}
          orientation="horizontal"
          interactive
        />
      }
      variant="onboarding"
      title={s.title}
      description={s.description}
      stepLabel={`Step ${flow.activeStep + 1} of ${flow.totalSteps}`}
      backAction={flow.isFirst ? undefined : { label: "Back", onClick: flow.goBack }}
      primaryAction={{
        label: flow.isLast ? "Done" : "Next",
        onClick: () => (flow.isLast ? undefined : flow.goForward()),
        disabled: flow.isLast ? !flow.stepAdvanceAllowed : !flow.canGoForward,
      }}
    >
      <label className="flex items-center gap-component text-sm text-muted-foreground">
        <input
          type="checkbox"
          className="size-4 rounded border"
          checked={perStepOk[flow.activeStep]}
          onChange={() =>
            setPerStepOk((p) => {
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

export const WithTopStepper = {
  render: () => <WithTopStepperStory />,
} as unknown as StoryObj<typeof meta>;

function WithStartStepperStory() {
  const flow = useStepLayout({ totalSteps: 3, canAdvanceFrom: () => true });
  const s = stepperSteps[flow.activeStep];
  if (!s) {
    return null;
  }
  return (
    <div className="w-full min-w-0 max-w-4xl">
      <StepLayout
        stepperPosition="start"
        layout="fill"
        stepper={
          <OnboardingStepper
            className="max-w-none"
            steps={stepperSteps}
            activeStep={flow.activeStep}
            onStepChange={flow.goToStep}
            orientation="vertical"
            interactive
          />
        }
        variant="onboarding"
        title={s.title}
        description={s.description}
        stepLabel={`Step ${flow.activeStep + 1} of ${flow.totalSteps}`}
        backAction={flow.isFirst ? undefined : { label: "Back", onClick: flow.goBack }}
        primaryAction={{
          label: flow.isLast ? "Done" : "Next",
          onClick: () => (flow.isLast ? undefined : flow.goForward()),
        }}
      >
        <p className="text-sm text-muted-foreground">Start rail: vertical stepper in the `stepper` slot with `stepperPosition="start"`. On small screens the rail stacks above the main column.</p>
      </StepLayout>
    </div>
  );
}

export const WithStartStepper = {
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 700 },
    },
  },
  render: () => <WithStartStepperStory />,
} as unknown as StoryObj<typeof meta>;

/** Tighter width and type — dense flows such as a certification wizard. */
function WizardStepStory() {
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const flow = useStepLayout({
    totalSteps: 2,
    canAdvanceFrom: (s) => (s === 0 ? ready : true),
  });
  const step = flow.activeStep;

  const primaryDisabled = flow.isLast
    ? !flow.stepAdvanceAllowed
    : !flow.canGoForward;

  if (completed) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Submitted (story).
      </p>
    );
  }

  return (
    <StepLayout
      variant="wizard"
      title={step === 0 ? "Intent" : "Confirm"}
      stepLabel={step === 0 ? "Step 1" : "Step 2 of 2"}
      description="Footer emphasizes the primary “Next” action; use optional outline secondary actions when needed."
      backAction={
        flow.isFirst ? undefined : { label: "Back", onClick: flow.goBack, disabled: !flow.canGoBack }
      }
      primaryAction={{
        label: flow.isLast ? "Submit" : "Next",
        onClick: () => {
          if (flow.isLast) setCompleted(true);
          else flow.goForward();
        },
        disabled: primaryDisabled,
      }}
    >
      {step === 0 ? (
        <label className="flex items-center gap-component text-sm">
          <input
            type="checkbox"
            className="size-4"
            checked={ready}
            onChange={() => setReady((r) => !r)}
          />
          Required for Next
        </label>
      ) : (
        <p className="text-sm">Confirm and submit (demo).</p>
      )}
    </StepLayout>
  );
}

export const WizardStep = {
  render: () => <WizardStepStory />,
} as unknown as StoryObj<typeof meta>;

const fillerParagraphs = Array.from(
  { length: 18 },
  (_, i) => `Line ${i + 1} — the body slot scrolls in fill layout; header and footer stay visible for actions.`,
);

/** Full width and `100svh` height: step chrome fills the viewport; children scroll. */
function FillLayoutStory() {
  const [ok, setOk] = useState(false);
  const flow = useStepLayout({
    totalSteps: 1,
    canAdvanceFrom: () => ok,
  });

  const primaryDisabled = !flow.stepAdvanceAllowed;

  return (
    <StepLayout
      layout="fill"
      variant="onboarding"
      title="Scrollable full-screen step"
      description='Set the layout prop to "fill" when the layout should occupy the viewport. The main region scrolls; header and footer stay put.'
      stepLabel="Step 1 of 1"
      primaryAction={{
        label: "Continue",
        onClick: () => undefined,
        disabled: primaryDisabled,
      }}
      secondaryAction={{ label: "Save draft", onClick: () => undefined }}
    >
      <div className="space-y-section text-sm text-muted-foreground">
        <label className="flex items-center gap-component text-foreground">
          <input
            type="checkbox"
            className="size-4 rounded border"
            checked={ok}
            onChange={() => setOk((o) => !o)}
          />
          Allow Continue (prerequisite)
        </label>
        {fillerParagraphs.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </StepLayout>
  );
}

export const OnboardingStepFill = {
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 700 },
    },
  },
  render: () => <FillLayoutStory />,
} as unknown as StoryObj<typeof meta>;

function ParentFillWithRailStory() {
  const flow = useStepLayout({ totalSteps: 3, canAdvanceFrom: () => true });
  const s = stepperSteps[flow.activeStep];
  if (!s) {
    return null;
  }

  return (
    <div className="h-[70svh] min-h-0 w-full min-w-0 bg-muted/20 p-section">
      <StepLayout
        className="max-w-none"
        layout="fill-parent"
        stepperPosition="start"
        stepper={
          <OnboardingStepper
            className="max-w-none"
            steps={stepperSteps}
            activeStep={flow.activeStep}
            onStepChange={flow.goToStep}
            orientation="vertical"
            interactive
          />
        }
        variant="wizard"
        title={s.title}
        description="Parent-fill layout fills the available app-shell region; the body scrolls internally and actions stay docked at the bottom."
        stepLabel={`Step ${flow.activeStep + 1} of ${flow.totalSteps}`}
        backAction={flow.isFirst ? undefined : { label: "Back", onClick: flow.goBack }}
        primaryAction={{
          label: flow.isLast ? "Done" : "Next",
          onClick: () => (flow.isLast ? undefined : flow.goForward()),
        }}
      >
        <div className="space-y-section text-sm text-muted-foreground">
          {fillerParagraphs.concat(fillerParagraphs).map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
      </StepLayout>
    </div>
  );
}

export const ParentFillWithStartStepper = {
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 700 },
    },
  },
  render: () => <ParentFillWithRailStory />,
} as unknown as StoryObj<typeof meta>;
