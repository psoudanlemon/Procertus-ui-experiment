import {
  PageHeader,
  PublicRegistryAppShell,
  type PublicRegistryHeaderProps,
} from "@procertus-ui/ui";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
import type { ReactNode } from "react";

type RegistryHeaderLanguageProps = Pick<
  PublicRegistryHeaderProps,
  "languages" | "activeLanguage" | "onLanguageChange"
>;

type RegistryGuestLanguagePlacement = PublicRegistryHeaderProps["guestLanguagePlacement"];

export type OnboardingShellProps = {
  pageTitle: string;
  pageDescription: string;
  onSignInClick: () => void;
  /** Leading registry header slot (e.g. color mode). */
  headerLeadingActions?: React.ReactNode;
  /** Trailing registry header slot before language (e.g. inquiry cart). */
  headerTrailingActions?: React.ReactNode;
  /** Guest language switcher (prototype / i18n hook-up). */
  languages?: RegistryHeaderLanguageProps["languages"];
  activeLanguage?: RegistryHeaderLanguageProps["activeLanguage"];
  onLanguageChange?: RegistryHeaderLanguageProps["onLanguageChange"];
  /** `<a href>` for the guest login control (used with SPA `onSignInClick`). */
  loginUrl?: string;
  /** When host renders language in {@link headerLeadingActions}, set `"leading"`. */
  guestLanguagePlacement?: RegistryGuestLanguagePlacement;
  /** Rendered after {@link PageHeader}, before main content (e.g. session notices). */
  sessionBanner?: ReactNode;
  /** When true, skip {@link PublicRegistryAppShell} — host supplies outer registry chrome + footer. */
  embedded?: boolean;
  children: ReactNode;
};

/** Public onboarding chrome: logo, page header, Sign in — used by certification + registration phases. */
export function OnboardingShell({
  pageTitle,
  pageDescription,
  onSignInClick,
  headerLeadingActions,
  headerTrailingActions,
  languages,
  activeLanguage,
  onLanguageChange,
  loginUrl,
  guestLanguagePlacement,
  sessionBanner,
  embedded = false,
  children,
}: OnboardingShellProps) {
  const body = (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-region p-boundary">
      <PageHeader kicker="Uw PROCERTUS traject" title={pageTitle} description={pageDescription} />
      {sessionBanner}
      {children}
    </div>
  );

  if (embedded) {
    return body;
  }

  return (
    <PublicRegistryAppShell
      header={{
        logo: (
          <img
            src={procertusLogo}
            alt="PROCERTUS, certification that builds trust"
            className="h-8 w-auto dark:brightness-0 dark:invert"
          />
        ),
        onLogin: onSignInClick,
        loginUrl,
        leadingActions: headerLeadingActions,
        trailingActions: headerTrailingActions,
        languages,
        activeLanguage,
        onLanguageChange,
        guestLanguagePlacement,
      }}
      hideFab
    >
      {body}
    </PublicRegistryAppShell>
  );
}
