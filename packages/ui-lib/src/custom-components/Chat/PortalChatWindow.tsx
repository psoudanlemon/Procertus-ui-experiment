import { AvatarFallback, AvatarImage } from "@procertus-ui/ui";

import { cn } from "@/lib/utils";

import { ChatBubble } from "../../components/portal-chat/chat-bubble";
import { ChatBubbleAvatar } from "../../components/portal-chat/chat-bubble-avatar";
import { ChatBubbleMessage } from "../../components/portal-chat/chat-bubble-message";
import { ChatList } from "../../components/portal-chat/chat-list";
import type {
  PortalChatComposerProps,
  PortalChatComposerToolbarOptions,
  PortalChatMessage,
  PortalChatWindowProps,
} from "../../components/portal-chat/portal-chat-types";
import { ChatComposerToolbar } from "./chat-composer-toolbar";

const defaultFormatTimestamp = (iso: string) =>
  new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

function initialsFrom(authorLabel: string): string {
  const parts = authorLabel.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase();
  }
  return authorLabel.slice(0, 2).toUpperCase() || "?";
}

function placementToVariant(placement: PortalChatMessage["placement"]) {
  return placement === "requester" ? "sent" : "received";
}

function normalizeToolbarOptions(
  toolbar: PortalChatComposerProps["toolbar"],
): PortalChatComposerToolbarOptions {
  if (toolbar == null || toolbar === false || toolbar === true) return {};
  return toolbar;
}

/**
 * Portal transcript built from shadcn-svelte-extras–style primitives:
 * `ChatList`, `ChatBubble`, `ChatBubbleAvatar`, `ChatBubbleMessage`, plus
 * `ChatComposerToolbar` for the footer (read-only or editable).
 */
export function PortalChatWindow({
  messages,
  "aria-label": ariaLabel = "Conversatie",
  className,
  scrollAreaClassName,
  formatTimestamp = defaultFormatTimestamp,
  composer,
  emptyContent,
}: PortalChatWindowProps) {
  const showComposer = composer?.show !== false;
  const readOnly = composer?.readOnly ?? true;
  const toolbarOpts = normalizeToolbarOptions(composer?.toolbar);

  return (
    <div className={cn("flex min-h-0 min-w-0 flex-col gap-3 bg-card text-card-foreground", className)}>
      {messages.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          {emptyContent ?? "Nog geen berichten in dit gesprek."}
        </div>
      ) : (
        <ChatList
          className={cn("max-h-[min(40vh,22rem)]", scrollAreaClassName)}
          role="log"
          aria-live="polite"
          aria-label={ariaLabel}
        >
          {messages.map((m) => (
            <ChatBubble key={m.id} variant={placementToVariant(m.placement)}>
              <ChatBubbleAvatar>
                {m.avatarImageSrc ? (
                  <AvatarImage src={m.avatarImageSrc} alt="" className="object-cover" />
                ) : null}
                <AvatarFallback>{m.avatarFallback ?? initialsFrom(m.authorLabel)}</AvatarFallback>
              </ChatBubbleAvatar>
              <ChatBubbleMessage>
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-[11px] opacity-90">
                  <span className="font-semibold">{m.authorLabel}</span>
                  <span className="tabular-nums">{formatTimestamp(m.atIso)}</span>
                </div>
                <p className="whitespace-pre-wrap leading-snug">{m.body}</p>
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
        </ChatList>
      )}

      {showComposer ? (
        <ChatComposerToolbar
          value={composer?.value ?? ""}
          onChange={(v) => composer?.onChange?.(v)}
          onSubmit={composer?.onSubmit}
          placeholder={composer?.placeholder ?? "Bericht…"}
          aria-label={composer?.["aria-label"]}
          disabled={composer?.disabled}
          readOnly={readOnly}
          hideEmojiPicker={toolbarOpts.hideEmojiPicker}
          emojiPresets={toolbarOpts.emojiPresets}
          asForm={toolbarOpts.asForm}
          sendDisabled={toolbarOpts.sendDisabled}
          sendAriaLabel={toolbarOpts.sendAriaLabel}
          inputClassName={composer?.className}
        />
      ) : null}
    </div>
  );
}
