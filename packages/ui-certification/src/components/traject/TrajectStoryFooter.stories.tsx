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
          "Gedeeld footer-template voor traject-stories. Vaste vorm: ghost 'Annuleren' helemaal links (consumenten bedraden dit op de wegwijzer-route), en rechts de outline 'Terug' + primary 'Verder' als stap-navigatie. Op de eerste stap van een flow laat de consument `onCancel` weg: de ghost-knop verdwijnt en `onBack` neemt de rol 'terug naar het vorige scherm' over.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectStoryFooter>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    onCancel: noop,
    onBack: noop,
    onContinue: noop,
    cancelLabel: "Annuleren",
    backLabel: "Terug",
    continueLabel: "Bevestig selectie",
  },
  render: (args) => (
    <TrajectLayout
      onSignInClick={noop}
      footer={STORY_FOOTER}
      title="Voorbeeldscherm met gedeelde footer"
      description="Deze pagina toont enkel de baseline footer. De inhoud erboven is leeg zodat de visuele standaard duidelijk is."
      actionBar={<TrajectStoryFooter {...args} />}
    >
      <div />
    </TrajectLayout>
  ),
};

export const FirstStep: StoryObj<typeof meta> = {
  args: {
    onBack: noop,
    onContinue: noop,
    backLabel: "Terug",
    continueLabel: "Verder",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Eerste stap van een flow: `onCancel` wordt bewust weggelaten waardoor de ghost-knop verdwijnt. 'Terug' brengt de gebruiker dan naar het scherm dat aan de flow voorafging (typisch de wegwijzer).",
      },
    },
  },
  render: (args) => (
    <TrajectLayout
      onSignInClick={noop}
      footer={STORY_FOOTER}
      title="Voorbeeldscherm: eerste stap"
      description="Op de eerste stap is er nog niets om te annuleren. De ghost-knop is afwezig en 'Terug' brengt de gebruiker terug naar het voorgaande scherm."
      actionBar={<TrajectStoryFooter {...args} />}
    >
      <div />
    </TrajectLayout>
  ),
};
