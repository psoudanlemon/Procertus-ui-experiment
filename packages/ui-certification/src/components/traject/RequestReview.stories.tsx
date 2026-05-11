import type { Meta, StoryObj } from "@storybook/react-vite";
import { cn } from "@procertus-ui/ui";
import { type ComponentType, useLayoutEffect, useMemo, useState } from "react";

import type { CertificationRequestDraft } from "../../certification-request/types";
import {
  buildProductDocumentsForDraft,
  groupDraftsByProduct,
} from "./build-validation-documents";
import { ProductDocumentationLibrary } from "./ProductDocumentationLibrary";
import { ProductInquiryMatrix } from "./ProductInquiryMatrix";
import {
  PRODUCT_REQUEST_NOTE_MAX_LENGTH_LONG,
  ProductRequestNoteField,
  isProductRequestNoteComplete,
} from "./ProductRequestNoteField";
import { TrajectLayout } from "./TrajectLayout";
import { TrajectStoryFooter } from "./TrajectStoryFooter";

const STORY_FOOTER = {
  companyDetails: [
    { label: "© 2026 PROCERTUS asbl/vzw" },
    { label: "TVA/BTW: BE 1000.472.054" },
  ],
  legalLinks: [
    { label: "Privacy policy", url: "#" },
    { label: "Contact", url: "#" },
  ],
};

/**
 * Mirrors `PublicAppShell` in the production app: sets `data-public-layout` on `<html>` so the
 * shared `globals.css` unlocks document scrolling (it keeps html/body locked for the
 * authenticated shell) and paints the public bottom chrome (footer + action bar) on a white
 * surface. Without this, tall traject pages get clipped at viewport.
 */
const PublicLayoutDecorator = (Story: ComponentType) => {
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);
  return <Story />;
};

const meta = {
  title: "Traject configuration/Layout/Aanvraag controleren",
  component: TrajectLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      children: null,
      description: {
        component:
          "Definitief validatiescherm in split-view: bovenaan een compacte, read-only matrix met één rij per uniek product en kruispunt-tickets per aangevraagd traject, eronder een documentatiebibliotheek per product met gededupliceerde Media Cards. De description-line van elke kaart vermeldt voor welke trajecten het bestand relevant is. De knop 'Akkoord' is geforceerd disabled tot de gebruiker tot onderaan heeft gescrold.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectLayout>;

export default meta;

const noop = () => {};

/**
 * Toggle voor de begeleidende-brief-sectie. Zet op `true` om te zien hoe de
 * "Akkoord"-knop gegated wordt op een ingevuld notitieveld.
 */
const STORY_NOTE_REQUIRED = false;

/**
 * Drie producten met respectievelijk twee, twee en één certificaten. De
 * matrix toont drie rijen (één per uniek product) met tickets op de
 * aangevraagde combinaties; de documentatiebibliotheek eronder groepeert
 * dezelfde drie producten met gededupliceerde Media Cards.
 */
const STORY_REVIEW_INQUIRIES: CertificationRequestDraft[] = [
  {
    id: "draft-rainscreen-benor",
    entryId: "benor",
    label: "BENOR — Rainscreen",
    shortLabel: "BENOR",
    productId: "p-rain",
    productLabel: "Rainscreen",
    productPath: "Cladding / Facade / Rainscreen",
    productTypeStreamLabel: "BR01",
  },
  {
    id: "draft-rainscreen-ce",
    entryId: "ce",
    label: "CE-markering — Rainscreen",
    shortLabel: "CE",
    productId: "p-rain",
    productLabel: "Rainscreen",
    productPath: "Cladding / Facade / Rainscreen",
    productTypeStreamLabel: "BR01",
    value: "Niveau 1+",
  },
  {
    id: "draft-siding-benor",
    entryId: "benor",
    label: "BENOR — Siding panel",
    shortLabel: "BENOR",
    productId: "p-siding",
    productLabel: "Siding panel",
    productPath: "Cladding / Siding / Siding panel",
    productTypeStreamLabel: "Q2B-99",
  },
  {
    id: "draft-siding-atg",
    entryId: "atg",
    label: "ATG technische goedkeuring — Siding panel",
    shortLabel: "ATG",
    productId: "p-siding",
    productLabel: "Siding panel",
    productPath: "Cladding / Siding / Siding panel",
  },
  {
    id: "draft-membrane-benor",
    entryId: "benor",
    label: "BENOR — Vapour barrier membrane",
    shortLabel: "BENOR",
    productId: "p-membrane",
    productLabel: "Vapour barrier membrane",
    productPath: "Insulation / Vapour control / Vapour barrier membrane",
    productTypeStreamLabel: "VB-12",
  },
];

function RequestReviewStory() {
  const productGroups = useMemo(
    () => groupDraftsByProduct(STORY_REVIEW_INQUIRIES),
    [],
  );
  const [note, setNote] = useState("");

  return (
    <TrajectLayout
      onSignInClick={noop}
      footer={STORY_FOOTER}
      bodyGap="section"
      title="Controleer je aanvraagpakket"
      description="Lees de onderstaande samenvatting van je geselecteerde producten en de bijbehorende documentatie aandachtig na ter validatie voordat je de aanvraag indient."
      actionBar={
        <TrajectStoryFooter
          onCancel={noop}
          onBack={noop}
          onContinue={noop}
          cancelLabel="Annuleren"
          backLabel="Terug"
          continueLabel="Akkoord"
          continueDisabled={!isProductRequestNoteComplete(note, STORY_NOTE_REQUIRED)}
        />
      }
    >
      <div className="flex flex-col gap-section">
        <section
          className="flex flex-col gap-component rounded-xl border border-border bg-card p-section text-card-foreground"
          aria-labelledby="aanvraag-matrix-heading"
        >
          <div className="flex flex-col">
            <h2
              id="aanvraag-matrix-heading"
              className="m-0 text-heading-lg font-semibold text-heading-foreground"
            >
              Overzicht aanvragen
            </h2>
            <p className="m-0 text-sm text-muted-foreground">
              {STORY_REVIEW_INQUIRIES.length}{" "}
              {STORY_REVIEW_INQUIRIES.length === 1 ? "certificaat" : "certificaten"} aangevraagd
              over{" "}
              {productGroups.length} {productGroups.length === 1 ? "product" : "producten"}.
            </p>
          </div>
          <ProductInquiryMatrix groups={productGroups} primaryEntryId="benor" />
        </section>

        <section
          className={cn(
            "flex flex-col gap-component rounded-xl border bg-card p-section text-card-foreground transition-colors",
            "focus-within:ring-3 focus-within:ring-ring/50",
            note.trim().length > 0 ? "border-primary/50" : "border-border",
          )}
          aria-labelledby="begeleidende-brief-heading"
        >
          <h2
            id="begeleidende-brief-heading"
            className="m-0 text-heading-lg font-semibold text-heading-foreground"
          >
            Voeg extra informatie toe
          </h2>
          <ProductRequestNoteField
            value={note}
            onChange={setNote}
            required={STORY_NOTE_REQUIRED}
            bordered={false}
            aria-labelledby="begeleidende-brief-heading"
          />
        </section>

        <ProductDocumentationLibrary
          groups={productGroups}
          documentsForDraft={buildProductDocumentsForDraft}
        />
      </div>
    </TrajectLayout>
  );
}

export const Default: StoryObj<typeof meta> = {
  args: {
    onSignInClick: noop,
    children: null,
  },
  render: () => <RequestReviewStory />,
};

/**
 * Variant voor niet-product-gebonden certificaten (bv. ATG, EPD,
 * partijkeuring). Vanuit de wegwijzer-detail-card spring je rechtstreeks naar
 * dit scherm zonder product- of bundle-stap: de matrix en de
 * documentatiebibliotheek worden weggelaten en de begeleidende brief is
 * verplicht in te vullen.
 */
function RequestReviewNonProductBoundStory() {
  const [note, setNote] = useState("");
  const noteRequired = true;

  return (
    <TrajectLayout
      onSignInClick={noop}
      footer={STORY_FOOTER}
      bodyGap="section"
      kicker="ATG technische goedkeuring"
      title="Beschrijf je ATG-aanvraag"
      description="Geef in onderstaande brief de context en details van je ATG-aanvraag mee. Een PROCERTUS-expert neemt je dossier op basis daarvan op."
      actionBar={
        <TrajectStoryFooter
          onCancel={noop}
          onBack={noop}
          onContinue={noop}
          cancelLabel="Annuleren"
          backLabel="Terug"
          continueLabel="Bevestig en verzend"
          continueDisabled={!isProductRequestNoteComplete(note, noteRequired)}
        />
      }
    >
      <div className="flex flex-col gap-section">
        <section
          className={cn(
            "flex flex-col gap-component rounded-xl border bg-card p-section text-card-foreground transition-colors",
            "focus-within:ring-3 focus-within:ring-ring/50",
            note.trim().length > 0 ? "border-primary/50" : "border-border",
          )}
          aria-labelledby="begeleidende-brief-heading-non-product"
        >
          <h2
            id="begeleidende-brief-heading-non-product"
            className="m-0 text-heading-lg font-semibold text-heading-foreground"
          >
            Begeleidende brief
          </h2>
          <ProductRequestNoteField
            value={note}
            onChange={setNote}
            required={noteRequired}
            rows={16}
            maxLength={PRODUCT_REQUEST_NOTE_MAX_LENGTH_LONG}
            bordered={false}
            aria-labelledby="begeleidende-brief-heading-non-product"
          />
        </section>
      </div>
    </TrajectLayout>
  );
}

export const NonProductBound: StoryObj<typeof meta> = {
  args: {
    onSignInClick: noop,
    children: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Sprong vanuit een wegwijzer-detail-card naar de validatiepagina voor een certificaat dat niet aan een product gebonden is. Geen matrix, geen productdocumentatie — alleen een verplichte begeleidende brief.",
      },
    },
  },
  render: () => <RequestReviewNonProductBoundStory />,
};
