import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft01Icon,
  ArrowRight02Icon,
  Call02Icon,
  CheckmarkCircle02Icon,
  FilePlusIcon,
  Mail01Icon,
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
  PublicRegistryAppShell,
} from "@procertus-ui/ui";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
import { APP_FOOTER } from "../layouts/footerConfig";
import { findWegwijzerService } from "../features/wegwijzer/wegwijzer-services";

const LOGIN_PATH = "/welcome/login";
const WEGWIJZER_PATH = "/welcome";
const INFO_REQUEST_PATH = (serviceId: string) => `/welcome/info-request/${serviceId}`;
const FORMAL_REQUEST_PATH = "/welcome/start";
const EXPERT_CALL_PATH = (serviceId: string) => `/welcome/expert-call/${serviceId}`;

const CATEGORY_LABEL = {
  certification: "Productcertificatie",
  attest: "Attest",
  document: "Document",
  inspection: "Keuring",
} as const;

export function TriagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);

  if (!service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  const { entry } = service;

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate(`${WEGWIJZER_PATH}?service=${entry.id}`);
    }
  };

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
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-region p-boundary">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 self-start text-muted-foreground"
          onClick={handleBack}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          Terug
        </Button>

        <section className="flex flex-col gap-micro">
          <Badge variant="outline" className="self-start">
            {CATEGORY_LABEL[entry.category]}
          </Badge>
          <H1>Hoe wilt u {entry.label} aanvragen?</H1>
          <p className="max-w-[44rem] text-base leading-normal text-muted-foreground">
            Kies een vrijblijvende informatieaanvraag voor een prijsopgave en advies, of start
            meteen het formele dossier zodat de ontvankelijkheidsbeoordeling kan beginnen.
          </p>
        </section>

        <div className="flex flex-col gap-section">
          <div className="grid grid-cols-1 gap-section md:grid-cols-2">
            <TriageOptionCard
              tone="muted"
              icon={Mail01Icon}
              title="Informatieve aanvraag"
              description="Voor wie eerst wil afstemmen. U bezorgt enkele basisgegevens en uw vraag, wij komen terug met een prijsopgave en het te volgen traject."
              bullets={[
                "Geen verplichting tot opstart",
                "Reactie binnen enkele werkdagen",
                "Mogelijkheid tot live sessie tijdens het invullen",
              ]}
              cta="Start informatieve aanvraag"
              to={INFO_REQUEST_PATH(entry.id)}
            />
            <TriageOptionCard
              tone="primary"
              icon={FilePlusIcon}
              title="Formele aanvraag"
              description="Voor wie klaar is om in te dienen. Het volledige aanvraagpakket wordt opgebouwd en de ontvankelijkheidsbeoordeling kan starten."
              bullets={[
                "Volledige aanvraagwizard",
                "Dossier wordt actief opgevolgd",
                "Account aanmaken pas bij indiening",
              ]}
              cta="Start formele aanvraag"
              to={FORMAL_REQUEST_PATH}
            />
          </div>

          <Card className="flex flex-col gap-component border border-primary/20 bg-primary/5 px-section py-section sm:flex-row sm:items-center sm:justify-between sm:gap-section">
            <div className="flex min-w-0 flex-1 flex-col gap-micro">
              <p className="text-heading-sm font-semibold">Liever eerst een expert spreken?</p>
              <p className="text-sm leading-normal text-muted-foreground">
                Plan een live online sessie van één uur en doorloop de vereisten samen met een PROCERTUS-expert.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full bg-background sm:w-auto sm:shrink-0">
              <Link to={EXPERT_CALL_PATH(entry.id)}>
                <HugeiconsIcon icon={Call02Icon} className="size-4" />
                Plan een expert call
                <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </PublicRegistryAppShell>
    </DensityProvider>
  );
}

type TriageOptionCardProps = {
  tone: "muted" | "primary";
  icon: typeof Mail01Icon;
  title: string;
  description: string;
  bullets: readonly string[];
  cta: string;
  to: string;
};

function TriageOptionCard({ tone, icon, title, description, bullets, cta, to }: TriageOptionCardProps) {
  const isPrimary = tone === "primary";
  return (
    <Card
      className={
        isPrimary
          ? "flex h-full flex-col gap-section py-section shadow-proc-md ring-2 ring-primary/30"
          : "flex h-full flex-col gap-section py-section shadow-proc-xs"
      }
    >
      <CardHeader className="gap-component px-section">
        <div
          className={
            isPrimary
              ? "flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground"
              : "flex size-11 items-center justify-center rounded-md bg-secondary text-secondary-foreground"
          }
        >
          <HugeiconsIcon icon={icon} className="size-6" />
        </div>
        <div className="flex flex-col gap-micro">
          <CardTitle className="text-heading-md">{title}</CardTitle>
          <CardDescription className="text-sm leading-normal">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-section px-section">
        <ul className="flex flex-col gap-micro">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-micro text-sm leading-normal">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mt-0.5 size-4 shrink-0 text-success" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <Button asChild variant={isPrimary ? "default" : "outline"} className="w-full justify-between">
          <Link to={to}>
            {cta}
            <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
