import { ModeToggle } from "@procertus-ui/ui";
import { useMockPrototypeIsAuthenticated } from "@procertus-ui/ui-pt1-prototype";
import { useLayoutEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Guest routes: no management sidebar — pages use **`AuthLayout`** from ui-lib (same pattern as authentication stories).
 * Matches Storybook decorator **`data-density="operational"`** for auth screens.
 *
 * Sets **`data-public-layout`** on `<html>` so app CSS can restore normal document scrolling (shared
 * **`globals.css`** locks **`overflow`** on html/body/#root for the signed-in shell).
 */
export function PublicAppShell() {
  const isAuthenticated = useMockPrototypeIsAuthenticated();
  const location = useLocation();

  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);

  if (isAuthenticated && location.pathname.startsWith("/welcome")) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div data-density="operational" className="relative min-h-svh">
      <div className="fixed right-4 top-4 z-50">
        <ModeToggle />
      </div>
      <Outlet />
    </div>
  );
}
