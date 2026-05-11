import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { stepIndex } from "../../../onboarding/onboarding-flow-helpers";
import {
  baseOnboardingFlowViewProps,
  storyCustomerContext,
  storyOnboardingDrafts,
  storyOnboardingStepperSteps,
  storyRequestOrigin,
} from "../../../onboarding/onboarding-story-fixtures";
import {
  DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  findVatPrototypePreset,
  vatLookupSimulationStepsForPreset,
  VAT_PROTOTYPE_PRESETS,
} from "../../../onboarding/lib/vatPrototypePresets";
import { useOnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";

import { OnboardingInvoicingStep } from "./OnboardingInvoicingStep";

type Model = ReturnType<typeof useOnboardingRegistrationLayoutModel>;

function Layout({
  children,
}: {
  children: (model: Model) => ReactNode;
}) {
  const props = useMemo(() => {
    const drafts = storyOnboardingDrafts;
    const ctx = storyCustomerContext();
    const activePreset =
      findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;
    return baseOnboardingFlowViewProps({
      step: "invoicing",
      context: ctx,
      drafts,
      steps: storyOnboardingStepperSteps({
        step: "invoicing",
        context: ctx,
        drafts,
        requestOrigin: storyRequestOrigin,
      }),
      activeStep: stepIndex("invoicing"),
      companyLookupPhase: "ready",
      lookupProgress: 100,
      lookupStepIndex: 4,
      vatLookupStepLabels: vatLookupSimulationStepsForPreset(activePreset),
      primaryAction: { label: "Verder", onClick: () => {}, disabled: false },
      rows: [],
      effectiveSummaryIncludedDraftIds: drafts.map((d) => d.id),
    });
  }, []);
  const model = useOnboardingRegistrationLayoutModel(props);
  return <>{children(model)}</>;
}

const meta = {
  title: "Onboarding/Presentational/Steps/Invoicing",
  component: OnboardingInvoicingStep,
  parameters: {
    layout: "padded",
    docs: { description: { component: "Facturatie stap." } },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingInvoicingStep>;

export default meta;

export const Default = {
  render: () => <Layout>{(m) => <OnboardingInvoicingStep model={m} />}</Layout>,
} satisfies StoryObj<typeof OnboardingInvoicingStep>;
