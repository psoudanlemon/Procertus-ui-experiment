import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useLayoutEffect } from "react";

import { defaultProcertusCategorizationDoc } from "../../categorization-data";
import {
  ProductSelectionBasketActionBar,
  ProductSelectionBasketBody,
  ProductSelectionBasketProvider,
} from "./ProductSelectionBasket";
import { TrajectLayout } from "./TrajectLayout";

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

const noop = () => {};

/**
 * Mirrors `PublicAppShell` in the production app: sets `data-public-layout` on `<html>` so the
 * shared `globals.css` unlocks document scrolling. Without this, the page can't scroll and the
 * sticky basket sidebar + action bar have no scroll context to anchor against.
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
  title: "Traject/Layout",
  component: TrajectLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      children: null,
      description: {
        component:
          "Catalogus-prototype met global search en hiërarchische navigatie: 70/30 split, een dominante zoekbalk die naar een gehele-catalogus zoekmodus schakelt, een prominente action-header voor contextueel terugnavigeren, en een winkelmandje rechts dat geselecteerde producten uit de lijsten weghoudt.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectLayout>;

export default meta;

/**
 * Catalogus met global search bovenaan en hiërarchische navigatie eronder. De
 * action-header (Terug naar X + huidige titel) vervangt de breadcrumb en
 * verdwijnt zodra de zoekmodus actief wordt. Geselecteerde producten worden
 * weggefilterd uit zowel de drilldown-lijst als de zoekresultaten en zijn alleen
 * nog zichtbaar in het winkelmandje rechts.
 */
export const ProductSelection: StoryObj<typeof meta> = {
  name: "Product selecteren",
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    bodyGap: "section",
    kicker: "BENOR-certificatie",
    title: "Selecteer de producten die je wil certificeren",
    description:
      "Doorzoek de hele catalogus of blader stapsgewijs door categorieën.",
    children: null,
  },
  render: (args) => (
    <ProductSelectionBasketProvider
      doc={defaultProcertusCategorizationDoc}
      onCancel={noop}
      onContinue={noop}
    >
      <TrajectLayout {...args} actionBar={<ProductSelectionBasketActionBar />}>
        <ProductSelectionBasketBody />
      </TrajectLayout>
    </ProductSelectionBasketProvider>
  ),
};
