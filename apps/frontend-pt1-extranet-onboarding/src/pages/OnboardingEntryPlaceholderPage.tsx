import { Button, Empty, EmptyActions, EmptyDescription, EmptyIcon, EmptyTitle } from "@procertus-ui/ui";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "@procertus-ui/ui-lib";

const PANEL = {
  gradient: true,
  title: "Get ready to collaborate",
  subtitle: "Onboarding will guide new members when the flow is implemented.",
} as const;

function RouteGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-6"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

/**
 * Placeholder for a future onboarding flow — same **`AuthLayout`** shell as other guest screens.
 */
export function OnboardingEntryPlaceholderPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Onboarding entry"
      description="This step is reserved for activation or first-run tasks. Nothing runs here yet in the prototype."
      panel={PANEL}
    >
      <Empty className="min-h-[220px] w-full max-w-full border-0 bg-transparent p-0 shadow-none">
        <EmptyIcon>
          <RouteGlyph />
        </EmptyIcon>
        <EmptyTitle>No steps to complete</EmptyTitle>
        <EmptyDescription>
          When onboarding ships, this card will be replaced by the real wizard. For now, return to sign in
          or explore the signed-in shell using the demo account path from the welcome screen.
        </EmptyDescription>
        <EmptyActions>
          <Button type="button" variant="outline" onClick={() => navigate("/welcome")}>
            Back to sign in
          </Button>
        </EmptyActions>
      </Empty>
    </AuthLayout>
  );
}
