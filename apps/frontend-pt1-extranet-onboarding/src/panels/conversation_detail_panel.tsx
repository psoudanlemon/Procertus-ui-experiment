import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, CoverView, usePanelsContext } from "@procertus-ui/ui";
import {
  PortalEmailThreadWindow,
  type PortalEmailAttachment,
  type PortalEmailMessage,
} from "@procertus-ui/ui-lib";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  conversationSuiteTitle,
  getRawConversationThread,
  isConversationSuite,
  normalizeConversationScenario,
  type ConversationScenario,
  type ConversationSuite,
  type MockPortalChatLine,
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
  return (
    <Button
      variant="ghost"
      size="icon"
      inverse
      aria-label="Sluit communicatiepaneel"
      onClick={() => removePanel(panelType)}
    >
      <HugeiconsIcon icon={Cancel01Icon} />
    </Button>
  );
}

function mapLinesToEmailMessages(lines: readonly MockPortalChatLine[]): PortalEmailMessage[] {
  return lines.map((m) => ({
    id: m.id,
    placement: m.side === "requester" ? "requester" : "portal",
    authorLabel: m.authorLabel,
    atIso: m.atIso,
    body: m.body,
    subject: m.subject,
    attachments: m.attachments?.length ? m.attachments : undefined,
  }));
}

function formatFileByteSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function revokeHrefIfBlob(href: string) {
  if (href.startsWith("blob:")) URL.revokeObjectURL(href);
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
        title="Dossiercommunicatie"
        colorScheme="primary"
        primaryAction={<ClosePanelButton panelType={panelType} />}
        className="h-full"
        scrollable={false}
        contentClassName="p-0"
      >
        <div className="flex flex-1 flex-col px-4 py-3 text-sm text-muted-foreground">
          Deze thread kon niet worden geladen.
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
  const [draftBody, setDraftBody] = useState("");
  const [draftSubject, setDraftSubject] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<PortalEmailAttachment[]>([]);
  const [optimisticMessages, setOptimisticMessages] = useState<PortalEmailMessage[]>([]);

  useEffect(() => {
    setDraftBody("");
    setDraftSubject("");
    setOptimisticMessages((prev) => {
      for (const msg of prev) {
        for (const a of msg.attachments ?? []) revokeHrefIfBlob(a.href);
      }
      return [];
    });
    setPendingAttachments((prev) => {
      for (const a of prev) revokeHrefIfBlob(a.href);
      return [];
    });
  }, [scenario, suite]);

  const baseMessages = useMemo(
    () => mapLinesToEmailMessages(getRawConversationThread(suite, scenario)),
    [suite, scenario],
  );

  const messages = useMemo(
    () => [...baseMessages, ...optimisticMessages],
    [baseMessages, optimisticMessages],
  );

  const handlePickFiles = useCallback((files: readonly File[]) => {
    setPendingAttachments((prev) => [
      ...prev,
      ...files.map((file, i) => ({
        id: `pending-${Date.now()}-${i}-${file.name}`,
        title: file.name,
        formatHint: formatFileByteSize(file.size),
        href: URL.createObjectURL(file),
      })),
    ]);
  }, []);

  const handleRemovePendingAttachment = useCallback((id: string) => {
    setPendingAttachments((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) revokeHrefIfBlob(found.href);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = draftBody.trim();
    if (!trimmed && pendingAttachments.length === 0) return;
    const subjectLine = draftSubject.trim();
    const msg: PortalEmailMessage = {
      id: `local-${Date.now()}`,
      placement: "requester",
      authorLabel: "U",
      atIso: new Date().toISOString(),
      subject: subjectLine || undefined,
      body: trimmed || "—",
      attachments: pendingAttachments.length > 0 ? pendingAttachments.map((a) => ({ ...a })) : undefined,
    };
    setOptimisticMessages((prev) => [...prev, msg]);
    setDraftBody("");
    setDraftSubject("");
    setPendingAttachments([]);
  }, [draftBody, draftSubject, pendingAttachments]);

  return (
    <CoverView
      title="Dossiercommunicatie"
      colorScheme="primary"
      primaryAction={<ClosePanelButton panelType={panelType} />}
      className="h-full"
      scrollable={false}
      contentClassName="p-0"
    >
      <PortalEmailThreadWindow
        aria-label={`Dossiercommunicatie voor ${conversationSuiteTitle(suite)}`}
        messages={messages}
        className="flex min-h-0 min-w-0 flex-1 flex-col rounded-none border-0 bg-transparent shadow-none"
        scrollAreaClassName="max-h-none min-h-0 flex-1"
        threadSummary={{
          title: conversationSuiteTitle(suite),
          subtitle:
            scenario === "short"
              ? `Mock: korte thread (${scenario})`
              : scenario === "followUp"
                ? `Mock: thread met vervolg (${scenario})`
                : `Mock: standaard thread (${scenario})`,
        }}
        composer={{
          show: true,
          readOnly: false,
          value: draftBody,
          onChange: setDraftBody,
          subject: draftSubject,
          onSubjectChange: setDraftSubject,
          subjectPlaceholder: "Onderwerp (optioneel)",
          toolbar: true,
          onSubmit: handleSubmit,
          placeholder: "Schrijf een bericht aan PROCERTUS…",
          "aria-label": "Bericht aan PROCERTUS",
          className: "shrink-0 border-t border-border bg-card",
          pendingAttachments,
          onRemovePendingAttachment: handleRemovePendingAttachment,
          onPickFiles: handlePickFiles,
        }}
      />
    </CoverView>
  );
}
