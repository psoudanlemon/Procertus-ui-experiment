/**
 * Redesign-variant van "Aanvraag controleren" (3.4):
 *
 * - "Nog certificatie toevoegen" verhuist van een inline-knop ergens in de body
 *   naar de footer-actiebar als secundaire actie naast de primaire "Bevestig".
 * - Primaire CTA wijst conceptueel naar het mandje (zie design-doc §
 *   Draft- en cart-gedrag); in deze story is het visueel een gewone primary
 *   button met label "Aanvraag toevoegen aan mandje".
 *
 * Niet gebruikt in productie — leeft alleen in stories.
 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, cn } from "@procertus-ui/ui";
import { type ComponentType, useLayoutEffect, useMemo, useState } from "react";

import type { CertificationRequestDraft } from "../../../certification-request/types";
import {
  buildProductDocumentsForDraft,
  groupDraftsByProduct,
} from "../../traject/build-validation-documents";
import { ProductDocumentationLibrary } from "../../traject/ProductDocumentationLibrary";
import { ProductInquiryMatrix } from "../../traject/ProductInquiryMatrix";
import {
  PRODUCT_REQUEST_NOTE_MAX_LENGTH_LONG,
  ProductRequestNoteField,
  isProductRequestNoteComplete,
} from "../../traject/ProductRequestNoteField";
import { TrajectLayout } from "../../traject/TrajectLayout";

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
  title: "Onboarding/Redesign/Steps/3.4 Request review (redesign)",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Redesign van 'Controleer je aanvraagpakket'. 'Nog certificatie toevoegen' verhuist naar de footer-actiebar als secundaire actie links naast de primaire CTA. Body blijft inhoudelijk hetzelfde: overzichtsmatrix, optionele toelichting, documentatiebibliotheek.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

const noop = () => {};
const STORY_NOTE_REQUIRED = false;

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
];

function FooterActionBarRedesign({
  onAddAnother,
  onCancel,
  onBack,
  onContinue,
  continueDisabled,
}: {
  onAddAnother: () => void;
  onCancel: () => void;
  onBack: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
}) {
  return (
    <div className="grid w-full grid-cols-2 items-center gap-component md:flex md:flex-wrap">
      <Button
        type="button"
        variant="ghost"
        size="lg"
        className="h-12 w-full px-6 md:order-1 md:col-auto md:h-9 md:w-auto md:px-4"
        onClick={onCancel}
      >
        Alle certificaten
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="col-span-2 h-12 w-full px-6 md:order-2 md:ml-auto md:col-auto md:h-9 md:w-auto md:px-4"
        onClick={onAddAnother}
      >
        <HugeiconsIcon icon={PlusSignIcon} aria-hidden className="size-4" />
        <span className="ms-1">Nog een certificatie toevoegen</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-12 w-full px-6 md:order-3 md:col-auto md:h-9 md:w-auto md:px-4"
        onClick={onBack}
      >
        Terug
      </Button>
      <Button
        type="button"
        size="lg"
        className="col-span-2 h-12 w-full px-6 md:order-4 md:col-auto md:h-9 md:w-auto md:px-4"
        disabled={continueDisabled}
        onClick={onContinue}
      >
        Aanvraag toevoegen aan mandje
      </Button>
    </div>
  );
}

function RequestReviewRedesignStory() {
  const productGroups = useMemo(() => groupDraftsByProduct(STORY_REVIEW_INQUIRIES), []);
  const [note, setNote] = useState("");

  return (
    <TrajectLayout
      onSignInClick={noop}
      footer={STORY_FOOTER}
      bodyGap="section"
      title="Controleer je aanvraagpakket"
      description="Lees de onderstaande samenvatting van je geselecteerde producten en de bijbehorende documentatie aandachtig na voordat je dit pakket aan je mandje toevoegt."
      actionBar={
        <FooterActionBarRedesign
          onAddAnother={noop}
          onCancel={noop}
          onBack={noop}
          onContinue={noop}
          continueDisabled={!isProductRequestNoteComplete(note, STORY_NOTE_REQUIRED)}
        />
      }
    >
      <div className="flex flex-col gap-section">
        <section
          className="flex flex-col gap-component rounded-xl border border-border bg-card p-section text-card-foreground"
          aria-labelledby="aanvraag-matrix-heading-redesign"
        >
          <div className="flex flex-col">
            <h2
              id="aanvraag-matrix-heading-redesign"
              className="m-0 text-heading-lg font-semibold text-heading-foreground"
            >
              Overzicht aanvragen
            </h2>
            <p className="m-0 text-sm text-muted-foreground">
              {STORY_REVIEW_INQUIRIES.length}{" "}
              {STORY_REVIEW_INQUIRIES.length === 1 ? "certificaat" : "certificaten"} aangevraagd
              over {productGroups.length}{" "}
              {productGroups.length === 1 ? "product" : "producten"}.
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
          aria-labelledby="begeleidende-brief-heading-redesign"
        >
          <h2
            id="begeleidende-brief-heading-redesign"
            className="m-0 text-heading-lg font-semibold text-heading-foreground"
          >
            Voeg extra informatie toe
          </h2>
          <ProductRequestNoteField
            value={note}
            onChange={setNote}
            required={STORY_NOTE_REQUIRED}
            maxLength={PRODUCT_REQUEST_NOTE_MAX_LENGTH_LONG}
            bordered={false}
            aria-labelledby="begeleidende-brief-heading-redesign"
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

export const Default: StoryObj = {
  render: () => <RequestReviewRedesignStory />,
};
