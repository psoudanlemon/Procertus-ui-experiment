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
import { OnboardingRequestStep } from "./OnboardingRequestStep";

const wizardProps = storyCertificationWizardProps(storyCustomerContext());

const meta = {
  title: "Onboarding/Presentational/Steps/Certification (request)",
  component: OnboardingRequestStep,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Certification phase: onboarding shell wrapping `CertificationRequestWizard`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingRequestStep>;

export default meta;

export const WithMemoryWizard: StoryObj<typeof meta> = {
  args: {
    pageTitle: CERTIFICATION_PHASE_TITLE,
    pageDescription: CERTIFICATION_PHASE_DESCRIPTION,
    onSignInClick: noop,
    certificationWizardProps: {
      ...(wizardProps as CertificationRequestWizardProps),
      sessionId: "storybook-onboarding-request-step",
    },
  },
};
