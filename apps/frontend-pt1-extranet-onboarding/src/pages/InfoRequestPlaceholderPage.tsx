import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft01Icon,
  ArrowRight02Icon,
  Call02Icon,
  MailSend01Icon,
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
  Checkbox,
  DensityProvider,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
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
const EXPERT_CALL_PATH = (serviceId: string) => `/welcome/expert-call/${serviceId}`;

export function InfoRequestPlaceholderPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);

  if (!service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  const { entry } = service;

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
          <Link to={TRIAGE_PATH(entry.id)}>
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Terug naar keuze
          </Link>
        </Button>

        <section className="flex flex-col gap-micro">
          <Badge variant="outline" className="self-start">
            Informatieve aanvraag
          </Badge>
          <H1 className="text-heading-lg">{entry.label}</H1>
          <p className="text-base leading-normal text-muted-foreground">
            Bezorg ons enkele basisgegevens en uw vraag. We komen terug met een prijsopgave en het te
            volgen traject — vrijblijvend.
          </p>
        </section>

        <Card className="gap-section py-section shadow-proc-xs">
          <CardHeader className="px-section">
            <CardTitle className="text-heading-md">Uw gegevens</CardTitle>
            <CardDescription>
              Het formulier wordt momenteel afgewerkt; de velden hieronder geven de definitieve structuur weer.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-component px-section">
            <PrefillFieldSkeleton label="Voornaam" prefilled={false} />
            <PrefillFieldSkeleton label="Achternaam" prefilled={false} />
            <PrefillFieldSkeleton label="E-mailadres" prefilled={false} />
            <PrefillFieldSkeleton label="Telefoonnummer" prefilled={false} />
            <PrefillFieldSkeleton label="Bedrijfsnaam" prefilled={false} />
          </CardContent>

          <Separator />

          <CardContent className="flex flex-col gap-component px-section">
            <H4>Uw vraag</H4>
            <PrefillFieldSkeleton label="Onderwerp" prefilled={false} />
            <Field>
              <FieldLabel>Toelichting</FieldLabel>
              <Skeleton className="h-28 w-full rounded-md border border-dashed bg-muted/10" />
              <FieldDescription>
                Beschrijf kort uw situatie, het project of de specifieke vraag rond {entry.shortLabel}.
              </FieldDescription>
            </Field>
          </CardContent>

          <Separator />

          <CardContent className="px-section">
            <LiveSessionFieldOption serviceId={entry.id} />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-component sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Door uw aanvraag te versturen ontvangt u binnen enkele werkdagen een bericht van een PROCERTUS-medewerker.
          </p>
          <Button disabled className="w-full sm:w-auto">
            <HugeiconsIcon icon={MailSend01Icon} className="size-4" />
            Verstuur informatieve aanvraag
          </Button>
        </div>
      </div>
    </PublicRegistryAppShell>
    </DensityProvider>
  );
}

function LiveSessionFieldOption({ serviceId }: { serviceId: string }) {
  return (
    <div className="flex flex-col gap-component rounded-lg border border-primary/20 bg-primary/5 p-section">
      <div className="flex items-start gap-component">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <HugeiconsIcon icon={Video01Icon} className="size-5" />
        </div>
        <div className="flex flex-col gap-micro">
          <h4 className="text-heading-sm font-semibold text-heading-foreground">
            Hulp nodig terwijl u invult?
          </h4>
          <p className="text-sm leading-normal text-muted-foreground">
            Vink onderstaande aan en een PROCERTUS-expert plant een live online sessie van één uur in
            om uw aanvraag samen te overlopen.
          </p>
        </div>
      </div>
      <Field orientation="horizontal" className="items-start gap-component">
        <Checkbox id="contact-for-live-session" className="mt-micro" />
        <FieldContent>
          <FieldLabel htmlFor="contact-for-live-session" className="cursor-pointer leading-normal">
            Contacteer mij voor een live sessie
          </FieldLabel>
          <FieldDescription>
            U wordt binnen één werkdag gecontacteerd om een moment te plannen.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Button asChild variant="ghost" size="sm" className="self-start text-primary hover:text-primary">
        <Link to={EXPERT_CALL_PATH(serviceId)}>
          <HugeiconsIcon icon={Call02Icon} className="size-4" />
          Of plan zelf direct een moment
          <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
