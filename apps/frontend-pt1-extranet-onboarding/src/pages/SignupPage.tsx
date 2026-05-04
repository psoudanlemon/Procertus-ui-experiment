import { MockPrototypePasswordlessLoginForm } from "@procertus-ui/ui-pt1-prototype";
import { useNavigate } from "react-router-dom";

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
      description="Meld je aan met je e-mailadres waarmee je bij PROCERTUS geregistreerd staat."
      notice="Let op! Je e-mailadres wordt steeds gekoppeld aan 1 account dat gelinked wordt aan 1 organisatie. Meld aan met het juiste e-mailadres om aan te melden bij de juiste organisatie."
      panel={AUTH_PANEL}
    >
      <MockPrototypePasswordlessLoginForm
        submitLabel="Inloggen"
        onLoggedIn={() => navigate("/requests", { replace: true })}
      />
    </AuthLayout>
  );
}
