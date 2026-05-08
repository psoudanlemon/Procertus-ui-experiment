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

import { OnboardingCustomerStep } from "./OnboardingCustomerStep";

function Layout({
  children,
}: {
  children: (model: ReturnType<typeof useOnboardingRegistrationLayoutModel>) => ReactNode;
}) {
  const props = useMemo(
    () =>
      baseOnboardingFlowViewProps({
        step: "customer",
        context: storyCustomerContext({
          organizationName: "",
          country: "",
          addressStreet: "",
          addressHouseNumber: "",
          addressPostalCode: "",
          addressCity: "",
        }),
        drafts: storyOnboardingDrafts,
        steps: storyOnboardingStepperSteps({
          step: "customer",
          context: storyCustomerContext({
            organizationName: "",
            country: "",
            addressStreet: "",
            addressHouseNumber: "",
            addressPostalCode: "",
            addressCity: "",
          }),
          drafts: storyOnboardingDrafts,
          requestOrigin: storyRequestOrigin,
        }),
        activeStep: stepIndex("customer"),
        primaryAction: { label: "Verder", onClick: () => {}, disabled: false },
        rows: [],
        effectiveSummaryIncludedDraftIds: [],
      }),
    [],
  );
  const model = useOnboardingRegistrationLayoutModel(props);
  return <>{children(model)}</>;
}

const meta = {
  title: "Onboarding/Presentational/Steps/Customer",
  component: OnboardingCustomerStep,
  parameters: { layout: "padded", docs: { description: { component: "Registration — customer / identiteit body." } } },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingCustomerStep>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <Layout>{(model) => <OnboardingCustomerStep model={model} />}</Layout>
  ),
};
