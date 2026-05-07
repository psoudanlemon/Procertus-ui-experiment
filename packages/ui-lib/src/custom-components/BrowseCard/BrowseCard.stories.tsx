import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { BrowseCard } from "./BrowseCard";

const meta = {
  title: "custom-components/BrowseCard",
  component: BrowseCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Clickable navigation card. Same chrome vocabulary as `SelectChoiceCard` / `ChoiceBar` (elevated, default, faded, ghost, no-border) but without form-control machinery — drop-in for catalogue grids, drill-down lists, and external referrals.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BrowseCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const description =
  "BENOR is een Belgisch productcertificaat dat aantoont dat een bouwproduct voldoet aan de geldende normen voor samenstelling, productie en prestatie.";

export const Elevated: Story = {
  args: {
    title: "BENOR-certificatie",
    description,
    variant: "elevated",
    onClick: () => undefined,
  },
};

export const Default: Story = {
  args: {
    title: "BENOR-certificatie",
    description,
    variant: "default",
    onClick: () => undefined,
  },
};

export const Faded: Story = {
  args: {
    title: "Innovatie-attest",
    description:
      "Een Innovatie-attest is een ad-hoc attest, uitgegeven door PROCERTUS voor een specifiek innovatief product of techniek dat (nog) niet onder een gestandaardiseerd schema valt.",
    variant: "faded",
    onClick: () => undefined,
  },
};

export const Ghost: Story = {
  args: {
    title: "Environmental Product Declaration",
    description:
      "Een EPD documenteert de milieuprestaties van een bouwproduct over de volledige levenscyclus.",
    eyebrow: "Externe verwijzing",
    variant: "ghost",
    onClick: () => undefined,
  },
};

export const NoBorder: Story = {
  args: {
    title: "Alle certificaten",
    description: "Bekijk het volledige aanbod aan certificaten en attesten.",
    variant: "no-border",
    onClick: () => undefined,
  },
};

export const AsLink: Story = {
  args: {
    title: "ATG-attest",
    description: "Doorverwijzing naar BUtgb voor de afhandeling van uw aanvraag.",
    eyebrow: "Externe verwijzing",
    variant: "ghost",
    cta: {
      label: "Open externe site",
      icon: <HugeiconsIcon icon={LinkSquare02Icon} className="size-3.5" strokeWidth={1.5} />,
    },
    asChild: true,
    children: <a href="https://www.butgb.be" target="_blank" rel="noopener noreferrer" />,
  },
};

export const NoCta: Story = {
  args: {
    title: "Card zonder cta",
    description: "Pas `cta={null}` toe als de affordance elders zit.",
    variant: "default",
    cta: null,
    onClick: () => undefined,
  },
};

function GridStory() {
  return (
    <div role="list" className="grid w-full grid-cols-4 gap-section">
      <BrowseCard
        title="BENOR-certificatie"
        description="BENOR is een Belgisch productcertificaat dat aantoont dat een bouwproduct voldoet aan de geldende normen."
        variant="elevated"
        className="col-span-4"
        onClick={() => undefined}
      />
      <BrowseCard
        title="CE-markering"
        description="De CE-markering bevestigt dat een bouwproduct voldoet aan de essentiële kenmerken vastgelegd in de Bouwproductenverordening."
        variant="elevated"
        className="col-span-4"
        onClick={() => undefined}
      />
      <BrowseCard
        title="Innovatie-attest"
        description="Een ad-hoc attest voor specifieke innovatieve producten of technieken die nog niet onder een gestandaardiseerd schema vallen."
        variant="faded"
        className="col-span-4 md:col-span-2"
        onClick={() => undefined}
      />
      <BrowseCard
        title="Partijkeuring"
        description="Een eenmalige keuring waarbij PROCERTUS één afgebakende batch op conformiteit controleert."
        variant="faded"
        className="col-span-4 md:col-span-2"
        onClick={() => undefined}
      />
      <BrowseCard
        title="ATG-attest"
        description="Een ATG-attest bevestigt de geschiktheid van een innovatief bouwproduct."
        eyebrow="Externe verwijzing"
        variant="ghost"
        cta={{
          label: "Open externe site",
          icon: (
            <HugeiconsIcon icon={LinkSquare02Icon} className="size-3.5" strokeWidth={1.5} />
          ),
        }}
        className="col-span-2 md:col-span-1"
        onClick={() => undefined}
      />
      <BrowseCard
        title="Environmental Product Declaration"
        description="Een EPD documenteert de milieuprestaties van een bouwproduct over de volledige levenscyclus."
        eyebrow="Externe verwijzing"
        variant="ghost"
        cta={{
          label: "Open externe site",
          icon: (
            <HugeiconsIcon icon={LinkSquare02Icon} className="size-3.5" strokeWidth={1.5} />
          ),
        }}
        className="col-span-2 md:col-span-1"
        onClick={() => undefined}
      />
    </div>
  );
}

export const TieredGrid: Story = {
  args: { title: "" },
  render: () => <GridStory />,
};
