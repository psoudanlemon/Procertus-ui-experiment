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

import { OnboardingExtrasStep } from "./OnboardingExtrasStep";

type Model = ReturnType<typeof useOnboardingRegistrationLayoutModel>;

function Layout({ children }: { children: (model: Model) => ReactNode }) {
  const props = useMemo(() => {
    const drafts = storyOnboardingDrafts;
    const ctx = storyCustomerContext();
    return baseOnboardingFlowViewProps({
      step: "extras",
      context: ctx,
      drafts,
      steps: storyOnboardingStepperSteps({
        step: "extras",
        context: ctx,
        drafts,
        requestOrigin: storyRequestOrigin,
      }),
      activeStep: stepIndex("extras"),
      companyLookupPhase: "ready",
      primaryAction: { label: "Verder", onClick: () => {}, disabled: false },
      rows: [],
      effectiveSummaryIncludedDraftIds: [],
    });
  }, []);
  const model = useOnboardingRegistrationLayoutModel(props);
  return <>{children(model)}</>;
}

const meta = {
  title: "Onboarding/Presentational/Steps/Extras",
  component: OnboardingExtrasStep,
  parameters: {
    layout: "padded",
    docs: { description: { component: "Extra contacten (optioneel)." } },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingExtrasStep>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => <Layout>{(m) => <OnboardingExtrasStep model={m} />}</Layout>,
};
