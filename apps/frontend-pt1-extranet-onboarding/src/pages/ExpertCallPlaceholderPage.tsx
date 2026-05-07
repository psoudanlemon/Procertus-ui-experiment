import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft01Icon,
  Calendar01Icon,
  ClockIcon,
  Tick02Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DensityProvider,
  H1,
  H4,
  PrefillFieldSkeleton,
  PublicRegistryAppShell,
  Separator,
  Skeleton,
} from "@procertus-ui/ui";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
import { APP_FOOTER } from "../layouts/footerConfig";
import { findWegwijzerService } from "../features/wegwijzer/wegwijzer-services";

const LOGIN_PATH = "/welcome/login";
const WEGWIJZER_PATH = "/welcome";
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;

const SESSION_HIGHLIGHTS = [
  "Eén uur live online — videogesprek met scherm delen",
  "Doorloop van de minimale vereisten en uw dossier",
  "Concrete inschatting van het te volgen traject",
] as const;

export function ExpertCallPlaceholderPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);

  // /welcome/expert-call/:serviceId with an unknown id → fall back to overview.
  // /welcome/expert-call (no param) is the generic intake from the Hero banner.
  if (serviceId && !service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  const entry = service?.entry;
  const backTo = entry ? TRIAGE_PATH(entry.id) : WEGWIJZER_PATH;
  const backLabel = entry ? "Terug naar keuze" : "Terug naar overzicht";
  const heading = entry ? `Plan een gesprek over ${entry.label}` : "Plan een gesprek met een PROCERTUS-expert";
  const intro = entry
    ? "Eén uur live met een PROCERTUS-expert om de vereisten en uw dossier door te nemen, voordat u een aanvraag start."
    : "Eén uur live met een PROCERTUS-expert om uw vraag, uw dossier en de juiste route samen door te nemen.";

  return (
    <DensityProvider density="spacious">
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
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-region p-boundary">
        <Button asChild variant="ghost" size="sm" className="-ml-2 self-start text-muted-foreground">
          <Link to={backTo}>
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            {backLabel}
          </Link>
        </Button>

        <section className="flex flex-col gap-component">
          <Badge variant="outline" className="self-start">
            Expert call
          </Badge>
          <H1 className="text-heading-lg">{heading}</H1>
          <p className="text-base leading-normal text-muted-foreground">{intro}</p>
        </section>

        <Card className="gap-section py-section shadow-proc-xs">
          <CardHeader className="px-section">
            <CardTitle className="text-heading-md">Wat u kunt verwachten</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-component px-section">
            <ul className="flex flex-col gap-micro">
              {SESSION_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-micro text-sm leading-normal">
                  <HugeiconsIcon icon={Tick02Icon} className="mt-0.5 size-4 shrink-0 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <Separator />

          <CardHeader className="px-section">
            <CardTitle className="text-heading-md">Kies een moment</CardTitle>
            <CardDescription>
              De agendamodule wordt momenteel afgewerkt; hieronder ziet u de definitieve structuur.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-section px-section">
            <div className="flex flex-col gap-component">
              <H4>Datum</H4>
              <Skeleton
                aria-label="Agenda wordt voorbereid"
                className="h-44 w-full rounded-md border border-dashed bg-muted/10"
              />
              <p className="flex items-center gap-micro text-xs text-muted-foreground">
                <HugeiconsIcon icon={Calendar01Icon} className="size-3" />
                Beschikbare slots verschijnen hier zodra de agenda is gekoppeld.
              </p>
            </div>

            <div className="flex flex-col gap-component">
              <H4>Tijdvak</H4>
              <div className="grid grid-cols-2 gap-micro sm:grid-cols-4">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <Skeleton key={i} className="h-9 rounded-md border border-dashed bg-muted/10" />
                ))}
              </div>
              <p className="flex items-center gap-micro text-xs text-muted-foreground">
                <HugeiconsIcon icon={ClockIcon} className="size-3" />
                Sessies duren één uur en starten op het hele of halve uur.
              </p>
            </div>
          </CardContent>

          <Separator />

          <CardHeader className="px-section">
            <CardTitle className="text-heading-md">Uw gegevens</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-component px-section">
            <PrefillFieldSkeleton label="Voornaam" prefilled={false} />
            <PrefillFieldSkeleton label="Achternaam" prefilled={false} />
            <PrefillFieldSkeleton label="E-mailadres" prefilled={false} />
            <PrefillFieldSkeleton label="Bedrijfsnaam" prefilled={false} />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-component sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            U ontvangt een agenda-uitnodiging met videolink zodra het moment is bevestigd.
          </p>
          <Button disabled className="w-full sm:w-auto">
            <HugeiconsIcon icon={Video01Icon} className="size-4" />
            Bevestig expert call
          </Button>
        </div>
      </div>
    </PublicRegistryAppShell>
    </DensityProvider>
  );
}
