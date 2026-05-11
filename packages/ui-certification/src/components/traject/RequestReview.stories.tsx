import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useLayoutEffect, useMemo } from "react";

import type { CertificationRequestDraft } from "../../certification-request/types";
import {
  buildProductDocumentsForDraft,
  groupDraftsByProduct,
} from "./build-validation-documents";
import { ProductSummaryCard } from "./ProductSummaryCard";
import { TrajectLayout } from "./TrajectLayout";
import { TrajectStoryFooter } from "./TrajectStoryFooter";
import { useForceScrollConfirmation } from "./use-force-scroll-confirmation";

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
          "Definitief validatiescherm voor het aanvraagpakket. Eén kaart per uniek product (drie in deze story: 2, 2 en 1 certificatietrajecten) met de productkop bovenaan, daaronder de gezamenlijke documenten en per traject de bijbehorende badge en cert-specifieke documenten. De knop 'Akkoord' is geforceerd disabled tot de gebruiker tot onderaan heeft gescrold.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectLayout>;

export default meta;

const noop = () => {};

/**
 * Drie producten met respectievelijk twee, twee en één certificaten. De story
 * groepeert deze drafts per product en rendert drie kaarten in plaats van
 * vijf — de twee multi-cert producten tonen de "Gezamenlijke documenten"-
 * dedup en de subtiele scheidingslijnen tussen trajecten.
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
  const { sentinelRef, hasReachedBottom } = useForceScrollConfirmation();
  const productGroups = useMemo(
    () => groupDraftsByProduct(STORY_REVIEW_INQUIRIES),
    [],
  );

  return (
    <TrajectLayout
      onSignInClick={noop}
      footer={STORY_FOOTER}
      bodyGap="section"
      title="Controleer je aanvraagpakket"
      description="Lees de onderstaande samenvatting van je geselecteerde producten en de bijbehorende documentatie aandachtig na ter validatie voordat je de aanvraag indient."
      actionBar={
        <div className="flex w-full flex-col gap-micro">
          {!hasReachedBottom ? (
            <p
              className="m-0 text-xs font-medium text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              Scroll naar beneden om te kunnen bevestigen.
            </p>
          ) : null}
          <TrajectStoryFooter
            onCancel={noop}
            onBack={noop}
            onContinue={noop}
            cancelLabel="Annuleren"
            backLabel="Terug"
            continueLabel="Akkoord"
            continueDisabled={!hasReachedBottom}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-region">
        <section
          className="flex flex-col gap-component"
          aria-labelledby="aanvraag-pakket-heading"
        >
          <div className="flex flex-wrap items-baseline gap-x-component gap-y-micro">
            <h2
              id="aanvraag-pakket-heading"
              className="m-0 text-heading-md font-semibold leading-tight tracking-tight"
            >
              Aanvragen in dit pakket
            </h2>
            <p className="m-0 text-sm text-muted-foreground">
              {STORY_REVIEW_INQUIRIES.length}{" "}
              {STORY_REVIEW_INQUIRIES.length === 1 ? "certificaat" : "certificaten"} aangevraagd
              over{" "}
              {productGroups.length} {productGroups.length === 1 ? "product" : "producten"}.
            </p>
          </div>
          <div className="flex flex-col gap-component">
            {productGroups.map((group) => (
              <ProductSummaryCard
                key={group.productId}
                product={{
                  id: group.productId,
                  label: group.productLabel,
                  path: group.productPath,
                  code: group.productTypeStreamLabel,
                }}
                certifications={group.drafts.map((draft) => ({
                  id: draft.id,
                  entryId: draft.entryId,
                  value: draft.entryId === "ce" ? draft.value : undefined,
                  documents: buildProductDocumentsForDraft(draft),
                }))}
              />
            ))}
          </div>
          <div ref={sentinelRef} aria-hidden className="h-px w-full" />
        </section>
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
