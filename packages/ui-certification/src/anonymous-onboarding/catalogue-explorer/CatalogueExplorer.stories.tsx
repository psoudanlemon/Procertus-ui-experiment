import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ArrowRight02Icon, ClockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, H4 } from "@procertus-ui/ui";
import { DetailCard, type ChoiceBarItem } from "@procertus-ui/ui-lib";

import { CatalogueExplorer } from "./CatalogueExplorer";

const meta = {
  title: "anonymous-onboarding/CatalogueExplorer",
  component: CatalogueExplorer,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Composition of `ChoiceBar` (from `@procertus-ui/ui-lib`) and an animated body region. Owns internal `gap-section` rhythm and the body's `animate-in` transition; page-edge padding is the caller's concern. Reproduces the Wegwijzer service-picker layout 1:1.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CatalogueExplorer>;

export default meta;

type ServiceContent = {
  description: string;
  what: string;
  whenToApply: readonly string[];
  timeline: string;
};

const ITEMS: readonly ChoiceBarItem[] = [
  { value: "benor", label: "BENOR-certificatie", variant: "elevated" },
  { value: "ce", label: "CE-markering", variant: "elevated" },
  { value: "ssd", label: "SSD", variant: "elevated" },
  { value: "innovatie-attest", label: "Innovatie-attest", variant: "faded" },
  { value: "procertus-attest", label: "PROCERTUS-attest", variant: "faded" },
  { value: "partijkeuring", label: "Partijkeuring", variant: "faded" },
  { value: "overige", label: "Overige", variant: "ghost" },
];

const SERVICE_BY_ID: Record<string, { title: string; content: ServiceContent }> = {
  benor: {
    title: "BENOR-certificatie",
    content: {
      description: "Productgebonden BENOR-certificatie.",
      what: "BENOR is een Belgisch productcertificaat dat aantoont dat een bouwproduct voldoet aan de geldende normen voor samenstelling, productie en prestatie.",
      whenToApply: [
        "U wenst een gestandaardiseerd bouwproduct op de Belgische markt aan te bieden.",
        "Aanbestedende overheden leggen BENOR op in hun lastenboeken.",
        "U wilt uw kwaliteitssysteem en productprestaties extern laten valideren.",
      ],
      timeline:
        "Vanaf indiening van een volledig dossier verloopt het traject in 8 tot 12 weken.",
    },
  },
  ce: {
    title: "CE-markering",
    content: {
      description: "Verplichte CE-markering voor bouwproducten onder een geharmoniseerde norm.",
      what: "De CE-markering toont aan dat een bouwproduct voldoet aan de Verordening Bouwproducten (CPR) en is verplicht voor producten die onder een geharmoniseerde Europese norm vallen.",
      whenToApply: [
        "Uw product valt onder een geharmoniseerde Europese norm.",
        "U brengt het product in de handel binnen de Europese Economische Ruimte.",
      ],
      timeline:
        "De afhandeling kost doorgaans 6 tot 10 weken na een volledig ingediend dossier.",
    },
  },
};

function DefaultStory() {
  const [activeId, setActiveId] = useState("benor");
  const service = SERVICE_BY_ID[activeId];

  return (
    <CatalogueExplorer
      items={ITEMS}
      activeId={activeId}
      onActiveIdChange={setActiveId}
      ariaLabel="Kies een certificaat"
    >
      {service ? (
        <DetailCard
          title={service.title}
          description={service.content.description}
          footer={
            <>
              <Button variant="link">Hulp nodig?</Button>
              <Button size="lg">
                Aanvraag starten
                <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
              </Button>
            </>
          }
        >
          <section className="flex flex-col gap-component">
            <H4 className="leading-none">Wat is een {service.title.toLowerCase()}?</H4>
            <p className="text-sm leading-normal">{service.content.what}</p>
          </section>

          <section className="flex flex-col gap-component">
            <H4>Wanneer vraag je dit het beste aan?</H4>
            <ul className="flex flex-col gap-micro">
              {service.content.whenToApply.map((item) => (
                <li key={item} className="flex items-start gap-component text-sm leading-normal">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="max-w-3xl">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex items-start gap-component self-start rounded-md bg-info p-component text-info-foreground">
            <HugeiconsIcon icon={ClockIcon} className="mt-0.5 size-5 shrink-0" />
            <p className="text-sm leading-normal">{service.content.timeline}</p>
          </section>
        </DetailCard>
      ) : (
        <p className="text-sm text-muted-foreground">
          Inhoud voor dit onderdeel volgt — selecteer een ander certificaat hierboven.
        </p>
      )}
    </CatalogueExplorer>
  );
}

export const Default = {
  render: () => <DefaultStory />,
} as unknown as StoryObj<typeof meta>;
