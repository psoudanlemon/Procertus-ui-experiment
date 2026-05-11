import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProductBasket, type ProductBasketItem } from "./ProductBasket";

const noop = () => {};

const SAMPLE_ITEMS: readonly ProductBasketItem[] = [
  {
    id: "wegenbeton",
    label: "Wegenbeton",
    categoryTrail: "Beton en mortel > Stortklaar beton",
  },
  {
    id: "metselmortel",
    label: "Metselmortel",
    categoryTrail: "Beton en mortel > Mortels",
  },
  {
    id: "hydraulisch-gebonden-mengsels",
    label: "Hydraulisch gebonden mengsels",
    categoryTrail: "Beton en mortel > Mengsels",
  },
  {
    id: "geprefabriceerde-buizen",
    label:
      "Cirkelvormige geperforeerde buizen en hulpstukken van ongewapend beton",
    categoryTrail:
      "Beton en mortel > Geprefabriceerde betonproducten > Buizen",
  },
] as const;

const meta = {
  title: "Traject/ProductBasket",
  component: ProductBasket,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Winkelmand voor de product-selectieflow. Toont gekozen producten met hun categoriepad als prefix en een verwijderactie per rij. De empty state staat los van de gevulde lijst zodat er een duidelijke aanmoediging blijft staan om iets uit de catalogus links toe te voegen.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onRemove: { action: "remove" },
    onClear: { action: "clear" },
  },
  args: {
    onRemove: noop,
    onClear: noop,
  },
} satisfies Meta<typeof ProductBasket>;

export default meta;

const STORY_WRAPPER_CLASS = "max-w-sm";

/**
 * Lege winkelmand: prompt om producten toe te voegen vanuit de catalogus.
 * Badge gebruikt de `outline`-variant zodat de telling visueel rust.
 */
export const Empty: StoryObj<typeof meta> = {
  name: "Lege winkelmand",
  args: {
    items: [],
    className: STORY_WRAPPER_CLASS,
  },
};

/**
 * Gevulde winkelmand met meerdere producten op verschillende dieptes in de
 * categoriestructuur. Lange labels wikkelen op twee regels, de
 * categoriepad-prefix in muted-foreground laat zien waar het product
 * vandaan komt.
 */
export const Filled: StoryObj<typeof meta> = {
  name: "Gevulde winkelmand",
  args: {
    items: SAMPLE_ITEMS,
    className: STORY_WRAPPER_CLASS,
  },
};
