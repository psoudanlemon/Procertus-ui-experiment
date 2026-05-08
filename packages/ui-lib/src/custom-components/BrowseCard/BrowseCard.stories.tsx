import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowRight02Icon,
  Call02Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Card } from "@procertus-ui/ui";

import { BrowseCard } from "./BrowseCard";

const meta = {
  title: "custom-components/Catalogue/BrowseCard",
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
    title: "ATG",
    description:
      "Een ATG-attest (Technische Goedkeuring) bevestigt de geschiktheid van een innovatief bouwproduct voor zijn beoogde toepassing.",
    variant: "faded",
    cta: {
      label: "Bezoek website",
      icon: <HugeiconsIcon icon={LinkSquare02Icon} className="size-3.5" strokeWidth={1.5} />,
    },
    asChild: true,
    children: <a href="https://www.butgb.be" target="_blank" rel="noopener noreferrer" />,
  },
};

const externalCta = {
  label: "Bezoek website",
  icon: <HugeiconsIcon icon={LinkSquare02Icon} className="size-3.5" strokeWidth={1.5} />,
};

function GridStory() {
  return (
    <div role="list" className="grid w-full grid-cols-4 gap-section">
      <BrowseCard
        title="BENOR-certificatie"
        description="BENOR is een Belgisch productcertificaat dat aantoont dat een bouwproduct voldoet aan de geldende normen."
        variant="elevated"
        className="col-span-4"
        asChild
      >
        <button type="button" />
      </BrowseCard>
      <BrowseCard
        title="CE-markering"
        description="De CE-markering bevestigt dat een bouwproduct voldoet aan de essentiële kenmerken vastgelegd in de Bouwproductenverordening."
        variant="elevated"
        className="col-span-4"
        asChild
      >
        <button type="button" />
      </BrowseCard>
      <BrowseCard
        title="SSD"
        description="Een Schriftelijke Sectorale Dienstverlening voor productgebonden controles binnen een afgebakend kader."
        variant="default"
        className="col-span-4 md:col-span-2"
        asChild
      >
        <button type="button" />
      </BrowseCard>
      <BrowseCard
        title="Innovatie-attest"
        description="Een ad-hoc attest voor specifieke innovatieve producten of technieken die nog niet onder een gestandaardiseerd schema vallen."
        variant="default"
        className="col-span-4 md:col-span-2"
        asChild
      >
        <button type="button" />
      </BrowseCard>
      <BrowseCard
        title="PROCERTUS-attest"
        description="Een productattest uitgegeven door PROCERTUS voor toepassingen die buiten de scope van een sectoraal schema vallen."
        variant="default"
        className="col-span-4 md:col-span-2"
        asChild
      >
        <button type="button" />
      </BrowseCard>
      <BrowseCard
        title="Partijkeuring"
        description="Een eenmalige keuring waarbij PROCERTUS één afgebakende batch op conformiteit controleert."
        variant="default"
        className="col-span-4 md:col-span-2"
        asChild
      >
        <button type="button" />
      </BrowseCard>
      <BrowseCard
        title="ATG"
        description="Een ATG-attest bevestigt de geschiktheid van een innovatief bouwproduct voor zijn beoogde toepassing."
        variant="faded"
        cta={externalCta}
        className="col-span-2 md:col-span-1"
        asChild
      >
        <button type="button" />
      </BrowseCard>
      <BrowseCard
        title="EPD"
        description="Een EPD documenteert de milieuprestaties van een bouwproduct over de volledige levenscyclus."
        variant="faded"
        cta={externalCta}
        className="col-span-2 md:col-span-1"
        asChild
      >
        <button type="button" />
      </BrowseCard>
      <ExpertCallFooterCard />
    </div>
  );
}

function ExpertCallFooterCard() {
  return (
    <Card className="col-span-4 flex flex-col gap-section bg-muted/50 px-section py-section md:col-span-2">
      <div className="flex flex-col gap-micro">
        <p className="text-heading-sm font-semibold">Liever eerst een expert spreken?</p>
        <p className="text-sm leading-normal text-muted-foreground">
          Plan een live online sessie van één uur en doorloop de vereisten samen met een
          PROCERTUS-expert.
        </p>
      </div>
      <Button asChild variant="outline" className="self-start bg-background">
        <a href="#expert-call" onClick={(e) => e.preventDefault()}>
          <HugeiconsIcon icon={Call02Icon} className="size-4" />
          Plan een expert call
          <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
        </a>
      </Button>
    </Card>
  );
}

export const TieredGrid: Story = {
  args: { title: "" },
  render: () => <GridStory />,
};
