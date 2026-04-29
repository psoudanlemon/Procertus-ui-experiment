import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Badge, CoverView, IconButton, usePanelsContext } from "@procertus-ui/ui";
import {
  CertificationRequestLifecycleDetailTimeline,
  CertificationRequestLifecycleTimeline,
} from "@procertus-ui/ui-certification";
import { PanelSection } from "@procertus-ui/ui-lib";
import { useCallback, useMemo } from "react";

import { diffStringRecords } from "../features/profile-change-requests/flatten";
import { labelForChangeField } from "../features/profile-change-requests/field-labels";
import {
  PROFILE_CHANGE_STATUS_LABEL,
  profileChangeStatusToCertificationTimeline,
} from "../features/profile-change-requests/lifecycle-map";
import { profileChangeDetailLifecycleEvents } from "../features/profile-change-requests/profile-change-lifecycle-events";
import { profileChangeTimelineDateLabels } from "../features/profile-change-requests/profile-change-timeline-labels";
import { useProfileChangeRequests } from "../features/profile-change-requests/use-profile-change-requests";
import { isPendingProfileChangeStatus } from "../features/profile-change-requests/types";
import { CONVERSATION_SUITE_PROFILE_CHANGE } from "../features/conversations/conversation-detail-panel-mocks";
import { ConversationDigestItem } from "./conversation_digest_item";
import { useAppPanels } from "./useAppPanels";

/** Must match `ConversationDigestItem` / full conversation panel for this dossier. */
const PROFILE_CHANGE_CONVERSATION_SCENARIO = "followUp" as const;

export const PROFILE_CHANGE_DETAIL_PANEL_TYPE = "profileChangeDetail" as const;

export type ProfileChangeDetailPanelProps = {
  panelType?: string;
  requestId: string;
};

function ClosePanelButton({
  panelType = PROFILE_CHANGE_DETAIL_PANEL_TYPE,
}: {
  panelType?: string;
}) {
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

export function ProfileChangeDetailPanel({ panelType, requestId }: ProfileChangeDetailPanelProps) {
  const { removePanel } = useAppPanels();
  const { requests, setStatus } = useProfileChangeRequests();

  const request = useMemo(
    () => requests.find((candidate) => candidate.id === requestId),
    [requests, requestId],
  );

  const diffRows = useMemo(
    () =>
      request
        ? diffStringRecords(
            request.baseline as Record<string, string>,
            request.proposed as Record<string, string>,
          )
        : [],
    [request],
  );

  const timelineStatus = request
    ? profileChangeStatusToCertificationTimeline(request.status)
    : "submitted";
  const dateLabels = useMemo(
    () => (request ? profileChangeTimelineDateLabels(request) : {}),
    [request],
  );
  const lifecycleEvents = useMemo(
    () => (request ? profileChangeDetailLifecycleEvents(request) : []),
    [request],
  );

  const pending = request ? isPendingProfileChangeStatus(request.status) : false;

  const onCancel = useCallback(
    (id: string) => {
      setStatus(id, "canceled");
      removePanel(panelType ?? PROFILE_CHANGE_DETAIL_PANEL_TYPE);
    },
    [setStatus, removePanel, panelType],
  );

  if (!request) {
    return (
      <CoverView
        title="Wijziging niet gevonden"
        colorScheme="primary"
        primaryAction={<ClosePanelButton panelType={panelType} />}
        className="h-full"
      >
        <div className="p-4 text-sm text-muted-foreground">Deze aanvraag is niet meer beschikbaar.</div>
      </CoverView>
    );
  }

  return (
    <CoverView
      title={PROFILE_CHANGE_STATUS_LABEL[request.status]}
      colorScheme="primary"
      header={<div className="text-sm font-medium leading-snug">{request.title}</div>}
      primaryAction={<ClosePanelButton panelType={panelType} />}
      className="h-full"
    >
      <div className="space-y-10 p-0">
        <PanelSection title="Levenscyclus" description="Status van uw profielwijziging.">
          <CertificationRequestLifecycleTimeline dateLabels={dateLabels} status={timelineStatus} />
        </PanelSection>

        <PanelSection title="Tijdlijn" description="Verwerking van deze aanvraag.">
          <CertificationRequestLifecycleDetailTimeline events={lifecycleEvents} />
        </PanelSection>

        <PanelSection
          title="Voorgestelde wijzigingen"
          description="Alleen velden die afwijken van de laatst goedgekeurde waarden."
        >
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-2 font-medium">Veld</th>
                  <th className="p-2 font-medium">Goedgekeurd (huidig)</th>
                  <th className="p-2 font-medium">Voorgesteld</th>
                </tr>
              </thead>
              <tbody>
                {diffRows.map((row) => (
                  <tr key={row.key} className="border-t border-border bg-primary/5">
                    <td className="p-2 align-top font-medium text-foreground">
                      <span className="inline-flex flex-wrap items-center gap-2">
                        {labelForChangeField(row.key)}
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          wijziging
                        </Badge>
                      </span>
                    </td>
                    <td className="p-2 align-top text-muted-foreground">{row.before || "—"}</td>
                    <td className="p-2 align-top font-medium text-foreground">
                      {row.after || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelSection>

        <ConversationDigestItem
          key={requestId}
          requestId={requestId}
          suite={CONVERSATION_SUITE_PROFILE_CHANGE}
          scenario={PROFILE_CHANGE_CONVERSATION_SCENARIO}
        />

        {pending ? (
          <PanelSection
            title="Uw actie"
            description="U kunt een lopende aanvraag intrekken. Validatie en beslissing voert PROCERTUS uit."
          >
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onCancel(request.id)}
              >
                Aanvraag intrekken
              </Button>
            </div>
          </PanelSection>
        ) : null}
      </div>
    </CoverView>
  );
}
