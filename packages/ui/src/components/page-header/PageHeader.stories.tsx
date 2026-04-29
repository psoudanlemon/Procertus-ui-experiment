import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/heading";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderKicker,
  PageHeaderMedia,
} from "./PageHeader";

const meta = {
  title: "components/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Presentational masthead. Kicker, title, and description share one text column. `media` floats top-right of that column on `sm`+; `icon` (mutually exclusive with media) and `actions` float bottom-right. All trailing slots stack underneath on mobile. `children` render full-width below the entire header row. Pass plain strings for kicker/description/title to get default typography, or pass custom nodes for full control.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PageHeader>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  name: "Dashboard-style",
  args: {
    kicker: "Extranet prototype",
    title: "Welkom op het PROCERTUS klantenportaal",
    description:
      "Overzicht van uw sessie, organisatie en certificatie-aanvragen zoals in deze demo beschikbaar zijn.",
    media: (
      <img
        src="/Procertus Logo with tagline.svg"
        alt="Procertus"
        className="h-16 w-auto max-w-[min(100%,240px)] object-contain sm:h-18"
      />
    ),
  },
};

export const TitleOnly: StoryObj<typeof meta> = {
  name: "Title only",
  args: {
    kicker: undefined,
    title: "Instellingen",
    description: undefined,
    media: undefined,
    actions: undefined,
  },
};

export const WithActions: StoryObj<typeof meta> = {
  name: "With actions",
  args: {
    kicker: "Beheer",
    title: "Organisatieprofiel",
    description: "Werk de gegevens van uw organisatie bij en controleer wie toegang heeft.",
    actions: (
      <>
        <Button type="button" size="sm" variant="outline">
          Annuleren
        </Button>
        <Button type="button" size="sm">
          Opslaan
        </Button>
      </>
    ),
  },
};

export const WithIcon: StoryObj<typeof meta> = {
  name: "Trailing icon (no media)",
  args: {
    kicker: "Mijn account",
    title: "Mijn profiel",
    description: "Icon shares the trailing column with media; it aligns with the kicker + title row only.",
    icon: (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-xs font-semibold text-primary">
        Me
      </div>
    ),
  },
};

export const WithTitleBadge: StoryObj<typeof meta> = {
  name: "Badge as kicker",
  args: {
    kicker: <Badge variant="success">In behandeling</Badge>,
    title: "Aanvraag #2026-0142",
    description: "Status van uw lopende certificatie-aanvraag.",
  },
};

export const WithChildrenAndActions: StoryObj<typeof meta> = {
  name: "Below description + actions",
  args: {
    kicker: "Certificatie",
    title: "Aanvraag indienen",
    description: "Controleer het pakket voordat u het ter beoordeling verstuurt.",
    children: (
      <p className="text-sm text-muted-foreground">
        Laatst opgeslagen om <span className="tabular-nums text-foreground">14:32</span> — alle verplichte
        documenten zijn aanwezig.
      </p>
    ),
    actions: (
      <>
        <Button type="button" size="sm" variant="outline">
          Terug naar concept
        </Button>
        <Button type="button" size="sm">
          Indienen
        </Button>
      </>
    ),
  },
};

export const CompositionSlots: StoryObj<typeof meta> = {
  name: "Composition (slot primitives)",
  args: {
    title: "Slot composition demo",
  },
  render: () => (
    <header>
      <div className="flex flex-col gap-region sm:flex-row sm:justify-between sm:gap-region">
        <div className="flex min-w-0 flex-1 flex-col [&_[data-slot=page-header-description]]:[text-box:trim-start_text]">
          <div className="flex min-w-0 flex-col gap-component text-left [&_[data-slot=heading]]:[text-box:trim-end_text] [&_[data-slot=page-header-kicker]]:[text-box:trim-both_cap_alphabetic]">
            <PageHeaderKicker>Custom kicker node</PageHeaderKicker>
            <H1 className="text-balance">Hand-built title with extra classes</H1>
          </div>
          <PageHeaderDescription>
            Description sits inside the text column, directly under the title (same as{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">PageHeader</code>).
          </PageHeaderDescription>
        </div>
        <PageHeaderMedia className="sm:self-start">
          <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
            Logo
          </div>
        </PageHeaderMedia>
      </div>
    </header>
  ),
};
