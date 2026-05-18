import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLayoutEffect, useMemo, useState, type ComponentType } from "react";

import { cn, H1, P, StepLayout } from "@procertus-ui/ui";

import {
  REGISTRATION_PHASE_DESCRIPTION,
  REGISTRATION_PHASE_TITLE,
  STABLE_STEP_MIN_HEIGHT,
} from "../../../onboarding/onboarding-constants";
import { mergeRegistrationChromeCopy } from "../../../onboarding/onboarding-registration-chrome-copy";
import {
  registrationStepsSequence,
  registrationStepIndex,
} from "../../../onboarding/onboarding-registration-steps";
import {
  baseOnboardingFlowViewProps,
  noop,
  storyCustomerContext,
  storyOnboardingDrafts,
  storyOnboardingStepperSteps,
  storyRequestOrigin,
} from "../../../onboarding/onboarding-story-fixtures";
import type { OnboardingStep } from "../../../onboarding/onboarding-types";
import { useOnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";

import { OnboardingCompanyLegalEntitiesStep } from "../company-step/OnboardingCompanyLegalEntitiesStep";
import { OnboardingCompanyZetelStep } from "../company-step/OnboardingCompanyZetelStep";
import { OnboardingCustomerStep } from "../customer-step/OnboardingCustomerStep";
import { OnboardingExtrasStep } from "../extras-step/OnboardingExtrasStep";
import { OnboardingInvoicingStep } from "../invoicing-step/OnboardingInvoicingStep";
import {
  OnboardingFloatingStepsMobileCardLead,
  OnboardingFloatingStepsNav,
} from "./OnboardingFloatingStepsNav";
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

function RegistrationChromeComposer({ initialStep }: { initialStep: OnboardingStep }) {
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [stepsSheetOpen, setStepsSheetOpen] = useState(false);
  const [requestOrigin, setRequestOrigin] = useState<typeof storyRequestOrigin | "">(
    storyRequestOrigin,
  );

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
        activeStep: registrationStepIndex(step, storyOnboardingDrafts),
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

  const handleStepChange = (index: number) => {
    const seq = registrationStepsSequence(storyOnboardingDrafts);
    const nextStep = seq[index];
    if (nextStep) {
      setStep(nextStep);
    }
  };

  return (
    <OnboardingShell
      pageTitle={REGISTRATION_PHASE_TITLE}
      pageDescription={REGISTRATION_PHASE_DESCRIPTION}
      onSignInClick={noop}
    >
      <div className="flex w-full flex-col gap-region md:flex-row md:items-start md:gap-region">
        <div className="min-w-0 flex-1">
          <StepLayout
            className={cn("ms-auto me-0 w-full")}
            hideHeader
            chromeStyle="card"
            minHeight={STABLE_STEP_MIN_HEIGHT}
            stepKey={viewProps.activeStep}
            variant="onboarding"
            title={`${registrationChrome.title} (${step})`}
            description={`${registrationChrome.description} Storybook-demo: gebruik het stappen-paneel rechts.`}
            backAction={viewProps.backAction}
            primaryAction={viewProps.primaryAction}
            mobileCardLead={
              viewProps.steps.length > 0 ? (
                <OnboardingFloatingStepsMobileCardLead
                  steps={viewProps.steps}
                  activeStep={viewProps.activeStep}
                  onOpenStepsSheet={() => setStepsSheetOpen(true)}
                  stepsSheetOpen={stepsSheetOpen}
                />
              ) : undefined
            }
          >
            <div className="flex flex-col gap-micro">
              <H1>{`${registrationChrome.title} (${step})`}</H1>
              <P className="text-base leading-[1.6] text-muted-foreground">
                {`${registrationChrome.description} Storybook-demo: op een smal scherm staan stap-voortgang en “Stappen” bovenaan de kaart; het volledige overzicht opent in een paneel.`}
              </P>
            </div>
            <StepBodies
              model={model}
              step={step}
              requestOrigin={requestOrigin}
              setRequestOrigin={setRequestOrigin}
            />
          </StepLayout>
        </div>

        <OnboardingFloatingStepsNav
          steps={viewProps.steps}
          activeStep={viewProps.activeStep}
          interactive
          onStepChange={handleStepChange}
          sheetOpen={stepsSheetOpen}
          onSheetOpenChange={setStepsSheetOpen}
        />
      </div>
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
  requestOrigin: typeof storyRequestOrigin | "";
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
      return <OnboardingCompanyZetelStep model={model} />;
    case "innovationAttest":
      return (
        <p className="max-w-prose text-sm text-muted-foreground">
          Het innovatie‑attest formulier wordt getoond in de volledige flow met{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">OnboardingFlowProvider</code>.
        </p>
      );
    case "metrologyAttest":
      return (
        <p className="max-w-prose text-sm text-muted-foreground">
          De metrologie-intake wordt getoond in de volledige flow met{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">OnboardingFlowProvider</code>.
        </p>
      );
    case "companyLegalEntities":
      return <OnboardingCompanyLegalEntitiesStep model={model} />;
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
          "Composes onboarding shell with the step rail beside the main card on wide viewports; on narrow viewports the step summary and sheet trigger sit in the card header while the full list opens in a side sheet.",
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
