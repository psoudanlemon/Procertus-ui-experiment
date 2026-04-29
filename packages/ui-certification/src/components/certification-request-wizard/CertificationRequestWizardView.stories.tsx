import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

import type { CertificationIntentId } from "../certification-intent-picker";
import { CertificationRequestWizardView } from "./CertificationRequestWizardView";
import { CompactWizardTimeline } from "./CompactWizardTimeline";
import {
  baseCertificationRequestWizardViewProps,
  emptyDetailsStep,
  emptyDraftsStep,
  emptyIntentStep,
  emptyReviewStep,
  storyDrafts,
  storyProductTreeSample,
  storyRequester,
  storyRulesetDocuments,
} from "./certification-request-wizard-story-fixtures";

function noop() {}

const meta = {
  title: "Certification Request/CertificationRequestWizardView",
  component: CertificationRequestWizardView,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Portal **presentational** shell for the certification request wizard: wraps `StepLayout` and swaps intent, details (freeform / product tree / mobile split), draft bundling, and review + downloadable docs blocks. Real apps derive props from `useCertificationRequestWizardView` inside `CertificationRequestProvider`. Stories below isolate each block with static fixtures.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CertificationRequestWizardView>;

export default meta;

function timelineStepper(activeStep: number) {
  return (
    <div className="pt-region w-full max-w-5xl">
      <CompactWizardTimeline
        model={{
          activeStep,
          steps: [
            { id: "intent", title: "Intent", description: "Kies type" },
            { id: "details", title: "Details", description: "Product & vragen" },
            { id: "drafts", title: "Bundel", description: "Aanvragen" },
            { id: "review", title: "Controle", description: "Indienen" },
          ],
          onStepChange: noop,
        }}
      />
    </div>
  );
}

export const IntentStep: StoryObj<typeof meta> = {
  name: "01 — Intent",
  render: () => (
    <div className="bg-background p-6">
      <CertificationRequestWizardView
        {...baseCertificationRequestWizardViewProps({
          showIntentStep: true,
          stepLayout: {
            ...baseCertificationRequestWizardViewProps().stepLayout,
            stepper: timelineStepper(0),
            title: "Wat wil je aanvragen?",
            description: "Kies het type certificatie of attest.",
            stepLabel: "Stap 1 van 4",
          },
        })}
      />
    </div>
  ),
};

function IntentInteractive() {
  const [intent, setIntent] = useState<CertificationIntentId | undefined>(undefined);
  const intentStep = useMemo(
    () => ({
      ...emptyIntentStep(),
      value: intent,
      onValueChange: (id: CertificationIntentId) => setIntent(id),
    }),
    [intent],
  );
  return (
    <div className="bg-background p-6">
      <CertificationRequestWizardView
        {...baseCertificationRequestWizardViewProps({
          showIntentStep: true,
          intentStep,
          stepLayout: {
            ...baseCertificationRequestWizardViewProps().stepLayout,
            stepper: timelineStepper(0),
            title: "Intent (interactive)",
            description: "Selection is held in local state for this story.",
            stepLabel: "Stap 1 van 4",
          },
        })}
      />
      <p className="mx-auto mt-4 max-w-5xl text-sm text-muted-foreground" role="status">
        {intent ? `Selected: ${intent}` : "No intent selected yet."}
      </p>
    </div>
  );
}

export const IntentStepInteractive: StoryObj<typeof meta> = {
  name: "01 — Intent (interactive)",
  render: () => <IntentInteractive />,
};

export const DetailsProductTree: StoryObj<typeof meta> = {
  name: "02 — Details (product tree + inquiries)",
  render: () => (
    <div className="bg-background p-6">
      <CertificationRequestWizardView
        {...baseCertificationRequestWizardViewProps({
          showDetailsStep: true,
          detailsStep: emptyDetailsStep({
            detailsUseProductTree: true,
            productTree: {
              nodes: storyProductTreeSample,
              expandedIds: ["g-clad", "g-facade"],
              expandAll: noop,
              collapseAll: noop,
              onToggle: noop,
              searchValue: "",
              onSearchChange: noop,
              hideUnavailableProducts: false,
              onHideUnavailableProductsChange: noop,
              onSelectProduct: noop,
            },
            selectedProduct: {
              label: "Rainscreen (fixture)",
              path: "Cladding and panels / Facade systems / Rainscreen (fixture)",
            },
            selectedEntryIds: ["benor"],
            onSelectedEntryIdsChange: noop,
            productOptions: [
              {
                id: "benor",
                label: "BENOR product certification",
                description: "Beschikbaar voor dit producttype",
              },
              {
                id: "ce",
                label: "CE prestatieverklaring",
                disabled: true,
                description: "Niet beschikbaar voor deze combinatie (fixture)",
              },
            ],
          }),
          stepLayout: {
            ...baseCertificationRequestWizardViewProps().stepLayout,
            stepper: timelineStepper(1),
            title: "Product en aanvragen",
            description: "Fixturedata — boom + multi-select.",
            stepLabel: "Stap 2 van 4",
          },
        })}
      />
    </div>
  ),
};

export const DetailsFreeform: StoryObj<typeof meta> = {
  name: "02 — Details (freeform context)",
  render: () => (
    <div className="bg-background p-6">
      <CertificationRequestWizardView
        {...baseCertificationRequestWizardViewProps({
          showDetailsStep: true,
          detailsStep: emptyDetailsStep({
            canUseFreeform: true,
            selectedIntentLabel: "innovation attest",
            requestText:
              "Technisch attest voor een innovatieve geveloplossing op werf X — prototype tekst.",
            onRequestTextChange: noop,
          }),
          stepLayout: {
            ...baseCertificationRequestWizardViewProps().stepLayout,
            stepper: timelineStepper(1),
            title: "Beschrijf de aanvraagcontext",
            description: "Vrije tekst voor niet-productgebonden intenten.",
            stepLabel: "Stap 2 van 4",
          },
        })}
      />
    </div>
  ),
};

export const DetailsMobileSplitInquiries: StoryObj<typeof meta> = {
  name: "02 — Details (mobile split — inquiries panel)",
  render: () => (
    <div className="bg-background p-6">
      <CertificationRequestWizardView
        {...baseCertificationRequestWizardViewProps({
          showDetailsStep: true,
          splitProductInquirySteps: true,
          effectiveMobileDetailsStep: "inquiries",
          detailsStep: emptyDetailsStep({
            detailsUseProductTree: true,
            productTree: {
              nodes: storyProductTreeSample,
              expandedIds: ["g-clad"],
              expandAll: noop,
              collapseAll: noop,
              onToggle: noop,
              searchValue: "",
              onSearchChange: noop,
              hideUnavailableProducts: true,
              onHideUnavailableProductsChange: noop,
              onSelectProduct: noop,
            },
            selectedProduct: {
              label: "Rainscreen (fixture)",
              path: "Cladding / Facade / Rainscreen",
            },
            selectedEntryIds: [],
            onSelectedEntryIdsChange: noop,
            productOptions: [
              { id: "benor", label: "BENOR product certification" },
              { id: "atg", label: "ATG", disabled: true },
            ],
          }),
          stepLayout: {
            ...baseCertificationRequestWizardViewProps().stepLayout,
            stepper: timelineStepper(1),
            title: "Kies de aanvragen",
            description: "Tweede sub-stap op smalle viewports (fixture).",
            stepLabel: "Stap 3 van 5",
          },
        })}
      />
    </div>
  ),
};

export const DraftsBundling: StoryObj<typeof meta> = {
  name: "03 — Draft bundling",
  render: () => (
    <div className="bg-background p-6">
      <CertificationRequestWizardView
        {...baseCertificationRequestWizardViewProps({
          showDraftsStep: true,
          draftsStep: emptyDraftsStep({
            drafts: storyDrafts,
            includedDraftIds: ["draft-1", "draft-2"],
            onIncludedDraftIdsChange: noop,
          }),
          sortedDrafts: storyDrafts,
          stepLayout: {
            ...baseCertificationRequestWizardViewProps().stepLayout,
            stepper: timelineStepper(2),
            title: "Bundel aanvragen",
            description: "Fixture met twee concept-aanvragen.",
            stepLabel: "Stap 3 van 4",
          },
        })}
      />
    </div>
  ),
};

function DraftsInteractive() {
  const [included, setIncluded] = useState<string[]>(["draft-1"]);
  return (
    <div className="bg-background p-6">
      <CertificationRequestWizardView
        {...baseCertificationRequestWizardViewProps({
          showDraftsStep: true,
          draftsStep: emptyDraftsStep({
            drafts: storyDrafts,
            includedDraftIds: included,
            onIncludedDraftIdsChange: noop,
          }),
          sortedDrafts: storyDrafts,
          onDraftIncludedChange: (id, checked) => {
            setIncluded((prev) =>
              checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id),
            );
          },
          stepLayout: {
            ...baseCertificationRequestWizardViewProps().stepLayout,
            stepper: timelineStepper(2),
            title: "Bundel (interactive)",
            description: "Toggle inclusion with local state.",
            stepLabel: "Stap 3 van 4",
          },
        })}
      />
    </div>
  );
}

export const DraftsBundlingInteractive: StoryObj<typeof meta> = {
  name: "03 — Draft bundling (interactive)",
  render: () => <DraftsInteractive />,
};

export const ReviewOnboarding: StoryObj<typeof meta> = {
  name: "04 — Review (onboarding)",
  render: () => (
    <div className="bg-background p-6">
      <CertificationRequestWizardView
        {...baseCertificationRequestWizardViewProps({
          showReviewStep: true,
          mode: "onboarding",
          reviewStep: emptyReviewStep({
            draftCount: 2,
            rows: [
              { id: "intent", label: "Intent", value: "Product certification" },
              { id: "product", label: "Product", value: "Rainscreen (fixture)" },
            ],
          }),
          rulesetDocuments: storyRulesetDocuments,
          rulesetDocumentsDescription:
            "Documenten op basis van je 2 geselecteerde aanvragen (prototype — fixture).",
          stepLayout: {
            ...baseCertificationRequestWizardViewProps().stepLayout,
            stepper: timelineStepper(3),
            title: "Samenvatting van het aanvraagpakket",
            description: "Onboarding — zonder requesterblok.",
            stepLabel: "Stap 4 van 4",
            primaryAction: { label: "Aanvraagpakket versturen", onClick: noop },
          },
        })}
      />
    </div>
  ),
};

export const ReviewAuthenticated: StoryObj<typeof meta> = {
  name: "04 — Review (authenticated + requester)",
  render: () => (
    <div className="bg-background p-6">
      <CertificationRequestWizardView
        {...baseCertificationRequestWizardViewProps({
          showReviewStep: true,
          mode: "authenticated",
          reviewRequester: storyRequester,
          reviewStep: emptyReviewStep({
            draftCount: 2,
            rows: [
              { id: "intent", label: "Intent", value: "Product certification" },
              { id: "product", label: "Product", value: "Rainscreen (fixture)" },
            ],
          }),
          rulesetDocuments: storyRulesetDocuments,
          rulesetDocumentsDescription: "Regels en documentatie voor dit pakket (fixture).",
          stepLayout: {
            ...baseCertificationRequestWizardViewProps().stepLayout,
            className: "w-full max-w-none",
            layout: "fill-parent",
            flush: true,
            stepperPosition: "start",
            stepper: timelineStepper(3),
            title: "Aanvraagdetails",
            description: "Authenticated extranet — inclusief aanvrager.",
            stepLabel: "Stap 4 van 4",
            primaryAction: { label: "Aanvraagpakket versturen", onClick: noop },
          },
        })}
      />
    </div>
  ),
};

export const SubcomponentsShowcase: StoryObj<typeof meta> = {
  name: "Subcomponents (timeline + empty docs)",
  parameters: {
    docs: {
      description: {
        story:
          "Shows **CompactWizardTimeline** in the stepper slot and an empty downloadable-docs panel copy — useful when tuning chrome without full wizard state.",
      },
    },
  },
  render: () => (
    <div className="bg-background p-6">
      <CertificationRequestWizardView
        {...baseCertificationRequestWizardViewProps({
          showReviewStep: true,
          reviewStep: emptyReviewStep({ draftCount: 0, rows: [] }),
          rulesetDocuments: [],
          rulesetDocumentsDescription: "Nog geen aanvragen geselecteerd (fixture).",
          stepLayout: {
            ...baseCertificationRequestWizardViewProps().stepLayout,
            stepper: (
              <div className="flex max-w-5xl flex-col gap-6 md:flex-row md:items-start">
                <div className="min-w-0 shrink-0 md:w-72">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    CompactWizardTimeline
                  </p>
                  <CompactWizardTimeline
                    model={{
                      activeStep: 3,
                      steps: [
                        { id: "intent", title: "Intent" },
                        { id: "details", title: "Details" },
                        { id: "drafts", title: "Bundel" },
                        { id: "review", title: "Controle" },
                      ],
                      onStepChange: noop,
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1 text-sm text-muted-foreground">
                  Pair the timeline with <code className="rounded bg-muted px-1">OnboardingStepper</code>{" "}
                  on desktop in real flows; this story only documents the compact rail.
                </div>
              </div>
            ),
            title: "Review (docs empty)",
            description: "Downloadlijst gebruikt `rulesetEmptyContent` wanneer er geen items zijn.",
            stepLabel: "Stap 4 van 4",
          },
        })}
      />
    </div>
  ),
};
