import {
  ONBOARDING_FLOW_STORAGE_KEY,
  ONBOARDING_REGISTRATION_COMPLETE_PATH,
  OnboardingFlowProvider,
  createLocalStorageOnboardingFlowPersistence,
} from "@procertus-ui/ui-certification";
import { AlertDialogProvider } from "@procertus-ui/ui";
import { useMockPrototypeIsAuthenticated } from "@procertus-ui/ui-pt1-prototype";
import { useLayoutEffect, useMemo } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import { PublicPrototypeLanguageProvider } from "./PublicPrototypeLanguageContext";

/**
 * Guest routes: no management sidebar — pages use **`AuthLayout`** from ui-lib (same pattern as authentication stories).
 * Matches Storybook decorator **`data-density="operational"`** for auth screens.
 *
 * Sets **`data-public-layout`** on `<html>` so app CSS can restore normal document scrolling (shared
 * **`globals.css`** locks **`overflow`** on html/body/#root for the signed-in shell).
 *
 * Wraps public guest flows in {@link OnboardingFlowProvider} so triage, wizard, and formal registration
 * share persisted onboarding state; see {@link PublicCertificationRequestsCart}.
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
          <div data-density="operational" className="relative min-h-svh">
            <Outlet />
          </div>
        </AlertDialogProvider>
      </PublicPrototypeLanguageProvider>
    </OnboardingFlowProvider>
  );
}
