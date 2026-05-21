import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useLayoutEffect } from "react";

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

const noop = () => {};

const meta = {
  title: "Traject configuration/Layout/Footer",
  component: TrajectStoryFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Gedeeld footer-template voor traject-stappen. De `mode`-prop bepaalt welke knoppen verschijnen: `in-flow` voor een typische wizard-stap met expliciete primaire CTA, of `decision` voor een keuze-scherm zoals Triage waar de forward-actie in het body zit en de footer alleen escape-acties heeft. Labels gebruiken canonieke defaults; per call-site kan een specifiek label de actie scherper beschrijven (bv. \"Aanvraag verzenden\" ipv \"Bevestig\").",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectStoryFooter>;

export default meta;

export const InFlow: StoryObj<typeof meta> = {
  args: {
    mode: "in-flow",
    onCancel: noop,
    onBack: noop,
    onContinue: noop,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Typische wizard-stap met Annuleren links, en Terug + primaire Bevestig rechts. Gebruik `continueLabel` om de primaire actie scherper te omschrijven (bv. \"Aanvraag verzenden\").",
      },
    },
  },
  render: (args) => (
    <TrajectLayout
      onSignInClick={noop}
      footer={STORY_FOOTER}
      title="Voorbeeldscherm met in-flow footer"
      description="Een typische tussenstap in een traject: footer toont Annuleren, Terug en de primaire CTA rechts."
      actionBar={<TrajectStoryFooter {...args} />}
    >
      <div />
    </TrajectLayout>
  ),
};

export const Decision: StoryObj<typeof meta> = {
  args: {
    mode: "decision",
    onCancel: noop,
    onBack: noop,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Keuze-scherm zoals Triage. Het body draagt de forward-actie via kaarten of vergelijkbare keuze-UI; de footer heeft alleen escape-acties (Annuleren + Terug).",
      },
    },
  },
  render: (args) => (
    <TrajectLayout
      onSignInClick={noop}
      footer={STORY_FOOTER}
      title="Voorbeeldscherm met decision footer"
      description="Een keuze-scherm waar de forward-actie in het body zit. Footer heeft alleen Annuleren en Terug."
      actionBar={<TrajectStoryFooter {...args} />}
    >
      <div />
    </TrajectLayout>
  ),
};
