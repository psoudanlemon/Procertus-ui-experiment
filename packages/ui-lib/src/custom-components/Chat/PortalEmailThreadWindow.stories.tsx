import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { useCallback, useState } from "react";

import type {
  PortalEmailAttachment,
  PortalEmailMessage,
} from "../../components/portal-chat/portal-email-thread-types";
import { PortalEmailThreadWindow } from "./PortalEmailThreadWindow";

const longPortalReplyBody = `
Dag,

Dit is **akkoord** op voorwaarde dat het \`BTW-nummer\` overeenstemt met de KBO-gegevens.

## Controlelijst vóór verzending

- Controleer of alle geüploade documenten nog geldig zijn vóór de technische review.
- Verifieer dat uw contactpersoon nog steeds bevoegd is om het dossier te ondertekenen.
- Stuur bij twijfel een korte e-mail naar het backoffice adres dat u hierboven ziet vermeld.

### Bijlagen en referenties

Tot slot willen we u er nog op wijzen dat verlopen attesten het proces kunnen vertragen — plan daarom uw documentatie ruim tijdig.

Groeten uit het PROCERTUS backoffice-team.
`.trim();

const threadMessages = [
  {
    id: "1",
    placement: "requester",
    authorLabel: "U",
    atIso: "2026-04-28T09:12:00.000Z",
    subject: "Profielwijziging — validatie gevraagd",
    attachments: [
      {
        id: "a1",
        title: "ingevuld_profielsjabloon.pdf",
        formatHint: "PDF",
        href: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/table-word.pdf",
      },
    ],
    body: "Beste,\n\nHierbij de **aangevulde gegevens**. Zien jullie nog iets ontbreekt?\n\nMet vriendelijke groet",
  },
  {
    id: "2",
    placement: "portal",
    authorLabel: "PROCERTUS — backoffice",
    atIso: "2026-04-28T14:05:00.000Z",
    subject: "Re: Profielwijziging — validatie gevraagd",
    body: longPortalReplyBody,
  },
] satisfies PortalEmailMessage[];

/** Shorter transcript when truncation is not relevant. */
const compactThreadMessages = [
  threadMessages[0]!,
  {
    ...threadMessages[1]!,
    body: "Dag,\n\nDit is **akkoord** op voorwaarde dat het `BTW-nummer` overeenstemt met de KBO-gegevens.\n\nGroeten",
  },
] satisfies PortalEmailMessage[];

const meta = {
  title: "Custom Components/Chat/PortalEmailThreadWindow",
  component: PortalEmailThreadWindow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Single-thread dossier correspondence with Markdown bodies (read: react-markdown + GFM; compose: TipTap). Long card bodies clamp with a bottom fade + **Volledig bericht bekijken** when `onOpenMessageDetail` is wired (extranet stacks `conversationMessageDetail`).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PortalEmailThreadWindow>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    messages: compactThreadMessages,
    threadSummary: {
      title: "Profielwijziging",
      subtitle: "Eén thread voor dit dossier",
    },
    composer: {
      readOnly: true,
      placeholder: "Antwoord naar PROCERTUS…",
      "aria-label": "Bericht naar PROCERTUS",
    },
  },
};

export const BodyPreviewAndDetailCta: StoryObj<typeof meta> = {
  args: {
    messages: threadMessages,
    threadSummary: {
      title: "Profielwijziging",
      subtitle: "Lange inhoud: verloop naar leesbare CTA",
    },
    onOpenMessageDetail: fn(),
    composer: {
      readOnly: true,
      placeholder: "Antwoord naar PROCERTUS…",
      "aria-label": "Bericht naar PROCERTUS",
    },
  },
};

export const EditableComposer: StoryObj<typeof meta> = {
  args: {
    messages: compactThreadMessages,
    threadSummary: { title: "Profielwijziging" },
  },
  render: () => {
    const [draft, setDraft] = useState("");
    const [subject, setSubject] = useState("Re: Profielwijziging — validatie gevraagd");
    const [pending, setPending] = useState<PortalEmailAttachment[]>([]);

    const onPickFiles = useCallback((files: readonly File[]) => {
      setPending((prev) => [
        ...prev,
        ...files.map((file, i) => ({
          id: `picked-${Date.now()}-${i}`,
          title: file.name,
          formatHint: file.type || "Bestand",
          href: URL.createObjectURL(file),
        })),
      ]);
    }, []);

    const removePending = useCallback((id: string) => {
      setPending((prev) => {
        const drop = prev.find((p) => p.id === id);
        if (drop?.href.startsWith("blob:")) URL.revokeObjectURL(drop.href);
        return prev.filter((p) => p.id !== id);
      });
    }, []);

    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <PortalEmailThreadWindow
          messages={compactThreadMessages}
          threadSummary={{ title: "Profielwijziging" }}
          scrollAreaClassName="max-h-96"
          composer={{
            readOnly: false,
            value: draft,
            onChange: setDraft,
            subject,
            onSubjectChange: setSubject,
            placeholder: "Typ uw antwoord…",
            toolbar: true,
            pendingAttachments: pending,
            onRemovePendingAttachment: removePending,
            onPickFiles,
            onSubmit: () => {
              const body = draft.trim();
              if (!body && pending.length === 0) return;
              setDraft("");
              for (const a of pending) {
                if (a.href.startsWith("blob:")) URL.revokeObjectURL(a.href);
              }
              setPending([]);
            },
          }}
        />
      </div>
    );
  },
};
