import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { useOnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";
import { baseOnboardingFlowViewProps } from "../../../onboarding/onboarding-story-fixtures";

import { OnboardingSummaryStepRedesign } from "./OnboardingSummaryStepRedesign";

type Model = ReturnType<typeof useOnboardingRegistrationLayoutModel>;

function Layout({ children }: { children: (model: Model) => ReactNode }) {
  const props = useMemo(() => baseOnboardingFlowViewProps(), []);
  const model = useOnboardingRegistrationLayoutModel(props);
  return <>{children(model)}</>;
}

const meta = {
  title: "Onboarding/Redesign/Steps/3.10 Summary (redesign)",
  component: OnboardingSummaryStepRedesign,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Redesign van 'Nazicht'. Zware kaarten zijn vervangen door compacte secties met thin border en tabelvorm — pagina in één oogopslag scanbaar. Multi-select drafts staan als checkbox-lijst in tabel. Knop 'Aanvragen wijzigen' is verwijderd.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingSummaryStepRedesign>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => <Layout>{(m) => <OnboardingSummaryStepRedesign model={m} />}</Layout>,
};
