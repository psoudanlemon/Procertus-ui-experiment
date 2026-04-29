import {
  Badge,
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@procertus-ui/ui";
import { Message01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

export type PortalChatConversationDigestItemProps = {
  /** Primary line (e.g. "Conversatie met PROCERTUS"). */
  heading?: string;
  lastMessageBody: string;
  lastMessageAuthorLabel: string;
  /** Pre-formatted time string for the footer (locale is caller’s concern). */
  lastMessageTimeLabel: string;
  /** Shown as a badge until the user activates the row; cleared on activate. */
  initialUnreadCount?: number;
  /** Invoked when the row is activated (click or keyboard); unread is cleared afterward. */
  onOpen: () => void;
  /** Optional override for the default Dutch `aria-label`. */
  "aria-label"?: string;
};

/**
 * Shadcn `Item` digest: last message preview, optional unread badge, full row is one `<button>`.
 * Pair with app data (mocks, routing) via `onOpen` and string props.
 */
export function PortalChatConversationDigestItem({
  heading = "Conversatie met PROCERTUS",
  lastMessageBody,
  lastMessageAuthorLabel,
  lastMessageTimeLabel,
  initialUnreadCount = 0,
  onOpen,
  "aria-label": ariaLabelProp,
}: PortalChatConversationDigestItemProps) {
  const [unread, setUnread] = useState(initialUnreadCount);

  const ariaLabel =
    ariaLabelProp ??
    (unread > 0
      ? `Open volledige conversatie, ${unread} ongelezen berichten`
      : "Open volledige conversatie");

  return (
    <ItemGroup className="w-full min-w-0">
      <Item variant="outline" size="sm" className="min-w-0 w-full" asChild>
        <button
          type="button"
          className="cursor-pointer text-left"
          aria-label={ariaLabel}
          onClick={() => {
            onOpen();
            setUnread(0);
          }}
        >
          <ItemMedia variant="icon" className="text-muted-foreground">
            <HugeiconsIcon icon={Message01Icon} className="size-4" />
          </ItemMedia>
          <ItemContent className="min-w-0">
            <ItemHeader className="min-w-0">
              <ItemTitle className="min-w-0 max-w-full flex-1">{heading}</ItemTitle>
              {unread > 0 ? (
                <Badge variant="default" className="shrink-0 tabular-nums" aria-hidden>
                  {unread}
                </Badge>
              ) : null}
            </ItemHeader>
            <ItemDescription className="line-clamp-2 text-left">{lastMessageBody}</ItemDescription>
            <ItemFooter className="mt-1 text-xs text-muted-foreground">
              <span className="min-w-0 truncate">{lastMessageAuthorLabel}</span>
              <span className="shrink-0 tabular-nums">{lastMessageTimeLabel}</span>
            </ItemFooter>
          </ItemContent>
        </button>
      </Item>
    </ItemGroup>
  );
}
