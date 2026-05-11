import type { Meta, StoryObj } from "@storybook/react-vite";

import type { CertificationRequestDraft } from "../../certification-request/types";
import { buildProductDocumentsForDraft } from "./build-validation-documents";
import { ProductSummaryCard } from "./ProductSummaryCard";

const RAINSCREEN_BENOR: CertificationRequestDraft = {
  id: "draft-rainscreen-benor",
  entryId: "benor",
  label: "BENOR — Rainscreen",
  shortLabel: "BENOR",
  productId: "p-rain",
  productLabel: "Rainscreen",
  productPath: "Cladding / Facade / Rainscreen",
  productTypeStreamLabel: "BR01",
};

const RAINSCREEN_CE: CertificationRequestDraft = {
  id: "draft-rainscreen-ce",
  entryId: "ce",
  label: "CE-markering — Rainscreen",
  shortLabel: "CE",
  productId: "p-rain",
  productLabel: "Rainscreen",
  productPath: "Cladding / Facade / Rainscreen",
  productTypeStreamLabel: "BR01",
  value: "Niveau 1+",
};

const BETONBOORDSTENEN_BENOR: CertificationRequestDraft = {
  id: "draft-betonboordstenen-benor",
  entryId: "benor",
  label: "BENOR — Betonboordstenen",
  shortLabel: "BENOR",
  productId: "p-betonboordstenen",
  productLabel: "Betonboordstenen",
  productPath: "Beton en mortel / Prefab / Infrastructuur / Betonboordstenen",
  productTypeStreamLabel: "411",
};

const SIDING_ATG: CertificationRequestDraft = {
  id: "draft-siding-atg",
  entryId: "atg",
  label: "ATG technische goedkeuring — Siding panel",
  shortLabel: "ATG",
  productId: "p-siding",
  productLabel: "Siding panel",
  productPath: "Cladding / Siding / Siding panel",
};

const meta = {
  title: "Traject configuration/Layout/Aanvraag controleren/ProductSummaryCard",
  component: ProductSummaryCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Product-level samenvattingskaart in het validatiescherm. Eén kaart per uniek product met de naam, het categoriepad en de producttype-stream bovenaan, daaronder een lijst van aangevraagde certificatietrajecten. Documenten die identiek zijn voor alle trajecten worden automatisch verzameld in een 'Gezamenlijke documenten'-sectie; cert-specifieke documenten blijven onder hun eigen badge staan.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProductSummaryCard>;

export default meta;

/**
 * Eén product, één traject: geen "Gezamenlijke documenten"-sectie omdat dedup
 * pas zinvol is bij meerdere trajecten. Alle documenten staan onder de
 * BENOR-badge.
 */
export const SingleTraject: StoryObj<typeof meta> = {
  args: {
    product: {
      id: BETONBOORDSTENEN_BENOR.productId!,
      label: BETONBOORDSTENEN_BENOR.productLabel!,
      path: BETONBOORDSTENEN_BENOR.productPath,
      code: BETONBOORDSTENEN_BENOR.productTypeStreamLabel,
    },
    certifications: [
      {
        id: BETONBOORDSTENEN_BENOR.id,
        entryId: BETONBOORDSTENEN_BENOR.entryId,
        documents: buildProductDocumentsForDraft(BETONBOORDSTENEN_BENOR),
      },
    ],
  },
};

/**
 * Hetzelfde product met BENOR én CE-markering. PTV en normen zijn identiek
 * voor beide trajecten en worden in "Gezamenlijke documenten" samengebracht.
 * Het cert-specifieke certificatiereglement blijft per traject onder de
 * bijbehorende badge. De CE-rij toont ook de prestatieniveau-badge naast de
 * cert-badge.
 */
export const MultipleTrajectsWithSharedDocs: StoryObj<typeof meta> = {
  args: {
    product: {
      id: RAINSCREEN_BENOR.productId!,
      label: RAINSCREEN_BENOR.productLabel!,
      path: RAINSCREEN_BENOR.productPath,
      code: RAINSCREEN_BENOR.productTypeStreamLabel,
    },
    certifications: [
      {
        id: RAINSCREEN_BENOR.id,
        entryId: RAINSCREEN_BENOR.entryId,
        documents: buildProductDocumentsForDraft(RAINSCREEN_BENOR),
      },
      {
        id: RAINSCREEN_CE.id,
        entryId: RAINSCREEN_CE.entryId,
        value: RAINSCREEN_CE.value,
        documents: buildProductDocumentsForDraft(RAINSCREEN_CE),
      },
    ],
  },
};

/**
 * Producten zonder producttype-stream (bv. ATG-aanvragen) tonen geen code-
 * badge in de header. Eén traject zonder gedeelde documenten.
 */
export const WithoutProductCode: StoryObj<typeof meta> = {
  args: {
    product: {
      id: SIDING_ATG.productId!,
      label: SIDING_ATG.productLabel!,
      path: SIDING_ATG.productPath,
    },
    certifications: [
      {
        id: SIDING_ATG.id,
        entryId: SIDING_ATG.entryId,
        documents: buildProductDocumentsForDraft(SIDING_ATG),
      },
    ],
  },
};

/**
 * Drie trajecten op hetzelfde product. Toont stevig hoe de scheidingslijnen
 * de trajecten in de kaart groeperen en hoe de gedeelde documenten één keer
 * bovenaan staan in plaats van drie keer dubbel.
 */
export const ThreeTrajects: StoryObj<typeof meta> = {
  args: {
    product: {
      id: RAINSCREEN_BENOR.productId!,
      label: RAINSCREEN_BENOR.productLabel!,
      path: RAINSCREEN_BENOR.productPath,
      code: RAINSCREEN_BENOR.productTypeStreamLabel,
    },
    certifications: [
      {
        id: RAINSCREEN_BENOR.id,
        entryId: RAINSCREEN_BENOR.entryId,
        documents: buildProductDocumentsForDraft(RAINSCREEN_BENOR),
      },
      {
        id: RAINSCREEN_CE.id,
        entryId: RAINSCREEN_CE.entryId,
        value: RAINSCREEN_CE.value,
        documents: buildProductDocumentsForDraft(RAINSCREEN_CE),
      },
      {
        id: "draft-rainscreen-atg",
        entryId: "atg",
        documents: buildProductDocumentsForDraft({
          ...RAINSCREEN_BENOR,
          id: "draft-rainscreen-atg",
          entryId: "atg",
          shortLabel: "ATG",
          label: "ATG — Rainscreen",
        }),
      },
    ],
  },
};
