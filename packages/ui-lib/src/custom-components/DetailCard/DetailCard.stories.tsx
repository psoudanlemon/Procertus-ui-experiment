import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight02Icon, ClockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, DownloadableItemGrid, type DownloadableItemData } from "@procertus-ui/ui";

import { DetailCard, DetailCardSection } from "./DetailCard";

const documents: DownloadableItemData[] = [
  {
    id: "benor-ptv",
    title: "Producttechnische fiche (PTV): BENOR",
    description: "Technische specificaties en profieldelen voor BENOR (prototype).",
    formatHint: "PDF · mock",
    href: "#",
  },
  {
    id: "benor-ruleset",
    title: "Ruleset matrix: geselecteerde certificeringen en attesten",
    description: "Normenkader en regelpaden voor: BENOR.",
    formatHint: "PDF · mock",
    href: "#",
  },
  {
    id: "benor-checklist",
    title: "Indien-checklist aanvraagpakket",
    description: "Controlelijst afgestemd op de samenstelling van dit pakket vóór indiening.",
    formatHint: "PDF · mock",
    href: "#",
  },
];

const meta = {
  title: "custom-components/Catalogue/DetailCard",
  component: DetailCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Opt-in feature shell card. Title + description on a muted strip, free-form body with an optional watermark, optional footer strip. Use for detail / feature pages; for ordinary cards keep using the base `Card` primitive.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DetailCard>;

export default meta;

function DefaultStory() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <DetailCard
        title="BENOR-certificatie"
        description="Productgebonden BENOR-certificatie."
        footer={
          <>
            <Button variant="link">Hulp nodig?</Button>
            <Button size="lg">
              Start traject
              <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
            </Button>
          </>
        }
      >
        <DetailCardSection title="Wat is een BENOR-certificatie?">
          <p className="max-w-3xl text-sm leading-normal">
            BENOR is een Belgisch productcertificaat dat aantoont dat een bouwproduct voldoet aan de
            geldende normen voor samenstelling, productie en prestatie. PROCERTUS kent het toe na
            een uitgebreide initiële beoordeling en houdt het in stand via continue externe
            controles op de productielocatie en op de markt.
          </p>
        </DetailCardSection>

        <DetailCardSection title="Wanneer vraag je dit het beste aan?">
          <ul className="flex flex-col gap-micro">
            {[
              "U wenst een gestandaardiseerd bouwproduct (beton, mortel, granulaten, hydraulische bindmiddelen) op de Belgische markt aan te bieden.",
              "Aanbestedende overheden (SPW, AWV, MOW, Infrabel) leggen BENOR op in hun lastenboeken.",
              "U wilt uw kwaliteitssysteem en productprestaties extern laten valideren.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-component text-sm leading-normal">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span className="max-w-3xl">{item}</span>
              </li>
            ))}
          </ul>
        </DetailCardSection>

        <DetailCardSection
          title="Regels en documentatie"
          description="Documenten op basis van uw selectie voor BENOR (prototype, downloadlinks zijn gemockt)."
        >
          <DownloadableItemGrid items={documents} />
        </DetailCardSection>

        <DetailCardSection>
          <div className="flex items-start gap-component self-start rounded-md bg-info/40 p-component text-info-foreground">
            <HugeiconsIcon icon={ClockIcon} className="mt-0.5 size-5 shrink-0" />
            <p className="text-sm leading-normal">
              Vanaf indiening van een volledig dossier verloopt het traject in 8 tot 12 weken:
              ontvankelijkheidsanalyse, initiële audit, analyse van de proefresultaten en finale
              beslissing.
            </p>
          </div>
        </DetailCardSection>
      </DetailCard>
    </div>
  );
}

export const Default = {
  render: () => <DefaultStory />,
} as unknown as StoryObj<typeof meta>;

function NoWatermarkStory() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <DetailCard
        title="Detail card without watermark"
        description="Use `hideWatermark` when the body is busy or includes a custom illustration."
        hideWatermark
        footer={
          <>
            <Button variant="link">Hulp nodig?</Button>
            <Button size="lg">
              Bevestigen
              <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
            </Button>
          </>
        }
      >
        <DetailCardSection title="Waarom geen watermerk?">
          <p className="max-w-3xl text-sm leading-normal">
            Schakel het watermerk uit op surfaces met een drukke body of een eigen illustratie,
            zodat de inhoud rustig blijft en de typografie centraal staat.
          </p>
        </DetailCardSection>

        <DetailCardSection
          title="Wanneer toepassen?"
          description="Een paar concrete situaties waarin `hideWatermark` de juiste keuze is."
        >
          <ul className="flex flex-col gap-micro">
            {[
              "De body bevat een eigen visualisatie, illustratie of kaart.",
              "De content is data-zwaar (tabellen, formulieren, dashboards).",
              "De surface staat al naast een ander gebrand element.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-component text-sm leading-normal">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span className="max-w-3xl">{item}</span>
              </li>
            ))}
          </ul>
        </DetailCardSection>

        <DetailCardSection
          title="Documentatie"
          description="Optionele referenties die de keuze ondersteunen (mock)."
        >
          <DownloadableItemGrid items={documents.slice(0, 2)} />
        </DetailCardSection>
      </DetailCard>
    </div>
  );
}

export const NoWatermark = {
  render: () => <NoWatermarkStory />,
} as unknown as StoryObj<typeof meta>;

function WithCloseStory() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <DetailCard
        title="BENOR-certificatie"
        description="Pass `onClose` to render a ghost close button in the header. Use to return from a detail view to its overview."
        onClose={() => {
          // eslint-disable-next-line no-alert
          alert("DetailCard close clicked");
        }}
        closeLabel="Sluit BENOR-certificatie en keer terug naar het overzicht"
        footer={
          <>
            <Button variant="link">Hulp nodig?</Button>
            <Button size="lg">
              Start traject
              <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
            </Button>
          </>
        }
      >
        <DetailCardSection title="Wat is een BENOR-certificatie?">
          <p className="max-w-3xl text-sm leading-normal">
            De close-knop links bovenaan de header laat de gebruiker zonder browser-back terug naar
            het overzicht. Houd de titel kort genoeg zodat hij niet over de knop heen loopt — bij
            lange titels zorgt de flex-layout dat de knop netjes naast de tekst blijft staan.
          </p>
        </DetailCardSection>
      </DetailCard>
    </div>
  );
}

export const WithClose = {
  render: () => <WithCloseStory />,
} as unknown as StoryObj<typeof meta>;

function LayoutStory() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <DetailCard
        title="DetailCard layout"
        description="CardHeader, CardContent (DetailCardSection × N), CardFooter."
        footer={
          <>
            <Button variant="link">Footer leading slot</Button>
            <Button size="lg">Footer trailing slot</Button>
          </>
        }
      >
        <DetailCardSection
          title="Section A"
          description="Title + description block, separated by gap-micro."
        >
          <LayoutPlaceholder label="Section content" />
        </DetailCardSection>

        <DetailCardSection title="Section B (title only)">
          <LayoutPlaceholder label="Section content" />
        </DetailCardSection>

        <DetailCardSection description="Section C — description only.">
          <LayoutPlaceholder label="Section content" />
        </DetailCardSection>

        <DetailCardSection>
          <LayoutPlaceholder label="Section D — content only, no header" />
        </DetailCardSection>
      </DetailCard>
    </div>
  );
}

function LayoutPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex min-h-20 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 p-component text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export const Layout = {
  render: () => <LayoutStory />,
} as unknown as StoryObj<typeof meta>;
