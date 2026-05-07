import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  DensityProvider,
  Field,
  FieldLabel,
  H1,
  H2,
  Input,
  PublicRegistryAppShell,
  Separator,
} from "@procertus-ui/ui";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
import { APP_FOOTER } from "../layouts/footerConfig";
import { findWegwijzerService } from "../features/wegwijzer/wegwijzer-services";

const LOGIN_PATH = "/welcome/login";
const WEGWIJZER_PATH = "/welcome";
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;

const SESSION_HIGHLIGHTS = [
  "Eén uur live online, videogesprek met scherm delen",
  "Doorloop van de minimale vereisten en uw dossier",
  "Concrete inschatting van het te volgen traject",
] as const;

const TIME_SLOTS = [
  "09:00",
  "09:15",
  "09:30",
  "09:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
] as const;

const SELECTION_FORMATTER = new Intl.DateTimeFormat("nl-BE", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function ExpertCallPlaceholderPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);
  const formattedSelection =
    selectedDate && selectedSlot
      ? `${SELECTION_FORMATTER.format(selectedDate)} om ${selectedSlot}`
      : null;

  // /welcome/expert-call/:serviceId with an unknown id → fall back to overview.
  // /welcome/expert-call (no param) is the generic intake from the Hero banner.
  if (serviceId && !service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  const entry = service?.entry;
  const backTo = entry ? TRIAGE_PATH(entry.id) : WEGWIJZER_PATH;
  const backLabel = entry ? "Terug naar keuze" : "Terug naar overzicht";
  const intro = entry
    ? `Eén uur live met een PROCERTUS-expert om de vereisten voor ${entry.label} en uw dossier door te nemen, voordat u een aanvraag start.`
    : "Eén uur live met een PROCERTUS-expert om uw vraag, uw dossier en de juiste route samen door te nemen.";

  return (
    <DensityProvider density="operational">
      <PublicRegistryAppShell
        hideFab
        header={{
          logo: (
            <img
              src={procertusLogo}
              alt="PROCERTUS, certification that builds trust"
              className="h-8 w-auto dark:brightness-0 dark:invert"
            />
          ),
          onLogin: () => navigate(LOGIN_PATH),
        }}
        footer={APP_FOOTER}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-component p-boundary">
          <Button asChild variant="ghost" size="sm" className="-ml-2 self-start text-muted-foreground">
            <Link to={backTo}>
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              {backLabel}
            </Link>
          </Button>

          <Card className="gap-section py-section shadow-proc-xs">
            <CardHeader className="gap-micro px-section">
              <H1>Plan een expert call</H1>
              <CardDescription className="max-w-[44rem] text-base leading-normal">
                {intro}
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardHeader className="px-section">
              <H2 className="text-heading-md">Wat u kunt verwachten</H2>
            </CardHeader>
              <CardContent className="px-section">
                <ul className="flex flex-col gap-component">
                  {SESSION_HIGHLIGHTS.map((item) => (
                    <li key={item} className="flex items-start gap-component text-base leading-normal">
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        className="mt-0.5 size-5 shrink-0 text-accent-foreground"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <Separator />

              <CardHeader className="px-section">
                <H2 className="text-heading-md">Kies een moment</H2>
                <CardDescription>
                  Sessies duren één uur en starten op het hele of halve uur.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-section">
                <div className="flex flex-col gap-section md:flex-row md:items-stretch md:gap-0">
                  <div className="flex flex-1 justify-center md:justify-start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="w-fit"
                    />
                  </div>
                  <Separator orientation="vertical" className="hidden md:block" />
                  <div className="flex max-h-80 flex-col gap-micro overflow-y-auto md:w-44 md:pl-section">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <Button
                          key={slot}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => setSelectedSlot(slot)}
                          className="w-full justify-center"
                          disabled={!selectedDate}
                        >
                          {slot}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                {formattedSelection ? (
                  <p className="mt-section text-sm text-muted-foreground">
                    Uw expert call is gepland voor{" "}
                    <span className="font-medium text-foreground">{formattedSelection}</span>.
                  </p>
                ) : null}
              </CardContent>

              <Separator />

              <CardHeader className="px-section">
                <H2 className="text-heading-md">Uw gegevens</H2>
              </CardHeader>
              <CardContent className="px-section">
                <div className="grid grid-cols-1 gap-section sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="expert-call-firstname">Voornaam</FieldLabel>
                    <Input id="expert-call-firstname" autoComplete="given-name" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="expert-call-lastname">Achternaam</FieldLabel>
                    <Input id="expert-call-lastname" autoComplete="family-name" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="expert-call-email">E-mailadres</FieldLabel>
                    <Input id="expert-call-email" type="email" autoComplete="email" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="expert-call-company">Bedrijfsnaam</FieldLabel>
                    <Input id="expert-call-company" autoComplete="organization" />
                  </Field>
                </div>
              </CardContent>

              <Separator />

              <CardFooter className="flex flex-col items-stretch gap-component px-section sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground sm:max-w-[28rem]">
                  U ontvangt een agenda-uitnodiging met videolink zodra het moment is bevestigd.
                </p>
                <Button disabled className="w-full sm:w-auto">
                  <HugeiconsIcon icon={Video01Icon} className="size-4" />
                  Bevestig expert call
                </Button>
              </CardFooter>
          </Card>
        </div>
      </PublicRegistryAppShell>
    </DensityProvider>
  );
}
