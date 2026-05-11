import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useLayoutEffect } from "react";

import { defaultProcertusCategorizationDoc } from "../../categorization-data";
import {
  ProductSelectionBasketBody,
  ProductSelectionBasketMobileSummaryBar,
  ProductSelectionBasketProvider,
  useProductSelectionBasket,
} from "./ProductSelectionBasket";
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

const noop = () => {};

/**
 * Mirrors `PublicAppShell` in the production app: sets `data-public-layout` on `<html>` so the
 * shared `globals.css` unlocks document scrolling and paints the public bottom chrome (footer
 * + action bar) on a white surface. Without this, the page can't scroll and the sticky basket
 * sidebar + action bar have no scroll context to anchor against.
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
  title: "Traject configuration/Layout/Product selecteren",
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
  name: "Default",
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
      onBack={noop}
      onContinue={noop}
    >
      <TrajectLayout
        {...args}
        aboveActionBar={
          <ProductSelectionBasketMobileSummaryBar className="md:hidden" />
        }
        actionBar={<ProductSelectionStoryFooter />}
      >
        <ProductSelectionBasketBody />
      </TrajectLayout>
    </ProductSelectionBasketProvider>
  ),
};

/**
 * Verbindt {@link TrajectStoryFooter} met de basket-context: leest `selectedIds` voor de
 * disabled-staat van "Bevestig selectie" en bedraadt `onBack`/`onContinue` op de provider.
 * Eerste stap van de flow, dus `onCancel` wordt bewust weggelaten — `onBack` brengt de
 * gebruiker terug naar de wegwijzer.
 */
function ProductSelectionStoryFooter() {
  const { selectedIds, onBack, onContinue } = useProductSelectionBasket();
  return (
    <TrajectStoryFooter
      onBack={onBack}
      onContinue={() => onContinue(selectedIds)}
      continueLabel="Bevestig selectie"
      continueDisabled={selectedIds.length === 0}
    />
  );
}
