import { useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert02Icon,
  ArrowRight02Icon,
  Call02Icon,
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
  Card,
  DensityProvider,
  DownloadableItemGrid,
  type DownloadableItemData,
  H3,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  PageHeader,
  PublicRegistryAppShell,
  Skeleton,
} from "@procertus-ui/ui";
import {
  BrowseCard,
  DetailCard,
  DetailCardSection,
  type ChoiceBarItem,
} from "@procertus-ui/ui-lib";
import { CatalogueExplorer } from "@procertus-ui/ui-certification";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
import { APP_FOOTER } from "../layouts/footerConfig";
import {
  WEGWIJZER_SERVICES,
  type WegwijzerService,
} from "../features/wegwijzer/wegwijzer-services";
import { WEGWIJZER_SERVICE_CONTENT } from "../features/wegwijzer/wegwijzer-service-content";
import {
  TRAJECT_ENTRY_POINT_QUERY_PARAM,
  clearTrajectBreadcrumbs,
} from "../features/traject/traject-submission-context";

const LOGIN_PATH = "/welcome/login";
/** Eerste stap van de TrajectFlow: producttype kiezen en aanvraag controleren in de wizard, voor de triage-keuze. */
const TRAJECT_CONFIGURE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}/start`;
const EXPERT_CALL_PATH = (serviceId?: string) =>
  serviceId ? `/welcome/expert-call/${serviceId}` : "/welcome/expert-call";
/** Detail-card "Hulp nodig?" stuurt mee dat het certificaat al in beeld is, zonder verdere wizard-context. */
const EXPERT_CALL_FROM_DETAIL_PATH = (serviceId: string) =>
  `${EXPERT_CALL_PATH(serviceId)}?${TRAJECT_ENTRY_POINT_QUERY_PARAM}=wegwijzer-detail`;

/** Sentinel id for the leading "Alle certificaten" pill that resets the explorer to the overview. */
const ALL_ID = "all";
/** Sentinel id for the merged "Overige" pill that bundles all tier-3 external referrals. */
const ANDERE_ID = "overige";

/** Search param that mirrors the active certificate selection so back-nav can restore it. */
const SERVICE_PARAM = "service";

const PRIMARY_SERVICES = WEGWIJZER_SERVICES.filter((s) => s.tier !== 3);
const EXTERNAL_SERVICES = WEGWIJZER_SERVICES.filter((s) => s.tier === 3);

const VALID_SERVICE_IDS = new Set<string>([
  ALL_ID,
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
  const activeId = rawParam && VALID_SERVICE_IDS.has(rawParam) ? rawParam : ALL_ID;

  const setActiveId = useCallback(
    (id: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!id || id === ALL_ID) {
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
        stickyBottomChrome={false}
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
              {activeId === ALL_ID ? (
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
    <PageHeader
      className="px-boundary pt-boundary pb-section"
      title="Start uw certificeringstraject"
      description="Bij PROCERTUS bieden we verschillende diensten aan. Hieronder vindt u een overzicht van ons aanbod. Selecteer een certificaat om meer informatie te krijgen of direct uw aanvraag te starten."
    />
  );
}

// ---------------------------------------------------------------------------
// Choice-bar items — primary services first (tier 1 elevated, tier 2 default),
// trailing "Overige" ghost pill bundles tier-3 external referrals.
// ---------------------------------------------------------------------------

const CHOICE_BAR_ITEMS: readonly ChoiceBarItem[] = [
  { value: ALL_ID, label: "Alle certificaten", variant: "elevated" as const },
  ...PRIMARY_SERVICES.map((service) => ({
    value: service.entry.id,
    label: service.pillLabel ?? service.entry.label,
    variant: service.tier === 1 ? ("elevated" as const) : ("default" as const),
  })),
];

// ---------------------------------------------------------------------------
// All Certificates Grid — shown when "Alle certificaten" is active.
// Three-tier visual hierarchy mirrors the choice-bar pill variants:
//   elevated (full width) → tier 1 primary services (BENOR, CE)
//   default  (50/50)      → tier 2 primary services
//   faded    (25% each)   → tier 3 external referrals (ATG, EPD)
// ---------------------------------------------------------------------------

function AllCertificatesGrid({
  primary,
  external,
  onSelect,
}: {
  primary: readonly WegwijzerService[];
  external: readonly WegwijzerService[];
  onSelect: (id: string) => void;
}) {
  const elevated = primary.filter((s) => s.tier === 1);
  const secondary = primary.filter((s) => s.tier === 2);

  const summary = (id: string) => WEGWIJZER_SERVICE_CONTENT[id]?.what;

  return (
    <div role="list" className="grid w-full grid-cols-4 gap-section">
      {elevated.map((service) => (
        <BrowseCard
          key={service.entry.id}
          title={service.entry.label}
          description={summary(service.entry.id)}
          variant="elevated"
          className="col-span-4"
          asChild
        >
          <button type="button" onClick={() => onSelect(service.entry.id)} />
        </BrowseCard>
      ))}
      {secondary.map((service) => (
        <BrowseCard
          key={service.entry.id}
          title={service.entry.label}
          description={summary(service.entry.id)}
          variant="default"
          className="col-span-4 md:col-span-2"
          asChild
        >
          <button type="button" onClick={() => onSelect(service.entry.id)} />
        </BrowseCard>
      ))}
      {external.map((service) => (
        <BrowseCard
          key={service.entry.id}
          title={service.entry.shortLabel}
          description="Dit attest wordt beoordeeld door een andere instantie."
          variant="faded"
          cta={{
            label: "Bezoek website",
            icon: (
              <HugeiconsIcon icon={LinkSquare02Icon} className="size-3.5" strokeWidth={1.5} />
            ),
          }}
          className="col-span-2 md:col-span-1"
          asChild
        >
          <button
            type="button"
            onClick={() => {
              const url = service.externalReferral?.url;
              if (url) window.open(url, "_blank", "noopener,noreferrer");
            }}
          />
        </BrowseCard>
      ))}
      <ExpertCallFooterCard />
    </div>
  );
}

function ExpertCallFooterCard() {
  const navigate = useNavigate();
  // Hero-CTA: gebruiker drukt expliciet de reset, eerdere traject-breadcrumbs worden gewist zodat
  // het expert-call formulier echt context-loos verzonden wordt.
  const handleHeroExpertCall = () => {
    clearTrajectBreadcrumbs();
    navigate(EXPERT_CALL_PATH());
  };
  return (
    <Card
      className="relative col-span-4 flex cursor-pointer flex-col gap-section px-section py-section md:col-span-2"
      style={{ background: "var(--gradient-neutral)" }}
    >
      <div className="flex flex-col gap-micro">
        <H3>Liever eerst een expert spreken?</H3>
        <p className="text-sm leading-normal text-muted-foreground">
          Plan een live online sessie van één uur en doorloop de vereisten samen met een PROCERTUS-expert.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleHeroExpertCall}
        className="self-start bg-background before:absolute before:inset-0 before:content-[''] group-hover/card:rounded-tl-[4px] group-hover/card:rounded-tr-[var(--cmd-deep)] group-hover/card:rounded-br-[4px] group-hover/card:rounded-bl-[var(--cmd-deep)] group-hover/card:bg-muted group-hover/card:text-foreground"
      >
        <HugeiconsIcon icon={Call02Icon} className="size-4" />
        Plan een expert call
      </Button>
    </Card>
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
                <Link to={EXPERT_CALL_FROM_DETAIL_PATH(entry.id)}>Hulp nodig?</Link>
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
            <Link to={TRAJECT_CONFIGURE_PATH(entry.id)}>
              Bekijk mogelijkheden
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
        <Alert variant="warning" className="max-w-3xl">
          <HugeiconsIcon icon={Alert02Icon} />
          <AlertTitle>Richtwaarde formele opstart</AlertTitle>
          <AlertDescription>
            De ontvankelijkheidsbeoordeling start vanaf <strong>€&nbsp;2.000 (excl. btw)</strong>. Een
            definitieve offerte volgt na intake.
          </AlertDescription>
        </Alert>
      )}

      <DetailCardSection
        title="Regels en documentatie"
        description={`Documenten op basis van uw selectie voor ${entry.shortLabel} (prototype, downloadlinks zijn gemockt).`}
      >
        <DownloadableItemGrid items={documents} />
      </DetailCardSection>

      <MasterCardTimeline service={service} />
    </DetailCard>
  );
}

function buildMockDocuments(service: WegwijzerService): DownloadableItemData[] {
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
    <>
      <DetailCardSection title={`Wat is een ${entry.label}?`}>
        <p className="max-w-3xl text-sm leading-normal">{content.what}</p>
      </DetailCardSection>

      <DetailCardSection title="Wanneer vraag je dit het beste aan?">
        <ul className="flex flex-col gap-micro">
          {content.whenToApply.map((item) => (
            <li key={item} className="flex items-start gap-component text-sm leading-normal">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="max-w-3xl">{item}</span>
            </li>
          ))}
        </ul>
      </DetailCardSection>
    </>
  );
}

function MasterCardTimeline({ service }: { service: WegwijzerService }) {
  const content = WEGWIJZER_SERVICE_CONTENT[service.entry.id];
  if (!content) return null;
  return (
    <DetailCardSection>
      <div className="flex items-start gap-component self-start rounded-md bg-info/40 p-component text-info-foreground">
        <HugeiconsIcon icon={ClockIcon} className="mt-0.5 size-5 shrink-0" />
        <p className="max-w-3xl text-sm leading-normal">{content.timeline}</p>
      </div>
    </DetailCardSection>
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

