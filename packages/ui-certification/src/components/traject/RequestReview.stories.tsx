import { Alert, AlertDescription, AlertTitle, DownloadableItemList } from "@procertus-ui/ui";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useLayoutEffect } from "react";

import { storyDrafts } from "../certification-request-wizard/certification-request-wizard-story-fixtures";
import {
  buildGeneralProcessDocuments,
  buildProductDocumentsForDraft,
} from "./build-validation-documents";
import { RequestValidationCard } from "./RequestValidationCard";
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
          "Definitief validatiescherm voor het aanvraagpakket. Per product/certificaat een individuele samenvattingskaart met productspecifieke documentatie; daaronder de algemene procesinformatie. De knop 'Bevestig en verzend' is geforceerd disabled tot de gebruiker tot onderaan heeft gescrold.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectLayout>;

export default meta;

const noop = () => {};

const STORY_REVIEW_INQUIRIES = storyDrafts.map(({ title: _title, subtitle: _subtitle, ...draft }) => draft);

const STORY_GENERAL_DOCS = buildGeneralProcessDocuments(STORY_REVIEW_INQUIRIES);

function RequestReviewStory() {
  const { sentinelRef, hasReachedBottom } = useForceScrollConfirmation();

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
            continueLabel="Bevestig en verzend"
            continueDisabled={!hasReachedBottom}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-region">
        <section
          className="flex max-w-5xl flex-col gap-component"
          aria-labelledby="aanvraag-pakket-heading"
        >
          <div className="flex flex-col gap-micro">
            <h2
              id="aanvraag-pakket-heading"
              className="m-0 text-heading-md font-semibold leading-tight tracking-tight"
            >
              Aanvragen in dit pakket
            </h2>
            <p className="m-0 text-sm text-muted-foreground">
              {STORY_REVIEW_INQUIRIES.length}{" "}
              {STORY_REVIEW_INQUIRIES.length === 1 ? "aanvraag" : "aanvragen"} worden samen
              gebundeld.
            </p>
          </div>
          <div className="flex flex-col gap-component">
            {STORY_REVIEW_INQUIRIES.map((draft) => (
              <RequestValidationCard
                key={draft.id}
                draft={draft}
                documents={buildProductDocumentsForDraft(draft)}
              />
            ))}
          </div>
        </section>

        <section
          className="flex max-w-5xl flex-col gap-component"
          aria-labelledby="aanvraag-algemeen-heading"
        >
          <div className="flex flex-col gap-micro">
            <h2
              id="aanvraag-algemeen-heading"
              className="m-0 text-heading-md font-semibold leading-tight tracking-tight"
            >
              Algemene procesinformatie
            </h2>
            <p className="m-0 text-sm text-muted-foreground">
              Documenten die gelden voor het volledige aanvraagpakket.
            </p>
          </div>
          <DownloadableItemList items={STORY_GENERAL_DOCS} />
          <Alert variant="info" className="max-w-5xl">
            <HugeiconsIcon icon={Clock01Icon} />
            <AlertTitle>Doorlooptijd: 8 tot 12 weken</AlertTitle>
            <AlertDescription>
              Vanaf indiening van een volledig dossier verloopt het traject in 8 tot 12 weken:
              ontvankelijkheidsanalyse, initiële audit, analyse van de proefresultaten en finale
              beslissing.
            </AlertDescription>
          </Alert>
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
