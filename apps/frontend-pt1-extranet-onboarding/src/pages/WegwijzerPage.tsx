import { useCallback, useMemo, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
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
  DownloadableItemGrid,
  type DownloadableItemData,
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
  Skeleton,
} from "@procertus-ui/ui";
import {
  BrowseCard,
  DecisionCardCallout,
  DetailCard,
  DetailCardSection,
  type ChoiceBarItem,
} from "@procertus-ui/ui-lib";
import {
  CatalogueExplorer,
  type CertificationEntryId,
  type CertificationRequestDraft,
  type OnboardingFlowState,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";
import {
  WEGWIJZER_SERVICES,
  type WegwijzerService,
} from "../features/wegwijzer/wegwijzer-services";
import { WEGWIJZER_SERVICE_CONTENT } from "../features/wegwijzer/wegwijzer-service-content";
import {
  TRAJECT_ENTRY_POINT_QUERY_PARAM,
  clearTrajectBreadcrumbs,
  reduceTrajectHandoffState,
} from "../features/traject/traject-submission-context";

/** Eerste stap van de TrajectFlow: producttype kiezen en aanvraag controleren in de wizard, voor de triage-keuze. */
const TRAJECT_CONFIGURE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}/start`;
/**
 * Sprong rechtstreeks naar de validatiepagina, gebruikt vanuit detail-cards van
 * niet-product-gebonden certificaten (`productRelation === "optional"`).
 */
const REQUEST_REVIEW_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}/controleren`;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const explorerRef = useRef<HTMLDivElement>(null);
  const { setFlowState } = useOnboardingFlowState();

  const choiceBarItems = useMemo((): readonly ChoiceBarItem[] => {
    return [
      { value: ALL_ID, label: "Alle certificaten", variant: "elevated" as const },
      ...PRIMARY_SERVICES.map((service) => ({
        value: service.entry.id,
        label: service.pillLabel ?? service.entry.label,
        variant: service.tier === 1 ? ("elevated" as const) : ("default" as const),
      })),
    ];
  }, []);

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

  /**
   * Sluit een detail-card en stuur de gebruiker terug naar het overzicht.
   * Scrollt naar de choice-bar zodat de gebruiker leert dat de selectie ook
   * vanuit die bar te bedienen is. requestAnimationFrame wacht tot de nieuwe
   * grid is uitgemonteerd zodat de scroll niet over een collapsing layout heen
   * springt.
   */
  const handleResetToOverview = useCallback(() => {
    setActiveId(ALL_ID);
    requestAnimationFrame(() => {
      explorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [setActiveId]);

  const activeService = WEGWIJZER_SERVICES.find((s) => s.entry.id === activeId);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        className="px-boundary pt-boundary pb-section"
        title="Start je certificeringstraject"
        description="Bij PROCERTUS bieden we verschillende diensten aan. Hieronder vind je een overzicht van ons aanbod. Selecteer een certificaat om meer informatie te krijgen of meteen je aanvraag te starten."
      />

      <div ref={explorerRef} className="px-boundary pb-boundary scroll-mt-section">
        <CatalogueExplorer
          items={choiceBarItems}
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
            <MasterCard
              service={activeService}
              onClose={handleResetToOverview}
              setFlowState={setFlowState}
            />
          ) : null}
        </CatalogueExplorer>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Choice-bar items worden dynamisch opgebouwd (geselecteerde producten per route)
// in {@link WegwijzerPage}.
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
          cornerCaption={service.entry.shortLabel}
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
          cornerCaption={service.entry.shortLabel}
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
            icon: <HugeiconsIcon icon={LinkSquare02Icon} className="size-3.5" strokeWidth={1.5} />,
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
  const handleHeroExpertCall = () => {
    clearTrajectBreadcrumbs();
    navigate(EXPERT_CALL_PATH());
  };
  return (
    <DecisionCardCallout
      orientation="vertical"
      className="col-span-4 md:col-span-2"
      title="Wil je eerst een expert spreken?"
      description="Reserveer een live online sessie van één uur en overloop de vereisten samen met een PROCERTUS-expert."
      cta={{
        label: "Plan een gesprek",
        icon: Call02Icon,
        asChild: true,
        children: <button type="button" onClick={handleHeroExpertCall} />,
      }}
    />
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

function MasterCard({
  service,
  onClose,
  setFlowState,
}: {
  service: WegwijzerService;
  onClose: () => void;
  setFlowState: Dispatch<SetStateAction<OnboardingFlowState>>;
}) {
  const navigate = useNavigate();
  const { entry, externalReferral } = service;
  const isInnovation = entry.id === "innovation-attest";
  const isExternal = service.tier === 3;
  const isExternalRequestOnly = Boolean(service.externalRequestOnly && externalReferral);
  const isNonProductBound = entry.productRelation === "optional";

  const handleStartNonProductFlow = () => {
    const placeholder: CertificationRequestDraft = {
      id: `standalone-${entry.id}`,
      entryId: entry.id as CertificationEntryId,
      label: entry.label,
      shortLabel: entry.shortLabel,
      trajectRootServiceId: entry.id,
    };
    setFlowState((prev) =>
      reduceTrajectHandoffState(prev, { drafts: [placeholder], serviceId: entry.id }),
    );
    navigate(REQUEST_REVIEW_PATH(entry.id));
  };

  return (
    <DetailCard
      title={entry.label}
      description={entry.description}
      onClose={onClose}
      closeLabel={`Sluit ${entry.shortLabel} en keer terug naar alle certificaten`}
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
                Hulp nodig bij je {entry.shortLabel}-dossier?
              </p>
              <p className="text-muted-foreground">
                Plan een online sessie van één uur en bereid je {entry.shortLabel}-dossier samen met
                een PROCERTUS-expert voor.
              </p>
            </HoverCardContent>
          </HoverCard>
          {isExternalRequestOnly && externalReferral ? (
            <Button size="lg" asChild>
              <a href={externalReferral.url} target="_blank" rel="noopener noreferrer">
                Ga naar {externalReferral.name}
                <HugeiconsIcon icon={LinkSquare02Icon} className="size-4" strokeWidth={1.5} />
              </a>
            </Button>
          ) : isNonProductBound ? (
            <Button size="lg" onClick={handleStartNonProductFlow}>
              Aanvraag indienen
              <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link to={TRAJECT_CONFIGURE_PATH(entry.id)}>
                Bekijk mogelijkheden
                <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
              </Link>
            </Button>
          )}
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
            De ontvankelijkheidsbeoordeling start vanaf <strong>€&nbsp;2.000 (excl. btw)</strong>.
            Een definitieve offerte volgt na intake.
          </AlertDescription>
        </Alert>
      )}

      {!isExternalRequestOnly && (
        <DetailCardSection
          title="Regels en documentatie"
          description={`Documenten op basis van je selectie voor ${entry.shortLabel} (prototype, downloadlinks zijn gemockt).`}
        >
          <DownloadableItemGrid items={buildMockDocuments(service)} />
        </DetailCardSection>
      )}

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
      description:
        "Controlelijst afgestemd op de samenstelling van dit pakket vóór indiening (prototype).",
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

  const whatParagraphs = Array.isArray(content.what) ? content.what : [content.what];

  return (
    <>
      <DetailCardSection title={`Wat is een ${entry.label}?`}>
        <div className="flex max-w-3xl flex-col gap-component">
          {whatParagraphs.map((paragraph, index) => (
            <p key={index} className="text-sm leading-normal">
              {paragraph}
            </p>
          ))}
        </div>
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

      {content.requirements.length > 0 ? (
        <DetailCardSection
          title="Vereisten en dossierinhoud"
          description={
            entry.id === "epd"
              ? "EPD’s bouwen voornamelijk op een levenscyclusanalyse (LCA) en een erkend publicatieprogramma; hieronder staat wat PROCERTUS typisch met u aligned tijdens intake."
              : `Kenmerken van een volledig dossier voor ${entry.shortLabel}.`
          }
        >
          <dl className="flex max-w-3xl flex-col gap-section">
            {content.requirements.map((req) => (
              <div key={req.title}>
                <dt className="text-sm font-semibold text-foreground">{req.title}</dt>
                <dd className="mt-micro text-sm leading-normal text-muted-foreground">
                  {req.content}
                </dd>
              </div>
            ))}
          </dl>
        </DetailCardSection>
      ) : null}
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
    <div className="flex flex-col gap-section" aria-busy aria-label="Inhoud wordt voorbereid">
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
