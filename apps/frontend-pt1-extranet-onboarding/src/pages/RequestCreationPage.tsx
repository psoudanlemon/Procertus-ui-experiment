import { useConfirm } from "@procertus-ui/ui";
import { useMockPrototypeSession } from "@procertus-ui/ui-pt1-prototype";
import { useNavigate } from "react-router-dom";

import { CertificationRequestWizard } from "../features/certification-wizard/CertificationRequestWizard";
import { reviewRequesterFromSession } from "../features/certification-wizard/reviewRequesterFromSession";
import {
  createAuthenticatedRequestPackage,
  submitAuthenticatedRequestPackage,
  useAuthenticatedRequests,
} from "../features/requests/authenticatedRequestStore";

export function RequestCreationPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const session = useMockPrototypeSession();
  const [, setRequests] = useAuthenticatedRequests();
  const reviewRequester = reviewRequesterFromSession(session);

  const handleCancel = async () => {
    const confirmed = confirm
      ? await confirm(
          "Conceptaanvraag annuleren?",
          "Deze conceptaanvraag wordt verlaten. Niet-opgeslagen keuzes kunnen niet worden hersteld.",
        )
      : true;
    if (confirmed) {
      navigate("/requests");
    }
  };

  return (
    <div className="h-[calc(100svh-5rem)] min-h-0 w-full max-w-[1600px]">
      <CertificationRequestWizard
        mode="authenticated"
        backendKind="memory"
        reviewRequester={reviewRequester}
        onCancel={handleCancel}
        onRequestCreated={(draft) => {
          const createdRequest = createAuthenticatedRequestPackage({ inquiries: [draft] });
          setRequests((prev) => {
            const byId = new Map(
              prev.map((storedRequest) => [storedRequest.id, storedRequest] as const),
            );
            byId.set(createdRequest.id, createdRequest);
            return Array.from(byId.values());
          });
          navigate(`/requests/${createdRequest.id}/edit`);
        }}
        onComplete={(drafts) => {
          const createdRequest = submitAuthenticatedRequestPackage(
            createAuthenticatedRequestPackage({ inquiries: drafts }),
            drafts,
          );
          setRequests((prev) => {
            const byId = new Map(
              prev.map((storedRequest) => [storedRequest.id, storedRequest] as const),
            );
            byId.set(createdRequest.id, createdRequest);
            return Array.from(byId.values());
          });
          navigate(`/requests/${createdRequest.id}`);
        }}
      />
    </div>
  );
}
