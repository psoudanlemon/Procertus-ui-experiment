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
  title: "Aanvragen zonder drempel",
  subtitle: "Nieuwe klanten starten met hun certificatievraag. Registratie volgt pas bij indiening.",
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
      title="Start een PROCERTUS-aanvraag"
      description="Maak eerst duidelijk wat je wilt certificeren of attesteren. Aanmelden kan nog steeds voor bestaande vertegenwoordigers."
      panel={AUTH_PANEL}
    >
      <div className="mb-8 rounded-xl border border-border/70 bg-card p-4 shadow-proc-xs">
        <p className="text-sm font-medium text-foreground">Nieuw bij PROCERTUS?</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Start de aanvraagwizard zonder account. Je maakt pas een account aan wanneer je het aanvraagpakket indient.
        </p>
        <Button asChild className="mt-4 w-full">
          <Link to="/welcome/start">Start certificatieaanvraag</Link>
        </Button>
      </div>

      <div className="mb-4 space-y-2 border-t border-border/70 pt-6">
        <p className="text-sm font-medium text-foreground">Bestaande gebruiker</p>
        <p className="text-muted-foreground text-sm">Prototype: kies een mock gebruiker om aan te melden.</p>
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
    </AuthLayout>
  );
}
