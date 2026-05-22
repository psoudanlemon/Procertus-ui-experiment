import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import type { OnboardingRequestOrigin } from "../../../onboarding/onboarding-request-origin";

import { OnboardingOriginStepRedesign } from "./OnboardingOriginStepRedesign";

const meta = {
  title: "Onboarding/Redesign/Steps/3.5 Origin (redesign)",
  component: OnboardingOriginStepRedesign,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Redesign van 'Land of regio'. Alle vier opties op gelijke visuele tier (ChoiceCard, trailing control) met de vlag als leading-icon vooraan de titel. Doel: ongelijkheid tussen hero- en secondary-cards wegnemen, vlag minder subtiel maken.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingOriginStepRedesign>;

export default meta;

function Interactive({
  initial,
}: {
  initial: OnboardingRequestOrigin | "";
}) {
  const [origin, setOrigin] = useState<OnboardingRequestOrigin | "">(initial);
  return (
    <OnboardingOriginStepRedesign
      originFieldBase="storybook-origin-redesign"
      requestOrigin={origin}
      setRequestOrigin={setOrigin}
    />
  );
}

const placeholderArgs = {
  originFieldBase: "storybook-origin-redesign",
  requestOrigin: "" as OnboardingRequestOrigin | "",
  setRequestOrigin: () => {},
};

export const Unselected: StoryObj<typeof meta> = {
  args: placeholderArgs,
  render: () => <Interactive initial="" />,
};

export const BelgiumSelected: StoryObj<typeof meta> = {
  name: "Belgium selected",
  args: placeholderArgs,
  render: () => <Interactive initial="be" />,
};

export const EuSelected: StoryObj<typeof meta> = {
  name: "EU selected",
  args: placeholderArgs,
  render: () => <Interactive initial="eu" />,
};
