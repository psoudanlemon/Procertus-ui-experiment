import { Badge, DownloadableItemList } from "@procertus-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useLayoutEffect } from "react";

import { buildRulesetDocumentsForInquiries } from "../certification-request-wizard";
import { storyDrafts } from "../certification-request-wizard/certification-request-wizard-story-fixtures";
import { RequestPackageReview } from "../request-package-review";
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
          "Aanvraag controleren: read-only samenvatting van het conceptpakket plus de bijhorende regelset-documenten. Volgt dezelfde shell-architectuur als 'product selecteren' en 'voeg trajecten toe': inhoud in `TrajectLayout`, gedeelde footer-knoppen via `TrajectStoryFooter` in de `actionBar`-slot.",
      },
    },
  },
  decorators: [PublicLayoutDecorator],
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectLayout>;

export default meta;

const noop = () => {};

const STORY_REVIEW_INQUIRIES = storyDrafts.map(({ title: _title, subtitle: _subtitle, ...draft }) => draft);

const STORY_REVIEW_ROWS = STORY_REVIEW_INQUIRIES.map((draft) => ({
  id: draft.id,
  label: draft.productLabel ?? "Aanvraag",
  value: draft.label,
}));

const STORY_REVIEW_REQUESTER = {
  context: {
    requesterName: "Alex Voorbeeld",
    requesterEmail: "alex@voorbeeld.nl",
    organizationName: "Voorbeeld BV",
    organizationDetails: (
      <p className="m-0 text-sm">BE 0123.456.789 · Kerkstraat 12, 9000 Gent</p>
    ),
  },
};

const STORY_REVIEW_DOCUMENTS = buildRulesetDocumentsForInquiries(STORY_REVIEW_INQUIRIES);

export const Default: StoryObj<typeof meta> = {
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    bodyGap: "section",
    title: "Controleer je aanvraagpakket",
    children: null,
    description:
      "Bekijk de samengestelde conceptaanvragen en de bijhorende regelset-documenten voordat je doorgaat met registratie.",
  },
  render: (args) => (
    <TrajectLayout
      {...args}
      actionBar={
        <TrajectStoryFooter
          onCancel={noop}
          onBack={noop}
          onContinue={noop}
          continueLabel="Bevestig en verzend"
        />
      }
    >
      <div className="flex flex-col gap-section">
        <RequestPackageReview
          className="max-w-5xl"
          title="Samenvatting van het aanvraagpakket"
          description="Controleer de inhoudelijke aanvragen en de organisatiecontext voordat je het pakket indient."
          requester={STORY_REVIEW_REQUESTER}
          rows={STORY_REVIEW_ROWS}
          notice={
            STORY_REVIEW_INQUIRIES.length > 1 ? (
              <span>
                <Badge variant="secondary">{STORY_REVIEW_INQUIRIES.length} vragen</Badge> worden
                samen gebundeld in deze aanvraag.
              </span>
            ) : undefined
          }
        />
        <section className="flex max-w-5xl flex-col gap-component">
          <div className="flex flex-col gap-micro">
            <h3 className="text-heading-sm font-semibold leading-tight tracking-tight">
              Regels en documentatie
            </h3>
            <p className="text-sm text-muted-foreground">
              Documenten op basis van je {STORY_REVIEW_INQUIRIES.length} geselecteerde{" "}
              {STORY_REVIEW_INQUIRIES.length === 1 ? "aanvraag" : "aanvragen"} (prototype,
              downloadlinks zijn gemockt).
            </p>
          </div>
          <DownloadableItemList items={STORY_REVIEW_DOCUMENTS} />
        </section>
      </div>
    </TrajectLayout>
  ),
};
