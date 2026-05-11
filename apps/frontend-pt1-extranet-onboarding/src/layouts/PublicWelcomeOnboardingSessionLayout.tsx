import { Outlet } from "react-router-dom";

/**
 * Route group for welcome flows under {@link PublicAppShell} (share the same onboarding session +
 * {@link OnboardingFlowProvider} from the shell).
 */
export function PublicWelcomeOnboardingSessionLayout() {
  return <Outlet />;
}
