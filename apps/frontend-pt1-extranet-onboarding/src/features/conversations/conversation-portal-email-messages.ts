import type { PortalEmailMessage } from "@procertus-ui/ui-lib";

import {
  getRawConversationThread,
  type ConversationScenario,
  type ConversationSuite,
  type MockPortalChatLine,
} from "./conversation-detail-panel-mocks";

export function mapMockLinesToPortalEmailMessages(lines: readonly MockPortalChatLine[]): PortalEmailMessage[] {
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

/** Newest-first, matching `ConversationDetailPanel` ordering. */
export function getSortedPortalEmailMessagesFromMocks(
  suite: ConversationSuite,
  scenario: ConversationScenario,
): PortalEmailMessage[] {
  const base = mapMockLinesToPortalEmailMessages(getRawConversationThread(suite, scenario));
  return base.toSorted((a, b) => b.atIso.localeCompare(a.atIso));
}
