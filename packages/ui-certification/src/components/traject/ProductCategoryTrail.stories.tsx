import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProductCategoryTrail } from "./ProductCategoryTrail";

const meta = {
  title: "Traject configuration/Layout/Product selecteren/ProductCategoryTrail",
  component: ProductCategoryTrail,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Inline categoriepad dat naast een productlabel verschijnt en de browse-context teruggeeft. Wordt overal gebruikt waar een productlabel met categoriecontext getoond wordt (catalogus-rij, basket-rij, bundle matrix), zodat de visuele behandeling 1-op-1 hetzelfde blijft. Toont het pad deepest-first met `›` als leidende marker én als separator.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    trail: {
      control: "text",
      description:
        "Categoriepad als platte string met ` > ` als delimiter, root-to-leaf. Wordt intern gesplitst en deepest-first gerenderd.",
    },
  },
} satisfies Meta<typeof ProductCategoryTrail>;

export default meta;

/**
 * Standalone weergave naast een dummy productlabel. In productie wordt het
 * component direct na de productnaam binnen dezelfde `<ItemTitle>` of `<p>`
 * geplaatst, zodat label en pad op de baseline lijnen.
 */
export const Default: StoryObj<typeof meta> = {
  args: {
    trail: "Beton en mortel > Stortklaar beton",
  },
  render: (args) => (
    <p className="text-sm font-medium leading-snug">
      Wegenbeton
      <ProductCategoryTrail {...args} />
    </p>
  ),
};

/** Eén segment: enkel de directe oudercategorie wordt getoond. */
export const SingleSegment: StoryObj<typeof meta> = {
  args: {
    trail: "Staal",
  },
  render: (args) => (
    <p className="text-sm font-medium leading-snug">
      Wapeningsstaal
      <ProductCategoryTrail {...args} />
    </p>
  ),
};

/** Diep genest pad: meerdere chevrons om de hele terugloop te tonen. */
export const DeeplyNested: StoryObj<typeof meta> = {
  args: {
    trail: "Bestanddelen voor beton > Granulaten > Zand > Fijn zand",
  },
  render: (args) => (
    <p className="text-sm font-medium leading-snug">
      Rivierzand 0/2
      <ProductCategoryTrail {...args} />
    </p>
  ),
};

/**
 * Lege trail: component rendert niets. Call-sites kunnen het pad
 * onvoorwaardelijk doorgeven zonder zelf op `trail` te checken.
 */
export const EmptyTrail: StoryObj<typeof meta> = {
  args: {
    trail: "",
  },
  render: (args) => (
    <p className="text-sm font-medium leading-snug">
      Product zonder categorie
      <ProductCategoryTrail {...args} />
    </p>
  ),
};

/**
 * Side-by-side met een lange productnaam, om te tonen hoe het pad bij
 * krappe ruimte achter het label aansluit. De parent regelt truncation;
 * het component zelf clipt niet.
 */
export const NextToLongLabel: StoryObj<typeof meta> = {
  args: {
    trail: "Beton en mortel > Geprefabriceerde betonproducten",
  },
  render: (args) => (
    <div className="max-w-md">
      <p className="truncate text-sm font-medium leading-snug">
        Geprefabriceerde betonproducten met infiltratiekenmerken
        <ProductCategoryTrail {...args} />
      </p>
    </div>
  ),
};
