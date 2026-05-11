import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  BundleProductCard,
  type BundleCertKey,
  type BundleProduct,
} from "./BundleProductCard";

const noop = () => {};

const meta = {
  title: "Traject configuration/BundleProductCard",
  component: BundleProductCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Eén productkaart in de \"Stel je aanvraagpakket samen\"-stap. Toont het volledige categoriepad en het productlabel als header, en daaronder een grid van `ChoiceCard` multi-toggles voor de aanvullende certificaties (CE, ATG, …) die bovenop de hoofdcertificatie van het pakket kunnen worden gekozen.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BundleProductCard>;

export default meta;

const SAMPLE_PRODUCT: BundleProduct = {
  id: "stortklaar-beton",
  label: "Stortklaar beton",
  categoryTrail: "Beton en mortel",
  extraCerts: ["ce", "atg"],
};

/**
 * Standaardvariant: twee extra certificaties beschikbaar, nog niets geselecteerd.
 * Mirrors de eerste rij van "Voeg trajecten toe" in de TrajectLayout-story.
 */
export const Default: StoryObj<typeof meta> = {
  args: {
    product: SAMPLE_PRODUCT,
    selected: new Set<BundleCertKey>(),
    onToggle: noop,
  },
  render: (args) => <InteractiveCard {...args} />,
};

/**
 * Pre-geselecteerde extra certificaties. Toont de `ChoiceCard` checked-state zoals
 * die zichtbaar wordt nadat de gebruiker beide opties heeft aangevinkt.
 */
export const WithSelection: StoryObj<typeof meta> = {
  args: {
    product: SAMPLE_PRODUCT,
    selected: new Set<BundleCertKey>(["ce", "atg"]),
    onToggle: noop,
  },
  render: (args) => <InteractiveCard {...args} />,
};

function InteractiveCard({
  product,
  selected: initial,
  onToggle,
}: {
  product: BundleProduct;
  selected: ReadonlySet<BundleCertKey>;
  onToggle: (cert: BundleCertKey, checked: boolean) => void;
}) {
  const [selected, setSelected] = useState<ReadonlySet<BundleCertKey>>(initial);
  return (
    <BundleProductCard
      product={product}
      selected={selected}
      onToggle={(cert, checked) => {
        onToggle(cert, checked);
        setSelected((prev) => {
          const next = new Set(prev);
          if (checked) next.add(cert);
          else next.delete(cert);
          return next;
        });
      }}
    />
  );
}

