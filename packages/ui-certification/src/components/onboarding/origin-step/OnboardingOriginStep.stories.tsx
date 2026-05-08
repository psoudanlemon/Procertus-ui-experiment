import type { Meta, StoryObj } from "@storybook/react-vite";

import { OnboardingOriginStep } from "./OnboardingOriginStep";

const meta = {
  title: "Onboarding/Presentational/Steps/Origin",
  component: OnboardingOriginStep,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Land of regio chooser (`SelectChoiceCardGroup`) — first registration body step.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingOriginStep>;

export default meta;

export const Unselected: StoryObj<typeof meta> = {
  args: {
    originFieldBase: "storybook-origin",
    requestOrigin: "",
    setRequestOrigin: () => {},
  },
};

export const BelgiumSelected: StoryObj<typeof meta> = {
  name: "Belgium selected",
  args: {
    originFieldBase: "storybook-origin-be",
    requestOrigin: "be",
    setRequestOrigin: () => {},
  },
};
