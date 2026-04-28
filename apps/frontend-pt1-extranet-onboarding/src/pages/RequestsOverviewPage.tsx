import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardList,
} from "@procertus-ui/ui";
import {
  CertificationRequestCard,
  DraftRequestList,
  RequestPackageReview,
} from "@procertus-ui/ui-certification";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import {
  CertificationRequestWizard,
} from "../features/certification-wizard/CertificationRequestWizard";
import {
  CERTIFICATION_REQUEST_STORAGE_KEY,
  requestApprovalStatus,
  requestStatus,
  requestTitle,
  toDraftItems,
  useAuthenticatedRequests,
} from "../features/requests/authenticatedRequestStore";
import {
  REQUEST_DETAIL_PANEL_TYPE,
  useAppPanels,
} from "../panels";

function RequestsOverviewContent() {
  const navigate = useNavigate();
  const { openPanel } = useAppPanels();
  const [requests] = useAuthenticatedRequests();

  return (
    <div className="flex h-full w-full flex-col gap-6 overflow-auto px-4 py-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-proc-xs md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <Badge variant="secondary">Aangemelde omgeving</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Aanvragen</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Concepten en ingestuurde aanvragen blijven zichtbaar in dit overzicht. Start een nieuwe aanvraag of open
            een bestaande request voor detail en bewerking.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => navigate("/requests/create")}
        >
          Nieuwe aanvraag
        </Button>
      </div>

      <section className="min-w-0 space-y-4">
        {requests.length > 0 ? (
          <CardList items={requests}>
            {(request) => (
              <CertificationRequestCard
                key={request.id}
                approvalStatusLabel={requestApprovalStatus(request)}
                productLabel={request.productLabel ?? "Niet-productgebonden"}
                requestId={request.id}
                statusLabel={requestStatus(request)}
                statusVariant={request.id.startsWith("submitted") ? "secondary" : "outline"}
                subtitle={request.productPath ?? "Contextaanvraag"}
                title={requestTitle(request)}
                typeLabel={request.shortLabel ?? request.label}
                valueLabel={request.value}
                onOpen={(requestId) => openPanel(REQUEST_DETAIL_PANEL_TYPE, { requestId })}
              />
            )}
          </CardList>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Nog geen aanvragen</CardTitle>
              <CardDescription>
                Start een nieuwe aanvraag om productcertificaties of attesten toe te voegen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" onClick={() => navigate("/requests/create")}>
                Nieuwe aanvraag
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

export function RequestsOverviewPage() {
  return (
    <RequestsOverviewContent />
  );
}

export function AuthenticatedRequestCreatePage() {
  const navigate = useNavigate();
  const [, setRequests] = useAuthenticatedRequests();

  return (
    <div className="h-[calc(100svh-5rem)] min-h-0 w-full">
      <CertificationRequestWizard
        mode="authenticated"
        backendKind="memory"
        onCancel={() => navigate("/requests")}
        onRequestCreated={(draft) => {
          setRequests((prev) => {
            const byId = new Map(prev.map((request) => [request.id, request] as const));
            byId.set(draft.id, draft);
            return Array.from(byId.values());
          });
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
