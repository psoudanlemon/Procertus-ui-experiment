import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";

import {
  BUNDLE_CERT_ORDER,
  BundleMatrixHeader,
  BundleMatrixProvider,
  BundleProductCard,
  BundleProductMobileCard,
  bundleMatrixGridCols,
  type BundleCertKey,
  type BundleProduct,
} from "./BundleProductCard";

const noop = () => {};

const meta = {
  title: "Traject configuration/Layout/Voeg trajecten toe/BundleProductCard",
  component: BundleProductCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Eén rij in de \"Stel je aanvraagpakket samen\"-matrix. Links staat het productlabel en het volledige categoriepad; rechts staan op vaste kolomposities één compacte `ChoiceCard` per certificatie uit `BUNDLE_CERT_ORDER`. Lege cellen blijven gereserveerd zodat de verticale uitlijning over alle rijen heen behouden blijft. Wikkel meerdere rijen in een `BundleMatrixProvider` om de kolom-hover state te delen.",
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
  extraCerts: ["ce", "ssd", "procertus"],
};

const SECONDARY_PRODUCT: BundleProduct = {
  id: "granulaten-voor-beton",
  label: "Granulaten voor beton",
  categoryTrail: "Bestanddelen voor beton > Granulaten",
  extraCerts: ["ce"],
};

const TERTIARY_PRODUCT: BundleProduct = {
  id: "betonstaal",
  label: "Betonstaal",
  categoryTrail: "Staal > Wapeningsstaal",
  extraCerts: ["ce", "procertus"],
};

/**
 * Standaardvariant: één rij in de matrix, nog niets geselecteerd. De lege cellen
 * tonen waar certs voor dit product niet beschikbaar zijn.
 */
export const Default: StoryObj<typeof meta> = {
  args: {
    product: SAMPLE_PRODUCT,
    selected: new Set<BundleCertKey>(),
    onToggle: noop,
  },
  render: (args) => (
    <SingleRowMatrix>
      <InteractiveCard {...args} />
    </SingleRowMatrix>
  ),
};

/**
 * Pre-geselecteerde extra certificaties. Toont de `ChoiceCard` checked-state zoals
 * die zichtbaar wordt nadat de gebruiker enkele opties heeft aangevinkt.
 */
export const WithSelection: StoryObj<typeof meta> = {
  args: {
    product: SAMPLE_PRODUCT,
    selected: new Set<BundleCertKey>(["ce", "ssd"]),
    onToggle: noop,
  },
  render: (args) => (
    <SingleRowMatrix>
      <InteractiveCard {...args} />
    </SingleRowMatrix>
  ),
};

/**
 * Drie rijen onder elkaar in een gedeeld grid: laat zien hoe de cert-kolommen
 * over producten heen uitlijnen en hoe de kolom-hover state met
 * `BundleMatrixProvider` synchroniseert (hover over BENOR in rij 1 licht
 * dezelfde kolom op in rij 2 en 3).
 */
export const MatrixStack: StoryObj<typeof meta> = {
  args: {
    product: SAMPLE_PRODUCT,
    selected: new Set<BundleCertKey>(["ce"]),
    onToggle: noop,
  },
  render: () => (
    <BundleMatrixProvider>
      <div className="overflow-x-auto">
        <section
          role="table"
          aria-label="Voorbeeld matrix"
          className={`grid min-w-3xl gap-component ${bundleMatrixGridCols.all}`}
        >
          <BundleMatrixHeader />
          {[SAMPLE_PRODUCT, SECONDARY_PRODUCT, TERTIARY_PRODUCT].map((product) => (
            <InteractiveCard
              key={product.id}
              product={product}
              selected={new Set<BundleCertKey>()}
              onToggle={noop}
            />
          ))}
        </section>
      </div>
    </BundleMatrixProvider>
  ),
};

/**
 * Mobiele weergave (<md): één kaart per product, sticky product-header, full-width
 * ChoiceCards en bovenaan de hoofdcertificatie als read-only basis-marker.
 * Storybook viewport instellen op een mobiele breedte om de stacked layout te zien.
 */
export const MobileStack: StoryObj<typeof meta> = {
  args: {
    product: SAMPLE_PRODUCT,
    selected: new Set<BundleCertKey>(),
    onToggle: noop,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => (
    <ul className="flex flex-col gap-section">
      {[SAMPLE_PRODUCT, SECONDARY_PRODUCT, TERTIARY_PRODUCT].map((product) => (
        <li key={product.id}>
          <InteractiveMobileCard
            product={product}
            selected={new Set<BundleCertKey>()}
            onToggle={noop}
            primaryCert="benor"
          />
        </li>
      ))}
    </ul>
  ),
};

function InteractiveMobileCard({
  product,
  selected: initial,
  onToggle,
  primaryCert,
}: {
  product: BundleProduct;
  selected: ReadonlySet<BundleCertKey>;
  onToggle: (cert: BundleCertKey, checked: boolean) => void;
  primaryCert: BundleCertKey;
}) {
  const [selected, setSelected] = useState<ReadonlySet<BundleCertKey>>(initial);
  return (
    <BundleProductMobileCard
      product={product}
      primaryCert={primaryCert}
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

function SingleRowMatrix({ children }: { children: ReactNode }) {
  return (
    <BundleMatrixProvider>
      <div className="overflow-x-auto">
        <section
          role="table"
          aria-label="Voorbeeld matrix"
          className={`grid min-w-3xl gap-component ${bundleMatrixGridCols.all}`}
        >
          <BundleMatrixHeader />
          {children}
        </section>
      </div>
    </BundleMatrixProvider>
  );
}

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

// Touch the export so unused-imports doesn't strip BUNDLE_CERT_ORDER from the
// docgen — pages may want to reference it from stories.
void BUNDLE_CERT_ORDER;
