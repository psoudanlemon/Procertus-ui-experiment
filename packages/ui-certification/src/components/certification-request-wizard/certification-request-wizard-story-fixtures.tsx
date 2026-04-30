import type { DownloadableDocumentListItemData } from "@procertus-ui/ui";

import type { CertificationWizardModel } from "../../certification-request/model";
import type { CertificationRequestDraft } from "../../certification-request/types";
import type { RequestPackageReviewRequesterPresentation } from "../request-package-review";
import type { ProductTreeNode } from "../product-tree-panel";
import type { CertificationRequestWizardViewProps } from "./certification-request-wizard-types";

export const storyProductTreeSample: ProductTreeNode[] = [
  {
    kind: "group",
    id: "g-clad",
    label: "Cladding and panels",
    children: [
      {
        kind: "group",
        id: "g-facade",
        label: "Facade systems",
        children: [
          {
            kind: "product",
            id: "p-rain",
            label: "Rainscreen (fixture)",
            productTypeId: "BR01",
            description: "Storybook — narrowed by Procertus model",
            statusLabel: "BENOR available",
          },
        ],
      },
      {
        kind: "product",
        id: "p-siding",
        label: "Siding product (fixture)",
        productTypeId: "Q2B-99",
        description: "Selectable row for the wizard story.",
        statusLabel: "Selectable",
      },
    ],
  },
];

export const storyDrafts: Array<CertificationRequestDraft & { title: string; subtitle?: string }> =
  [
    {
      id: "draft-1",
      entryId: "product-certification",
      label: "BENOR — Rainscreen (fixture)",
      shortLabel: "BENOR",
      title: "BENOR — Rainscreen (fixture)",
      productId: "p-rain",
      productLabel: "Rainscreen (fixture)",
      productPath: "Cladding / Facade / Rainscreen",
      productTypeStreamLabel: "BENOR",
    },
    {
      id: "draft-2",
      entryId: "atg",
      label: "ATG technische goedkeuring",
      shortLabel: "ATG",
      title: "ATG technische goedkeuring",
      productId: "p-siding",
      productLabel: "Siding product (fixture)",
      productPath: "Cladding / Siding",
    },
  ];

export const storyRulesetDocuments: DownloadableDocumentListItemData[] = [
  {
    id: "ptv-fixture",
    title: "PTV — Rainscreen (fixture)",
    description: "Mock product technical sheet for Storybook.",
    formatHint: "PDF · mock",
    href: "#story-ptv",
  },
  {
    id: "ruleset-fixture",
    title: "Ruleset matrix (fixture)",
    description: "Bundled certificeringen for the selected inquiries.",
    formatHint: "PDF · mock",
    href: "#story-ruleset",
  },
];

export const storyRequester: RequestPackageReviewRequesterPresentation = {
  context: {
    requesterName: "Alex Example",
    requesterEmail: "alex@example.com",
    organizationName: "Example Construct BV",
    organizationDetails: (
      <span className="text-muted-foreground">BE0123456789 · Gent</span>
    ),
  },
};

function noop() {}

export function emptyIntentStep(): CertificationWizardModel["intentStep"] {
  return {
    value: undefined,
    onValueChange: noop,
  };
}

export function emptyDetailsStep(overrides?: Partial<CertificationWizardModel["detailsStep"]>) {
  const base: CertificationWizardModel["detailsStep"] = {
    canUseFreeform: false,
    detailsUseProductTree: false,
    selectedIntentLabel: "product certification",
    requestText: "",
    onRequestTextChange: noop,
    productTree: {
      nodes: [],
      expandedIds: [],
      toggleExpandAll: noop,
      onToggle: noop,
      searchValue: "",
      onSearchChange: noop,
      hideUnavailableProducts: false,
      onHideUnavailableProductsChange: noop,
      onSelectProduct: noop,
    },
    selectedProduct: undefined,
    selectedEntryIds: [],
    onSelectedEntryIdsChange: noop,
    productOptions: [],
  };
  return { ...base, ...overrides } as CertificationWizardModel["detailsStep"];
}

export function emptyDraftsStep(
  overrides?: Partial<CertificationWizardModel["draftsStep"]>,
): CertificationWizardModel["draftsStep"] {
  const base: CertificationWizardModel["draftsStep"] = {
    drafts: [],
    includedDraftIds: [],
    onIncludedDraftIdsChange: noop,
    onAddAnother: noop,
    onEdit: noop,
    onRemove: noop,
  };
  return { ...base, ...overrides };
}

export function emptyReviewStep(
  overrides?: Partial<CertificationWizardModel["reviewStep"]>,
): CertificationWizardModel["reviewStep"] {
  return { rows: [], draftCount: 0, ...overrides };
}

/** Baseline presentational props: swap visibility flags and override slices per story. */
export function baseCertificationRequestWizardViewProps(
  overrides: Partial<CertificationRequestWizardViewProps> = {},
): CertificationRequestWizardViewProps {
  const base: CertificationRequestWizardViewProps = {
    stepLayout: {
      className: "w-full max-w-5xl",
      layout: "default",
      flush: false,
      stepperPosition: "top",
      variant: "wizard",
      stepper: null,
      title: "Certification request (story)",
      description:
        "Presentational shell — state comes from the parent or useCertificationRequestWizardView.",
      backAction: { label: "Terug", onClick: noop },
      primaryAction: { label: "Verder", onClick: noop },
    },
    showIntentStep: false,
    intentStep: emptyIntentStep(),
    showDetailsStep: false,
    splitProductInquirySteps: false,
    effectiveMobileDetailsStep: "product",
    detailsStep: emptyDetailsStep(),
    showDraftsStep: false,
    draftsStep: emptyDraftsStep(),
    sortedDrafts: [],
    onDraftIncludedChange: noop,
    showReviewStep: false,
    mode: "onboarding",
    reviewRequester: undefined,
    reviewStep: emptyReviewStep(),
    rulesetDocumentsDescription: "Regels en documentatie (storybook).",
    rulesetDocuments: [],
    rulesetEmptyContent: (
      <p className="text-sm text-muted-foreground">Geen documenten in deze story.</p>
    ),
  };
  return { ...base, ...overrides };
}
