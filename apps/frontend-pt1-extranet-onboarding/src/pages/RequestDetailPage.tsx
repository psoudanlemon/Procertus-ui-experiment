import { Badge, Button, useConfirm } from "@procertus-ui/ui";
import {
  CertificationRequestLifecycleDetailTimeline,
  DraftRequestList,
  RequestPackageReview,
} from "@procertus-ui/ui-certification";
import { useMockPrototypeSession } from "@procertus-ui/ui-pt1-prototype";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { reviewRequesterFromSession } from "../features/certification-wizard/reviewRequesterFromSession";
import {
  cancelAuthenticatedRequestPackage,
  requestApprovalStatus,
  requestLifecycleEvents,
  requestSubtitle,
  requestStatus,
  requestTitle,
  toDraftItems,
  useAuthenticatedRequests,
} from "../features/requests/authenticatedRequestStore";

const formatDateTime = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("nl-BE", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Nog niet";

export function RequestDetailPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const session = useMockPrototypeSession();
  const { requestId } = useParams();
  const reviewRequester = reviewRequesterFromSession(session);
  const [requests, setRequests] = useAuthenticatedRequests();
  const request = requests.find((candidate) => candidate.id === requestId);

  if (!request) return <Navigate to="/requests" replace />;

  const editable = request.status === "draft";
  const cancellable = request.status === "submitted" || request.status === "in-progress";

  const cancelRequest = async () => {
    const confirmed = confirm
      ? await confirm(
          "Aanvraag annuleren?",
          "Annuleren kan niet ongedaan gemaakt worden. De aanvraag blijft geannuleerd tot ze wordt gearchiveerd.",
        )
      : false;
    if (!confirmed) return;
    setRequests((prev) =>
      prev.map((candidate) =>
        candidate.id === request.id ? cancelAuthenticatedRequestPackage(candidate) : candidate,
      ),
    );
  };

  const removeDraftInquiry = async (id: string) => {
    const confirmed = confirm
      ? await confirm(
          "Conceptaanvraag verwijderen?",
          "Deze conceptaanvraag wordt uit het pakket verwijderd. Dit kan niet ongedaan gemaakt worden.",
        )
      : false;
    if (!confirmed) return;
    setRequests((prev) =>
      prev.map((candidate) =>
        candidate.id === request.id
          ? {
              ...candidate,
              inquiries: candidate.inquiries.filter((inquiry) => inquiry.id !== id),
              updatedAt: new Date().toISOString(),
            }
          : candidate,
      ),
    );
    navigate("/requests");
  };

  const removeDraftRequest = async () => {
    const confirmed = confirm
      ? await confirm(
          "Conceptaanvraag verwijderen?",
          "Deze conceptaanvraag wordt verwijderd. Dit kan niet ongedaan gemaakt worden.",
        )
      : false;
    if (!confirmed) return;
    setRequests((prev) => prev.filter((candidate) => candidate.id !== request.id));
    navigate("/requests");
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-proc-xs md:flex-row md:items-start md:justify-between">
        <div>
          <Badge variant={editable ? "outline" : "secondary"}>{requestStatus(request)}</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">{requestTitle(request)}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {requestSubtitle(request)} · Request ID: <span className="font-mono">{request.id}</span>
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
          {editable ? (
            <Button type="button" variant="destructive" onClick={removeDraftRequest}>
              Verwijderen
            </Button>
          ) : null}
          {cancellable ? (
            <Button type="button" variant="destructive" onClick={cancelRequest}>
              Annuleren
            </Button>
          ) : null}
        </div>
      </div>

      <RequestPackageReview
        title="Request details"
        description="Detailoverzicht van de geselecteerde aanvraag."
        requester={reviewRequester}
        rows={[
          { id: "status", label: "Status", value: requestStatus(request) },
          { id: "handling", label: "Behandeling", value: requestApprovalStatus(request) },
          { id: "created", label: "Aangemaakt", value: formatDateTime(request.createdAt) },
          { id: "submitted", label: "Ingediend", value: formatDateTime(request.submittedAt) },
          { id: "updated", label: "Laatst gewijzigd", value: formatDateTime(request.updatedAt) },
          { id: "inquiries", label: "Onderliggende aanvragen", value: request.inquiries.length },
        ]}
      />

      <div className="rounded-xl border bg-card p-section">
        <h2 className="text-base font-semibold text-foreground">Levenscyclus</h2>
        <p className="mt-micro text-sm text-muted-foreground">
          Historiek van acties op dit aanvraagpakket.
        </p>
        <CertificationRequestLifecycleDetailTimeline
          className="mt-section"
          events={requestLifecycleEvents(request)}
        />
      </div>

      <DraftRequestList
        title="Onderliggende certificatie- en attestvragen"
        description="Na goedkeuring van dit pakket krijgen deze aanvragen elk hun eigen vervolgproces."
        drafts={toDraftItems(request.inquiries)}
        onEdit={() => navigate(`/requests/${request.id}/edit`)}
        onRemove={removeDraftInquiry}
        editLabel={editable ? "Bewerken" : "Openen"}
        showEdit={editable}
        showRemove={editable}
      />
    </div>
  );
}
