import { ModeToggle } from "@procertus-ui/ui";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { usePrototypeSession } from "../auth/usePrototypeSession";

/**
 * Guest routes: no management sidebar — pages use **`AuthLayout`** from ui-lib (same pattern as authentication stories).
 * Matches Storybook decorator **`data-density="operational"`** for auth screens.
 */
export function PublicAppShell() {
  const { isAuthenticated } = usePrototypeSession();
  const location = useLocation();

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
