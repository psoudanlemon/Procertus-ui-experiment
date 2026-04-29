import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Call02Icon, InformationCircleIcon, Video01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage, Button } from "@procertus-ui/ui";

import { ChatBubble } from "./chat-bubble";
import { ChatBubbleAvatar } from "./chat-bubble-avatar";
import { ChatBubbleMessage } from "./chat-bubble-message";
import { ChatComposerToolbar } from "./chat-composer-toolbar";
import { ChatList } from "./chat-list";
import { ChatThreadHeader } from "./chat-thread-header";
import type { PortalChatMessage } from "./portal-chat-types";
import { PortalChatWindow } from "./PortalChatWindow";

const meta = {
  title: "ui-lib/PortalChat full experience",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Fully composed chat: `ChatThreadHeader`, `ChatList` + bubbles + typing row, and `ChatComposerToolbar` (Shadcn Popover + Input + send), aligned with the shadcn-svelte-extras example.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

const friend = {
  name: "John Doe",
  username: "@johndoe",
  img: "https://images.freeimages.com/images/large-previews/fdd/man-avatar-1632964.jpg?fmt=webp&h=350",
};

const user = {
  name: "Jane Doe",
  username: "@janedoe",
  img: "https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("");
}

function formatShortTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

const firstMessageMinutesAgo = 25;
const now = new Date();
const baseTime = new Date(now.getTime() - firstMessageMinutesAgo * 60_000);

const seed: PortalChatMessage[] = [
  {
    id: "1",
    placement: "requester",
    authorLabel: user.name,
    atIso: new Date(baseTime).toISOString(),
    body: "Hey, did you see Svelte 5 just got released?",
    avatarImageSrc: user.img,
    avatarFallback: initials(user.name),
  },
  {
    id: "2",
    placement: "portal",
    authorLabel: friend.name,
    atIso: new Date(baseTime.getTime() + 3 * 60_000).toISOString(),
    body: "Yes! The runes system looks really interesting!",
    avatarImageSrc: friend.img,
    avatarFallback: initials(friend.name),
  },
  {
    id: "3",
    placement: "requester",
    authorLabel: user.name,
    atIso: new Date(baseTime.getTime() + 5 * 60_000).toISOString(),
    body: "Right? Such a big change from the previous reactive system",
    avatarImageSrc: user.img,
    avatarFallback: initials(user.name),
  },
];

export const ComposedThread: StoryObj<typeof meta> = {
  render: function ComposedThreadStory() {
    const [draft, setDraft] = useState("");
    const [rows, setRows] = useState(seed);

    return (
      <div className="mx-auto w-full max-w-lg overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <ChatThreadHeader
          title={friend.name}
          subtitle="Active 2 mins ago"
          avatar={
            <Avatar size="sm">
              <AvatarImage src={friend.img} alt={friend.username} />
              <AvatarFallback>{initials(friend.name)}</AvatarFallback>
            </Avatar>
          }
          actions={
            <>
              <Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="Bellen">
                <HugeiconsIcon icon={Call02Icon} className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="Video">
                <HugeiconsIcon icon={Video01Icon} className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="Info">
                <HugeiconsIcon icon={InformationCircleIcon} className="size-4" />
              </Button>
            </>
          }
        />
        <ChatList className="max-h-[400px]">
          {rows.map((msg) => (
            <ChatBubble key={msg.id} variant={msg.placement === "requester" ? "sent" : "received"}>
              <ChatBubbleAvatar>
                {msg.avatarImageSrc ? <AvatarImage src={msg.avatarImageSrc} alt="" /> : null}
                <AvatarFallback>{msg.avatarFallback ?? "?"}</AvatarFallback>
              </ChatBubbleAvatar>
              <ChatBubbleMessage className="flex flex-col gap-1">
                <p className="text-sm">{msg.body}</p>
                <div
                  className={
                    msg.placement === "requester"
                      ? "w-full text-end text-xs text-muted-foreground"
                      : "w-full text-xs text-muted-foreground"
                  }
                >
                  {formatShortTime(new Date(msg.atIso))}
                </div>
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
          <ChatBubble variant="received">
            <ChatBubbleAvatar>
              <AvatarImage src={friend.img} alt={friend.username} />
              <AvatarFallback>{initials(friend.name)}</AvatarFallback>
            </ChatBubbleAvatar>
            <ChatBubbleMessage typing className="min-h-12 min-w-18" />
          </ChatBubble>
        </ChatList>
        <ChatComposerToolbar
          value={draft}
          onChange={setDraft}
          onSubmit={() => {
            if (!draft.trim()) return;
            setRows((prev) => [
              ...prev,
              {
                id: `local-${Date.now()}`,
                placement: "requester",
                authorLabel: user.name,
                atIso: new Date().toISOString(),
                body: draft.trim(),
                avatarImageSrc: user.img,
                avatarFallback: initials(user.name),
              },
            ]);
            setDraft("");
          }}
          placeholder="Type a message…"
        />
      </div>
    );
  },
};

export const PortalWindowWithToolbar: StoryObj<typeof meta> = {
  render: function PortalWindowToolbarStory() {
    const [draft, setDraft] = useState("");
    const [rows, setRows] = useState(seed.slice(0, 2));

    return (
      <div className="mx-auto w-full max-w-md rounded-lg border border-border p-3">
        <PortalChatWindow
          messages={rows}
          scrollAreaClassName="max-h-64"
          composer={{
            show: true,
            readOnly: false,
            value: draft,
            onChange: setDraft,
            toolbar: true,
            onSubmit: () => {
              if (!draft.trim()) return;
              setRows((prev) => [
                ...prev,
                {
                  id: `w-${Date.now()}`,
                  placement: "requester",
                  authorLabel: user.name,
                  atIso: new Date().toISOString(),
                  body: draft.trim(),
                },
              ]);
              setDraft("");
            },
            placeholder: "Typ een bericht…",
          }}
        />
      </div>
    );
  },
};
