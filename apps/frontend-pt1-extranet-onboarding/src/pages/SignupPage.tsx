import { Button } from "@procertus-ui/ui";
import { MockPrototypePasswordlessLoginForm } from "@procertus-ui/ui-pt1-prototype";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "@procertus-ui/ui-lib";

/** Same asset as Storybook `AuthLayout` carousel 1 — served from `public/auth-carousel-1.png`. */
const AUTH_PANEL = {
  image: "/auth-carousel-1.png",
} as const;

export function SignupPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Welkom terug"
      description="Meld je aan met het e-mailadres waarmee je bij PROCERTUS geregistreerd staat."
      panel={AUTH_PANEL}
      belowCard={
        <p className="text-center text-sm text-muted-foreground">
          Nog geen account?{" "}
          <Button asChild variant="link" className="text-sm">
            <Link to="/welcome">Start je aanvraag hier</Link>
          </Button>
        </p>
      }
    >
      <MockPrototypePasswordlessLoginForm
        submitLabel="Inloggen"
        onLoggedIn={() => navigate("/requests", { replace: true })}
      />
    </AuthLayout>
  );
}
