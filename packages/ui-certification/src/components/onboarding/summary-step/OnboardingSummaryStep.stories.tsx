import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { useOnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";
import { baseOnboardingFlowViewProps } from "../../../onboarding/onboarding-story-fixtures";

import { OnboardingSummaryStep } from "./OnboardingSummaryStep";

type Model = ReturnType<typeof useOnboardingRegistrationLayoutModel>;

function Layout({ children }: { children: (model: Model) => ReactNode }) {
  const props = useMemo(() => baseOnboardingFlowViewProps(), []);
  const model = useOnboardingRegistrationLayoutModel(props);
  return <>{children(model)}</>;
}

const meta = {
  title: "Onboarding/Presentational/Steps/Summary",
  component: OnboardingSummaryStep,
  parameters: {
    layout: "padded",
    docs: { description: { component: "Nazicht / samenvatting." } },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingSummaryStep>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => <Layout>{(m) => <OnboardingSummaryStep model={m} />}</Layout>,
};
