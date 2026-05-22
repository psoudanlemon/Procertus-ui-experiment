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
import { useOnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";

import { OnboardingCustomerStepRedesign } from "./OnboardingCustomerStepRedesign";

function Layout({
  children,
}: {
  children: (model: ReturnType<typeof useOnboardingRegistrationLayoutModel>) => ReactNode;
}) {
  const props = useMemo(() => {
    const ctx = storyCustomerContext({
      organizationName: "",
      country: "",
      addressStreet: "",
      addressHouseNumber: "",
      addressPostalCode: "",
      addressCity: "",
    });
    return baseOnboardingFlowViewProps({
      step: "customer",
      context: ctx,
      drafts: storyOnboardingDrafts,
      steps: storyOnboardingStepperSteps({
        step: "customer",
        context: ctx,
        drafts: storyOnboardingDrafts,
        requestOrigin: storyRequestOrigin,
      }),
      activeStep: stepIndex("customer"),
      primaryAction: { label: "Verder", onClick: () => {}, disabled: false },
      rows: [],
      effectiveSummaryIncludedDraftIds: [],
    });
  }, []);
  const model = useOnboardingRegistrationLayoutModel(props);
  return <>{children(model)}</>;
}

const meta = {
  title: "Onboarding/Redesign/Steps/3.6 Customer (redesign)",
  component: OnboardingCustomerStepRedesign,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Redesign van 'Registratie'. Twee hero choice cards 'Bent u de wettelijke vertegenwoordiger?' worden één checkbox 'Ik vul namens iemand anders in'. Drievoudige titelstapel rond 'Wettelijke vertegenwoordiger' wordt één sectiekop met een lichter sub-label voor het indiener-blok.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingCustomerStepRedesign>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => <Layout>{(model) => <OnboardingCustomerStepRedesign model={model} />}</Layout>,
};
