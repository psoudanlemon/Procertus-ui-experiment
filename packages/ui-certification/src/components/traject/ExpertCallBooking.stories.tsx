import { Card, CardContent } from "@procertus-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Clock, Compass, FileSearch } from "lucide-react";
import { type ComponentType, useLayoutEffect, useState } from "react";

import { ExpertCallBookingView } from "./ExpertCallBookingView";
import { TrajectLayout } from "./TrajectLayout";
import { TrajectStoryFooter } from "./TrajectStoryFooter";

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
 * authenticated shell) and paints the public bottom chrome (footer + action bar) on a white
 * surface. Without this, tall traject pages get clipped at viewport.
 */
const PublicLayoutDecorator = (Story: ComponentType) => {
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);
  return <Story />;
};

const meta = {
  title: "Traject configuration/Layout/Informatieve aanvraag",
  component: TrajectLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      children: null,
      description: {
        component:
          "Plan een expert call: kalender, tijdslots en contactgegevens. Navigatie via de gedeelde `TrajectStoryFooter` (Terug + Aanvraag verzenden) in de `actionBar`-slot van `TrajectLayout`; 'Aanvraag verzenden' blijft uitgeschakeld tot datum en tijdslot gekozen zijn.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectLayout>;

export default meta;

const noop = () => {};

export const Default: StoryObj<typeof meta> = {
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    kicker: "Productcertificatie",
    title: "Een informatieve aanvraag",
    bodyGap: "section",
    children: null,
    description:
      "Gelieve uw gegevens achter te laten. Wij bekijken uw aanvraag en nemen binnenkort met u contact op om deze verder te bespreken.",
  },
  render: (args) => <ExpertCallStoryBody args={args} />,
};

export const ExpertCall: StoryObj<typeof meta> = {
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    title: "Plan een expert call",
    bodyGap: "section",
    children: null,
    description:
      "Eén uur live met een PROCERTUS-expert om uw vraag, uw dossier en de juiste route samen door te nemen.",
  },
  render: (args) => <ExpertCallStoryBody args={args} variant="expert-call" />,
};

const EXPERT_CALL_USPS = [
  {
    icon: Clock,
    title: "60 minuten, één op één",
    description: "Een live gesprek met een PROCERTUS-expert.",
  },
  {
    icon: FileSearch,
    title: "Op maat van uw dossier",
    description: "We vertrekken vanuit uw vraag en uw specifieke context.",
  },
  {
    icon: Compass,
    title: "De juiste route in beeld",
    description: "U weet meteen welke stappen u kunt zetten.",
  },
] as const;

function ExpertCallUspCards() {
  return (
    <div className="grid grid-cols-1 gap-component sm:grid-cols-3">
      {EXPERT_CALL_USPS.map(({ icon: Icon, title, description }) => (
        <Card key={title} className="h-full">
          <CardContent>
            <div className="flex items-start gap-component">
              <Icon className="mt-px size-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="flex flex-col gap-micro">
                <p className="font-medium leading-tight">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ExpertCallStoryBody({
  args,
  variant = "info-request",
}: {
  args: React.ComponentProps<typeof TrajectLayout>;
  variant?: "info-request" | "expert-call";
}) {
  const [canSubmit, setCanSubmit] = useState(false);
  const isExpertCall = variant === "expert-call";
  return (
    <TrajectLayout
      {...args}
      actionBar={
        <TrajectStoryFooter
          onBack={noop}
          onContinue={noop}
          continueLabel="Aanvraag verzenden"
          continueDisabled={!canSubmit}
        />
      }
    >
      <div className="flex flex-col gap-component">
        {isExpertCall ? <ExpertCallUspCards /> : null}
        <ExpertCallBookingView
          onCanSubmitChange={setCanSubmit}
          idPrefix={isExpertCall ? "story-expert-call" : "story-info-request"}
          alwaysShowSchedule={isExpertCall}
          showSelfServiceScheduling
        />
      </div>
    </TrajectLayout>
  );
}
