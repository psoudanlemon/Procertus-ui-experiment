import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CoverView, IconButton, usePanelsContext } from "@procertus-ui/ui";
import { PortalChatWindow, type PortalChatMessage } from "@procertus-ui/ui-lib";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getRawConversationThread,
  isConversationSuite,
  normalizeConversationScenario,
  type ConversationScenario,
  type ConversationSuite,
} from "../features/conversations/conversation-detail-panel-mocks";
import { CONVERSATION_DETAIL_PANEL_TYPE } from "./conversation-panel-config";

export type ConversationDetailPanelProps = {
  panelType?: string;
  /**
   * Dossier context from URL `panelProps` (with `suite`): which mock thread family to load.
   */
  suite?: ConversationSuite;
  /**
   * Thread variant from URL `panelProps` — drives `getRawConversationThread(suite, scenario)`.
   * Not user-switchable in-panel; change the URL / `openPanel` payload to load another mock.
   */
  scenario?: ConversationScenario;
};

function ClosePanelButton({ panelType = CONVERSATION_DETAIL_PANEL_TYPE }: { panelType?: string }) {
  const { removePanel } = usePanelsContext();
  const CloseIcon = ({ className }: { className?: string }) => (
    <HugeiconsIcon icon={Cancel01Icon} className={className} />
  );

  return (
    <IconButton
      icon={CloseIcon}
      aria-label="Sluit conversatiepaneel"
      onClick={() => removePanel(panelType)}
      invertColors
    />
  );
}

function mapLinesToPortalMessages(
  lines: readonly {
    id: string;
    side: "requester" | "PROCERTUS";
    authorLabel: string;
    atIso: string;
    body: string;
  }[],
): PortalChatMessage[] {
  return lines.map((m) => ({
    id: m.id,
    placement: m.side === "requester" ? "requester" : "portal",
    authorLabel: m.authorLabel,
    atIso: m.atIso,
    body: m.body,
  }));
}

export function ConversationDetailPanel({
  panelType,
  suite: suiteProp,
  scenario: scenarioProp,
}: ConversationDetailPanelProps) {
  const suite = isConversationSuite(suiteProp) ? suiteProp : null;
  const scenario = normalizeConversationScenario(scenarioProp);

  if (!suite) {
    return (
      <CoverView
        title="Conversatie"
        colorScheme="primary"
        primaryAction={<ClosePanelButton panelType={panelType} />}
        className="h-full"
        scrollable={false}
        contentClassName="p-0"
      >
        <div className="flex flex-1 flex-col px-4 py-3 text-sm text-muted-foreground">
          Deze conversatie kon niet worden geladen.
        </div>
      </CoverView>
    );
  }

  return <ConversationCoverBody panelType={panelType} suite={suite} scenario={scenario} />;
}

type ConversationCoverBodyProps = {
  panelType?: string;
  suite: ConversationSuite;
  scenario: ConversationScenario;
};

function ConversationCoverBody({ panelType, suite, scenario }: ConversationCoverBodyProps) {
  const [draft, setDraft] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<PortalChatMessage[]>([]);

  useEffect(() => {
    setDraft("");
    setOptimisticMessages([]);
  }, [scenario, suite]);

  const baseMessages = useMemo(
    () => mapLinesToPortalMessages(getRawConversationThread(suite, scenario)),
    [suite, scenario],
  );

  const messages = useMemo(
    () => [...baseMessages, ...optimisticMessages],
    [baseMessages, optimisticMessages],
  );

  const handleSubmit = useCallback(() => {
    const body = draft.trim();
    if (!body) return;
    const msg: PortalChatMessage = {
      id: `local-${Date.now()}`,
      placement: "requester",
      authorLabel: "U",
      atIso: new Date().toISOString(),
      body,
    };
    setOptimisticMessages((prev) => [...prev, msg]);
    setDraft("");
  }, [draft]);

  return (
    <CoverView
      title="Conversatie"
      colorScheme="primary"
      primaryAction={<ClosePanelButton panelType={panelType} />}
      className="h-full"
      scrollable={false}
      contentClassName="p-0"
    >
      <PortalChatWindow
        aria-label="Conversatie met PROCERTUS"
        messages={messages}
        className="flex min-h-0 min-w-0 flex-1 flex-col"
        scrollAreaClassName="max-h-none min-h-0 flex-1"
        composer={{
          show: true,
          readOnly: false,
          value: draft,
          onChange: setDraft,
          toolbar: true,
          onSubmit: handleSubmit,
          placeholder: "Bericht aan PROCERTUS…",
          "aria-label": "Bericht aan PROCERTUS",
          className: "p-4",
        }}
      />
    </CoverView>
  );
}
