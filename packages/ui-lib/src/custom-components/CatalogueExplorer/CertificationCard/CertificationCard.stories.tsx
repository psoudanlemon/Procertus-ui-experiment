import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight02Icon, ClockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, H4 } from "@procertus-ui/ui";

import { CertificationCard } from "./CertificationCard";

const meta = {
  title: "custom-components/CatalogueExplorer/CertificationCard",
  component: CertificationCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Detail card shell used by the catalogue explorer. Header (title + description), body slot, optional footer. Defaults a Procertus logomark watermark in the bottom-right; pass `hideWatermark` to suppress or `watermark` to override.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CertificationCard>;

export default meta;

function DefaultStory() {
  return (
    <CertificationCard
      title="BENOR-certificatie"
      description="Productgebonden BENOR-certificatie."
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
        <H4 className="leading-none">Wat is een BENOR-certificatie?</H4>
        <p className="text-sm leading-normal">
          BENOR is een Belgisch productcertificaat dat aantoont dat een bouwproduct voldoet aan de
          geldende normen voor samenstelling, productie en prestatie.
        </p>
      </section>

      <section className="flex flex-col gap-component">
        <H4>Wanneer vraag je dit het beste aan?</H4>
        <ul className="flex flex-col gap-micro">
          {[
            "U wenst een gestandaardiseerd bouwproduct op de Belgische markt aan te bieden.",
            "Aanbestedende overheden leggen BENOR op in hun lastenboeken.",
            "U wilt uw kwaliteitssysteem en productprestaties extern laten valideren.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-component text-sm leading-normal">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="max-w-3xl">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-start gap-component self-start rounded-md bg-info p-component text-info-foreground">
        <HugeiconsIcon icon={ClockIcon} className="mt-0.5 size-5 shrink-0" />
        <p className="text-sm leading-normal">
          Vanaf indiening van een volledig dossier verloopt het traject in 8 tot 12 weken.
        </p>
      </section>
    </CertificationCard>
  );
}

export const Default = {
  render: () => <DefaultStory />,
} as unknown as StoryObj<typeof meta>;
