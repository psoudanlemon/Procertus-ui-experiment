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
          "Gedeeld footer-template voor traject-stories. Houdt de visuele baseline (twee Buttons, ghost links + primary rechts, matching responsive sizing) consistent zodat elk traject-scherm vanuit dezelfde shape vertrekt en daarna alleen labels/extra slots hoeft aan te passen.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectStoryFooter>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    onBack: noop,
    onContinue: noop,
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
