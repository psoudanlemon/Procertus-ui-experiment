import { Badge } from "@procertus-ui/ui";
import type {
  CertificationRequestLifecycleEvent,
  CertificationRequestDraft,
  CertificationRequestInquiry,
  CertificationRequestLifecycleStatus,
  CertificationRequestPackage,
  DraftRequestItem,
} from "@procertus-ui/ui-certification";
import { type Dispatch, type SetStateAction, useMemo } from "react";

import { useLocalStorageState } from "../../hooks/useLocalStorageState";

export const AUTHENTICATED_REQUESTS_STORAGE_KEY = "pt1:authenticated-request-list";
export const CERTIFICATION_REQUEST_STORAGE_KEY = "pt1:certification-request-store";

export type AuthenticatedCertificationRequest = CertificationRequestPackage;

const nowIso = () => new Date().toISOString();

const statusLabels: Record<CertificationRequestLifecycleStatus, string> = {
  draft: "Concept",
  submitted: "Ingediend",
  "in-progress": "In behandeling",
  approved: "Goedgekeurd",
  archived: "Gearchiveerd",
  rejected: "Geweigerd",
  cancelled: "Geannuleerd",
};

export const INITIAL_REQUESTS: AuthenticatedCertificationRequest[] = [
  {
    id: "submitted-benor-demo",
    sessionId: "pt1:authenticated:certification-request:submitted-benor-demo",
    status: "in-progress",
    handlingStatus: "Intake afgerond, inhoudelijke beoordeling loopt",
    createdAt: "2026-04-15T09:12:00.000Z",
    submittedAt: "2026-04-16T13:30:00.000Z",
    updatedAt: "2026-04-18T10:00:00.000Z",
    inquiries: [
      {
        id: "submitted-benor-demo-inquiry-1",
        entryId: "benor",
        label: "BENOR-certificatie",
        shortLabel: "BENOR",
        productLabel: "Stortklaar beton",
        productPath: "Beton en mortel",
        value: "BENOR",
      },
    ],
  },
];

function isRequestPackage(value: unknown): value is AuthenticatedCertificationRequest {
  return (
    typeof value === "object" &&
    value != null &&
    Array.isArray((value as { inquiries?: unknown }).inquiries)
  );
}

function legacyDraftToRequest(draft: CertificationRequestDraft): AuthenticatedCertificationRequest {
  const timestamp = nowIso();
  const submitted = draft.id.startsWith("submitted");
  return {
    id: draft.id,
    sessionId: `pt1:authenticated:certification-request:${draft.id}`,
    status: submitted ? "submitted" : "draft",
    handlingStatus: submitted ? "Wacht op intake" : "Concept wordt voorbereid",
    createdAt: timestamp,
    submittedAt: submitted ? timestamp : undefined,
    updatedAt: timestamp,
    inquiries: [draft],
  };
}

function normalizeRequest(value: unknown): AuthenticatedCertificationRequest | undefined {
  if (isRequestPackage(value)) {
    return {
      ...value,
      status: value.status ?? "draft",
      handlingStatus: value.handlingStatus ?? requestApprovalStatus(value),
      createdAt: value.createdAt ?? nowIso(),
      updatedAt: value.updatedAt ?? value.createdAt ?? nowIso(),
      inquiries: value.inquiries,
    };
  }
  if (typeof value === "object" && value != null && "entryId" in value) {
    return legacyDraftToRequest(value as CertificationRequestDraft);
  }
  return undefined;
}

function normalizeRequests(values: readonly unknown[]): AuthenticatedCertificationRequest[] {
  return values.flatMap((value) => {
    const request = normalizeRequest(value);
    return request ? [request] : [];
  });
}

export function createAuthenticatedRequestPackage({
  inquiries,
  requestId,
  status = "draft",
}: {
  inquiries: readonly CertificationRequestInquiry[];
  requestId?: string;
  status?: CertificationRequestLifecycleStatus;
}): AuthenticatedCertificationRequest {
  const timestamp = nowIso();
  const id = requestId ?? `request-${timestamp.replaceAll(/\D/g, "").slice(0, 14)}`;
  return {
    id,
    sessionId: `pt1:authenticated:certification-request:${id}`,
    status,
    handlingStatus: status === "draft" ? "Concept wordt voorbereid" : "Wacht op intake",
    createdAt: timestamp,
    submittedAt: status === "draft" ? undefined : timestamp,
    updatedAt: timestamp,
    inquiries: [...inquiries],
  };
}

export function updateAuthenticatedRequestPackage(
  request: AuthenticatedCertificationRequest,
  inquiries: readonly CertificationRequestInquiry[],
): AuthenticatedCertificationRequest {
  return {
    ...request,
    inquiries: [...inquiries],
    updatedAt: nowIso(),
  };
}

export function submitAuthenticatedRequestPackage(
  request: AuthenticatedCertificationRequest,
  inquiries: readonly CertificationRequestInquiry[] = request.inquiries,
): AuthenticatedCertificationRequest {
  const timestamp = nowIso();
  return {
    ...request,
    inquiries: [...inquiries],
    status: "submitted",
    handlingStatus: "Wacht op intake",
    submittedAt: request.submittedAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export function cancelAuthenticatedRequestPackage(
  request: AuthenticatedCertificationRequest,
): AuthenticatedCertificationRequest {
  const timestamp = nowIso();
  return {
    ...request,
    status: "cancelled",
    handlingStatus: "Geannuleerd door de aanvrager",
    resolvedAt: request.resolvedAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export function requestStatus(request: AuthenticatedCertificationRequest) {
  return statusLabels[request.status] ?? "Concept";
}

function formatLifecycleDateTime(value: string) {
  return new Intl.DateTimeFormat("nl-BE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function requestLifecycleEvents(
  request: AuthenticatedCertificationRequest,
): CertificationRequestLifecycleEvent[] {
  const events: CertificationRequestLifecycleEvent[] = [
    {
      id: "created",
      title: "Aangemaakt",
      actorLabel: "Aanvrager",
      occurredAtLabel: formatLifecycleDateTime(request.createdAt),
      description: "Het aanvraagpakket werd als concept aangemaakt.",
    },
  ];

  if (request.submittedAt) {
    events.push({
      id: "submitted",
      title: "Ingediend",
      actorLabel: "Aanvrager",
      occurredAtLabel: formatLifecycleDateTime(request.submittedAt),
      description: "Het pakket werd ingediend voor behandeling door PROCERTUS.",
    });
  }

  if (
    request.status === "in-progress" ||
    request.status === "approved" ||
    request.status === "rejected" ||
    request.status === "archived"
  ) {
    events.push({
      id: "in-progress",
      title: "In behandeling",
      actorLabel: "Procertus",
      occurredAtLabel: formatLifecycleDateTime(request.updatedAt),
      description: "Procertus heeft de inhoudelijke behandeling gestart.",
    });
  }

  if ((request.status === "approved" || request.status === "archived") && request.resolvedAt) {
    events.push({
      id: "approved",
      title: "Goedgekeurd",
      actorLabel: "Procertus",
      occurredAtLabel: formatLifecycleDateTime(request.resolvedAt),
      description:
        "Het aanvraagpakket werd goedgekeurd. De onderliggende certificatieprocessen starten apart.",
      status: "success",
    });
  }

  if (request.status === "rejected" && request.resolvedAt) {
    events.push({
      id: "rejected",
      title: "Geweigerd",
      actorLabel: "Procertus",
      occurredAtLabel: formatLifecycleDateTime(request.resolvedAt),
      description: "Het aanvraagpakket werd geweigerd.",
      status: "destructive",
    });
  }

  if (request.status === "cancelled" && request.resolvedAt) {
    events.push({
      id: "cancelled",
      title: "Geannuleerd",
      actorLabel: "Aanvrager",
      occurredAtLabel: formatLifecycleDateTime(request.resolvedAt),
      description:
        "De aanvrager heeft de aanvraag geannuleerd. Dit kan niet ongedaan gemaakt worden.",
      status: "destructive",
    });
  }

  if (request.status === "archived" && request.archivedAt) {
    events.push({
      id: "archived",
      title: "Gearchiveerd",
      actorLabel: "Procertus",
      occurredAtLabel: formatLifecycleDateTime(request.archivedAt),
      description: "Het aanvraagpakket werd gearchiveerd.",
    });
  }

  return events;
}

export function requestApprovalStatus(request: AuthenticatedCertificationRequest) {
  if (request.handlingStatus) return request.handlingStatus;
  if (request.status === "draft") {
    return request.inquiries.length > 0 ? "Klaar voor review" : "Aan te vullen";
  }
  if (request.status === "submitted") return "Wacht op intake";
  if (request.status === "in-progress") return "In behandeling door Procertus";
  if (request.status === "approved") return "Goedgekeurd, certificatieprocessen starten apart";
  if (request.status === "rejected") return "Afgewezen";
  if (request.status === "cancelled") return "Geannuleerd";
  return "Afgesloten";
}

export function requestTitle(request: AuthenticatedCertificationRequest) {
  if (request.inquiries.length === 1) {
    const inquiry = request.inquiries[0]!;
    return inquiry.productLabel ? `${inquiry.label} voor ${inquiry.productLabel}` : inquiry.label;
  }
  return `Aanvraagpakket met ${request.inquiries.length} aanvragen`;
}

export function requestSubtitle(request: AuthenticatedCertificationRequest) {
  const productLabels = Array.from(
    new Set(request.inquiries.map((inquiry) => inquiry.productLabel).filter(Boolean)),
  );
  if (productLabels.length === 1) return productLabels[0]!;
  if (productLabels.length > 1) return `${productLabels.length} producttypes`;
  return "Niet-productgebonden aanvraag";
}

export function inquiryTitle(inquiry: CertificationRequestInquiry) {
  return inquiry.productLabel ? `${inquiry.label} voor ${inquiry.productLabel}` : inquiry.label;
}

export function toDraftItems(
  inquiries: readonly CertificationRequestInquiry[],
): DraftRequestItem[] {
  return inquiries.map((inquiry) => ({
    id: inquiry.id,
    title: inquiryTitle(inquiry),
    subtitle: inquiry.productPath ?? "Contextaanvraag",
    details: (
      <div className="space-y-component">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{inquiry.shortLabel}</Badge>
          {inquiry.value ? <Badge variant="outline">{inquiry.value}</Badge> : null}
        </div>
        {inquiry.context ? (
          <div className="rounded-md border border-border/60 bg-muted/30 p-component text-sm leading-normal text-foreground">
            <span className="mb-micro block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Aanvraagcontext
            </span>
            {inquiry.context}
          </div>
        ) : null}
      </div>
    ),
  }));
}

export function useAuthenticatedRequests() {
  const [storedRequests, setStoredRequests] = useLocalStorageState<unknown[]>(
    AUTHENTICATED_REQUESTS_STORAGE_KEY,
    INITIAL_REQUESTS,
  );
  const requests = useMemo(() => normalizeRequests(storedRequests), [storedRequests]);
  const setRequests: Dispatch<SetStateAction<AuthenticatedCertificationRequest[]>> = (next) => {
    setStoredRequests((current) => {
      const currentRequests = normalizeRequests(current);
      return typeof next === "function"
        ? (
            next as (
              value: AuthenticatedCertificationRequest[],
            ) => AuthenticatedCertificationRequest[]
          )(currentRequests)
        : next;
    });
  };

  return [requests, setRequests] as const;
}
