import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CoverView,
  IconButton,
  usePanelsContext,
} from "@procertus-ui/ui";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { RequestPackageReview } from "@procertus-ui/ui-certification";
import type { RequestPackageRow } from "@procertus-ui/ui-certification";
import { useNavigate } from "react-router-dom";

import {
  requestApprovalStatus,
  requestStatus,
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

export function RequestDetailPanel({ panelType, requestId }: RequestDetailPanelProps) {
  const navigate = useNavigate();
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

  const editable = !request.id.startsWith("submitted");
  const rows: RequestPackageRow[] = [
    { id: "status", label: "Processtatus", value: requestStatus(request) },
    { id: "approval", label: "Goedkeuringsstatus", value: requestApprovalStatus(request) },
    { id: "type", label: "Aanvraagtype", value: request.label },
    { id: "product", label: "Product", value: request.productLabel ?? "Niet-productgebonden" },
    { id: "path", label: "Productpad", value: request.productPath ?? "Niet van toepassing" },
    { id: "value", label: "Beschikbaarheid", value: request.value ?? request.context ?? "Nog niet ingevuld" },
    { id: "identifier", label: "Request ID", value: request.id },
  ];

  return (
    <CoverView
      title={request.shortLabel ?? request.label}
      colorScheme="primary"
      header={<div>{request.productLabel ? `${request.label} voor ${request.productLabel}` : request.label}</div>}
      primaryAction={<ClosePanelButton panelType={panelType} />}
      className="h-full"
    >
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={editable ? "outline" : "secondary"}>{requestStatus(request)}</Badge>
          <Badge variant="outline">{requestApprovalStatus(request)}</Badge>
          {request.value ? <Badge variant="outline">{request.value}</Badge> : null}
        </div>

        <RequestPackageReview
          title="Volledige aanvraagdetails"
          description="Alle beschikbare context voor deze certificatieaanvraag."
          rows={rows}
        />

        <Card>
          <CardHeader>
            <CardTitle>Vervolgacties</CardTitle>
            <CardDescription>
              Open de volledige route om te bewerken of beheer de aanvraag rechtstreeks vanuit dit overzicht.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => navigate(`/requests/${request.id}`)}>
              Route openen
            </Button>
            {editable ? (
              <Button type="button" onClick={() => navigate(`/requests/${request.id}/edit`)}>
                Bewerken
              </Button>
            ) : null}
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setRequests((prev) => prev.filter((candidate) => candidate.id !== request.id));
              }}
            >
              Verwijderen
            </Button>
          </CardContent>
        </Card>
      </div>
    </CoverView>
  );
}
