import { useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Calendar,
  DensityProvider,
  Field,
  FieldLabel,
  H4,
  Input,
  PublicRegistryAppShell,
  Separator,
} from "@procertus-ui/ui";
import { DetailCard } from "@procertus-ui/ui-lib";
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
  const location = useLocation();
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
  const intro = entry
    ? `Eén uur live met een PROCERTUS-expert om de vereisten voor ${entry.label} en uw dossier door te nemen, voordat u een aanvraag start.`
    : "Eén uur live met een PROCERTUS-expert om uw vraag, uw dossier en de juiste route samen door te nemen.";

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else if (entry) {
      navigate(TRIAGE_PATH(entry.id));
    } else {
      navigate(WEGWIJZER_PATH);
    }
  };

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
        <div className="mx-auto w-full max-w-7xl p-boundary">
          <DetailCard
            title="Plan een expert call"
            description={intro}
            footer={
              <>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleBack}
                  className="text-muted-foreground"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                  Terug
                </Button>
                <Button size="lg" disabled>
                  <HugeiconsIcon icon={Video01Icon} className="size-4" />
                  Bevestig expert call
                </Button>
              </>
            }
          >
            <section className="flex flex-col gap-component">
              <H4>Wat u kunt verwachten</H4>
              <ul className="flex flex-col gap-component">
                {SESSION_HIGHLIGHTS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-component text-sm leading-normal"
                  >
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className="mt-0.5 size-5 shrink-0 text-accent-foreground"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-component">
              <div className="flex flex-col">
                <H4>Kies een moment</H4>
                <p className="text-sm text-muted-foreground">
                  Sessies duren één uur en starten op het hele of halve uur.
                </p>
              </div>
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
                <p className="text-sm text-muted-foreground">
                  Uw expert call is gepland voor{" "}
                  <span className="font-medium text-foreground">{formattedSelection}</span>.
                </p>
              ) : null}
            </section>

            <section className="flex flex-col gap-component">
              <H4>Uw gegevens</H4>
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
              <p className="text-xs text-muted-foreground">
                U ontvangt een agenda-uitnodiging met videolink zodra het moment is bevestigd.
              </p>
            </section>
          </DetailCard>
        </div>
      </PublicRegistryAppShell>
    </DensityProvider>
  );
}
