import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import type { PortalChatMessage } from "./portal-chat-types";
import { PortalChatWindow } from "./PortalChatWindow";

const sampleMessages = [
  {
    id: "1",
    placement: "requester",
    authorLabel: "U",
    atIso: "2026-04-28T09:12:00.000Z",
    body: "Hierbij de aangevulde gegevens. Kunnen jullie dit valideren wanneer mogelijk?",
  },
  {
    id: "2",
    placement: "portal",
    authorLabel: "PROCERTUS",
    atIso: "2026-04-28T11:40:00.000Z",
    body: "Ontvangen. We nemen uw dossier in behandeling en sturen een update zodra er een beslissing is.",
  },
  {
    id: "3",
    placement: "portal",
    authorLabel: "PROCERTUS — backoffice",
    atIso: "2026-04-28T14:05:00.000Z",
    body: "Controleer of alle bijlagen leesbaar zijn vóór de technische review.",
  },
] satisfies PortalChatMessage[];

const meta = {
  title: "ui-lib/PortalChatWindow",
  component: PortalChatWindow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Portal transcript using ported chat primitives (`ChatList`, `ChatBubble`, `ChatBubbleAvatar`, `ChatBubbleMessage`, `ChatLoadingDots`) plus composer.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PortalChatWindow>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    messages: sampleMessages,
    "aria-label": "Conversatie met PROCERTUS",
    composer: {
      readOnly: true,
      placeholder: "Bericht aan PROCERTUS…",
      "aria-label": "Bericht aan PROCERTUS",
    },
  },
};

export const TallScroll: StoryObj<typeof meta> = {
  args: {
    messages: Array.from({ length: 12 }, (_, i) => ({
      id: `m-${i}`,
      placement: (i % 2 === 0 ? "requester" : "portal") as PortalChatMessage["placement"],
      authorLabel: i % 2 === 0 ? "U" : "PROCERTUS",
      atIso: new Date(Date.UTC(2026, 3, 28, 8 + i, 0)).toISOString(),
      body: `Bericht ${i + 1}: dit is extra tekst om scrollgedrag in Storybook te kunnen beoordelen.`,
    })),
    scrollAreaClassName: "max-h-48",
    composer: {
      readOnly: true,
      placeholder: "Typ een antwoord…",
    },
  },
};

export const Empty: StoryObj<typeof meta> = {
  args: {
    messages: [],
    emptyContent: "Nog geen uitwisseling voor dit dossier.",
    composer: { show: false },
  },
};

export const EditableComposer: StoryObj<typeof meta> = {
  args: {
    messages: sampleMessages,
  },
  render: (args) => {
    const [draft, setDraft] = useState("");
    return (
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border border-border bg-card">
        <PortalChatWindow
          {...args}
          scrollAreaClassName="max-h-64"
          composer={{
            readOnly: false,
            placeholder: "Schrijf een bericht…",
            value: draft,
            onChange: setDraft,
            "aria-label": "Nieuw bericht",
            onSubmit: () => setDraft(""),
          }}
        />
      </div>
    );
  },
};
