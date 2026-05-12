import type { Meta, StoryObj } from "@storybook/react-vite";
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
          "Plan een expert call: kalender, tijdslots en contactgegevens. Navigatie via de gedeelde `TrajectStoryFooter` (Terug + Verzenden) in de `actionBar`-slot van `TrajectLayout`; 'Verzenden' blijft uitgeschakeld tot datum en tijdslot gekozen zijn.",
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
    children: null,
    description:
      "Eén uur live met een PROCERTUS-expert om uw vraag, uw dossier en de juiste route samen door te nemen.",
  },
  render: (args) => <ExpertCallStoryBody args={args} />,
};

function ExpertCallStoryBody({ args }: { args: React.ComponentProps<typeof TrajectLayout> }) {
  const [canSubmit, setCanSubmit] = useState(false);
  return (
    <TrajectLayout
      {...args}
      actionBar={
        <TrajectStoryFooter
          onBack={noop}
          onContinue={noop}
          continueLabel="Verzenden"
          continueDisabled={!canSubmit}
        />
      }
    >
      <ExpertCallBookingView onCanSubmitChange={setCanSubmit} idPrefix="story-expert-call" />
    </TrajectLayout>
  );
}
