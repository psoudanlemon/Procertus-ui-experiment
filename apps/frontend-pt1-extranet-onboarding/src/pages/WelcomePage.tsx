import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  H1,
  H3,
} from "@procertus-ui/ui";
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
    <AuthLayout card={false} panel={AUTH_PANEL}>
      <>
        <div className="text-center">
          <H1>Meld je aan</H1>
          <H3>of start een PROCERTUS-aanvraag</H3>
          <p className="mt-micro text-base leading-[1.4] text-muted-foreground">
           Heb je nog geen PROCERTUS-account en wil je bekijken of PROCERTUS bij jou past? Start hieronder de registratiewizard om je aanvraag voor te bereiden.
          </p>
        </div>

        <Card className="gap-section py-section shadow-[var(--shadow-proc-md)] ring-0">
          <CardContent className="space-y-6 px-section">
            <div className="space-y-2">
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
          </CardContent>
        </Card>

        <Card className="gap-section py-section shadow-proc-xs">
          <CardHeader className="gap-1 px-section pb-0">
            <CardTitle>Nieuw bij PROCERTUS?</CardTitle>
            <CardDescription className="leading-6">
              Start de aanvraagwizard zonder account. Je maakt pas een account aan wanneer je het aanvraagpakket indient.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-section">
            <Button asChild variant="outline" className="w-full">
              <Link to="/welcome/start">Start certificatieaanvraag</Link>
            </Button>
          </CardContent>
        </Card>
      </>
    </AuthLayout>
  );
}
