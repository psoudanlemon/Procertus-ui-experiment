import { getRawConversationThread } from "../conversations/conversation-detail-panel-mocks";

/** @deprecated Prefer `getRawConversationThread` with suite/scenario; kept for callers that only need the default thread. */

export type MockPortalChatMessage = {
  id: string;
  side: "requester" | "PROCERTUS";
  authorLabel: string;
  atIso: string;
  body: string;
};

export function mockProfileChangePortalThread(): readonly MockPortalChatMessage[] {
  return getRawConversationThread("profileChange", "default");
}
