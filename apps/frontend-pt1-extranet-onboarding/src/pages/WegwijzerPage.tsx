import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert02Icon,
  ArrowRight02Icon,
  ClockIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  DensityProvider,
  DownloadableDocumentListItem,
  type DownloadableDocumentListItemData,
  FadingScrollList,
  H1,
  H2,
  H4,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  ItemGroup,
  PublicRegistryAppShell,
  SelectChoiceCard,
  SelectChoiceCardGroup,
  type SelectChoiceVariant,
  Skeleton,
} from "@procertus-ui/ui";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
import procertusLogomark from "@procertus-ui/ui/assets/logomark.svg";
import { APP_FOOTER } from "../layouts/footerConfig";
import {
  WEGWIJZER_SERVICES,
  type WegwijzerService,
} from "../features/wegwijzer/wegwijzer-services";
import { WEGWIJZER_SERVICE_CONTENT } from "../features/wegwijzer/wegwijzer-service-content";

const LOGIN_PATH = "/welcome/login";
/** Onboarding-stepper — primary CTA target for "Start aanvraag voor [Naam]". */
const ONBOARDING_STEPPER_PATH = "/welcome/start";
const EXPERT_CALL_PATH = (serviceId?: string) =>
  serviceId ? `/welcome/expert-call/${serviceId}` : "/welcome/expert-call";

const DEFAULT_ACTIVE_SERVICE = WEGWIJZER_SERVICES.find((s) => s.tier === 1) ?? WEGWIJZER_SERVICES[0];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function WegwijzerPage() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string>(DEFAULT_ACTIVE_SERVICE?.entry.id ?? "");

  const activeService = WEGWIJZER_SERVICES.find((s) => s.entry.id === activeId);

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
        <Hero />

        <div className="flex w-full flex-col gap-section px-boundary pb-boundary">
          <ServiceChoiceCards activeId={activeId} onChange={setActiveId} />

          <div
            key={activeId}
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200 min-w-0"
          >
            {activeService ? <MasterCard service={activeService} /> : null}
          </div>
        </div>
      </PublicRegistryAppShell>
    </DensityProvider>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[image:var(--background-image-gradient-procertus-hero)] opacity-60"
      />
      <div className="relative flex w-full flex-col items-start gap-component px-boundary pt-boundary pb-region text-left">
        <H1 className="max-w-3xl text-heading-xl">Start uw certificeringstraject</H1>
        <p className="max-w-[44rem] text-base leading-normal text-muted-foreground">
          Bij PROCERTUS bieden we verschillende diensten aan. Hieronder vindt u een overzicht van
          ons aanbod. Selecteer een certificaat om meer informatie te krijgen of direct uw aanvraag
          te starten.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Service ChoiceCards — selection grid (variants per spec)
// ---------------------------------------------------------------------------

function getCardVariant(
  service: WegwijzerService,
  activeId: string,
  index: number,
): SelectChoiceVariant {
  // First three pills (BENOR, CE, SSD) always render as elevated for emphasis.
  if (index < 3) return "elevated";
  if (service.entry.id === activeId) return "elevated";
  if (service.tier === 3) return "faded";
  return "default";
}

function ServiceChoiceCards({
  activeId,
  onChange,
}: {
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <FadingScrollList orientation="horizontal" fadeColor="from-background">
      <SelectChoiceCardGroup
        layout="stack"
        value={activeId}
        onValueChange={onChange}
        aria-label="Kies een certificaat"
        className="flex-row flex-nowrap gap-component"
      >
        {WEGWIJZER_SERVICES.map((service, index) => (
          <SelectChoiceCard
            key={service.entry.id}
            value={service.entry.id}
            controlId={`wegwijzer-pick-${service.entry.id}`}
            title={service.pillLabel ?? service.entry.label}
            variant={getCardVariant(service, activeId, index)}
            appearance="minimal"
            className="shrink-0 has-[>[data-slot=field]]:w-auto"
          />
        ))}
      </SelectChoiceCardGroup>
    </FadingScrollList>
  );
}

// ---------------------------------------------------------------------------
// Master Card — selected service detail
// ---------------------------------------------------------------------------

function MasterCard({ service }: { service: WegwijzerService }) {
  const { entry, externalReferral } = service;
  const isInnovation = entry.id === "innovation-attest";
  const isExternal = service.tier === 3;
  const documents = buildMockDocuments(service);

  return (
    <Card className="flex flex-col gap-0 pt-0 shadow-proc-xs md:shadow-proc-sm">
      <CardHeader className="gap-0 border-b bg-muted/40 px-region pt-region pb-section">
        <H2>{entry.label}</H2>
        <CardDescription className="text-base leading-normal">
          {entry.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative isolate flex flex-col gap-region overflow-hidden p-region">
        <img
          aria-hidden
          src={procertusLogomark}
          alt=""
          className="pointer-events-none absolute -right-16 -bottom-16 -z-10 size-96 select-none opacity-10"
        />
        {isExternal && externalReferral && (
          <Alert>
            <HugeiconsIcon icon={InformationCircleIcon} />
            <AlertTitle>Externe verwijzing — {externalReferral.name}</AlertTitle>
            <AlertDescription>{externalReferral.description}</AlertDescription>
          </Alert>
        )}

        <MasterCardSections service={service} />

        {isInnovation && (
          <Alert>
            <HugeiconsIcon icon={Alert02Icon} />
            <AlertTitle>Richtwaarde formele opstart</AlertTitle>
            <AlertDescription>
              De ontvankelijkheidsbeoordeling start vanaf <strong>€&nbsp;2.000 (excl. btw)</strong>. Een
              definitieve offerte volgt na intake.
            </AlertDescription>
          </Alert>
        )}

        <section className="flex flex-col gap-component">
          <div className="flex flex-col">
            <H4>Regels en documentatie</H4>
            <p className="text-sm text-muted-foreground">
              Documenten op basis van uw selectie voor {entry.shortLabel} (prototype — downloadlinks zijn gemockt).
            </p>
          </div>
          <ItemGroup className="w-full">
            {documents.map((doc) => (
              <DownloadableDocumentListItem key={doc.id} {...doc} />
            ))}
          </ItemGroup>
        </section>

        <MasterCardTimeline service={service} />
      </CardContent>

      <CardFooter className="flex-wrap-reverse justify-end gap-component p-region sm:flex-nowrap sm:justify-between">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button asChild variant="link">
              <Link to={EXPERT_CALL_PATH(entry.id)}>Hulp nodig?</Link>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side="top" sideOffset={12} align="start" className="w-80">
            <p className="font-semibold text-heading-foreground">
              Hulp nodig bij uw {entry.shortLabel}-dossier?
            </p>
            <p className="text-muted-foreground">
              Plan een online sessie van één uur en bereid uw {entry.shortLabel}-dossier samen met een PROCERTUS-expert voor.
            </p>
          </HoverCardContent>
        </HoverCard>
        <Button asChild size="lg">
          <Link to={ONBOARDING_STEPPER_PATH}>
            Aanvraag starten
            <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function buildMockDocuments(service: WegwijzerService): DownloadableDocumentListItemData[] {
  const { entry } = service;
  return [
    {
      id: `${entry.id}-ptv`,
      title: `Producttechnische fiche (PTV) — ${entry.shortLabel}`,
      description: `Technische specificaties en profieldelen voor ${entry.shortLabel} (prototype).`,
      formatHint: "PDF · mock",
      href: "#",
    },
    {
      id: `${entry.id}-ruleset`,
      title: "Ruleset matrix — geselecteerde certificeringen en attesten",
      description: `Normenkader en regelpaden voor: ${entry.shortLabel}.`,
      formatHint: "PDF · mock",
      href: "#",
    },
    {
      id: `${entry.id}-checklist`,
      title: "Indien-checklist aanvraagpakket",
      description: "Controlelijst afgestemd op de samenstelling van dit pakket vóór indiening (prototype).",
      formatHint: "PDF · mock",
      href: "#",
    },
  ];
}

// ---------------------------------------------------------------------------
// Master Card sections — uniform 4-section structure per service
// ---------------------------------------------------------------------------

function MasterCardSections({ service }: { service: WegwijzerService }) {
  const { entry } = service;
  const content = WEGWIJZER_SERVICE_CONTENT[entry.id];

  if (!content) return <MasterCardSkeleton />;

  return (
    <div className="flex flex-col gap-region">
      <section className="flex flex-col gap-component">
        <H4 className="leading-none">Wat is een {entry.label}</H4>
        <p className="text-sm leading-normal">{content.what}</p>
      </section>

      <section className="flex flex-col gap-component">
        <H4>Wanneer vraag je dit het beste aan</H4>
        <ul className="flex flex-col gap-micro">
          {content.whenToApply.map((item) => (
            <li key={item} className="flex items-start gap-component text-sm leading-normal">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="max-w-3xl">{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function MasterCardTimeline({ service }: { service: WegwijzerService }) {
  const content = WEGWIJZER_SERVICE_CONTENT[service.entry.id];
  if (!content) return null;
  return (
    <section className="flex items-start gap-component self-start rounded-md bg-info p-component text-info-foreground">
      <HugeiconsIcon icon={ClockIcon} className="mt-0.5 size-5 shrink-0" />
      <p className="text-sm leading-normal">{content.timeline}</p>
    </section>
  );
}

function MasterCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-section"
      aria-busy
      aria-label="Inhoud wordt voorbereid"
    >
      {[0, 1, 2, 3].map((i) => (
        <section key={i} className="flex flex-col gap-component">
          <Skeleton className="h-4 w-48" />
          <div className="flex flex-col gap-micro">
            <Skeleton className="h-3 w-full max-w-3xl" />
            <Skeleton className="h-3 w-11/12 max-w-3xl" />
            <Skeleton className="h-3 w-9/12 max-w-3xl" />
          </div>
        </section>
      ))}
    </div>
  );
}

