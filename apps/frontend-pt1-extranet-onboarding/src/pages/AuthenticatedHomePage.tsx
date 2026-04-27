import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@procertus-ui/ui";
import { DraftRequestList, RequestPackageReview } from "@procertus-ui/ui-certification";
import type { DraftRequestItem, RequestPackageRow } from "@procertus-ui/ui-certification";
import { useMockPrototypeSession } from "@procertus-ui/ui-pt1-prototype";
import { useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import {
  CertificationRequestWizard,
  type CertificationWizardDraft,
} from "../features/certification-wizard/CertificationRequestWizard";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const AUTHENTICATED_REQUESTS_STORAGE_KEY = "pt1:authenticated-request-list";
const AUTHENTICATED_WIZARD_OPEN_STORAGE_KEY = "pt1:authenticated-request-wizard-open";
const CERTIFICATION_REQUEST_STORAGE_KEY = "pt1:certification-request-store";
const CREATE_CERTIFICATION_SESSION_ID = "pt1:authenticated:certification-request:create";

const INITIAL_REQUESTS: CertificationWizardDraft[] = [
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

function requestStatus(request: CertificationWizardDraft) {
  return request.id.startsWith("submitted") ? "In intake" : "Concept";
}

function toDraftItems(drafts: readonly CertificationWizardDraft[]): DraftRequestItem[] {
  return drafts.map((draft) => ({
    id: draft.id,
    title: draft.productLabel ? `${draft.label} voor ${draft.productLabel}` : draft.label,
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

function useAuthenticatedRequests() {
  return useLocalStorageState<CertificationWizardDraft[]>(
    AUTHENTICATED_REQUESTS_STORAGE_KEY,
    INITIAL_REQUESTS,
  );
}

export function AuthenticatedRequestsOverviewPage() {
  const session = useMockPrototypeSession();
  const navigate = useNavigate();
  const [wizardOpen, setWizardOpen] = useLocalStorageState(
    AUTHENTICATED_WIZARD_OPEN_STORAGE_KEY,
    false,
  );
  const [requests, setRequests] = useAuthenticatedRequests();
  const organizationName = session?.user.representedOrganization.name ?? "Gekende organisatie";

  if (wizardOpen) {
    return <Navigate to="/requests/create" replace />;
  }

  const rows: RequestPackageRow[] = useMemo(
    () => [
      { id: "organization", label: "Organisatiecontext", value: organizationName },
      { id: "representative", label: "Vertegenwoordiger", value: session?.user.displayName ?? "Prototype user" },
      { id: "requests", label: "Aanvragen in scope", value: requests.length },
    ],
    [organizationName, requests.length, session?.user.displayName],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-proc-xs md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <Badge variant="secondary">Aangemelde omgeving</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Aanvragen voor {organizationName}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Concepten en ingestuurde aanvragen blijven zichtbaar in dit overzicht. Start een nieuwe aanvraag via de
            create-route of open een bestaande request voor detail en bewerking.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setWizardOpen(true);
            navigate("/requests/create");
          }}
        >
          Nieuwe aanvraag
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
        <DraftRequestList
          title="Aanvraagoverzicht"
          description="Concepten en ingestuurde aanvragen voor de geselecteerde organisatie."
          drafts={toDraftItems(requests)}
          onEdit={(id) => navigate(`/requests/${id}`)}
          onRemove={(id) => setRequests((prev) => prev.filter((request) => request.id !== id))}
          editLabel="Openen"
          emptyTitle="Nog geen aanvragen"
          emptyDescription="Start een nieuwe aanvraag om productcertificaties of attesten toe te voegen."
        />
        <div className="space-y-4">
          <RequestPackageReview title="Organisatiecontext" rows={rows} />
          <Card>
            <CardHeader>
              <CardTitle>Prototype navigatie</CardTitle>
              <CardDescription>
                Routes: `/requests`, `/requests/create`, `/requests/:id`, and `/requests/:id/edit`.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Nieuwe aanvragen worden lokaal toegevoegd en blijven conceptueel onder dezelfde organisatiecontext.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const AuthenticatedHomePage = AuthenticatedRequestsOverviewPage;

export function AuthenticatedRequestCreatePage() {
  const navigate = useNavigate();
  const [, setWizardOpen] = useLocalStorageState(
    AUTHENTICATED_WIZARD_OPEN_STORAGE_KEY,
    true,
  );
  const [, setRequests] = useAuthenticatedRequests();

  return (
    <div className="h-[calc(100svh-5rem)] min-h-0 w-full">
      <CertificationRequestWizard
        mode="authenticated"
        backendKind="localStorage"
        storageKey={CERTIFICATION_REQUEST_STORAGE_KEY}
        sessionId={CREATE_CERTIFICATION_SESSION_ID}
        onCancel={() => {
          setWizardOpen(false);
          navigate("/requests");
        }}
        onRequestCreated={(draft) => {
          setRequests((prev) => {
            const byId = new Map(prev.map((request) => [request.id, request] as const));
            byId.set(draft.id, draft);
            return Array.from(byId.values());
          });
          setWizardOpen(false);
          navigate(`/requests/${draft.id}/edit`);
        }}
        onComplete={(drafts) => {
          const createdRequestId = drafts[0]?.id;
          setRequests((prev) => {
            const byId = new Map(prev.map((request) => [request.id, request] as const));
            for (const draft of drafts) {
              byId.set(draft.id, draft);
            }
            return Array.from(byId.values());
          });
          setWizardOpen(false);
          navigate(createdRequestId ? `/requests/${createdRequestId}` : "/requests");
        }}
      />
    </div>
  );
}

export function AuthenticatedRequestDetailPage() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [requests, setRequests] = useAuthenticatedRequests();
  const request = requests.find((candidate) => candidate.id === requestId);

  if (!request) return <Navigate to="/requests" replace />;

  const editable = !request.id.startsWith("submitted");

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-proc-xs md:flex-row md:items-start md:justify-between">
        <div>
          <Badge variant={editable ? "outline" : "secondary"}>{requestStatus(request)}</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {request.productLabel ? `${request.label} voor ${request.productLabel}` : request.label}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Request ID: <span className="font-mono">{request.id}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/requests")}>
            Terug naar overzicht
          </Button>
          {editable ? (
            <Button type="button" onClick={() => navigate(`/requests/${request.id}/edit`)}>
              Bewerken
            </Button>
          ) : null}
        </div>
      </div>

      <RequestPackageReview
        title="Request details"
        description="Detailoverzicht van de geselecteerde aanvraag."
        rows={[
          { id: "status", label: "Status", value: requestStatus(request) },
          { id: "label", label: "Aanvraagtype", value: request.label },
          { id: "product", label: "Product", value: request.productLabel ?? "Niet-productgebonden" },
          { id: "path", label: "Productpad", value: request.productPath ?? "Niet van toepassing" },
          { id: "value", label: "Beschikbaarheid", value: request.value ?? request.context ?? "Nog niet ingevuld" },
        ]}
      />

      <DraftRequestList
        title="Request"
        drafts={toDraftItems([request])}
        onEdit={(id) => navigate(`/requests/${id}/edit`)}
        onRemove={(id) => {
          setRequests((prev) => prev.filter((candidate) => candidate.id !== id));
          navigate("/requests");
        }}
        editLabel={editable ? "Bewerken" : "Openen"}
      />
    </div>
  );
}

export function AuthenticatedRequestEditPage() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [requests, setRequests] = useAuthenticatedRequests();
  const request = requests.find((candidate) => candidate.id === requestId);

  if (!request) return <Navigate to="/requests" replace />;
  if (request.id.startsWith("submitted")) return <Navigate to={`/requests/${request.id}`} replace />;

  return (
    <div className="h-[calc(100svh-5rem)] min-h-0 w-full">
      <CertificationRequestWizard
        mode="authenticated"
        initialDrafts={[request]}
        initialStep="details"
        backendKind="localStorage"
        storageKey={CERTIFICATION_REQUEST_STORAGE_KEY}
        sessionId={`pt1:authenticated:certification-request:${request.id}`}
        onCancel={() => navigate(`/requests/${request.id}`)}
        onComplete={(drafts) => {
          const updated = drafts[0] ?? request;
          setRequests((prev) => {
            const byId = new Map(prev.map((candidate) => [candidate.id, candidate] as const));
            byId.delete(request.id);
            byId.set(updated.id, updated);
            return Array.from(byId.values());
          });
          navigate(`/requests/${updated.id}`);
        }}
      />
    </div>
  );
}
