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
    availableBundleCerts: ["benor", "ce", "ssd", "procertus", "epd"],
    rowPrimaryCert: "benor",
    ceAvailabilityRaw: "2+",
  },
  {
    id: "granulaten-voor-beton",
    label: "Granulaten voor beton",
    categoryTrail: "Bestanddelen voor beton > Granulaten",
    availableBundleCerts: ["benor", "ce", "epd"],
    rowPrimaryCert: "benor",
    ceAvailabilityRaw: "1",
  },
  {
    id: "betonstaal",
    label: "Betonstaal",
    categoryTrail: "Staal > Wapeningsstaal",
    availableBundleCerts: ["benor", "ce", "procertus", "epd"],
    rowPrimaryCert: "benor",
    ceAvailabilityRaw: "4",
  },
];

const STORY_BUNDLE_PRIMARY_LABEL = BUNDLE_CERT_META[STORY_BUNDLE_PRIMARY_CERT].title;

export const Default: StoryObj<typeof meta> = {
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    bodyGap: "section",
    title: "Voeg per product certificaten toe",
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
        kicker={STORY_BUNDLE_PRIMARY_LABEL}
        description="Bekijk elk van uw geselecteerde producten en voeg waar nodig nog extra certificaten toe, zodat je meteen alle benodigdheden voor elk product kan indienen"
        actionBar={<BundleAssembleActionBar />}
      >
        <BundleAssembleBody />
      </TrajectLayout>
    </BundleAssembleProvider>
  ),
};
