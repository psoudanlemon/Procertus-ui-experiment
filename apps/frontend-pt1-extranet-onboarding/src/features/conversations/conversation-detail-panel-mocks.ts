/** Raw lines for mocked portal chat threads (mapped to `PortalChatMessage` in the conversation panel). */

export type MockPortalChatLine = {
  id: string;
  side: "requester" | "PROCERTUS";
  authorLabel: string;
  atIso: string;
  body: string;
};

export const CONVERSATION_SUITES = ["profileChange", "certification"] as const;
export type ConversationSuite = (typeof CONVERSATION_SUITES)[number];

/** Use when opening the conversation panel from a profielwijziging-dossier. */
export const CONVERSATION_SUITE_PROFILE_CHANGE: ConversationSuite = "profileChange";
/** Use when opening the conversation panel from a certificatie-aanvraagdossier. */
export const CONVERSATION_SUITE_CERTIFICATION: ConversationSuite = "certification";

export const CONVERSATION_SCENARIOS = ["default", "followUp", "short"] as const;
export type ConversationScenario = (typeof CONVERSATION_SCENARIOS)[number];

const PROFILE_DEFAULT: MockPortalChatLine[] = [
  {
    id: "mock-req-1",
    side: "requester",
    authorLabel: "U",
    atIso: "2026-04-28T09:12:00.000Z",
    body: "Hierbij de aangevulde profielgegevens. Kunnen jullie dit valideren wanneer mogelijk?",
  },
  {
    id: "mock-adm-1",
    side: "PROCERTUS",
    authorLabel: "PROCERTUS",
    atIso: "2026-04-28T11:40:00.000Z",
    body: "Ontvangen. We nemen uw wijziging in behandeling en sturen u een update zodra er een beslissing is.",
  },
  {
    id: "mock-adm-2",
    side: "PROCERTUS",
    authorLabel: "PROCERTUS — backoffice",
    atIso: "2026-04-28T14:05:00.000Z",
    body: "Voor de volledigheid: controleer of het BTW-nummer overeenkomt met de KBO-gegevens voordat we definitief doorvoeren.",
  },
];

const PROFILE_FOLLOW_UP: MockPortalChatLine[] = [
  ...PROFILE_DEFAULT,
  {
    id: "mock-req-2",
    side: "requester",
    authorLabel: "U",
    atIso: "2026-04-28T15:30:00.000Z",
    body: "Bedankt — ik heb de KBO-link bijgevoegd in het dossier.",
  },
  {
    id: "mock-adm-3",
    side: "PROCERTUS",
    authorLabel: "PROCERTUS",
    atIso: "2026-04-28T16:02:00.000Z",
    body: "Dank u. We hervatten de controle en melden het resultaat hier.",
  },
];

const PROFILE_SHORT: MockPortalChatLine[] = PROFILE_DEFAULT.slice(0, 2);

const CERT_DEFAULT: MockPortalChatLine[] = [
  {
    id: "cert-req-1",
    side: "requester",
    authorLabel: "U",
    atIso: "2026-04-27T10:05:00.000Z",
    body: "Het aanvraagpakket is ingediend. Graag bevestigen wanneer de intake gepland kan worden.",
  },
  {
    id: "cert-adm-1",
    side: "PROCERTUS",
    authorLabel: "PROCERTUS",
    atIso: "2026-04-27T13:22:00.000Z",
    body: "Ontvangen. Uw dossier staat in de wachtrij voor eerste beoordeling; u ontvangt een seintje zodra er een datum is.",
  },
  {
    id: "cert-adm-2",
    side: "PROCERTUS",
    authorLabel: "PROCERTUS — backoffice",
    atIso: "2026-04-28T08:15:00.000Z",
    body: "Controleer of alle geüploade documenten nog geldig zijn vóór de technische review; verlopen attesten vertragen het traject.",
  },
];

const CERT_FOLLOW_UP: MockPortalChatLine[] = [
  ...CERT_DEFAULT,
  {
    id: "cert-req-2",
    side: "requester",
    authorLabel: "U",
    atIso: "2026-04-29T09:00:00.000Z",
    body: "Documenten zijn vernieuwd; graag opnieuw vrij te geven voor planning.",
  },
  {
    id: "cert-adm-3",
    side: "PROCERTUS",
    authorLabel: "PROCERTUS",
    atIso: "2026-04-29T09:45:00.000Z",
    body: "Noted. Intake wordt opnieuw ingepland zodra de checklist groen is.",
  },
];

const CERT_SHORT: MockPortalChatLine[] = CERT_DEFAULT.slice(0, 2);

const bySuite: Record<ConversationSuite, Record<ConversationScenario, readonly MockPortalChatLine[]>> = {
  profileChange: {
    default: PROFILE_DEFAULT,
    followUp: PROFILE_FOLLOW_UP,
    short: PROFILE_SHORT,
  },
  certification: {
    default: CERT_DEFAULT,
    followUp: CERT_FOLLOW_UP,
    short: CERT_SHORT,
  },
};

export const CONVERSATION_SCENARIO_LABELS: Record<ConversationScenario, string> = {
  default: "Standaard",
  followUp: "Vervolg",
  short: "Kort",
};

export function isConversationSuite(value: string | undefined): value is ConversationSuite {
  return value === "profileChange" || value === "certification";
}

export function isConversationScenario(value: string | undefined): value is ConversationScenario {
  return value === "default" || value === "followUp" || value === "short";
}

export function normalizeConversationScenario(value: string | undefined): ConversationScenario {
  return isConversationScenario(value) ? value : "default";
}

export function getRawConversationThread(
  suite: ConversationSuite,
  scenario: ConversationScenario,
): readonly MockPortalChatLine[] {
  return bySuite[suite][scenario];
}

export function conversationSuiteTitle(suite: ConversationSuite): string {
  return suite === "profileChange" ? "Profielwijziging" : "Certificatieaanvraag";
}

/** Preview row for inline "last message" widgets (detail panels, dashboards). */
export type ConversationThreadPreview = {
  lastLine: MockPortalChatLine;
  /**
   * Mock unread count (PROCERTUS-side messages capped) to drive badges before the user opens the thread.
   */
  initialUnreadCount: number;
};

export function formatConversationPreviewTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/**
 * Last line of the mocked thread plus a synthetic unread count for UI previews.
 */
export function getConversationThreadPreview(
  suite: ConversationSuite,
  scenario: ConversationScenario,
): ConversationThreadPreview {
  const thread = [...getRawConversationThread(suite, scenario)];
  const lastLine = thread[thread.length - 1]!;
  const portalReplies = thread.filter((m) => m.side === "PROCERTUS").length;
  const initialUnreadCount = Math.min(5, Math.max(1, portalReplies));
  return { lastLine, initialUnreadCount };
}
