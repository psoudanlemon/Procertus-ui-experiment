import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight02Icon, ClockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, H4 } from "@procertus-ui/ui";

import { DetailCard } from "./DetailCard";

const meta = {
  title: "custom-components/DetailCard",
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
    </DetailCard>
  );
}

export const Default = {
  render: () => <DefaultStory />,
} as unknown as StoryObj<typeof meta>;

function NoFooterStory() {
  return (
    <DetailCard
      title="Detail card without footer"
      description="A footer is optional. Useful for surfaces where the action lives elsewhere on the page."
    >
      <p className="text-sm leading-normal">Free-form body content.</p>
    </DetailCard>
  );
}

export const NoFooter = {
  render: () => <NoFooterStory />,
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
