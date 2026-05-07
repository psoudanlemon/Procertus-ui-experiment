import { useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert02Icon,
  ArrowRight02Icon,
  ClockIcon,
  InformationCircleIcon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  cn,
  DensityProvider,
  DownloadableDocumentGrid,
  type DownloadableDocumentListItemData,
  H1,
  H4,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  PublicRegistryAppShell,
  Skeleton,
} from "@procertus-ui/ui";
import { DetailCard, type ChoiceBarItem } from "@procertus-ui/ui-lib";
import { CatalogueExplorer } from "@procertus-ui/ui-certification";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
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

/** Sentinel id for the leading "Alle certificaten" pill — overview state, no single service active. */
const ALLE_ID = "alle";
/** Sentinel id for the merged "Overige" pill that bundles all tier-3 external referrals. */
const ANDERE_ID = "overige";

/** Search param that mirrors the active certificate selection so back-nav can restore it. */
const SERVICE_PARAM = "service";

const PRIMARY_SERVICES = WEGWIJZER_SERVICES.filter((s) => s.tier !== 3);
const EXTERNAL_SERVICES = WEGWIJZER_SERVICES.filter((s) => s.tier === 3);

const VALID_SERVICE_IDS = new Set<string>([
  ALLE_ID,
  ANDERE_ID,
  ...WEGWIJZER_SERVICES.map((s) => s.entry.id),
]);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function WegwijzerPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawParam = searchParams.get(SERVICE_PARAM);
  const activeId = rawParam && VALID_SERVICE_IDS.has(rawParam) ? rawParam : ALLE_ID;

  const setActiveId = useCallback(
    (id: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (id === ALLE_ID) {
            next.delete(SERVICE_PARAM);
          } else {
            next.set(SERVICE_PARAM, id);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

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
        <div className="mx-auto w-full max-w-7xl">
          <Hero />

          <div className="px-boundary pb-boundary">
            <CatalogueExplorer
              items={CHOICE_BAR_ITEMS}
              activeId={activeId}
              onActiveIdChange={setActiveId}
              ariaLabel="Kies een certificaat"
              navLabels={{ prev: "Vorige certificaat", next: "Volgende certificaat" }}
            >
              {activeId === ALLE_ID ? (
                <AllCertificatesGrid
                  primary={PRIMARY_SERVICES}
                  external={EXTERNAL_SERVICES}
                  onSelect={setActiveId}
                />
              ) : activeId === ANDERE_ID ? (
                <ExternalReferralGrid services={EXTERNAL_SERVICES} />
              ) : activeService ? (
                <MasterCard service={activeService} />
              ) : null}
            </CatalogueExplorer>
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
// Choice-bar items — primary services first (BENOR, CE, SSD elevated; the
// PROCERTUS-side trio faded), trailing "Overige" ghost pill bundles tier-3
// external referrals.
// ---------------------------------------------------------------------------

const CHOICE_BAR_ITEMS: readonly ChoiceBarItem[] = [
  { value: ALLE_ID, label: "Alle", variant: "no-border" as const },
  ...PRIMARY_SERVICES.map((service, index) => ({
    value: service.entry.id,
    label: service.pillLabel ?? service.entry.label,
    variant: index < 3 ? ("elevated" as const) : ("faded" as const),
  })),
];

// ---------------------------------------------------------------------------
// All Certificates Grid — shown when "Alle certificaten" is active.
// Three-tier visual hierarchy mirrors the choice-bar pill variants:
//   elevated (full width)  → first 3 primary services (BENOR, CE, SSD)
//   faded    (50/50 + 50%) → remaining primary services
//   ghost    (25% each)    → tier-3 external referrals (ATG, EPD)
// ---------------------------------------------------------------------------

type SummaryTier = "elevated" | "faded" | "ghost";

function AllCertificatesGrid({
  primary,
  external,
  onSelect,
}: {
  primary: readonly WegwijzerService[];
  external: readonly WegwijzerService[];
  onSelect: (id: string) => void;
}) {
  const elevated = primary.slice(0, 3);
  const faded = primary.slice(3);
  const fadedRow = faded.slice(0, 2);
  const fadedTrailing = faded[2];

  return (
    <div role="list" className="grid w-full grid-cols-4 gap-section">
      {elevated.map((service) => (
        <CertificateSummaryCard
          key={service.entry.id}
          service={service}
          tier="elevated"
          onSelect={onSelect}
          className="col-span-4"
        />
      ))}
      {fadedRow.map((service) => (
        <CertificateSummaryCard
          key={service.entry.id}
          service={service}
          tier="faded"
          onSelect={onSelect}
          className="col-span-4 md:col-span-2"
        />
      ))}
      {fadedTrailing && (
        <CertificateSummaryCard
          key={fadedTrailing.entry.id}
          service={fadedTrailing}
          tier="faded"
          onSelect={onSelect}
          className="col-span-4 md:col-span-2"
        />
      )}
      {external.map((service) => (
        <CertificateSummaryCard
          key={service.entry.id}
          service={service}
          tier="ghost"
          onSelect={onSelect}
          className="col-span-2 md:col-span-1"
        />
      ))}
    </div>
  );
}

function CertificateSummaryCard({
  service,
  tier,
  onSelect,
  className,
}: {
  service: WegwijzerService;
  tier: SummaryTier;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const { entry } = service;
  const what = WEGWIJZER_SERVICE_CONTENT[entry.id]?.what;
  const isExternal = service.tier === 3;

  return (
    <button
      type="button"
      role="listitem"
      onClick={() => onSelect(entry.id)}
      className={cn(
        "group flex flex-col items-start gap-component rounded-md border bg-card text-left transition-all motion-safe:hover:-translate-y-0.5 hover:border-accent hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        tier === "elevated" && "p-region",
        tier === "faded" && "p-section",
        tier === "ghost" && "p-section bg-transparent",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-micro">
        {isExternal && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Externe verwijzing
          </span>
        )}
        <h3
          className={cn(
            "font-semibold leading-tight text-heading-foreground",
            tier === "elevated" && "text-heading-lg",
            tier === "faded" && "text-heading-md",
            tier === "ghost" && "text-base",
          )}
        >
          {entry.label}
        </h3>
      </div>
      {what && (
        <p
          className={cn(
            "leading-normal text-muted-foreground",
            tier === "elevated" && "text-base line-clamp-3",
            tier === "faded" && "text-sm line-clamp-3",
            tier === "ghost" && "text-sm line-clamp-2",
          )}
        >
          {what}
        </p>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// External Referral Grid — shown when "Andere" is active
// ---------------------------------------------------------------------------

function ExternalReferralGrid({ services }: { services: readonly WegwijzerService[] }) {
  return (
    <ItemGroup className="grid w-full grid-cols-1 gap-section md:grid-cols-2">
      {services.map((service) => (
        <ExternalReferralItem key={service.entry.id} service={service} />
      ))}
    </ItemGroup>
  );
}

function ExternalReferralItem({ service }: { service: WegwijzerService }) {
  const { entry, externalReferral } = service;
  if (!externalReferral) return null;
  return (
    <Item asChild variant="outline" role="listitem" className="bg-card">
      <a href={externalReferral.url} target="_blank" rel="noopener noreferrer">
        <ItemContent>
          <ItemTitle>{entry.label}</ItemTitle>
          <ItemDescription>{externalReferral.description}</ItemDescription>
        </ItemContent>
        <ItemActions className="text-muted-foreground" aria-hidden>
          <HugeiconsIcon icon={LinkSquare02Icon} className="size-5" strokeWidth={1.5} />
        </ItemActions>
      </a>
    </Item>
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
    <DetailCard
      title={entry.label}
      description={entry.description}
      footer={
        <>
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
        </>
      }
    >
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
        <DownloadableDocumentGrid items={documents} />
      </section>

      <MasterCardTimeline service={service} />
    </DetailCard>
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
    <div className="flex max-w-3xl flex-col gap-region">
      <section className="flex flex-col gap-component">
        <H4 className="leading-none">Wat is een {entry.label}?</H4>
        <p className="text-sm leading-normal">{content.what}</p>
      </section>

      <section className="flex flex-col gap-component">
        <H4>Wanneer vraag je dit het beste aan?</H4>
        <ul className="flex flex-col gap-micro">
          {content.whenToApply.map((item) => (
            <li key={item} className="flex items-start gap-component text-sm leading-normal">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
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

