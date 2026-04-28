import { Badge } from "@procertus-ui/ui";
import type { DraftRequestItem } from "@procertus-ui/ui-certification";

import type { CertificationWizardDraft } from "../certification-wizard/CertificationRequestWizard";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";

export const AUTHENTICATED_REQUESTS_STORAGE_KEY = "pt1:authenticated-request-list";
export const CERTIFICATION_REQUEST_STORAGE_KEY = "pt1:certification-request-store";

export const INITIAL_REQUESTS: CertificationWizardDraft[] = [
  {
    id: "submitted-benor-demo",
    entryId: "benor",
    label: "BENOR-certificatie",
    shortLabel: "BENOR",
    productLabel: "Stortklaar beton",
    productPath: "Beton en mortel",
    value: "BENOR",
  },
];

export function requestStatus(request: CertificationWizardDraft) {
  return request.id.startsWith("submitted") ? "In intake" : "Concept";
}

export function requestApprovalStatus(request: CertificationWizardDraft) {
  if (request.id.startsWith("submitted")) return "Wacht op intake";
  if (request.productLabel) return "Klaar voor review";
  return "Aan te vullen";
}

export function requestTitle(request: CertificationWizardDraft) {
  return request.productLabel ? `${request.label} voor ${request.productLabel}` : request.label;
}

export function toDraftItems(drafts: readonly CertificationWizardDraft[]): DraftRequestItem[] {
  return drafts.map((draft) => ({
    id: draft.id,
    title: requestTitle(draft),
    subtitle: draft.productPath ?? "Contextaanvraag",
    details: (
      <div className="flex flex-wrap gap-2">
        <Badge variant={draft.id.startsWith("submitted") ? "secondary" : "outline"}>
          {requestStatus(draft)}
        </Badge>
        {draft.value ? <Badge variant="outline">{draft.value}</Badge> : null}
      </div>
    ),
  }));
}

export function useAuthenticatedRequests() {
  return useLocalStorageState<CertificationWizardDraft[]>(
    AUTHENTICATED_REQUESTS_STORAGE_KEY,
    INITIAL_REQUESTS,
  );
}
