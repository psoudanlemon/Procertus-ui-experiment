import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useLayoutEffect } from "react";

import {
  BUNDLE_CERT_META,
  BundleAssembleActionBar,
  BundleAssembleBody,
  BundleAssembleProvider,
} from "./BundleAssemble";
import type { BundleCertKey, BundleProduct } from "./BundleAssemble";
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
  title: "Traject configuration/Layout/Voeg trajecten toe",
  component: TrajectLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      children: null,
      description: {
        component:
          "Voeg trajecten toe: de gebruiker bevestigt zijn hoofdcertificatie (gekozen in de wegwijzer) één keer in de pagina-header en breidt vervolgens per product zijn pakket uit met aanvullende certificaties (CE, ATG, …). Eén samengesteld pakket, ook al vertaalt de backend dat naar meerdere aanvragen. Volgt dezelfde shell-architectuur als 'product selecteren': `BundleAssembleProvider` wraps `TrajectLayout`, en `actionBar` + `children` worden gevuld via de bijhorende slots.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectLayout>;

export default meta;

const noop = () => {};

const STORY_BUNDLE_PRIMARY_CERT: BundleCertKey = "benor";

const STORY_BUNDLE_PRODUCTS: readonly BundleProduct[] = [
  {
    id: "stortklaar-beton",
    label: "Stortklaar beton",
    categoryTrail: "Beton en mortel",
    extraCerts: ["ce", "atg"],
  },
  {
    id: "granulaten-voor-beton",
    label: "Granulaten voor beton",
    categoryTrail: "Bestanddelen voor beton > Granulaten",
    extraCerts: ["ce"],
  },
  {
    id: "betonstaal",
    label: "Betonstaal",
    categoryTrail: "Staal > Wapeningsstaal",
    extraCerts: ["ce", "atg"],
  },
];

const STORY_BUNDLE_PRIMARY_LABEL = BUNDLE_CERT_META[STORY_BUNDLE_PRIMARY_CERT].title;
const STORY_BUNDLE_PRODUCT_COUNT = STORY_BUNDLE_PRODUCTS.length;
const STORY_BUNDLE_PRODUCT_WORD = STORY_BUNDLE_PRODUCT_COUNT === 1 ? "product" : "producten";

export const Default: StoryObj<typeof meta> = {
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    bodyGap: "section",
    title: "Stel je aanvraagpakket samen",
    children: null,
  },
  render: (args) => (
    <BundleAssembleProvider
      products={STORY_BUNDLE_PRODUCTS}
      primaryCert={STORY_BUNDLE_PRIMARY_CERT}
      onCancel={noop}
      onBack={noop}
      onContinue={noop}
    >
      <TrajectLayout
        {...args}
        kicker={
          <span className="inline-flex max-w-full items-center gap-micro self-start rounded-full border border-primary/30 bg-primary/10 px-component py-micro text-xs font-medium text-primary">
            Hoofdcertificatie voor dit pakket:
            <strong className="font-semibold">{STORY_BUNDLE_PRIMARY_LABEL}</strong>
          </span>
        }
        description={`U heeft ${STORY_BUNDLE_PRODUCT_COUNT} ${STORY_BUNDLE_PRODUCT_WORD} geselecteerd. Breid uw aanvraag hieronder uit per product om uw dossier in één keer volledig te maken.`}
        actionBar={<BundleAssembleActionBar />}
      >
        <BundleAssembleBody />
      </TrajectLayout>
    </BundleAssembleProvider>
  ),
};
