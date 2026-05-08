import type { Meta, StoryObj } from "@storybook/react-vite";

import type { CertificationRequestWizardProps } from "../../certification-request-wizard/CertificationRequestWizard";
import {
  CERTIFICATION_PHASE_DESCRIPTION,
  CERTIFICATION_PHASE_TITLE,
} from "../../../onboarding/onboarding-constants";
import {
  noop,
  storyCertificationWizardProps,
  storyCustomerContext,
} from "../../../onboarding/onboarding-story-fixtures";
import { OnboardingRequestStep } from "../request-step/OnboardingRequestStep";

const wizard = storyCertificationWizardProps(storyCustomerContext());

const meta = {
  title: "Onboarding/Flow compositions/Certification phase",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Certification phase shell: `OnboardingRequestStep` = `OnboardingShell` + `CertificationRequestWizard` (same structure as live `step === \"request\"`).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const WithMemoryBackend: StoryObj<typeof meta> = {
  name: "Wizard (memory backend)",
  render: () => (
    <OnboardingRequestStep
      pageTitle={CERTIFICATION_PHASE_TITLE}
      pageDescription={CERTIFICATION_PHASE_DESCRIPTION}
      onSignInClick={noop}
      certificationWizardProps={
        {
          ...wizard,
          sessionId: "storybook-onboarding-flow-composition-cert",
        } as CertificationRequestWizardProps
      }
    />
  ),
};
