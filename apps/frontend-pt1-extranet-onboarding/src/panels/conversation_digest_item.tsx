import { PortalChatConversationDigestItem } from "@procertus-ui/ui-lib";
import { useMemo } from "react";

import {
  formatConversationPreviewTimestamp,
  getConversationThreadPreview,
  type ConversationScenario,
  type ConversationSuite,
} from "../features/conversations/conversation-detail-panel-mocks";
import { CONVERSATION_DETAIL_PANEL_TYPE } from "./conversation-panel-config";
import { useAppPanels } from "./useAppPanels";

export type ConversationDigestItemProps = {
  /** Remount with dossier id so unread mock resets when switching details. */
  requestId: string;
  suite: ConversationSuite;
  scenario: ConversationScenario;
  heading?: string;
};

/**
 * Extranet wiring: mock thread preview + `openPanel` for `conversationDetail`.
 * Presentation lives in `@procertus-ui/ui-lib` (`PortalChatConversationDigestItem`).
 */
export function ConversationDigestItem({ requestId, suite, scenario, heading }: ConversationDigestItemProps) {
  const { openPanel } = useAppPanels();
  const preview = useMemo(() => getConversationThreadPreview(suite, scenario), [suite, scenario]);

  return (
    <PortalChatConversationDigestItem
      key={`${requestId}-${suite}-${scenario}`}
      heading={heading}
      lastMessageBody={preview.lastLine.body}
      lastMessageAuthorLabel={preview.lastLine.authorLabel}
      lastMessageTimeLabel={formatConversationPreviewTimestamp(preview.lastLine.atIso)}
      initialUnreadCount={preview.initialUnreadCount}
      onOpen={() => openPanel(CONVERSATION_DETAIL_PANEL_TYPE, { suite, scenario })}
    />
  );
}
