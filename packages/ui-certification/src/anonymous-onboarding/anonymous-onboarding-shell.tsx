import { PageHeader, PublicRegistryAppShell } from "@procertus-ui/ui";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
import type { ReactNode } from "react";

export function AnonymousOnboardingShell({
  pageTitle,
  pageDescription,
  onSignInClick,
  children,
}: {
  pageTitle: string;
  pageDescription: string;
  onSignInClick: () => void;
  children: ReactNode;
}) {
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
      }}
      hideFab
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-region p-boundary">
        <PageHeader title={pageTitle} description={pageDescription} />
        {children}
      </div>
    </PublicRegistryAppShell>
  );
}
