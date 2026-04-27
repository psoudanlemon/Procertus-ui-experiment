import type {
  CertificationEntryId,
  CertificationRequestDraft,
  CertificationRequestIntentId,
  CertificationRequestMode,
  CertificationRequestSession,
} from "@procertus-ui/domain-certification";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import type { AvailableEntry, AvailableEntryKey, TreeNode } from "../types";
import type { CertificationRequestBackend } from "../persistence";

export type {
  CertificationEntryId,
  CertificationRequestDraft,
  CertificationRequestIntentId,
  CertificationRequestMode,
  CertificationRequestSession,
} from "@procertus-ui/domain-certification";

export const CERTIFICATION_REQUEST_STEP_IDS = ["intent", "details", "drafts", "review"] as const;
export type CertificationRequestStepId = (typeof CERTIFICATION_REQUEST_STEP_IDS)[number];

export const PRODUCT_CERTIFICATION_ENTRY_IDS = new Set<AvailableEntryKey>([
  "ce",
  "benor",
  "ssd",
]);

export const PRODUCT_REQUIRED_INTENTS = new Set<CertificationRequestIntentId>([
  "product-certification",
  "procertus",
]);

export const OPTIONAL_PRODUCT_INTENTS = new Set<CertificationRequestIntentId>([
  "atg",
  "epd",
  "partijkeuring",
]);

export type ProductIndexEntry = {
  node: TreeNode;
  path: string[];
};

export type ProductAvailability = {
  available: boolean;
  value?: string;
  reason?: string;
};

export type CertificationProductTreeNode =
  | {
      kind: "product";
      id: string;
      label: string;
      description?: string;
      productTypeId?: string;
      selectable?: boolean;
      selected?: boolean;
    }
  | {
      kind: "group";
      id: string;
      label: string;
      children: CertificationProductTreeNode[];
    };

export type CertificationRequestProviderProps = {
  children: ReactNode;
  mode: CertificationRequestMode;
  initialDrafts?: CertificationRequestDraft[];
  initialStep?: CertificationRequestStepId | number;
  backend?: CertificationRequestBackend;
  backendKind?: "localStorage" | "memory";
  sessionId?: string;
  storageKey?: string;
};

export type CertificationRequestContextValue = {
  mode: CertificationRequestMode;
  clusters: readonly TreeNode[];
  availableEntries: readonly AvailableEntry[];
  productIndex: ReadonlyMap<string, ProductIndexEntry>;
  activeStep: number;
  setActiveStep: (step: number) => void;
  intent: CertificationRequestIntentId | undefined;
  setIntent: (intent: CertificationRequestIntentId) => void;
  expandedIds: string[];
  setExpandedIds: Dispatch<SetStateAction<string[]>>;
  searchValue: string;
  setSearchValue: (value: string) => void;
  hideUnavailableProducts: boolean;
  setHideUnavailableProducts: (value: boolean) => void;
  selectedProductId: string | undefined;
  setSelectedProductId: (id: string | undefined) => void;
  selectedEntryIds: string[];
  setSelectedEntryIds: (ids: string[]) => void;
  requestText: string;
  setRequestText: (value: string) => void;
  drafts: CertificationRequestDraft[];
  setDrafts: Dispatch<SetStateAction<CertificationRequestDraft[]>>;
  selectedProduct: ProductIndexEntry | undefined;
  selectedIntentLabel: string | undefined;
  productRequired: boolean;
  detailsUseProductTree: boolean;
  productEntries: Array<{ entry: AvailableEntry; availability: ProductAvailability }>;
  canUseFreeform: boolean;
  canContinueDetails: boolean;
  canOpenDetails: boolean;
  canOpenDrafts: boolean;
  canOpenReview: boolean;
  replaceDraftsFromDetails: () => void;
  createDraftFromIntent: () => Promise<CertificationRequestDraft>;
  removeDraft: (id: string) => void;
  editDraft: (id: string) => void;
  resetSelectionForNewRequest: () => void;
  goToStep: (step: number) => void;
};
