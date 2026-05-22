import { Button, Empty, EmptyActions, EmptyDescription, EmptyIcon, EmptyTitle } from "@procertus-ui/ui";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "@procertus-ui/ui-lib";

const PANEL = {
  gradient: true,
  title: "Klaar om samen te werken",
  subtitle: "De onboarding loodst nieuwe teamleden door zodra de flow er staat.",
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
      title="Onboarding"
      description="Deze stap is voorbehouden voor activatie of een eerste gebruik. Hier draait nog niets in het prototype."
      panel={PANEL}
    >
      <Empty className="min-h-[220px] w-full max-w-full border-0 bg-transparent p-0 shadow-none">
        <EmptyIcon>
          <RouteGlyph />
        </EmptyIcon>
        <EmptyTitle>Geen stappen om te doorlopen</EmptyTitle>
        <EmptyDescription>
          Zodra de onboarding live gaat, vervangt de echte wizard deze kaart. Ga voorlopig terug naar
          aanmelden of verken de ingelogde omgeving via het demo-account vanaf het welkomstscherm.
        </EmptyDescription>
        <EmptyActions>
          <Button type="button" variant="outline" onClick={() => navigate("/welcome")}>
            Terug naar aanmelden
          </Button>
        </EmptyActions>
      </Empty>
    </AuthLayout>
  );
}
