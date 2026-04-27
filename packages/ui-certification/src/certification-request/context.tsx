import type {
  CertificationRequestDraft,
  CertificationRequestIntentId,
  CertificationRequestSession,
  CreateCertificationRequestSession,
  UpdateCertificationRequestSession,
} from "@procertus-ui/domain-certification";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import { getAvailableEntries } from "../helpers";
import { useProcertusCategorization } from "../ProcertusCategorizationContext";
import {
  type CertificationRequestBackend,
  createInMemoryCertificationRequestBackend,
  createLocalStorageCertificationRequestBackend,
} from "../persistence";
import {
  buildProductIndex,
  entryLabelForIntent,
  getAvailableProductEntries,
} from "./product-tree";
import { createContextDraft, createDraftsForProduct, getIntentDraftLabels, intentForDraft } from "./drafts";
import {
  CERTIFICATION_REQUEST_STEP_IDS,
  PRODUCT_REQUIRED_INTENTS,
  type CertificationRequestContextValue,
  type CertificationRequestProviderProps,
} from "./types";

function normalizeInitialStep(
  initialStep: CertificationRequestProviderProps["initialStep"],
  hasDrafts: boolean,
) {
  if (typeof initialStep === "number") {
    return Math.min(CERTIFICATION_REQUEST_STEP_IDS.length - 1, Math.max(0, initialStep));
  }
  if (initialStep != null) {
    return CERTIFICATION_REQUEST_STEP_IDS.indexOf(initialStep);
  }
  return hasDrafts
    ? CERTIFICATION_REQUEST_STEP_IDS.indexOf("drafts")
    : CERTIFICATION_REQUEST_STEP_IDS.indexOf("intent");
}

const applySetState = <TValue,>(
  current: TValue,
  next: SetStateAction<TValue>,
): TValue => (typeof next === "function" ? (next as (value: TValue) => TValue)(current) : next);

const CertificationRequestContext = createContext<CertificationRequestContextValue | undefined>(undefined);

export function CertificationRequestProvider({
  children,
  mode,
  initialDrafts = [],
  initialStep,
  backend,
  backendKind = "localStorage",
  sessionId: sessionIdProp,
  storageKey,
}: CertificationRequestProviderProps) {
  const { doc, groupIds } = useProcertusCategorization();
  const availableEntries = useMemo(() => getAvailableEntries(doc), [doc]);
  const productIndex = useMemo(() => buildProductIndex(doc.clusters), [doc.clusters]);

  const initialSession = useMemo<CreateCertificationRequestSession>(
    () => ({
      mode,
      activeStep: normalizeInitialStep(initialStep, initialDrafts.length > 0),
      expandedIds: groupIds.slice(0, 4),
      drafts: initialDrafts,
    }),
    [groupIds, initialDrafts, initialStep, mode],
  );

  const persistence = useMemo<CertificationRequestBackend>(
    () => {
      if (backend) return backend;
      const options = {
        sessionId: sessionIdProp ?? `certification-request:${mode}`,
        initialSession,
      };
      return backendKind === "memory"
        ? createInMemoryCertificationRequestBackend(options)
        : createLocalStorageCertificationRequestBackend({ ...options, storageKey });
    },
    [backend, backendKind, initialSession, mode, sessionIdProp, storageKey],
  );

  const session = useSyncExternalStore(
    persistence.subscribe,
    persistence.getCurrentSession,
    persistence.getCurrentSession,
  );

  const updateSession = (
    input:
      | UpdateCertificationRequestSession
      | ((session: CertificationRequestSession) => UpdateCertificationRequestSession),
  ) => persistence.updateCurrentSession(input);

  const activeStep = session.activeStep;
  const intent = session.intent;
  const expandedIds = [...session.expandedIds];
  const searchValue = session.searchValue;
  const hideUnavailableProducts = session.hideUnavailableProducts;
  const selectedProductId = session.selectedProductId;
  const selectedEntryIds = [...session.selectedEntryIds];
  const requestText = session.requestText;
  const drafts = [...session.drafts];

  const setActiveStep = (step: number) => updateSession({ activeStep: step });
  const setExpandedIds: Dispatch<SetStateAction<string[]>> = (next) =>
    updateSession((current: CertificationRequestSession) => ({
      expandedIds: applySetState([...current.expandedIds], next),
    }));
  const setSearchValue = (value: string) => updateSession({ searchValue: value });
  const setHideUnavailableProducts = (value: boolean) => updateSession({ hideUnavailableProducts: value });
  const setSelectedProductId = (id: string | undefined) => updateSession({ selectedProductId: id });
  const setSelectedEntryIds = (ids: string[]) => updateSession({ selectedEntryIds: ids });
  const setRequestText = (value: string) => updateSession({ requestText: value });
  const setDrafts: Dispatch<SetStateAction<CertificationRequestDraft[]>> = (next) =>
    updateSession((current: CertificationRequestSession) => ({
      drafts: applySetState([...current.drafts], next),
    }));

  const selectedProduct = selectedProductId ? productIndex.get(selectedProductId) : undefined;
  const selectedIntentLabel = entryLabelForIntent(intent, availableEntries);
  const productRequired = intent ? PRODUCT_REQUIRED_INTENTS.has(intent) : false;
  const detailsUseProductTree = productRequired || (intent ? intent !== "innovation-attest" : false);
  const productEntries = getAvailableProductEntries(selectedProduct?.node, availableEntries);
  const canUseFreeform = intent ? !productRequired : false;
  const canContinueDetails = productRequired
    ? selectedProduct != null && selectedEntryIds.length > 0
    : canUseFreeform && requestText.trim().length >= 12;
  const canOpenDetails = intent != null;
  const canOpenDrafts = drafts.length > 0 || canContinueDetails;
  const canOpenReview = drafts.length > 0;

  const setIntent = (nextIntent: CertificationRequestIntentId) => {
    updateSession({
      intent: nextIntent,
      selectedProductId: undefined,
      selectedEntryIds: [],
      requestText: "",
    });
  };

  const replaceDraftsFromDetails = () => {
    if (!intent) return;
    const nextDrafts =
      selectedProduct && selectedEntryIds.length > 0
        ? createDraftsForProduct({ selectedEntryIds, availableEntries, product: selectedProduct })
        : createContextDraft({ intent, availableEntries, requestText, selectedProduct });

    setDrafts((prev) => {
      const existingById = new Map(prev.map((draft) => [draft.id, draft] as const));
      for (const draft of nextDrafts) {
        existingById.set(draft.id, draft);
      }
      return Array.from(existingById.values());
    });
  };

  const createDraftFromIntent = async () => {
    if (!intent) {
      throw new Error("Cannot create a certification request draft before an intent is selected.");
    }
    const labels = getIntentDraftLabels({ intent, availableEntries });
    const draft = await persistence.createDraftFromIntent({ intent, ...labels });
    return draft;
  };

  const editDraft = (id: string) => {
    const draft = drafts.find((candidate) => candidate.id === id);
    updateSession({
      intent: intentForDraft(draft),
      selectedProductId: draft?.productId,
      selectedEntryIds: draft ? [String(draft.entryId)] : [],
      requestText: draft?.context ?? "",
      activeStep: CERTIFICATION_REQUEST_STEP_IDS.indexOf("details"),
    });
  };

  const resetSelectionForNewRequest = () => {
    updateSession({
      selectedProductId: undefined,
      selectedEntryIds: [],
      searchValue: "",
      intent: undefined,
      requestText: "",
      activeStep: CERTIFICATION_REQUEST_STEP_IDS.indexOf("intent"),
    });
  };

  const goToStep = (targetStep: number) => {
    const available = [true, canOpenDetails, canOpenDrafts, canOpenReview][targetStep] ?? false;
    if (targetStep === activeStep || !available) return;
    if (activeStep === CERTIFICATION_REQUEST_STEP_IDS.indexOf("details") && targetStep > activeStep && canContinueDetails) {
      replaceDraftsFromDetails();
    }
    setActiveStep(targetStep);
  };

  const value = useMemo<CertificationRequestContextValue>(
    () => ({
      mode,
      clusters: doc.clusters,
      availableEntries,
      productIndex,
      activeStep,
      setActiveStep,
      intent,
      setIntent,
      expandedIds,
      setExpandedIds,
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
      setDrafts,
      selectedProduct,
      selectedIntentLabel,
      productRequired,
      detailsUseProductTree,
      productEntries,
      canUseFreeform,
      canContinueDetails,
      canOpenDetails,
      canOpenDrafts,
      canOpenReview,
      replaceDraftsFromDetails,
      createDraftFromIntent,
      removeDraft: (id) => setDrafts((prev) => prev.filter((draft) => draft.id !== id)),
      editDraft,
      resetSelectionForNewRequest,
      goToStep,
    }),
    [
      activeStep,
      availableEntries,
      canContinueDetails,
      canOpenDetails,
      canOpenDrafts,
      canOpenReview,
      canUseFreeform,
      createDraftFromIntent,
      doc.clusters,
      detailsUseProductTree,
      drafts,
      expandedIds,
      hideUnavailableProducts,
      intent,
      mode,
      productEntries,
      productIndex,
      productRequired,
      requestText,
      searchValue,
      selectedEntryIds,
      selectedIntentLabel,
      selectedProduct,
      selectedProductId,
    ],
  );

  return (
    <CertificationRequestContext.Provider value={value}>
      {children}
    </CertificationRequestContext.Provider>
  );
}

export function useCertificationRequest(): CertificationRequestContextValue {
  const context = useContext(CertificationRequestContext);
  if (context === undefined) {
    throw new Error("useCertificationRequest must be used within CertificationRequestProvider");
  }
  return context;
}
