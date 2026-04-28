import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CoverView,
  IconButton,
  useConfirm,
  usePanelsContext,
} from "@procertus-ui/ui";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CertificationRequestLifecycleDetailTimeline } from "@procertus-ui/ui-certification";
import { useNavigate } from "react-router-dom";

import {
  cancelAuthenticatedRequestPackage,
  requestLifecycleEvents,
  requestStatus,
  requestTitle,
  toDraftItems,
  useAuthenticatedRequests,
} from "../features/requests/authenticatedRequestStore";

export const REQUEST_DETAIL_PANEL_TYPE = "requestDetail";

export type RequestDetailPanelProps = {
  panelType?: string;
  requestId: string;
};

function ClosePanelButton({ panelType = REQUEST_DETAIL_PANEL_TYPE }: { panelType?: string }) {
  const { removePanel } = usePanelsContext();
  const CloseIcon = ({ className }: { className?: string }) => (
    <HugeiconsIcon icon={Cancel01Icon} className={className} />
  );

  return (
    <IconButton
      icon={CloseIcon}
      aria-label="Sluit detailpaneel"
      onClick={() => removePanel(panelType)}
      invertColors
    />
  );
}

function PanelSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription className="whitespace-normal wrap-break-word">
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="min-w-0">{children}</CardContent>
    </Card>
  );
}

export function RequestDetailPanel({ panelType, requestId }: RequestDetailPanelProps) {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [requests, setRequests] = useAuthenticatedRequests();
  const request = requests.find((candidate) => candidate.id === requestId);

  if (!request) {
    return (
      <CoverView
        title="Aanvraag niet gevonden"
        colorScheme="primary"
        primaryAction={<ClosePanelButton panelType={panelType} />}
        className="h-full"
      >
        <div className="p-4 text-sm text-muted-foreground">
          Deze aanvraag bestaat niet meer of werd verwijderd.
        </div>
      </CoverView>
    );
  }

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

  const removeDraftRequest = async () => {
    const confirmed = confirm
      ? await confirm(
          "Conceptaanvraag verwijderen?",
          "Deze conceptaanvraag wordt verwijderd. Dit kan niet ongedaan gemaakt worden.",
        )
      : false;
    if (!confirmed) return;
    setRequests((prev) => prev.filter((candidate) => candidate.id !== request.id));
  };

  const items = (
    <ul className="grid min-w-0 gap-3" role="list">
      {toDraftItems(request.inquiries).map((inquiry) => (
        <li key={inquiry.id} className="min-w-0 rounded-md border border-border/50 p-3">
          <p className="min-w-0 whitespace-normal wrap-break-word text-sm font-medium text-foreground">
            {inquiry.title}
          </p>
          <p className="mt-1 min-w-0 whitespace-normal wrap-break-word text-xs text-muted-foreground">
            {inquiry.subtitle ?? "Contextaanvraag"}
          </p>
          {inquiry.details ? <div className="mt-component min-w-0">{inquiry.details}</div> : null}
        </li>
      ))}
    </ul>
  );

  // const rows: RequestPackageRow[] = [
  //   { id: "status", label: "Processtatus", value: requestStatus(request) },
  //   { id: "approval", label: "Goedkeuringsstatus", value: requestApprovalStatus(request) },
  //   { id: "created", label: "Aangemaakt", value: formatDateTime(request.createdAt) },
  //   { id: "submitted", label: "Ingediend", value: formatDateTime(request.submittedAt) },
  //   { id: "updated", label: "Laatst gewijzigd", value: formatDateTime(request.updatedAt) },
  //   { id: "inquiries", label: "Onderliggende aanvragen", value: request.inquiries.length },
  //   { id: "identifier", label: "Request ID", value: request.id },
  // ];

  const showActions = editable || cancellable;

  return (
    <CoverView
      title={requestStatus(request)}
      colorScheme="primary"
      header={<div>{requestTitle(request)}</div>}
      primaryAction={<ClosePanelButton panelType={panelType} />}
      className="h-full"
    >
      <div className="space-y-4 p-4">
        {showActions ? (
          <Card>
            <CardHeader>
              <CardTitle>Vervolgacties</CardTitle>
              <CardDescription>
                Open de volledige route om te bewerken of beheer de aanvraag rechtstreeks vanuit dit
                overzicht.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
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
            </CardContent>
          </Card>
        ) : null}
        <PanelSection
          title="Levenscyclus"
          description="Historiek van acties op dit aanvraagpakket."
        >
          <CertificationRequestLifecycleDetailTimeline events={requestLifecycleEvents(request)} />
        </PanelSection>
        {request.inquiries.length > 1 ? (
          <PanelSection
            title="Onderliggende aanvragen"
            description="Deze vragen worden samen ingediend. Na goedkeuring start per vraag een eigen certificatieproces."
          >
            {items}
          </PanelSection>
        ) : (
          <>{items}</>
        )}
      </div>
    </CoverView>
  );
}
