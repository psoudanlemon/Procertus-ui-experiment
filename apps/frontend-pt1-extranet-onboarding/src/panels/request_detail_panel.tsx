import {
  Button,
  CoverView,
  IconButton,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  useConfirm,
  usePanelsContext,
} from "@procertus-ui/ui";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CertificationRequestLifecycleDetailTimeline } from "@procertus-ui/ui-certification";
import { useNavigate } from "react-router-dom";

import { DownloadableDocumentListItem, PanelSection } from "@procertus-ui/ui-lib";
import { useMemo } from "react";

import {
  cancelAuthenticatedRequestPackage,
  requestLifecycleEvents,
  requestStatus,
  requestTitle,
  toDraftItems,
  useAuthenticatedRequests,
} from "../features/requests/authenticatedRequestStore";
import { buildRulesetDocumentsForInquiries } from "@procertus-ui/ui-certification";

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
  const confirm = useConfirm();
  const [requests, setRequests] = useAuthenticatedRequests();
  const request = requests.find((candidate) => candidate.id === requestId);

  const rulesetDocuments = useMemo(
    () => (request ? buildRulesetDocumentsForInquiries(request.inquiries) : []),
    [request],
  );

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
    <ItemGroup className="w-full">
      {toDraftItems(request.inquiries).map((inquiry) => (
        <Item key={inquiry.id} role="listitem" variant="outline" size="sm" className="min-w-0">
          <ItemContent>
            <ItemTitle className="line-clamp-none w-full max-w-full min-w-0 whitespace-normal wrap-break-word">
              {inquiry.title}
            </ItemTitle>
            <ItemDescription className="line-clamp-none text-xs whitespace-normal wrap-break-word">
              {inquiry.subtitle ?? "Contextaanvraag"}
            </ItemDescription>
            {inquiry.details ? <div className="mt-component min-w-0">{inquiry.details}</div> : null}
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
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
      <div className="space-y-12 p-0">
        {showActions ? (
          <PanelSection
            title="Vervolgacties"
            description="Open de volledige route om te bewerken of beheer de aanvraag rechtstreeks vanuit dit overzicht."
            contentClassName="flex flex-wrap gap-2"
          >
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
          </PanelSection>
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
        <PanelSection
          className="max-w-5xl w-full min-w-0"
          title="Regels en documentatie"
          description={
            request.inquiries.length > 0
              ? `Documenten gekoppeld aan ${
                  request.inquiries.length === 1
                    ? "de aanvraag in dit pakket"
                    : `de ${request.inquiries.length} aanvragen in dit pakket`
                } (prototype — downloadlinks zijn gemockt).`
              : "Er zijn nog geen onderliggende aanvragen in dit pakket — voeg aanvragen toe om relevante documenten te zien."
          }
        >
          {rulesetDocuments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Geen aanvragen in dit pakket — documentatie verschijnt zodra er minstens één aanvraag
              is opgenomen.
            </p>
          ) : (
            <ItemGroup className="w-full">
              {rulesetDocuments.map((doc) => (
                <DownloadableDocumentListItem key={doc.id} {...doc} />
              ))}
            </ItemGroup>
          )}
        </PanelSection>
      </div>
    </CoverView>
  );
}
