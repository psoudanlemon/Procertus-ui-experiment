import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";

import {
  BUNDLE_CERT_ORDER,
  BundleMatrixHeader,
  BundleMatrixProvider,
  BundleProductCard,
  BundleProductMobileCard,
  bundleAssembleMatrixGridTemplate,
  bundleMatrixExtraColumnKeys,
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
          "Eén rij in de \"Stel je aanvraagpakket samen\"-matrix. Links staat het productlabel en het volledige categoriepad; daarna een read-only kolom voor de vast gekozen certificatie; rechts compacte selectiecellen per extra type (kolommen alleen wanneer minstens één product in het pakket dat type in de dataset heeft). Wikkel meerdere rijen in een `BundleMatrixProvider` plus raster met `bundleAssembleMatrixGridTemplate`.",
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
  availableBundleCerts: ["benor", "ce", "ssd", "procertus"],
  rowPrimaryCert: "benor",
  ceAvailabilityRaw: "2+",
};

const SECONDARY_PRODUCT: BundleProduct = {
  id: "granulaten-voor-beton",
  label: "Granulaten voor beton",
  categoryTrail: "Bestanddelen voor beton > Granulaten",
  availableBundleCerts: ["benor", "ce"],
  rowPrimaryCert: "benor",
  ceAvailabilityRaw: "1",
};

const TERTIARY_PRODUCT: BundleProduct = {
  id: "betonstaal",
  label: "Betonstaal",
  categoryTrail: "Staal > Wapeningsstaal",
  availableBundleCerts: ["benor", "ce", "procertus"],
  rowPrimaryCert: "benor",
  ceAvailabilityRaw: "4",
};

const DEMO_PRIMARY: BundleCertKey = "benor";
const MATRIX_DEMO_PRODUCTS = [SAMPLE_PRODUCT, SECONDARY_PRODUCT, TERTIARY_PRODUCT] as const;
const DEMO_MATRIX_EXTRAS = bundleMatrixExtraColumnKeys(DEMO_PRIMARY, [...MATRIX_DEMO_PRODUCTS]);
const DEMO_GRID_TEMPLATE = bundleAssembleMatrixGridTemplate(DEMO_MATRIX_EXTRAS.length);

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
    <SingleRowMatrix primaryCert={DEMO_PRIMARY} product={args.product}>
      <InteractiveCard {...args} />
    </SingleRowMatrix>
  ),
};

/**
 * Pre-geselecteerde extra certificaties. Toont de `Checkbox` checked-state zoals
 * die zichtbaar wordt nadat de gebruiker enkele opties heeft aangevinkt.
 */
export const WithSelection: StoryObj<typeof meta> = {
  args: {
    product: SAMPLE_PRODUCT,
    selected: new Set<BundleCertKey>(["ce", "ssd"]),
    onToggle: noop,
  },
  render: (args) => (
    <SingleRowMatrix primaryCert={DEMO_PRIMARY} product={args.product}>
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
    <BundleMatrixProvider primaryCert={DEMO_PRIMARY} matrixExtraCerts={DEMO_MATRIX_EXTRAS}>
      <div className="overflow-x-auto">
        <section
          role="table"
          aria-label="Voorbeeld matrix"
          className="grid min-w-3xl gap-component"
          style={{ gridTemplateColumns: DEMO_GRID_TEMPLATE }}
        >
          <BundleMatrixHeader />
          {MATRIX_DEMO_PRODUCTS.map((product) => (
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
      {MATRIX_DEMO_PRODUCTS.map((product) => (
        <li key={product.id}>
          <InteractiveMobileCard
            product={product}
            matrixExtraCerts={DEMO_MATRIX_EXTRAS}
            selected={new Set<BundleCertKey>()}
            onToggle={noop}
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
  matrixExtraCerts,
}: {
  product: BundleProduct;
  matrixExtraCerts: readonly BundleCertKey[];
  selected: ReadonlySet<BundleCertKey>;
  onToggle: (cert: BundleCertKey, checked: boolean) => void;
}) {
  const [selected, setSelected] = useState<ReadonlySet<BundleCertKey>>(initial);
  return (
    <BundleProductMobileCard
      product={product}
      matrixExtraCerts={matrixExtraCerts}
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

function SingleRowMatrix({
  children,
  primaryCert,
  product,
}: {
  children: ReactNode;
  primaryCert: BundleCertKey;
  product: BundleProduct;
}) {
  const extras = bundleMatrixExtraColumnKeys(primaryCert, [product]);
  const gridTemplate = bundleAssembleMatrixGridTemplate(extras.length);
  return (
    <BundleMatrixProvider primaryCert={primaryCert} matrixExtraCerts={extras}>
      <div className="overflow-x-auto">
        <section
          role="table"
          aria-label="Voorbeeld matrix"
          className="grid min-w-3xl gap-component"
          style={{ gridTemplateColumns: gridTemplate }}
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

void BUNDLE_CERT_ORDER;
