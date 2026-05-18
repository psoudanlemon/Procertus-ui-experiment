import type { PortalEmailMessage } from "@procertus-ui/ui-lib";

import type { ConversationScenario, ConversationSuite } from "../features/conversations/conversation-detail-panel-mocks";

export function conversationThreadMessagesCacheKey(
  suite: ConversationSuite,
  scenario: ConversationScenario,
): string {
  return `${suite}:${scenario}`;
}

let liveThread: { key: string; messages: readonly PortalEmailMessage[] } | null = null;

/**
 * Last conversation thread snapshot from the open dossier panel (includes optimistic sends).
 * Used by the stacked message-detail panel which cannot receive full message payloads via URL.
 */
export function publishConversationThreadMessages(
  key: string,
  messages: readonly PortalEmailMessage[],
): void {
  liveThread = { key, messages };
}

export function readConversationThreadMessages(key: string): readonly PortalEmailMessage[] | undefined {
  return liveThread?.key === key ? liveThread.messages : undefined;
}
