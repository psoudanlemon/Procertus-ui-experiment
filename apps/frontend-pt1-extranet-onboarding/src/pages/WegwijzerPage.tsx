import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert02Icon,
  ArrowRight02Icon,
  Call02Icon,
  ClockIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DensityProvider,
  DownloadableDocumentListItem,
  type DownloadableDocumentListItemData,
  H1,
  H4,
  ItemGroup,
  PublicRegistryAppShell,
  SelectChoiceCard,
  SelectChoiceCardGroup,
  type SelectChoiceVariant,
  Separator,
  Skeleton,
  useIsMobile,
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

const CATEGORY_LABEL: Record<WegwijzerService["entry"]["category"], string> = {
  certification: "Productcertificatie",
  attest: "Attest",
  document: "Document",
  inspection: "Keuring",
};

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

        <img
          aria-hidden
          src={procertusLogomark}
          alt=""
          className="pointer-events-none absolute right-0 bottom-0 size-96 select-none opacity-5"
        />
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
// Contextual Expert Call — embedded in each Master Card, scoped to the service
// ---------------------------------------------------------------------------

function ContextualExpertCall({
  serviceId,
  serviceLabel,
}: {
  /** When omitted, the expert-call link is generic (no service context). */
  serviceId?: string;
  /** When omitted, copy falls back to a generic "uw keuze" phrasing. */
  serviceLabel?: string;
}) {
  const heading = serviceLabel ? `Hulp nodig bij uw ${serviceLabel}-dossier?` : "Hulp nodig bij uw keuze?";
  const description = serviceLabel
    ? `Plan een online sessie van één uur en bereid uw ${serviceLabel}-dossier samen met een PROCERTUS-expert voor.`
    : "Plan een online sessie van één uur en doorloop de vereisten samen met een PROCERTUS-expert.";
  return (
    <section
      aria-label={serviceLabel ? `Expertbegeleiding voor ${serviceLabel}` : "Expertbegeleiding"}
      className="flex flex-col gap-component rounded-lg border border-primary/20 bg-primary/5 p-section sm:flex-row sm:items-center sm:gap-section"
    >
      <div className="flex flex-1 flex-col gap-micro">
        <p className="text-heading-sm font-semibold text-heading-foreground">{heading}</p>
        <p className="text-sm leading-normal text-muted-foreground">{description}</p>
      </div>
      <Button
        asChild
        variant="outline"
        className="w-full bg-background text-primary hover:bg-background/90 sm:w-auto"
      >
        <Link to={EXPERT_CALL_PATH(serviceId)}>
          <HugeiconsIcon icon={Call02Icon} className="size-4" />
          Boek expert-sessie (1u)
          <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
        </Link>
      </Button>
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
    <SelectChoiceCardGroup
      layout="stack"
      value={activeId}
      onValueChange={onChange}
      aria-label="Kies een certificaat"
      className="flex-row flex-nowrap overflow-x-auto"
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
    <Card className="flex flex-col gap-section py-region shadow-proc-xs md:shadow-proc-sm">
      <CardHeader className="gap-section px-region">
        <div className="flex items-center justify-between gap-section">
          <div className="flex flex-col gap-micro">
            <CardTitle className="text-heading-xl">{entry.label}</CardTitle>
            <CardDescription className="max-w-2xl text-base leading-normal">
              {entry.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0">
            {CATEGORY_LABEL[entry.category]}
          </Badge>
        </div>
      </CardHeader>

      {isExternal && externalReferral && (
        <CardContent className="px-region">
          <Alert>
            <HugeiconsIcon icon={InformationCircleIcon} />
            <AlertTitle>Externe verwijzing — {externalReferral.name}</AlertTitle>
            <AlertDescription>{externalReferral.description}</AlertDescription>
          </Alert>
        </CardContent>
      )}

      <Separator />

      <CardContent className="flex flex-col gap-section px-region">
        <MasterCardSections service={service} />
      </CardContent>

      {isInnovation && (
        <CardContent className="px-region">
          <Alert>
            <HugeiconsIcon icon={Alert02Icon} />
            <AlertTitle>Richtwaarde formele opstart</AlertTitle>
            <AlertDescription>
              De ontvankelijkheidsbeoordeling start vanaf <strong>€&nbsp;2.000 (excl. btw)</strong>. Een
              definitieve offerte volgt na intake.
            </AlertDescription>
          </Alert>
        </CardContent>
      )}

      <CardContent className="px-region">
        <section className="flex flex-col gap-component">
          <H4>Regels en documentatie</H4>
          <p className="text-sm text-muted-foreground">
            Documenten op basis van uw selectie voor {entry.shortLabel} (prototype — downloadlinks zijn gemockt).
          </p>
          <ItemGroup className="w-full">
            {documents.map((doc) => (
              <DownloadableDocumentListItem key={doc.id} {...doc} />
            ))}
          </ItemGroup>
        </section>
      </CardContent>

      <CardContent className="px-region">
        <MasterCardTimeline service={service} />
      </CardContent>

      <CardContent className="px-region">
        <ContextualExpertCall serviceId={entry.id} serviceLabel={entry.shortLabel} />
      </CardContent>

      <Separator />

      <CardContent className="flex px-region sm:justify-end">
        <Button asChild size="lg" className="w-full justify-between sm:w-auto sm:min-w-72">
          <Link to={ONBOARDING_STEPPER_PATH}>
            Start aanvraag voor {entry.shortLabel}
            <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
          </Link>
        </Button>
      </CardContent>
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
  const isMobile = useIsMobile();

  if (!content) return <MasterCardSkeleton />;

  const whenToApplyBody = (
    <ul className="flex flex-col gap-micro">
      {content.whenToApply.map((item) => (
        <li key={item} className="flex items-start gap-component text-sm leading-normal">
          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
          <span className="max-w-3xl">{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col gap-section">
      <section className="flex flex-col gap-component">
        <H4>Wat is een {entry.label}</H4>
        <p className="max-w-3xl text-sm leading-normal">{content.what}</p>
      </section>

      {isMobile ? (
        <Accordion
          type="single"
          collapsible
          defaultValue="wanneer"
          className="rounded-md border"
        >
          <AccordionItem value="wanneer" className="px-section">
            <AccordionTrigger>Wanneer vraag je dit het beste aan</AccordionTrigger>
            <AccordionContent>{whenToApplyBody}</AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <section className="flex flex-col gap-component">
          <H4>Wanneer vraag je dit het beste aan</H4>
          {whenToApplyBody}
        </section>
      )}
    </div>
  );
}

function MasterCardTimeline({ service }: { service: WegwijzerService }) {
  const content = WEGWIJZER_SERVICE_CONTENT[service.entry.id];
  if (!content) return null;
  return (
    <section className="flex flex-col gap-component">
      <H4>Termijn</H4>
      <div className="flex w-full items-start gap-component rounded-md border bg-muted/40 p-component">
        <HugeiconsIcon icon={ClockIcon} className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <p className="text-sm leading-normal">{content.timeline}</p>
      </div>
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

