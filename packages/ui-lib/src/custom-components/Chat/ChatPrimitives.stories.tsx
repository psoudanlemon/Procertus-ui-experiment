import type { Meta, StoryObj } from "@storybook/react-vite";

import { AvatarFallback, AvatarImage } from "@procertus-ui/ui";

import { ChatBubble } from "../../components/portal-chat/chat-bubble";
import { ChatBubbleAvatar } from "../../components/portal-chat/chat-bubble-avatar";
import { ChatBubbleMessage } from "../../components/portal-chat/chat-bubble-message";
import { ChatList } from "../../components/portal-chat/chat-list";
import { ChatLoadingDots } from "../../components/portal-chat/chat-loading-dots";

const meta = {
  title: "Custom Components/Chat/Chat (primitives)",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Low-level chat building blocks ported from shadcn-svelte-extras (`chat-bubble`, `chat-list`, `loading-dots`, etc.). Compose with `PortalChatWindow` or custom layouts.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const LoadingDots: StoryObj<typeof meta> = {
  render: () => (
    <div className="rounded-md border border-border p-6">
      <ChatLoadingDots />
    </div>
  ),
};

export const BubbleReceived: StoryObj<typeof meta> = {
  render: () => (
    <ChatBubble variant="received">
      <ChatBubbleAvatar>
        <AvatarFallback>P</AvatarFallback>
      </ChatBubbleAvatar>
      <ChatBubbleMessage>
        <p className="text-sm">Bericht aan de rechterkant van de thread (ontvangen).</p>
      </ChatBubbleMessage>
    </ChatBubble>
  ),
};

export const BubbleSent: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex flex-col items-end">
      <ChatBubble variant="sent">
        <ChatBubbleAvatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="" />
          <AvatarFallback>U</AvatarFallback>
        </ChatBubbleAvatar>
        <ChatBubbleMessage>
          <p className="text-sm">Bericht naar links uitgelijnd in de bubbel (verzonden).</p>
        </ChatBubbleMessage>
      </ChatBubble>
    </div>
  ),
};

export const TypingBubble: StoryObj<typeof meta> = {
  render: () => (
    <ChatBubble variant="received">
      <ChatBubbleAvatar>
        <AvatarFallback>…</AvatarFallback>
      </ChatBubbleAvatar>
      <ChatBubbleMessage typing />
    </ChatBubble>
  ),
};

export const ListWithScrollButton: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex h-72 max-w-md flex-col rounded-lg border border-border bg-card">
      <ChatList>
        {Array.from({ length: 14 }, (_, i) => (
          <ChatBubble key={i} variant={i % 2 === 0 ? "received" : "sent"}>
            <ChatBubbleAvatar>
              <AvatarFallback>{i % 2 === 0 ? "P" : "U"}</AvatarFallback>
            </ChatBubbleAvatar>
            <ChatBubbleMessage>
              <p className="text-sm">Regel {i + 1}, scroll omhoog om de “naar beneden”-knop te zien.</p>
            </ChatBubbleMessage>
          </ChatBubble>
        ))}
        <ChatBubble variant="received">
          <ChatBubbleAvatar>
            <AvatarFallback>…</AvatarFallback>
          </ChatBubbleAvatar>
          <ChatBubbleMessage typing />
        </ChatBubble>
      </ChatList>
    </div>
  ),
};
