import { AvatarFallback, AvatarImage, Input, Separator } from "@procertus-ui/ui";

import { cn } from "@/lib/utils";

import { ChatBubble } from "./chat-bubble";
import { ChatBubbleAvatar } from "./chat-bubble-avatar";
import { ChatBubbleMessage } from "./chat-bubble-message";
import { ChatComposerToolbar } from "./chat-composer-toolbar";
import { ChatList } from "./chat-list";
import type {
  PortalChatComposerProps,
  PortalChatComposerToolbarOptions,
  PortalChatMessage,
  PortalChatWindowProps,
} from "./portal-chat-types";

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
): PortalChatComposerToolbarOptions | null {
  if (toolbar == null || toolbar === false) return null;
  if (toolbar === true) return {};
  return toolbar;
}

/**
 * Portal transcript built from shadcn-svelte-extras–style primitives:
 * `ChatList`, `ChatBubble`, `ChatBubbleAvatar`, `ChatBubbleMessage`, plus composer
 * (plain `Input` or `ChatComposerToolbar` when `composer.toolbar` is set).
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
  const toolbarOpts = composer ? normalizeToolbarOptions(composer.toolbar) : null;
  const useToolbar = Boolean(toolbarOpts) && !readOnly && Boolean(composer?.onChange);

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
        <>
          {!useToolbar && messages.length > 0 ? <Separator className="my-0.5" /> : null}
          {useToolbar && composer ? (
            <ChatComposerToolbar
              value={composer.value ?? ""}
              onChange={(v) => composer.onChange?.(v)}
              onSubmit={composer.onSubmit}
              placeholder={composer.placeholder ?? "Bericht…"}
              disabled={composer.disabled}
              readOnly={readOnly}
              hideEmojiPicker={toolbarOpts?.hideEmojiPicker}
              emojiPresets={toolbarOpts?.emojiPresets}
              asForm={toolbarOpts?.asForm}
              sendDisabled={toolbarOpts?.sendDisabled}
              sendAriaLabel={toolbarOpts?.sendAriaLabel}
              inputClassName={composer.className}
            />
          ) : (
            <div className="min-w-0">
              <Input
                readOnly={readOnly}
                tabIndex={readOnly ? -1 : undefined}
                placeholder={composer?.placeholder ?? "Bericht…"}
                className={cn("bg-background", composer?.className)}
                aria-label={composer?.["aria-label"] ?? composer?.placeholder ?? "Bericht"}
                value={composer?.value}
                onChange={
                  composer?.onChange
                    ? (ev) => {
                        composer.onChange?.(ev.target.value);
                      }
                    : undefined
                }
                disabled={composer?.disabled}
              />
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
