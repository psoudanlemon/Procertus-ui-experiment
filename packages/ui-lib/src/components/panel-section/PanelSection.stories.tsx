import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@procertus-ui/ui";

import { PanelSection } from "./PanelSection";

const bodyPlaceholder = (
  <p className="text-sm leading-relaxed text-muted-foreground">
    Hoofdinhoud van de sectie — tijdlijn, lijst, formulierfragmenten, enz.
  </p>
);

const meta = {
  title: "ui-lib/PanelSection",
  component: PanelSection,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Section stack for detail panels (no card): optional `h2` title and description typography, `children` as the main slot, optional `contentClassName` on the body wrapper.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    children: bodyPlaceholder,
  },
} satisfies Meta<typeof PanelSection>;

export default meta;

export const TitleAndDescription: StoryObj<typeof meta> = {
  name: "Title + description",
  args: {
    title: "Levenscyclus",
    description: "Historiek van acties op dit aanvraagpakket.",
  },
};

export const TitleOnly: StoryObj<typeof meta> = {
  name: "Title only",
  args: {
    title: "Onderliggende aanvragen",
    description: undefined,
  },
};

export const DescriptionOnly: StoryObj<typeof meta> = {
  name: "Description only (no title)",
  args: {
    title: undefined,
    description:
      "Soms wil je alleen toelichtende copy zonder titelregel — de beschrijving staat dan alleen in de header.",
  },
};

export const Headerless: StoryObj<typeof meta> = {
  name: "Headerless (body only)",
  args: {
    title: undefined,
    description: undefined,
    children: (
      <div className="rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        Geen titel of beschrijving — alleen inhoud, bijvoorbeeld ingebedde kaarten of tabellen.
      </div>
    ),
  },
};

export const FollowUpActions: StoryObj<typeof meta> = {
  name: "Follow-up actions row",
  render: () => (
    <div className="mx-auto w-full max-w-lg">
      <PanelSection
        title="Vervolgacties"
        description="Open de volledige route om te bewerken of beheer de aanvraag rechtstreeks vanuit dit overzicht."
        contentClassName="flex flex-wrap gap-2"
      >
        <Button type="button">Bewerken</Button>
        <Button type="button" variant="destructive">
          Verwijderen
        </Button>
        <Button type="button" variant="destructive">
          Annuleren
        </Button>
      </PanelSection>
    </div>
  ),
};

export const LongDescription: StoryObj<typeof meta> = {
  name: "Long description + narrow column",
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Regels en documentatie",
    description:
      "Documenten gekoppeld aan meerdere aanvragen in dit pakket. In een smalle kolom moet de beschrijving netjes afbreken zonder horizontaal te scrollen (prototype — downloadlinks zijn gemockt).",
  },
};

export const RichTitle: StoryObj<typeof meta> = {
  name: "Rich title (ReactNode)",
  args: {
    title: (
      <span className="flex items-baseline gap-2">
        <span>Statusoverzicht</span>
        <span className="text-sm font-normal text-muted-foreground">(concept)</span>
      </span>
    ),
    description: "`title` en `description` mogen elk een ReactNode zijn.",
  },
};
