import { BrickWallIcon, FactoryIcon, MoleculesIcon } from "@hugeicons/core-free-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { CategoryPicker } from "./CategoryPicker";

const noop = () => {};

const meta = {
  title: "Traject configuration/Layout/Product selecteren/CategoryPicker",
  component: CategoryPicker,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Hiërarchische categoriekaart voor de traject-discovery. Gebouwd op de `Item`-primitive: icoon-tegel in `ItemMedia`, titel + beschrijving in `ItemContent`, chevron in `ItemActions`. Klikken navigeert één niveau dieper; dit is geen selectie-toggle.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    icon: { control: false },
    onSelect: { action: "select" },
  },
  args: {
    onSelect: noop,
  },
} satisfies Meta<typeof CategoryPicker>;

export default meta;

/** Default: kaart met label, beschrijving, icoon en chevron. */
export const Default: StoryObj<typeof meta> = {
  args: {
    label: "Beton en mortel",
    description: "6 categorieën",
    icon: BrickWallIcon,
  },
  render: (args) => (
    <div className="max-w-xl">
      <CategoryPicker {...args} />
    </div>
  ),
};

/**
 * Lange titels worden afgekapt op één regel. Hover over de kaart en blijf
 * even hangen: na een korte vertraging verschijnt een tooltip met de
 * volledige naam. Wanneer de titel volledig past, verschijnt er geen tooltip.
 */
export const TruncatedTitle: StoryObj<typeof meta> = {
  args: {
    label: "Voorgespannen prefab beton voor industriële vloersystemen en draagstructuren",
    description: "14 producten",
    icon: BrickWallIcon,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstreert het truncatie-gedrag van `CategoryPicker`: de eerste kaart heeft een extreem lange titel die wordt afgekapt en een hover-tooltip krijgt, de tweede past op één regel en toont geen tooltip.",
      },
    },
  },
  render: () => (
    <div className="grid max-w-md grid-cols-1 gap-component">
      <CategoryPicker
        label="Voorgespannen prefab beton voor industriële vloersystemen en draagstructuren"
        description="14 producten"
        icon={BrickWallIcon}
        onSelect={noop}
      />
      <CategoryPicker
        label="Staal"
        description="11 producten"
        icon={FactoryIcon}
        onSelect={noop}
      />
    </div>
  ),
};

/** Twee-kolomsraster zoals in de productie-drilldown van `ProductSelectionGrid`. */
export const Grid: StoryObj<typeof meta> = {
  args: {
    label: "Beton en mortel",
    description: "6 categorieën",
    icon: BrickWallIcon,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Drie clusters in een twee-kolomsraster zoals ze in de catalogus verschijnen op het hoogste niveau.",
      },
    },
  },
  render: () => (
    <div className="grid max-w-3xl grid-cols-1 gap-component sm:grid-cols-2">
      <CategoryPicker
        label="Beton en mortel"
        description="6 categorieën"
        icon={BrickWallIcon}
        onSelect={noop}
      />
      <CategoryPicker
        label="Bestanddelen voor beton"
        description="10 producten"
        icon={MoleculesIcon}
        onSelect={noop}
      />
      <CategoryPicker
        label="Staal"
        description="11 producten"
        icon={FactoryIcon}
        onSelect={noop}
      />
    </div>
  ),
};
