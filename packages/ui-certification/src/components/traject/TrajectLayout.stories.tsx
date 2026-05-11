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
  Field,
  FieldLabel,
  H3,
  Input,
  Separator,
  cn,
} from "@procertus-ui/ui";
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
 *
 * Also pins the footer to a white surface in every story by remapping the sidebar/card tokens
 * scoped to `[data-slot="footer"]`, so the chrome reads clean against the page regardless of
 * the active theme.
 */
const PublicLayoutDecorator = (Story: ComponentType) => {
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);
  return (
    <>
      <style>{`
        [data-slot="footer"] {
          --sidebar: var(--neutral-white);
          --sidebar-foreground: var(--neutral-950);
          --sidebar-accent-foreground: var(--brand-primary-700);
          --card: var(--neutral-white);
          --card-foreground: var(--neutral-950);
        }
      `}</style>
      <Story />
    </>
  );
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
