import { useMemo } from "react";

import {
  CERTIFICATION_REQUEST_STEP_IDS,
  type CertificationRequestDraft,
  type CertificationRequestIntentId,
} from "./types";
import {
  getCertificationOptionText,
  getCertificationProductAvailability,
  normalizeCertificationQuery,
  toCertificationProductTreeNodes,
} from "./product-tree";
import { useCertificationRequest } from "./context";

export type CertificationWizardAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export type CertificationWizardModelOptions = {
  onCancel?: () => void;
  onComplete: (drafts: CertificationRequestDraft[]) => void;
  onRequestCreated?: (draft: CertificationRequestDraft) => void;
};

export type CertificationWizardModel = {
  activeStep: number;
  mode: "onboarding" | "authenticated";
  layout: {
    title: string;
    description: string;
    stepLabel: string;
    primaryAction: CertificationWizardAction;
    backAction?: CertificationWizardAction;
    secondaryAction?: CertificationWizardAction;
  };
  stepper: {
    steps: Array<{ id: string; title: string; description?: string; available?: boolean }>;
    activeStep: number;
    onStepChange: (step: number) => void;
  };
  intentStep: {
    value: CertificationRequestIntentId | undefined;
    onValueChange: (intent: CertificationRequestIntentId) => void;
  };
  detailsStep: {
    canUseFreeform: boolean;
    detailsUseProductTree: boolean;
    selectedIntentLabel?: string;
    requestText: string;
    onRequestTextChange: (value: string) => void;
    productTree: {
      nodes: ReturnType<typeof toCertificationProductTreeNodes>;
      expandedIds: string[];
      expandAll: () => void;
      collapseAll: () => void;
      onToggle: (groupId: string, open: boolean) => void;
      searchValue: string;
      onSearchChange: (value: string) => void;
      hideUnavailableProducts: boolean;
      onHideUnavailableProductsChange: (value: boolean) => void;
      onSelectProduct: (product: { id: string }) => void;
    };
    selectedProduct?: {
      label: string;
      path: string;
    };
    selectedEntryIds: string[];
    onSelectedEntryIdsChange: (ids: string[]) => void;
    productOptions: Array<{
      id: string;
      label: string;
      description?: string;
      disabled?: boolean;
    }>;
  };
  draftsStep: {
    drafts: Array<CertificationRequestDraft & { title: string; subtitle?: string }>;
    includedDraftIds: string[];
    onIncludedDraftIdsChange: (ids: string[]) => void;
    onAddAnother: () => void;
    onEdit: (id: string) => void;
    onRemove: (id: string) => void;
  };
  reviewStep: {
    rows: Array<{ id: string; label: string; value: string | number }>;
    draftCount: number;
  };
};

export function useCertificationRequestWizardModel({
  onCancel,
  onComplete,
  onRequestCreated,
}: CertificationWizardModelOptions): CertificationWizardModel {
  const request = useCertificationRequest();
  const {
    mode,
    clusters,
    availableEntries,
    activeStep,
    intent,
    setIntent,
    expandedIds,
    setExpandedIds,
    groupIds,
    searchValue,
    setSearchValue,
    hideUnavailableProducts,
    setHideUnavailableProducts,
    selectedProductId,
    setSelectedProductId,
    selectedEntryIds,
    setSelectedEntryIds,
    requestText,
    setRequestText,
    drafts,
    includedDraftIds,
    setIncludedDraftIds,
    selectedProduct,
    selectedIntentLabel,
    productRequired,
    detailsUseProductTree,
    canUseFreeform,
    canContinueDetails,
    canOpenDetails,
    canOpenDrafts,
    canOpenReview,
    replaceDraftsFromDetails,
    removeDraft,
    editDraft,
    resetSelectionForNewRequest,
    goToStep,
    createDraftFromIntent,
  } = request;

  const steps = [
    {
      id: CERTIFICATION_REQUEST_STEP_IDS[0],
      title: "Intent",
      description: selectedIntentLabel ?? "Kies wat je nodig hebt",
      available: true,
    },
    {
      id: CERTIFICATION_REQUEST_STEP_IDS[1],
      title: productRequired ? "Product" : "Context",
      description:
        selectedProduct?.node.label ??
        (productRequired ? "Zoek in de beslissingsboom" : "Beschrijf de aanvraag"),
      available: canOpenDetails,
    },
    {
      id: CERTIFICATION_REQUEST_STEP_IDS[2],
      title: "Drafts",
      description: includedDraftIds.length === 1 ? "1 conceptaanvraag" : `${includedDraftIds.length} conceptaanvragen`,
      available: canOpenDrafts,
    },
    {
      id: CERTIFICATION_REQUEST_STEP_IDS[3],
      title: "Review",
      description: "Controleer het pakket",
      available: canOpenReview,
    },
  ];

  const productTreeNodes = useMemo(
    () =>
      toCertificationProductTreeNodes({
        nodes: clusters,
        entries: availableEntries,
        intent,
        selectedProductId,
        query: normalizeCertificationQuery(searchValue),
        hideUnavailableProducts,
      }),
    [availableEntries, clusters, hideUnavailableProducts, intent, searchValue, selectedProductId],
  );

  const productOptions = useMemo(
    () =>
      availableEntries
        .filter((entry) => entry.productAvailabilityKey != null)
        .map((entry) => {
          const availability = selectedProduct
            ? getCertificationProductAvailability(selectedProduct.node, entry)
            : { available: false, reason: "Selecteer eerst een producttype." };
          return {
            id: entry.id,
            label: entry.label,
            description: availability.available
              ? getCertificationOptionText(entry, availability.value)
              : `${entry.description} Niet mogelijk: ${availability.reason ?? "niet aangeboden voor dit producttype."}`,
            disabled: !availability.available,
          };
        }),
    [availableEntries, selectedProduct],
  );

  const draftItems = drafts.map((draft) => ({
    ...draft,
    id: draft.id,
    title: draft.productLabel ? `${draft.label} voor ${draft.productLabel}` : draft.label,
    subtitle: draft.productPath ?? "Niet-productgebonden aanvraag",
  }));

  const reviewRows = [
    { id: "intent", label: "Startintentie", value: selectedIntentLabel ?? "Nog niet gekozen" },
    {
      id: "mode",
      label: "Context",
      value: mode === "onboarding" ? "Anonieme onboarding" : "Aangemelde aanvraag",
    },
    ...drafts.filter((draft) => includedDraftIds.includes(draft.id)).map((draft, index) => ({
      id: draft.id,
      label: `Aanvraag ${index + 1}`,
      value: draft.context
        ? `${draft.label} · ${draft.context}`
        : draft.productLabel ? `${draft.label} · ${draft.productLabel}` : draft.label,
    })),
  ];

  const goNext = async () => {
    if (activeStep === 0 && intent && drafts.length === 0) {
      const draft = await createDraftFromIntent();
      onRequestCreated?.(draft);
      if (onRequestCreated) {
        return;
      }
    }
    if (activeStep === 1) {
      replaceDraftsFromDetails();
    }
    if (activeStep === steps.length - 1) {
      onComplete(drafts.filter((draft) => includedDraftIds.includes(draft.id)));
      return;
    }
    goToStep(activeStep + 1);
  };

  const primaryDisabled =
    (activeStep === 0 && !intent) ||
    (activeStep === 1 && !canContinueDetails) ||
    (activeStep >= 2 && includedDraftIds.length === 0);

  return {
    activeStep,
    mode,
    layout: {
      title:
        activeStep === 0
          ? "Waarvoor wil je een aanvraag starten?"
          : activeStep === 1
            ? productRequired
              ? "Selecteer het producttype"
              : "Beschrijf de aanvraagcontext"
            : activeStep === 2
              ? "Conceptaanvragen"
              : "Aanvraagpakket controleren",
      description:
        activeStep === 0
          ? mode === "onboarding"
            ? "We starten met de inhoudelijke aanvraag. Account- en organisatieactivatie komen pas nadat je zeker bent dat je dit pakket wilt indienen."
            : "Start een nieuwe aanvraag door te kiezen welk certificaat, attest of document je nodig hebt."
          : activeStep === 1
            ? productRequired
              ? "Alle productcategorieën blijven zichtbaar. Gebruik de filter om producttypes zonder match voor de gekozen intentie tijdelijk te verbergen."
              : "Niet elke attestering begint bij een product. Geef eerst de aanvraagcontext; voeg optioneel een product toe wanneer dat helpt."
            : activeStep === 2
              ? "Een wizardrun kan meerdere conceptaanvragen toevoegen wanneer het gekozen product meerdere beschikbare certificaties of attesten ondersteunt."
              : "Dit is de samenvatting die terugkeert naar de onboarding-intake of naar de aangemelde aanvraaglijst.",
      stepLabel: `Stap ${activeStep + 1} van ${steps.length}`,
      backAction:
        activeStep > 0
          ? { label: "Terug", onClick: () => goToStep(Math.max(0, activeStep - 1)) }
          : onCancel
            ? { label: "Annuleren", onClick: onCancel }
            : undefined,
      secondaryAction: undefined,
      primaryAction: {
        label: activeStep === steps.length - 1 ? "Aanvraagpakket indienen" : "Verder",
        onClick: goNext,
        disabled: primaryDisabled,
      },
    },
    stepper: {
      steps,
      activeStep,
      onStepChange: goToStep,
    },
    intentStep: {
      value: intent,
      onValueChange: setIntent,
    },
    detailsStep: {
      canUseFreeform,
      detailsUseProductTree,
      selectedIntentLabel,
      requestText,
      onRequestTextChange: setRequestText,
      productTree: {
        nodes: productTreeNodes,
        expandedIds,
      expandAll: () => setExpandedIds([...groupIds]),
      collapseAll: () => setExpandedIds([]),
        onToggle: (groupId, open) => {
          setExpandedIds((prev) => {
            const set = new Set(prev);
            if (open) set.add(groupId);
            else set.delete(groupId);
            return Array.from(set);
          });
        },
        searchValue,
        onSearchChange: setSearchValue,
        hideUnavailableProducts,
        onHideUnavailableProductsChange: setHideUnavailableProducts,
        onSelectProduct: (product) => {
          setSelectedProductId(product.id);
          setSelectedEntryIds([]);
        },
      },
      selectedProduct: selectedProduct
        ? {
            label: selectedProduct.node.label,
            path: selectedProduct.path.slice(0, -1).join(" › "),
          }
        : undefined,
      selectedEntryIds,
      onSelectedEntryIdsChange: setSelectedEntryIds,
      productOptions,
    },
    draftsStep: {
      drafts: draftItems,
      includedDraftIds,
      onIncludedDraftIdsChange: setIncludedDraftIds,
      onAddAnother: resetSelectionForNewRequest,
      onEdit: editDraft,
      onRemove: removeDraft,
    },
    reviewStep: {
      rows: reviewRows,
      draftCount: includedDraftIds.length,
    },
  };
}
