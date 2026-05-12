import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  REGISTRATION_PHASE_DESCRIPTION,
  REGISTRATION_PHASE_TITLE,
} from "../../../onboarding/onboarding-constants";
import { OnboardingShell } from "./OnboardingShell";

const meta = {
  title: "Onboarding/Presentational/Shell",
  component: OnboardingShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Public onboarding shell: registry header + page title/description + main slot (certification wizard or registration step layout).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingShell>;

export default meta;

export const RegistrationPhase: StoryObj<typeof meta> = {
  args: {
    pageTitle: REGISTRATION_PHASE_TITLE,
    pageDescription: REGISTRATION_PHASE_DESCRIPTION,
    onSignInClick: () => {},
  },
  render: (args) => (
    <OnboardingShell {...args}>
      <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-8 text-sm text-muted-foreground">
        Content slot — registration StepLayout lives here in production.
      </div>
    </OnboardingShell>
  ),
};
