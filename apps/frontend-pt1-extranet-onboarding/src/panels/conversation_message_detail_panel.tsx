import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, CoverView, cn, usePanelsContext } from "@procertus-ui/ui";
import {
  PortalEmailMessageDetailBody,
  type PortalEmailMessage,
} from "@procertus-ui/ui-lib";
import { useCallback, useMemo } from "react";

import {
  conversationSuiteTitle,
  isConversationSuite,
  normalizeConversationScenario,
  type ConversationScenario,
  type ConversationSuite,
} from "../features/conversations/conversation-detail-panel-mocks";
import { getSortedPortalEmailMessagesFromMocks } from "../features/conversations/conversation-portal-email-messages";
import { CONVERSATION_MESSAGE_DETAIL_PANEL_TYPE } from "./conversation-panel-config";
import {
  conversationThreadMessagesCacheKey,
  readConversationThreadMessages,
} from "./conversation-thread-messages-cache";
import { useAppPanels } from "./useAppPanels";

export type ConversationMessageDetailPanelProps = {
  panelType?: string;
  suite?: string;
  scenario?: string;
  messageId?: string;
};

function ClosePanelButton({
  panelType = CONVERSATION_MESSAGE_DETAIL_PANEL_TYPE,
}: {
  panelType?: string;
}) {
  const { removePanel } = usePanelsContext();
  return (
    <Button
      variant="ghost"
      size="icon"
      inverse
      aria-label="Sluit berichtpaneel"
      onClick={() => removePanel(panelType)}
    >
      <HugeiconsIcon icon={Cancel01Icon} />
    </Button>
  );
}

/** List order is newest-first; “nieuwer” moves toward younger messages (lower index). */
function normalizeThreadMessages(
  suite: ConversationSuite,
  scenario: ConversationScenario,
): readonly PortalEmailMessage[] {
  const key = conversationThreadMessagesCacheKey(suite, scenario);
  const cached = readConversationThreadMessages(key);
  if (cached?.length) return cached;
  return getSortedPortalEmailMessagesFromMocks(suite, scenario);
}

export function ConversationMessageDetailPanel({
  panelType,
  suite: suiteProp,
  scenario: scenarioProp,
  messageId: messageIdProp,
}: ConversationMessageDetailPanelProps) {
  const suite = isConversationSuite(suiteProp) ? suiteProp : null;
  const scenario = normalizeConversationScenario(scenarioProp);
  const messageId = messageIdProp != null ? String(messageIdProp) : "";
  const { openPanel } = useAppPanels();

  const ordered = useMemo(
    () => (suite ? normalizeThreadMessages(suite, scenario) : []),
    [suite, scenario],
  );

  const index = messageId.length ? ordered.findIndex((m) => m.id === messageId) : -1;
  const message = index >= 0 ? ordered[index] : undefined;

  const navigateToId = useCallback(
    (id: string) => {
      if (!suite) return;
      openPanel(CONVERSATION_MESSAGE_DETAIL_PANEL_TYPE, {
        suite,
        scenario,
        messageId: id,
      });
    },
    [openPanel, scenario, suite],
  );

  const newerId = index > 0 ? ordered[index - 1]?.id : undefined;
  const olderId = index >= 0 && index < ordered.length - 1 ? ordered[index + 1]?.id : undefined;

  const coverTitle =
    message?.subject?.trim().slice(0, 96) ??
    (message ? conversationSuiteTitle(suite!) : "Bericht");

  if (!suite) {
    return (
      <CoverView
        title="Bericht"
        colorScheme="primary"
        primaryAction={<ClosePanelButton panelType={panelType} />}
        className="h-full"
        scrollable={false}
        contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden p-0"
      >
        <div className="flex flex-1 flex-col px-4 py-3 text-sm text-muted-foreground">
          Dit bericht kon niet worden geladen.
        </div>
      </CoverView>
    );
  }

  return (
    <CoverView
      title={coverTitle}
      header={
        <p className="text-xs font-normal leading-snug text-muted-foreground">
          {ordered.length > 0 && index >= 0
            ? `${index + 1} van ${ordered.length} · ${conversationSuiteTitle(suite)}`
            : conversationSuiteTitle(suite)}
        </p>
      }
      colorScheme="primary"
      primaryAction={<ClosePanelButton panelType={panelType} />}
      className="h-full"
      scrollable={false}
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden p-0"
    >
      {message ? (
        <div className="flex min-h-0 flex-1 flex-col gap-0">
          <div className="min-h-0 flex-1 overflow-y-auto px-section pb-4 pt-6">
            <PortalEmailMessageDetailBody message={message} />
          </div>

          <nav
            aria-label="Andere berichten in dit dossier"
            className={cn(
              "shrink-0 border-border border-t bg-card/95 px-section py-3 backdrop-blur-sm",
              "flex flex-wrap items-center justify-between gap-2",
            )}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!newerId}
              aria-label="Nieuwer bericht tonen"
              onClick={() => newerId && navigateToId(newerId)}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 shrink-0" aria-hidden />
              Nieuwer
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!olderId}
              aria-label="Ouder bericht tonen"
              onClick={() => olderId && navigateToId(olderId)}
            >
              Ouder
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 shrink-0" aria-hidden />
            </Button>
          </nav>
        </div>
      ) : (
        <div className="flex flex-1 flex-col px-4 py-3 text-sm text-muted-foreground">
          {messageId
            ? `Geen bericht gevonden (${messageId}).`
            : "Geen bericht geselecteerd."}
        </div>
      )}
    </CoverView>
  );
}
