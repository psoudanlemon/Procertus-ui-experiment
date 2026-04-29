import { useConfirm } from "@procertus-ui/ui";
import { useMockPrototypeSession } from "@procertus-ui/ui-pt1-prototype";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { CertificationRequestWizard } from "@procertus-ui/ui-certification";
import { reviewRequesterFromSession } from "../features/certification-wizard/reviewRequesterFromSession";
import {
  CERTIFICATION_REQUEST_STORAGE_KEY,
  submitAuthenticatedRequestPackage,
  updateAuthenticatedRequestPackage,
  useAuthenticatedRequests,
} from "../features/requests/authenticatedRequestStore";

export function RequestEditPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const session = useMockPrototypeSession();
  const { requestId } = useParams();
  const reviewRequester = reviewRequesterFromSession(session);
  const [requests, setRequests] = useAuthenticatedRequests();
  const request = requests.find((candidate) => candidate.id === requestId);

  if (!request) return <Navigate to="/requests" replace />;
  if (request.status !== "draft")
    return <Navigate to={`/requests/${request.id}`} replace />;

  const handleCancel = async () => {
    const confirmed = confirm
      ? await confirm(
          "Bewerken annuleren?",
          "Niet-opgeslagen wijzigingen aan deze conceptaanvraag worden niet bewaard. Dit kan niet ongedaan gemaakt worden.",
        )
      : true;
    if (confirmed) {
      navigate(`/requests/${request.id}`);
    }
  };

  return (
    <div className="h-[calc(100svh-5rem)] min-h-0 w-full">
      <CertificationRequestWizard
        mode="authenticated"
        initialDrafts={[...request.inquiries]}
        initialStep="drafts"
        backendKind="localStorage"
        storageKey={CERTIFICATION_REQUEST_STORAGE_KEY}
        sessionId={request.sessionId}
        reviewRequester={reviewRequester}
        onCancel={handleCancel}
        onComplete={(drafts) => {
          const updated = submitAuthenticatedRequestPackage(
            updateAuthenticatedRequestPackage(request, drafts),
            drafts,
          );
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
