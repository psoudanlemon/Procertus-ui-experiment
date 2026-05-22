import {
  ONBOARDING_FLOW_STORAGE_KEY,
  ONBOARDING_REGISTRATION_COMPLETE_PATH,
  OnboardingFlowProvider,
  createLocalStorageOnboardingFlowPersistence,
  useActiveFormalInquiryContinueBanner,
} from "@procertus-ui/ui-certification";
import { AlertDialogProvider, DensityProvider, PublicRegistryAppShell } from "@procertus-ui/ui";
import { useMockPrototypeIsAuthenticated } from "@procertus-ui/ui-pt1-prototype";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
import { useLayoutEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { ActiveInquiryContinueAlert } from "./ActiveInquiryContinueAlert";
import { APP_FOOTER } from "./footerConfig";
import { PublicCertificationRequestsCart } from "./PublicCertificationRequestsCart";
import {
  PublicPrototypeLanguageProvider,
  usePublicPrototypeRegistryLanguageHeaderProps,
} from "./PublicPrototypeLanguageContext";
import { WelcomePublicHeaderLeading } from "./WelcomePublicHeaderLeading";
import { FORMAL_ONBOARDING_PATH, formalOnboardingStepPath } from "../routes/formal-request-routing";
import { PUBLIC_GUEST_LOGIN_PATH, PUBLIC_GUEST_WELCOME_PATH } from "../routes/guestPaths";

function PublicGuestRegistryChrome() {
  const navigate = useNavigate();
  const location = useLocation();
  const registryLang = usePublicPrototypeRegistryLanguageHeaderProps();

  const formalBanner = useActiveFormalInquiryContinueBanner({
    pathname: location.pathname,
    formalOnboardingPathPrefix: FORMAL_ONBOARDING_PATH,
  });

  const continuePath = useMemo(
    () => formalOnboardingStepPath(formalBanner.resumeStep),
    [formalBanner.resumeStep],
  );

  return (
    <DensityProvider density="spacious">
      <PublicRegistryAppShell
        hideFab
        header={{
          logo: (
            <img
              src={procertusLogo}
              alt="PROCERTUS, certification that builds trust"
              className="h-8 w-auto dark:brightness-0 dark:invert"
            />
          ),
          logoHref: PUBLIC_GUEST_WELCOME_PATH,
          onLogoClick: () => navigate(PUBLIC_GUEST_WELCOME_PATH),
          loginUrl: PUBLIC_GUEST_LOGIN_PATH,
          onLogin: () => navigate(PUBLIC_GUEST_LOGIN_PATH),
          leadingActions: <WelcomePublicHeaderLeading />,
          trailingActions: <PublicCertificationRequestsCart />,
          guestLanguagePlacement: "trailing",
          ...registryLang,
        }}
        footer={APP_FOOTER}
      >
        <div data-slot="public-guest-outlet" className="flex flex-1 flex-col">
          <div className="mx-auto w-full max-w-7xl px-boundary pt-boundary">
            {formalBanner.visible ? (
              <ActiveInquiryContinueAlert
                includedCount={formalBanner.includedCount}
                continuePath={continuePath}
              />
            ) : null}
          </div>
          <Outlet />
        </div>
      </PublicRegistryAppShell>
    </DensityProvider>
  );
}

/**
 * Guest routes: no management sidebar — pages use **`AuthLayout`** from ui-lib (same pattern as authentication stories).
 *
 * Sets **`data-public-layout`** on `<html>` so app CSS can restore normal document scrolling (shared
 * **`globals.css`** locks **`overflow`** on html/body/#root for the signed-in shell).
 *
 * Wraps public guest flows in {@link OnboardingFlowProvider} plus shared registry chrome
 * ({@link PublicRegistryAppShell}, density, footer, header actions). The header always mounts
 * {@link PublicCertificationRequestsCart}; it shows the basket trigger only when drafts exist and
 * animates that icon in and out (sheet content is unchanged).
 */
export function PublicAppShell() {
  const isAuthenticated = useMockPrototypeIsAuthenticated();
  const navigate = useNavigate();
  const persistence = useMemo(
    () => createLocalStorageOnboardingFlowPersistence({ storageKey: ONBOARDING_FLOW_STORAGE_KEY }),
    [],
  );

  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <OnboardingFlowProvider
      persistence={persistence}
      navigate={navigate}
      registrationCompletePath={ONBOARDING_REGISTRATION_COMPLETE_PATH}
    >
      <PublicPrototypeLanguageProvider>
        <AlertDialogProvider>
          <PublicGuestRegistryChrome />
        </AlertDialogProvider>
      </PublicPrototypeLanguageProvider>
    </OnboardingFlowProvider>
  );
}
