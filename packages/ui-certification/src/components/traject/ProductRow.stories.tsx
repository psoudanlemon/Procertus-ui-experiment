import { Button } from "@procertus-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import { ProductRow } from "./ProductRow";

const noop = () => {};

const meta = {
  title: "Traject/ProductRow",
  component: ProductRow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Productrij in de catalogus-discovery. De hele rij is klikbaar (toevoegen aan winkelmandje). Bij verwijderen schuift de rij naar rechts terwijl de hoogte naar nul collabeert, zodat de overige rijen vloeiend opschuiven dankzij `AnimatePresence` met `mode=\"popLayout\"`. Wrap een lijst rijen in een `<ul>` met `<AnimatePresence>` zodat de exit-animatie kan afspelen.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onAdd: { action: "add" },
  },
  args: {
    onAdd: noop,
  },
} satisfies Meta<typeof ProductRow>;

export default meta;

const SAMPLE_PRODUCTS = [
  {
    id: "stortklaar-beton",
    label: "Stortklaar beton",
    description: "Beton en mortel > Stortklaar beton",
  },
  {
    id: "verhuurbedrijven",
    label: "Verhuurbedrijven",
    description: "Beton en mortel > Stortklaar beton",
  },
  {
    id: "wegenbeton",
    label: "Wegenbeton",
    description: "Beton en mortel > Stortklaar beton",
  },
  {
    id: "metselmortel",
    label: "Metselmortel",
    description: "Beton en mortel > Mortels",
  },
  {
    id: "hydraulisch-gebonden-mengsels",
    label: "Hydraulisch gebonden mengsels",
    description: "Beton en mortel > Mengsels",
  },
] as const;

/**
 * Eén rij in een minimale lijst-wrapper, zodat de divide-y en padding kloppen.
 * `description` toont het categoriepad waar het product onder valt: één regel,
 * `text-xs`, muted, net als `ItemDescription` in `CategoryPicker`.
 */
export const Default: StoryObj<typeof meta> = {
  args: {
    id: "stortklaar-beton",
    label: "Stortklaar beton",
    description: "Beton en mortel > Stortklaar beton",
  },
  render: (args) => (
    <ul className="max-w-2xl divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      <AnimatePresence>
        <ProductRow {...args} />
      </AnimatePresence>
    </ul>
  ),
};

/** Zonder ondertitel: bv. wanneer de context al uit een breadcrumb blijkt. */
export const WithoutDescription: StoryObj<typeof meta> = {
  args: {
    id: "stortklaar-beton",
    label: "Stortklaar beton",
  },
  render: (args) => (
    <ul className="max-w-2xl divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      <AnimatePresence>
        <ProductRow {...args} />
      </AnimatePresence>
    </ul>
  ),
};

/**
 * Toont de exit-animatie wanneer een rij wordt verwijderd. Klik op een rij om
 * 'm uit de lijst te halen, druk op "Reset" om opnieuw te beginnen.
 */
export const InteractiveList: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      description: {
        story:
          "Klik op een rij om de slide-out te zien. Andere rijen schuiven omhoog dankzij `popLayout`-modus.",
      },
    },
  },
  render: () => <InteractiveListBody />,
};

function InteractiveListBody() {
  const [items, setItems] =
    useState<ReadonlyArray<{ id: string; label: string; description: string }>>(
      SAMPLE_PRODUCTS,
    );
  return (
    <div className="flex max-w-2xl flex-col gap-component">
      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((p) => (
            <ProductRow
              key={p.id}
              id={p.id}
              label={p.label}
              description={p.description}
              onAdd={() => setItems((prev) => prev.filter((x) => x.id !== p.id))}
            />
          ))}
        </AnimatePresence>
      </ul>
      {items.length === 0 ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => setItems(SAMPLE_PRODUCTS)}
        >
          Reset
        </Button>
      ) : null}
    </div>
  );
}

/** Lange productnaam: laat zien dat `ItemTitle` op `line-clamp-2` afgekapt wordt. */
export const LongLabel: StoryObj<typeof meta> = {
  args: {
    id: "long",
    label:
      "Cirkelvormige geperforeerde buizen, cirkelvormige poreuze buizen en hulpstukken van ongewapend beton voor draineer- en infiltratieleidingen",
    description: "Beton en mortel > Geprefabriceerde betonproducten > Buizen",
  },
  render: (args) => (
    <ul className="max-w-2xl divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      <AnimatePresence>
        <ProductRow {...args} />
      </AnimatePresence>
    </ul>
  ),
};
