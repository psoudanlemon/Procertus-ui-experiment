import { Button, H1 } from "@procertus-ui/ui";
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
    <div className="min-h-svh bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <img
                src={procertusLogo}
                alt="PROCERTUS, certification that builds trust"
                className="h-16 w-auto dark:hidden"
              />
              <img
                src={procertusLogo}
                alt="PROCERTUS, certification that builds trust"
                className="hidden h-16 w-auto brightness-0 invert dark:block"
              />
              <H1 className="mt-3">{pageTitle}</H1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {pageDescription}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="outline"
                className="justify-center"
                onClick={onSignInClick}
              >
                Aanmelden
              </Button>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
