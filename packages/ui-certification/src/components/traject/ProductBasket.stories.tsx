import type { Meta, StoryObj } from "@storybook/react-vite";

import { defaultProcertusCategorizationDoc } from "../../categorization-data";
import { ProductBasket, type ProductBasketItem } from "./ProductBasket";
import {
  ProductSelectionBasketActionBar,
  ProductSelectionBasketMobileSummaryBar,
  ProductSelectionBasketProvider,
} from "./ProductSelectionBasket";

const noop = () => {};

const MOBILE_INITIAL_IDS = [
  "beton-en-mortel--wegenbeton",
  "beton-en-mortel--metselmortel",
  "beton-en-mortel--hydraulisch-gebonden-mengsels",
] as const;

/**
 * Renderframe voor de mobiele basket-stories. Mocked het onderste stuk van de
 * `TrajectLayout`-chrome (rounded card + muted action-footer) en zet de
 * provider erom heen zodat tap-to-open, verwijderen en "Wis selectie"
 * volledig interactief zijn zonder dat de hele catalogus mee hoeft.
 */
function MobileBasketHarness({
  initialSelectedIds,
}: {
  initialSelectedIds?: readonly string[];
}) {
  return (
    <ProductSelectionBasketProvider
      doc={defaultProcertusCategorizationDoc}
      initialSelectedIds={initialSelectedIds}
      onCancel={noop}
      onContinue={noop}
    >
      <div className="mx-auto flex h-[600px] w-full max-w-sm flex-col justify-end overflow-hidden rounded-xl border border-border bg-background shadow-proc-lg">
        <div className="rounded-b-xl border-t border-border bg-muted">
          <ProductSelectionBasketMobileSummaryBar />
          <div className="flex w-full items-center justify-between gap-component px-boundary py-section">
            <ProductSelectionBasketActionBar />
          </div>
        </div>
      </div>
    </ProductSelectionBasketProvider>
  );
}

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

/**
 * Mobiele tegenhanger van de lege winkelmand: de samenvattings-bar staat als
 * dashed-border placeholder bovenaan de actiebar zodat de winkelmand ook
 * leeg een aanwezig anker boven Annuleren/Verder vormt. De `md:hidden`-gate
 * uit productie is hier weggelaten zodat de mobiele weergave op elke
 * canvas-breedte zichtbaar blijft.
 */
export const MobileEmpty: StoryObj<typeof meta> = {
  name: "Mobile · lege winkelmand",
  args: {
    items: [],
    onRemove: noop,
    onClear: noop,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Mobiele basket-flow met lege selectie. Tik op de bar gebeurt niets " +
          "(geen tray bij 0 items); zodra je via de catalogus producten zou " +
          "toevoegen vervangt de gevulde teller deze placeholder.",
      },
    },
  },
  render: () => <MobileBasketHarness initialSelectedIds={[]} />,
};

/**
 * Mobiele tegenhanger met seed-selectie: tap op de bar schuift de in-place
 * tray uit boven de actiebar (geen overlay), waarin elke rij verwijderbaar
 * is en "Wis selectie" de hele lijst leegmaakt. Volledig interactief: de
 * provider houdt de state, dus tray, teller-pulse en chevron-rotatie
 * blijven gesynchroniseerd zonder dat de catalogus zelf gemount hoeft.
 */
export const MobileFilled: StoryObj<typeof meta> = {
  name: "Mobile · gevulde winkelmand",
  args: {
    items: [],
    onRemove: noop,
    onClear: noop,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Mobiele basket-flow met 3 voorgeselecteerde producten. Tap de bar " +
          "om de tray omhoog uit te schuiven; verwijder rijen of leeg de " +
          "selectie via 'Wis selectie' om naar de lege state terug te vallen.",
      },
    },
  },
  render: () => <MobileBasketHarness initialSelectedIds={MOBILE_INITIAL_IDS} />,
};
