import { Button } from "@procertus-ui/ui";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { usePrototypeSession } from "../auth/usePrototypeSession";
import { AuthLayout, LoginForm } from "@procertus-ui/ui-lib";

const AUTH_PANEL = {
  gradient: true,
  title: "Certification that builds trust",
  subtitle: "Sign in to continue to your workspace.",
} as const;

export function WelcomePage() {
  const { signIn } = usePrototypeSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("jane.doe@company.com");
  const [password, setPassword] = useState("");

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your PROCERTUS account"
      panel={AUTH_PANEL}
    >
      <LoginForm
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        onForgotPassword={() => {}}
        onSubmit={() => {
          signIn();
          navigate("/app", { replace: true });
        }}
      />
      <div className="mt-section text-center">
        <Button variant="link" asChild className="h-auto p-0 text-sm font-normal">
          <Link to="/welcome/start">Start onboarding instead</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}
