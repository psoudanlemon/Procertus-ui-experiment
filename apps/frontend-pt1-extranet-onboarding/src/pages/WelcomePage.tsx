import { Button } from "@procertus-ui/ui";
import {
  MockPrototypeUserSelect,
  useMockPrototypeLogin,
  useMockPrototypeUserSelection,
} from "@procertus-ui/ui-pt1-prototype";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout, LoginForm } from "@procertus-ui/ui-lib";

const AUTH_PANEL = {
  gradient: true,
  title: "Certification that builds trust",
  subtitle: "Sign in to continue to your workspace.",
} as const;

export function WelcomePage() {
  const login = useMockPrototypeLogin();
  const { selectedUserId, selectedUser } = useMockPrototypeUserSelection();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const email = selectedUser?.email ?? "";

  const pickerError = selectedUserId === null ? "Choose a prototype user to continue." : undefined;

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your PROCERTUS account"
      panel={AUTH_PANEL}
    >
      <div className="mb-6 space-y-2">
        <p className="text-muted-foreground text-sm">Prototype: mock user session</p>
        <MockPrototypeUserSelect className="w-full" aria-label="Prototype user" />
      </div>
      <LoginForm
        email={email}
        onEmailChange={() => {}}
        password={password}
        onPasswordChange={setPassword}
        onForgotPassword={() => {}}
        error={pickerError}
        onSubmit={() => {
          if (selectedUserId === null) return;
          login();
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
