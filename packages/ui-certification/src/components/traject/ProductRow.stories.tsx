import { Button } from "@procertus-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import { ProductRow } from "./ProductRow";

const noop = () => {};

const meta = {
  title: "Traject configuration/Layout/Product selecteren/ProductRow",
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
  { id: "stortklaar-beton", label: "Stortklaar beton" },
  { id: "verhuurbedrijven", label: "Verhuurbedrijven" },
  { id: "wegenbeton", label: "Wegenbeton" },
  { id: "metselmortel", label: "Metselmortel" },
  { id: "hydraulisch-gebonden-mengsels", label: "Hydraulisch gebonden mengsels" },
] as const;

/** Eén rij in een minimale lijst-wrapper, zodat de divide-y en padding kloppen. */
export const Default: StoryObj<typeof meta> = {
  args: {
    id: "stortklaar-beton",
    label: "Stortklaar beton",
  },
  render: (args) => (
    <ul className="flex max-w-2xl flex-col gap-component">
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
    useState<ReadonlyArray<{ id: string; label: string }>>(SAMPLE_PRODUCTS);
  return (
    <div className="flex max-w-2xl flex-col gap-component">
      <ul className="flex flex-col gap-component">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((p) => (
            <ProductRow
              key={p.id}
              id={p.id}
              label={p.label}
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
  },
  render: (args) => (
    <ul className="flex max-w-2xl flex-col gap-component">
      <AnimatePresence>
        <ProductRow {...args} />
      </AnimatePresence>
    </ul>
  ),
};

/**
 * Zoekresultaat-variant. Toont het volledige categoriepad als prefix boven de
 * productnaam en markeert het matchende substring met accent-gekleurde
 * `<mark>`-spans. Gebruikt door de zoekmodus in `ProductSelectionBasket`,
 * zodat de browse-context bewaard blijft en de match visueel scant.
 */
export const SearchResult: StoryObj<typeof meta> = {
  args: {
    id: "geprefabriceerde-betonproducten-met-infiltratiekenmerken",
    label: "Geprefabriceerde betonproducten met infiltratiekenmerken",
    categoryTrail: "Beton en mortel > Geprefabriceerde betonproducten",
    highlight: "infiltra",
  },
  render: (args) => (
    <ul className="flex max-w-2xl flex-col gap-component">
      <AnimatePresence>
        <ProductRow {...args} />
      </AnimatePresence>
    </ul>
  ),
};
