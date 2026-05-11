import {
  ArrowLeft01Icon,
  ArrowRight02Icon,
  Call02Icon,
  CheckmarkCircle02Icon,
  FilePlusIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Badge,
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DownloadableItem,
  Field,
  FieldLabel,
  H3,
  Input,
  Separator,
  cn,
} from "@procertus-ui/ui";
import type { DownloadableItemData } from "@procertus-ui/ui";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useLayoutEffect, useMemo, useState } from "react";

import { CertificationRequestWizard } from "../certification-request-wizard";
import {
  storyCertificationWizardProps,
  storyCustomerContext,
  storyOnboardingDrafts,
} from "../../onboarding/onboarding-story-fixtures";
import { ProcertusCategorizationProvider } from "../../ProcertusCategorizationContext";
import { TrajectLayout } from "./TrajectLayout";

const STORY_FOOTER = {
  companyDetails: [
    { label: "© 2026 PROCERTUS asbl/vzw" },
    { label: "TVA/BTW: BE 1000.472.054" },
  ],
  legalLinks: [
    { label: "Privacy policy", url: "#" },
    { label: "Contact", url: "#" },
  ],
};

/**
 * Mirrors `PublicAppShell` in the production app: sets `data-public-layout` on `<html>` so the
 * shared `globals.css` unlocks document scrolling (it keeps html/body locked for the
 * authenticated shell). Without this, tall traject pages get clipped at viewport.
 */
const PublicLayoutDecorator = (Story: ComponentType) => {
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);
  return <Story />;
};

const meta = {
  title: "Traject/Layout",
  component: TrajectLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      children: null,
    description: {
        component:
          "Shared chrome for the public traject pages (product selecteren, aanvraag controleren, keuze aanvraag type, expert call boeken). Provides registry header, optional footer, capped content column, optional back link and a `PageHeader` for the title block. Page-specific bodies live in `children`.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectLayout>;

export default meta;

const noop = () => {};

/**
 * Voeg trajecten toe: na productselectie kan de gebruiker per geselecteerd product extra
 * certificaties (CE, ATG) bovenop de primaire certificatie (gekozen in de wegwijzer)
 * aanvinken om alles in één gebundelde aanvraag in te dienen. De regelset onderaan
 * reageert direct op de toegevoegde labels en groepeert algemene reglementen vs.
 * productspecifieke PTV's. De pakket-status in de actiebalk telt actuele producten en
 * certificaties.
 */
export const RequestBundleAssemble: StoryObj<typeof meta> = {
  name: "Voeg trajecten toe",
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    bodyGap: "section",
    title: "Stel je aanvraagpakket samen",
    description:
      "Controleer je geselecteerde producten. Hieronder kun je per product extra certificaties (zoals CE of ATG) toevoegen om deze in één gebundelde aanvraag in te dienen.",
    children: null,
  },
  render: (args) => <RequestBundleAssembleStoryBody args={args} />,
};

const BUNDLE_CERT_ORDER = ["benor", "ce", "atg"] as const;
type BundleCertKey = (typeof BUNDLE_CERT_ORDER)[number];

const BUNDLE_CERT_LABEL: Record<BundleCertKey, string> = {
  benor: "BENOR",
  ce: "CE",
  atg: "ATG",
};

type BundleProduct = {
  id: string;
  label: string;
  categoryTrail: string;
  primaryCert: BundleCertKey;
  availableCerts: readonly BundleCertKey[];
};

const BUNDLE_PRODUCTS: readonly BundleProduct[] = [
  {
    id: "stortklaar-beton",
    label: "Stortklaar beton",
    categoryTrail: "Beton en mortel",
    primaryCert: "benor",
    availableCerts: ["benor", "ce", "atg"],
  },
  {
    id: "granulaten-voor-beton",
    label: "Granulaten voor beton",
    categoryTrail: "Bestanddelen voor beton > Granulaten",
    primaryCert: "ce",
    availableCerts: ["benor", "ce"],
  },
  {
    id: "betonstaal",
    label: "Betonstaal",
    categoryTrail: "Staal > Wapeningsstaal",
    primaryCert: "benor",
    availableCerts: ["benor", "ce", "atg"],
  },
];

const GENERAL_DOCS_BY_CERT: Record<BundleCertKey, readonly DownloadableItemData[]> = {
  benor: [
    {
      id: "doc-benor-tra1",
      title: "TRA 1: Algemeen reglement BENOR",
      description: "Generieke spelregels voor elk BENOR-traject.",
      formatHint: "PDF · 1.4 MB",
      href: "#doc-benor-tra1",
    },
    {
      id: "doc-benor-tarief",
      title: "Tarievenlijst BENOR 2026",
      description: "Vergoedingen per fase en per audit.",
      formatHint: "PDF · 320 KB",
      href: "#doc-benor-tarief",
    },
  ],
  ce: [
    {
      id: "doc-ce-cpr",
      title: "Verordening (EU) 305/2011 (CPR)",
      description: "Europees wettelijk kader voor bouwproducten.",
      formatHint: "PDF · 2.1 MB",
      href: "#doc-ce-cpr",
    },
    {
      id: "doc-ce-2plus",
      title: "Conformiteitsbeoordeling, systeem 2+",
      description: "Procedure voor fabriekscontrole en initiële typetests.",
      formatHint: "PDF · 540 KB",
      href: "#doc-ce-2plus",
    },
  ],
  atg: [
    {
      id: "doc-atg-procedure",
      title: "ATG aanvraagprocedure",
      description: "Stappenplan voor een ATG-attest.",
      formatHint: "PDF · 880 KB",
      href: "#doc-atg-procedure",
    },
    {
      id: "doc-atg-tarief",
      title: "Tarievenlijst ATG 2026",
      description: "Kosten per attest, inclusief verlenging.",
      formatHint: "PDF · 280 KB",
      href: "#doc-atg-tarief",
    },
  ],
};

const PRODUCT_DOCS: Record<string, Partial<Record<BundleCertKey, readonly DownloadableItemData[]>>> = {
  "stortklaar-beton": {
    benor: [
      {
        id: "doc-stortklaar-ptv21",
        title: "PTV 21: Stortklaar beton",
        description: "Technische voorschriften voor de BENOR-certificatie.",
        formatHint: "PDF · 3.6 MB",
        href: "#doc-stortklaar-ptv21",
      },
    ],
    ce: [
      {
        id: "doc-stortklaar-en206",
        title: "NBN EN 206: Beton, specificatie en conformiteit",
        description: "Geharmoniseerde norm onder CE-markering.",
        formatHint: "PDF · 4.2 MB",
        href: "#doc-stortklaar-en206",
      },
    ],
    atg: [
      {
        id: "doc-stortklaar-atg",
        title: "ATG-richtlijn voor zelfverdichtend beton",
        description: "Aanvullende criteria voor het ATG-attest.",
        formatHint: "PDF · 1.1 MB",
        href: "#doc-stortklaar-atg",
      },
    ],
  },
  "granulaten-voor-beton": {
    benor: [
      {
        id: "doc-granulaten-ptv411",
        title: "PTV 411: Granulaten voor beton, mortel en injectiemortel",
        description: "Eisen voor BENOR-gecertificeerde granulaten.",
        formatHint: "PDF · 2.4 MB",
        href: "#doc-granulaten-ptv411",
      },
    ],
    ce: [
      {
        id: "doc-granulaten-en12620",
        title: "NBN EN 12620: Toeslagmaterialen voor beton",
        description: "Geharmoniseerde norm voor granulaten.",
        formatHint: "PDF · 2.8 MB",
        href: "#doc-granulaten-en12620",
      },
    ],
  },
  betonstaal: {
    benor: [
      {
        id: "doc-betonstaal-ptv302",
        title: "PTV 302: Betonstaal in staven en op rol",
        description: "Productspecificatie voor BENOR-certificering.",
        formatHint: "PDF · 1.9 MB",
        href: "#doc-betonstaal-ptv302",
      },
    ],
    ce: [
      {
        id: "doc-betonstaal-en10080",
        title: "NBN EN 10080: Staal voor het wapenen van beton",
        description: "Productnorm met CE-conformiteitsroute.",
        formatHint: "PDF · 2.3 MB",
        href: "#doc-betonstaal-en10080",
      },
    ],
    atg: [
      {
        id: "doc-betonstaal-atg",
        title: "ATG-richtlijn voor wapeningsmatten",
        description: "Aanvullende criteria voor wapeningsproducten.",
        formatHint: "PDF · 960 KB",
        href: "#doc-betonstaal-atg",
      },
    ],
  },
};

function RequestBundleAssembleStoryBody({
  args,
}: {
  args: React.ComponentProps<typeof TrajectLayout>;
}) {
  const [selections, setSelections] = useState<Record<string, ReadonlySet<BundleCertKey>>>(
    () =>
      Object.fromEntries(
        BUNDLE_PRODUCTS.map((p) => [p.id, new Set<BundleCertKey>([p.primaryCert])] as const),
      ),
  );

  const toggleCert = (productId: string, cert: BundleCertKey) => {
    setSelections((prev) => {
      const product = BUNDLE_PRODUCTS.find((p) => p.id === productId);
      if (!product || cert === product.primaryCert) return prev;
      const current = new Set(prev[productId] ?? []);
      if (current.has(cert)) current.delete(cert);
      else current.add(cert);
      return { ...prev, [productId]: current };
    });
  };

  const totalCertCount = useMemo(
    () => Object.values(selections).reduce((sum, set) => sum + set.size, 0),
    [selections],
  );

  const activeCerts = useMemo(() => {
    const set = new Set<BundleCertKey>();
    for (const s of Object.values(selections)) for (const c of s) set.add(c);
    return BUNDLE_CERT_ORDER.filter((c) => set.has(c));
  }, [selections]);

  const generalDocs = useMemo(
    () => activeCerts.flatMap((c) => GENERAL_DOCS_BY_CERT[c]),
    [activeCerts],
  );

  const productSpecificDocs = useMemo(() => {
    const out: DownloadableItemData[] = [];
    for (const product of BUNDLE_PRODUCTS) {
      const certs = selections[product.id];
      if (!certs) continue;
      for (const cert of BUNDLE_CERT_ORDER) {
        if (!certs.has(cert)) continue;
        const docs = PRODUCT_DOCS[product.id]?.[cert];
        if (!docs) continue;
        for (const doc of docs) {
          out.push({
            ...doc,
            description: `${product.label} · ${BUNDLE_CERT_LABEL[cert]}${
              doc.description ? ` · ${doc.description}` : ""
            }`,
          });
        }
      }
    }
    return out;
  }, [selections]);

  const productCount = BUNDLE_PRODUCTS.length;
  const certWord = totalCertCount === 1 ? "certificatie" : "certificaties";
  const productWord = productCount === 1 ? "product" : "producten";

  return (
    <TrajectLayout
      {...args}
      actionBar={
        <>
          <Button type="button" variant="ghost" onClick={noop}>
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Terug
          </Button>
          <div className="flex flex-wrap items-center justify-end gap-component">
            <Badge
              variant="outline"
              aria-label={`Pakket-status: ${productCount} ${productWord}, ${totalCertCount} ${certWord}`}
              className="hidden whitespace-nowrap sm:inline-flex"
            >
              {productCount} {productWord} · {totalCertCount} {certWord}
            </Badge>
            <Button type="button" variant="ghost" onClick={noop}>
              Annuleren
            </Button>
            <Button type="button" onClick={noop}>
              Verder
            </Button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-region">
        <section
          aria-label="Geselecteerde producten"
          className="flex flex-col gap-component"
        >
          {BUNDLE_PRODUCTS.map((product) => {
            const selected = selections[product.id] ?? new Set<BundleCertKey>();
            return (
              <BundleProductCard
                key={product.id}
                product={product}
                selected={selected}
                onToggle={(cert) => toggleCert(product.id, cert)}
              />
            );
          })}
        </section>

        <section className="flex flex-col gap-component">
          <div className="flex flex-col gap-micro">
            <H3>Regels en documentatie</H3>
            <p className="text-sm leading-normal text-muted-foreground">
              Documenten worden automatisch bijgewerkt zodra je een certificatie toevoegt
              aan een product in het pakket.
            </p>
          </div>
          <Card>
            <CardContent className="flex flex-col gap-section">
              <BundleDocumentGroup
                title="Algemene documenten"
                caption="Geldig voor alle producten in dit pakket."
                items={generalDocs}
                emptyHint="Voeg een certificatie toe aan een product om de algemene reglementen te zien."
              />
              <Separator />
              <BundleDocumentGroup
                title="Productspecifieke documenten"
                caption="Per product en per gekozen certificatie."
                items={productSpecificDocs}
                emptyHint="Nog geen productspecifieke documenten voor de huidige selectie."
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </TrajectLayout>
  );
}

function BundleProductCard({
  product,
  selected,
  onToggle,
}: {
  product: BundleProduct;
  selected: ReadonlySet<BundleCertKey>;
  onToggle: (cert: BundleCertKey) => void;
}) {
  return (
    <Card className="gap-region py-region">
      <CardHeader className="gap-micro px-region">
        <span className="text-xs leading-tight text-muted-foreground">
          {product.categoryTrail}
        </span>
        <CardTitle className="text-base font-semibold">{product.label}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-component px-region">
        <span className="text-sm text-muted-foreground">Extra certificaties toevoegen</span>
        <div
          role="group"
          aria-label={`Certificaties voor ${product.label}`}
          className="flex flex-wrap gap-component"
        >
          {product.availableCerts.map((cert) => {
            const isPrimary = cert === product.primaryCert;
            const isChecked = selected.has(cert);
            return (
              <BundleCertToggle
                key={cert}
                cert={cert}
                isPrimary={isPrimary}
                isChecked={isChecked}
                onToggle={() => onToggle(cert)}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function BundleCertToggle({
  cert,
  isPrimary,
  isChecked,
  onToggle,
}: {
  cert: BundleCertKey;
  isPrimary: boolean;
  isChecked: boolean;
  onToggle: () => void;
}) {
  const label = BUNDLE_CERT_LABEL[cert];
  const filled = isPrimary || isChecked;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      aria-disabled={isPrimary || undefined}
      onClick={isPrimary ? undefined : onToggle}
      className={cn(
        "group/cert inline-flex items-center gap-micro rounded-full border text-sm font-medium leading-none transition-all duration-150",
        "px-component py-component",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        isPrimary && "cursor-default border-primary bg-primary text-primary-foreground shadow-proc-xs",
        !isPrimary &&
          isChecked &&
          "border-primary bg-primary text-primary-foreground shadow-proc-xs hover:brightness-110 hover:shadow-proc-md active:brightness-95 active:shadow-proc-xs",
        !isPrimary &&
          !isChecked &&
          "border-primary/40 bg-card text-primary hover:border-primary hover:bg-primary/5 hover:shadow-proc-md active:bg-primary/10 active:shadow-proc-xs",
      )}
    >
      {filled ? (
        <Check aria-hidden className="size-3.5 shrink-0" strokeWidth={2.5} />
      ) : (
        <Plus aria-hidden className="size-3.5 shrink-0" strokeWidth={2.5} />
      )}
      <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
        {isChecked ? label : `Voeg ${label} toe`}
        {isPrimary ? (
          <span className="text-[0.7rem] font-normal opacity-80">(Primair)</span>
        ) : null}
      </span>
    </button>
  );
}

function BundleDocumentGroup({
  title,
  caption,
  items,
  emptyHint,
}: {
  title: string;
  caption: string;
  items: readonly DownloadableItemData[];
  emptyHint: string;
}) {
  return (
    <div className="flex flex-col gap-component">
      <div className="flex flex-col gap-micro">
        <h4 className="text-sm font-semibold">{title}</h4>
        <span className="text-xs text-muted-foreground">{caption}</span>
      </div>
      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-border/60 bg-muted/20 px-component py-component text-sm text-muted-foreground">
          {emptyHint}
        </div>
      ) : (
        <div role="list" className="flex w-full flex-col gap-component">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              >
                <DownloadableItem variant="card" {...item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/**
 * Aanvraag controleren: wizard geseed met conceptaanvragen, geopend op de review-stap
 * zodat de samenvatting met regelset-documenten meteen zichtbaar is.
 */
export const RequestReview: StoryObj<typeof meta> = {
  name: "Aanvraag controleren",
  args: {
    onSignInClick: noop,
    title: "Controleer je aanvraagpakket",
    children: null,
    description:
      "Bekijk de samengestelde conceptaanvragen en de bijhorende regelset-documenten voordat je doorgaat met registratie.",
  },
  render: (args) => <RequestReviewStoryBody args={args} />,
};

function RequestReviewStoryBody({ args }: { args: React.ComponentProps<typeof TrajectLayout> }) {
  const wizardProps = useMemo(
    () => ({
      ...storyCertificationWizardProps(storyCustomerContext()),
      initialDrafts: storyOnboardingDrafts,
      initialStep: "review" as const,
    }),
    [],
  );
  return (
    <ProcertusCategorizationProvider>
      <TrajectLayout {...args}>
        <CertificationRequestWizard
          {...wizardProps}
          sessionId="storybook-traject-layout-request-review"
          stepLayoutChromeStyle="bare"
        />
      </TrajectLayout>
    </ProcertusCategorizationProvider>
  );
}

/**
 * Hoe wilt u {service} aanvragen? Keuze tussen informatieve en formele aanvraag,
 * met "expert call"-uitnodiging onderaan.
 */
export const RequestTypeChoice: StoryObj<typeof meta> = {
  name: "Keuze aanvraag type",
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    backAction: { label: "Terug", onClick: noop },
    kicker: "Keuring",
    title: "Hoe wilt u Partijkeuring aanvragen?",
    children: null,
    description:
      "Kies een vrijblijvende informatieaanvraag voor een prijsopgave en advies, of start meteen het formele dossier zodat de ontvankelijkheidsbeoordeling kan beginnen.",
  },
  render: (args) => (
    <TrajectLayout {...args}>
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
          />
        </div>
        <Card
          className="relative flex flex-col gap-component px-section py-section sm:flex-row sm:items-center sm:justify-between sm:gap-section"
          style={{ background: "var(--gradient-neutral)" }}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-micro">
            <H3>Liever eerst een expert spreken?</H3>
            <p className="text-sm leading-normal text-muted-foreground">
              Plan een live online sessie van één uur en doorloop de vereisten samen met een
              PROCERTUS-expert.
            </p>
          </div>
          <Button variant="outline" className="w-full bg-background sm:w-auto sm:shrink-0">
            <HugeiconsIcon icon={Call02Icon} className="size-4" />
            Plan een expert call
          </Button>
        </Card>
      </div>
    </TrajectLayout>
  ),
};

/**
 * Plan een expert call: kalender, tijdslots en contactgegevens, met footer en
 * "Terug"-actie zoals in de live ExpertCallPlaceholderPage.
 */
export const ExpertCallBooking: StoryObj<typeof meta> = {
  name: "Expert call boeken",
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    backAction: { label: "Terug", onClick: noop },
    title: "Plan een expert call",
    children: null,
    description:
      "Eén uur live met een PROCERTUS-expert om uw vraag, uw dossier en de juiste route samen door te nemen.",
  },
  render: (args) => <ExpertCallStoryBody args={args} />,
};

const SESSION_HIGHLIGHTS = [
  "Eén uur live online, videogesprek met scherm delen",
  "Doorloop van de minimale vereisten en uw dossier",
  "Concrete inschatting van het te volgen traject",
] as const;

const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00"] as const;

function ExpertCallStoryBody({ args }: { args: React.ComponentProps<typeof TrajectLayout> }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);
  return (
    <TrajectLayout {...args}>
      <div className="flex flex-col gap-section">
        <section className="flex flex-col gap-component">
          <H3>Wat u kunt verwachten</H3>
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
          <div className="flex flex-col gap-micro">
            <H3>Kies een moment</H3>
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
        </section>

        <section className="flex flex-col gap-component">
          <H3>Uw gegevens</H3>
          <div className="grid grid-cols-1 gap-section sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="story-expert-call-firstname">Voornaam</FieldLabel>
              <Input id="story-expert-call-firstname" autoComplete="given-name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="story-expert-call-lastname">Achternaam</FieldLabel>
              <Input id="story-expert-call-lastname" autoComplete="family-name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="story-expert-call-email">E-mailadres</FieldLabel>
              <Input id="story-expert-call-email" type="email" autoComplete="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="story-expert-call-company">Bedrijfsnaam</FieldLabel>
              <Input id="story-expert-call-company" autoComplete="organization" />
            </Field>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-component">
          <Button variant="outline" size="lg" onClick={noop}>
            Terug
          </Button>
          <Button size="lg" disabled>
            Verzenden
          </Button>
        </div>
      </div>
    </TrajectLayout>
  );
}

type TriageOptionCardProps = {
  tone: "muted" | "primary";
  icon: IconSvgElement;
  title: string;
  description: string;
  bullets: readonly string[];
  cta: string;
};

function TriageOptionCard({ tone, icon, title, description, bullets, cta }: TriageOptionCardProps) {
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
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="mt-0.5 size-4 shrink-0 text-success"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <Button variant={isPrimary ? "default" : "outline"} className="w-full justify-between">
          {cta}
          <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
