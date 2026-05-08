import { CertificationRequestWizard } from "../../certification-request-wizard/CertificationRequestWizard";
import type { CertificationRequestWizardProps } from "../../certification-request-wizard/CertificationRequestWizard";
import { OnboardingShell } from "../shell/OnboardingShell";
import type { OnboardingRequestStepCopy } from "./onboarding-request-step-copy";

export type OnboardingRequestStepProps = {
  copy?: Partial<OnboardingRequestStepCopy>;
  pageTitle: string;
  pageDescription: string;
  onSignInClick: () => void;
  certificationWizardProps: CertificationRequestWizardProps;
};

export function OnboardingRequestStep({
  pageTitle,
  pageDescription,
  onSignInClick,
  certificationWizardProps,
}: OnboardingRequestStepProps) {
  return (
    <OnboardingShell
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      onSignInClick={onSignInClick}
    >
      <CertificationRequestWizard {...certificationWizardProps} />
    </OnboardingShell>
  );
}
