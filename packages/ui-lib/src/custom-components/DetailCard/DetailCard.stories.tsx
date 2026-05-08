import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowRight02Icon,
  ClockIcon,
  Download01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, H4 } from "@procertus-ui/ui";

import { DetailCard } from "./DetailCard";

type DocumentItem = {
  title: string;
  description: string;
  meta: string;
};

const documents: DocumentItem[] = [
  {
    title: "Producttechnische fiche (PTV): BENOR",
    description: "Technische specificaties en profieldelen voor BENOR (prototype).",
    meta: "PDF · mock",
  },
  {
    title: "Ruleset matrix: geselecteerde certificeringen en attesten",
    description: "Normenkader en regelpaden voor: BENOR.",
    meta: "PDF · mock",
  },
  {
    title: "Indien-checklist aanvraagpakket",
    description: "Controlelijst afgestemd op de samenstelling van dit pakket vóór indiening…",
    meta: "PDF · mock",
  },
];

function DocumentRow({ document }: { document: DocumentItem }) {
  return (
    <button
      type="button"
      className="group flex items-start gap-component rounded-md border border-border p-component text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <HugeiconsIcon
        icon={File01Icon}
        className="mt-0.5 size-5 shrink-0 text-muted-foreground"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-micro">
        <p className="truncate text-sm font-medium leading-snug">{document.title}</p>
        <p className="text-sm leading-snug text-muted-foreground">{document.description}</p>
        <p className="text-xs leading-none text-muted-foreground">{document.meta}</p>
      </div>
      <HugeiconsIcon
        icon={Download01Icon}
        className="mt-0.5 size-5 shrink-0 self-end text-muted-foreground transition-colors group-hover:text-foreground"
      />
    </button>
  );
}

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
      <section className="flex flex-col gap-component">
        <H4 className="leading-none">Wat is een BENOR-certificatie?</H4>
        <p className="max-w-3xl text-sm leading-normal">
          BENOR is een Belgisch productcertificaat dat aantoont dat een bouwproduct voldoet aan de
          geldende normen voor samenstelling, productie en prestatie. PROCERTUS kent het toe na een
          uitgebreide initiële beoordeling en houdt het in stand via continue externe controles op
          de productielocatie en op de markt.
        </p>
      </section>

      <section className="flex flex-col gap-component">
        <H4>Wanneer vraag je dit het beste aan?</H4>
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
      </section>

      <section className="flex flex-col gap-component">
        <H4>Regels en documentatie</H4>
        <p className="text-sm leading-normal text-muted-foreground">
          Documenten op basis van uw selectie voor BENOR (prototype, downloadlinks zijn gemockt).
        </p>
        <div className="grid grid-cols-1 gap-component md:grid-cols-2">
          {documents.map((document) => (
            <DocumentRow key={document.title} document={document} />
          ))}
        </div>
      </section>

      <section className="flex items-start gap-component rounded-md bg-info p-component text-info-foreground">
        <HugeiconsIcon icon={ClockIcon} className="mt-0.5 size-5 shrink-0" />
        <p className="max-w-3xl text-sm leading-normal">
          Vanaf indiening van een volledig dossier verloopt het traject in 8 tot 12 weken:
          ontvankelijkheidsanalyse, initiële audit, analyse van de proefresultaten en finale
          beslissing.
        </p>
      </section>
    </DetailCard>
  );
}

export const Default = {
  render: () => <DefaultStory />,
} as unknown as StoryObj<typeof meta>;

function NoWatermarkStory() {
  return (
    <DetailCard
      title="Detail card without watermark"
      description="Use `hideWatermark` when the body is busy or includes a custom illustration."
      hideWatermark
      footer={<Button>Bevestigen</Button>}
    >
      <p className="text-sm leading-normal">Free-form body content.</p>
    </DetailCard>
  );
}

export const NoWatermark = {
  render: () => <NoWatermarkStory />,
} as unknown as StoryObj<typeof meta>;
