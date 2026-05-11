import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { stepIndex } from "../../../onboarding/onboarding-flow-helpers";
import {
  baseOnboardingFlowViewProps,
  storyCustomerContext,
  storyEmptyCompanyFieldKeySet,
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

import { OnboardingCompanyZetelStep } from "./OnboardingCompanyZetelStep";

type Model = ReturnType<typeof useOnboardingRegistrationLayoutModel>;

function Layout({
  build,
  children,
}: {
  build: () => Parameters<typeof baseOnboardingFlowViewProps>[0];
  children: (model: Model) => ReactNode;
}) {
  const props = useMemo(() => baseOnboardingFlowViewProps(build()), []);
  const model = useOnboardingRegistrationLayoutModel(props);
  return <>{children(model)}</>;
}

const meta = {
  title: "Onboarding/Presentational/Steps/Company · maatschappelijke zetel",
  component: OnboardingCompanyZetelStep,
  parameters: {
    layout: "padded",
    docs: { description: { component: "Maatschappelijke zetel + mock VAT lookup UI." } },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingCompanyZetelStep>;

export default meta;

export const LookupReady: StoryObj<typeof meta> = {
  args: {},
  render: () => (
    <Layout
      build={() => {
        const drafts = storyOnboardingDrafts;
        const ctx = storyCustomerContext();
        return {
          step: "company",
          context: ctx,
          drafts,
          steps: storyOnboardingStepperSteps({
            step: "company",
            context: ctx,
            drafts,
            requestOrigin: storyRequestOrigin,
          }),
          activeStep: stepIndex("company"),
          primaryAction: { label: "Verder", onClick: () => {}, disabled: false },
          rows: [],
        };
      }}
    >
      {(model) => <OnboardingCompanyZetelStep model={model} />}
    </Layout>
  ),
};

export const LookupLoading: StoryObj<typeof meta> = {
  args: {},
  render: () => (
    <Layout
      build={() => {
        const drafts = storyOnboardingDrafts;
        const ctx = storyCustomerContext({
          organizationName: "",
          country: "",
          addressStreet: "",
          addressHouseNumber: "",
          addressPostalCode: "",
          addressCity: "",
        });
        const activePreset =
          findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;
        return {
          step: "company",
          context: ctx,
          drafts,
          steps: storyOnboardingStepperSteps({
            step: "company",
            context: ctx,
            drafts,
            requestOrigin: storyRequestOrigin,
          }),
          activeStep: stepIndex("company"),
          companyLookupPhase: "loading",
          lookupProgress: 48,
          lookupStepIndex: 2,
          vatLookupStepLabels: vatLookupSimulationStepsForPreset(activePreset),
          companyPrefillFieldKeys: storyEmptyCompanyFieldKeySet,
          companyFieldsResolvedInSimulation: storyEmptyCompanyFieldKeySet,
          vatNumberForDisplay: ctx.vatNumber.trim(),
          emailForDisplay: ctx.representativeEmail.trim(),
          activeVatPreset: activePreset,
          prototypeVatPresetId: activePreset.id,
          primaryAction: { label: "Verder", onClick: () => {}, disabled: true },
          rows: [],
        };
      }}
    >
      {(model) => <OnboardingCompanyZetelStep model={model} />}
    </Layout>
  ),
};
