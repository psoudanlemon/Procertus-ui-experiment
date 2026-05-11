import type { PublicRegistryHeaderProps } from "@procertus-ui/ui";
import { CertificationRequestWizard } from "../../certification-request-wizard/CertificationRequestWizard";
import type { CertificationRequestWizardProps } from "../../certification-request-wizard/CertificationRequestWizard";
import { OnboardingShell } from "../shell/OnboardingShell";
import type { OnboardingRequestStepCopy } from "./onboarding-request-step-copy";
import type { ReactNode } from "react";

type RegistryHeaderLanguageProps = Pick<
  PublicRegistryHeaderProps,
  "languages" | "activeLanguage" | "onLanguageChange"
>;

export type OnboardingRequestStepProps = {
  copy?: Partial<OnboardingRequestStepCopy>;
  pageTitle: string;
  pageDescription: string;
  onSignInClick: () => void;
  certificationWizardProps: CertificationRequestWizardProps;
  headerLeadingActions?: React.ReactNode;
  headerTrailingActions?: React.ReactNode;
  languages?: RegistryHeaderLanguageProps["languages"];
  activeLanguage?: RegistryHeaderLanguageProps["activeLanguage"];
  onLanguageChange?: RegistryHeaderLanguageProps["onLanguageChange"];
  loginUrl?: string;
  guestLanguagePlacement?: PublicRegistryHeaderProps["guestLanguagePlacement"];
  sessionBanner?: React.ReactNode;
};

export function OnboardingRequestStep({
  pageTitle,
  pageDescription,
  onSignInClick,
  certificationWizardProps,
  headerLeadingActions,
  headerTrailingActions,
  languages,
  activeLanguage,
  onLanguageChange,
  loginUrl,
  guestLanguagePlacement,
  sessionBanner,
}: OnboardingRequestStepProps) {
  return (
    <OnboardingShell
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      onSignInClick={onSignInClick}
      headerLeadingActions={headerLeadingActions}
      headerTrailingActions={headerTrailingActions}
      languages={languages}
      activeLanguage={activeLanguage}
      onLanguageChange={onLanguageChange}
      loginUrl={loginUrl}
      guestLanguagePlacement={guestLanguagePlacement}
      sessionBanner={sessionBanner}
    >
      <CertificationRequestWizard {...certificationWizardProps} />
    </OnboardingShell>
  );
}
