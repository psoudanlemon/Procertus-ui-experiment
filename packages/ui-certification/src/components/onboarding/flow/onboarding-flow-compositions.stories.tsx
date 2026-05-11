import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLayoutEffect, useMemo, useState, type ComponentType } from "react";

import { StepLayout, StepLayoutStepper } from "@procertus-ui/ui";

import {
  REGISTRATION_PHASE_DESCRIPTION,
  REGISTRATION_PHASE_TITLE,
  STABLE_STEP_MIN_HEIGHT,
} from "../../../onboarding/onboarding-constants";
import { mergeRegistrationChromeCopy } from "../../../onboarding/onboarding-registration-chrome-copy";
import { stepIndex } from "../../../onboarding/onboarding-flow-helpers";
import {
  baseOnboardingFlowViewProps,
  noop,
  storyCustomerContext,
  storyOnboardingDrafts,
  storyOnboardingStepperSteps,
  storyRequestOrigin,
} from "../../../onboarding/onboarding-story-fixtures";
import { ONBOARDING_STEPS } from "../../../onboarding/onboarding-types";
import type { OnboardingStep } from "../../../onboarding/onboarding-types";
import { useOnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";

import { OnboardingCompanyStep } from "../company-step/OnboardingCompanyStep";
import { OnboardingCustomerStep } from "../customer-step/OnboardingCustomerStep";
import { OnboardingExtrasStep } from "../extras-step/OnboardingExtrasStep";
import { OnboardingInvoicingStep } from "../invoicing-step/OnboardingInvoicingStep";
import { OnboardingOriginStep } from "../origin-step/OnboardingOriginStep";
import { OnboardingShell } from "../shell/OnboardingShell";
import { OnboardingSummaryStep } from "../summary-step/OnboardingSummaryStep";

const PublicLayoutDecorator = (Story: ComponentType) => {
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);
  return <Story />;
};

function RegistrationChromeComposer({
  initialStep,
}: {
  initialStep: OnboardingStep;
}) {
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [requestOrigin, setRequestOrigin] =
    useState<(typeof storyRequestOrigin) | "">(storyRequestOrigin);

  const viewProps = useMemo(
    () =>
      baseOnboardingFlowViewProps({
        step,
        drafts: storyOnboardingDrafts,
        requestOrigin,
        context: storyCustomerContext(),
        steps: storyOnboardingStepperSteps({
          step,
          context: storyCustomerContext(),
          drafts: storyOnboardingDrafts,
          requestOrigin,
        }),
        activeStep: stepIndex(step),
        goToOnboardingStep: (next: OnboardingStep) => {
          setStep(next);
        },
        setRequestOrigin: (o: typeof storyRequestOrigin) => setRequestOrigin(o),
        primaryAction: { label: "Verder (demo)", onClick: noop, disabled: false },
        backAction: { label: "Terug", onClick: noop },
      }),
    [step, requestOrigin],
  );

  const model = useOnboardingRegistrationLayoutModel(viewProps);
  const chromeStep = step;
  const registrationChrome = mergeRegistrationChromeCopy(chromeStep);

  return (
    <OnboardingShell
      pageTitle={REGISTRATION_PHASE_TITLE}
      pageDescription={REGISTRATION_PHASE_DESCRIPTION}
      onSignInClick={noop}
    >
      <StepLayout
        className="w-full"
        minHeight={STABLE_STEP_MIN_HEIGHT}
        variant="onboarding"
        stepper={
          <StepLayoutStepper
            steps={viewProps.steps}
            activeStep={viewProps.activeStep}
            onStepChange={(index) => {
              const nextStep = ONBOARDING_STEPS[index];
              if (nextStep) {
                setStep(nextStep);
              }
            }}
            interactive
          />
        }
        title={`${registrationChrome.title} (${step})`}
        description={`${registrationChrome.description} Storybook-demo: gebruik de stepper hierboven om te navigeren.`}
        backAction={viewProps.backAction}
        primaryAction={viewProps.primaryAction}
      >
        <StepBodies
          model={model}
          step={step}
          requestOrigin={requestOrigin}
          setRequestOrigin={setRequestOrigin}
        />
      </StepLayout>
    </OnboardingShell>
  );
}

function StepBodies({
  step,
  model,
  requestOrigin,
  setRequestOrigin,
}: {
  step: OnboardingStep;
  model: ReturnType<typeof useOnboardingRegistrationLayoutModel>;
  requestOrigin: (typeof storyRequestOrigin) | "";
  setRequestOrigin: (o: typeof storyRequestOrigin) => void;
}) {
  switch (step) {
    case "origin":
      return (
        <OnboardingOriginStep
          originFieldBase={model.originFieldBase}
          requestOrigin={requestOrigin}
          setRequestOrigin={setRequestOrigin}
        />
      );
    case "customer":
      return <OnboardingCustomerStep model={model} />;
    case "company":
      return <OnboardingCompanyStep model={model} />;
    case "invoicing":
      return <OnboardingInvoicingStep model={model} />;
    case "extras":
      return <OnboardingExtrasStep model={model} />;
    case "summary":
      return <OnboardingSummaryStep model={model} />;
    default: {
      const _never: never = step;
      void _never;
      return null;
    }
  }
}

const meta = {
  title: "Onboarding/Flow compositions/Registration chrome",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Composes onboarding shell plus `StepLayout` / stepper plus presentational registration steps.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const FromOriginInteractive: StoryObj<typeof meta> = {
  name: "Interactive · start at origin",
  render: () => <RegistrationChromeComposer initialStep="origin" />,
};

export const FromCustomerInteractive: StoryObj<typeof meta> = {
  name: "Interactive · start at customer",
  render: () => <RegistrationChromeComposer initialStep="customer" />,
};

export const SummaryChrome: StoryObj<typeof meta> = {
  name: "Interactive · summary on load",
  render: () => <RegistrationChromeComposer initialStep="summary" />,
};
