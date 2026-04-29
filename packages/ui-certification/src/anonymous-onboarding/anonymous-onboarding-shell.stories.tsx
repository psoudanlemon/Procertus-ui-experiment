import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  CERTIFICATION_PHASE_DESCRIPTION,
  CERTIFICATION_PHASE_TITLE,
  REGISTRATION_PHASE_DESCRIPTION,
  REGISTRATION_PHASE_TITLE,
} from "./anonymous-onboarding-constants";
import { AnonymousOnboardingShell } from "./anonymous-onboarding-shell";

const meta = {
  title: "Anonymous onboarding/AnonymousOnboardingShell",
  component: AnonymousOnboardingShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Public onboarding chrome: logo, page title and description, and **Aanmelden** (outline). Wraps the certification wizard (`step === "request"`) and registration `StepLayout` phases.',
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AnonymousOnboardingShell>;

export default meta;

export const CertificationPhaseChrome: StoryObj<typeof meta> = {
  name: "Certification phase",
  args: {
    pageTitle: CERTIFICATION_PHASE_TITLE,
    pageDescription: CERTIFICATION_PHASE_DESCRIPTION,
    onSignInClick: () => {},
  },
  render: (args) => (
    <AnonymousOnboardingShell {...args}>
      <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-8 text-sm text-muted-foreground">
        Content slot — hier staat de certification wizard in de echte flow.
      </div>
    </AnonymousOnboardingShell>
  ),
};

export const RegistrationPhaseChrome: StoryObj<typeof meta> = {
  name: "Registration phase",
  args: {
    pageTitle: REGISTRATION_PHASE_TITLE,
    pageDescription: REGISTRATION_PHASE_DESCRIPTION,
    onSignInClick: () => {},
  },
  render: (args) => (
    <AnonymousOnboardingShell {...args}>
      <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-8 text-sm text-muted-foreground">
        Content slot — hier staat het registratie-StepLayout (customer / company / summary).
      </div>
    </AnonymousOnboardingShell>
  ),
};
