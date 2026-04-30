import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ChatComposerToolbar } from "./chat-composer-toolbar";

const meta = {
  title: "Custom Components/Chat/ChatComposerToolbar",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Bottom compose row: auto-growing `InputGroupTextarea` with the emoji popover and send button as inline addons. Enter inserts a newline, Cmd/Ctrl+Enter submits. Use inside `PortalChatWindow` via `composer.toolbar` or compose manually.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: function ChatComposerToolbarDefault() {
    const [value, setValue] = useState("");
    const [lastSent, setLastSent] = useState<string | null>(null);

    return (
      <div className="mx-auto w-full max-w-md space-y-3">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <ChatComposerToolbar
            value={value}
            onChange={setValue}
            onSubmit={() => {
              setLastSent(value.trim());
              setValue("");
            }}
            placeholder="Type a message…"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {lastSent != null ? (
            <>
              Last sent: <span className="font-mono text-foreground">{lastSent}</span>
            </>
          ) : (
            "Submit clears the field; last payload is shown here."
          )}
        </p>
      </div>
    );
  },
};

export const WithoutEmojiPicker: StoryObj<typeof meta> = {
  render: function WithoutEmoji() {
    const [value, setValue] = useState("");

    return (
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <ChatComposerToolbar
          value={value}
          onChange={setValue}
          onSubmit={() => setValue("")}
          hideEmojiPicker
          placeholder="No emoji button…"
        />
      </div>
    );
  },
};

export const CustomEmojiPresets: StoryObj<typeof meta> = {
  render: function CustomPresets() {
    const [value, setValue] = useState("");

    return (
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <ChatComposerToolbar
          value={value}
          onChange={setValue}
          onSubmit={() => setValue("")}
          emojiPresets={["👍", "👎", "✅", "❌", "🎉", "🔥"]}
          placeholder="Quick reactions…"
        />
      </div>
    );
  },
};

export const SendDisabled: StoryObj<typeof meta> = {
  render: function SendDisabledStory() {
    const [value, setValue] = useState("Hello");

    return (
      <div className="mx-auto w-full max-w-md space-y-2">
        <p className="text-xs text-muted-foreground">Send stays disabled even with text (`sendDisabled`).</p>
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <ChatComposerToolbar
            value={value}
            onChange={setValue}
            onSubmit={() => setValue("")}
            sendDisabled
            placeholder="Cannot send…"
          />
        </div>
      </div>
    );
  },
};

export const Disabled: StoryObj<typeof meta> = {
  render: function DisabledStory() {
    const [value, setValue] = useState("Cannot edit or send.");

    return (
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border border-border bg-card opacity-90 shadow-sm">
        <ChatComposerToolbar
          value={value}
          onChange={setValue}
          onSubmit={() => {}}
          disabled
          placeholder="Composer disabled…"
        />
      </div>
    );
  },
};

export const ReadOnly: StoryObj<typeof meta> = {
  render: function ReadOnlyStory() {
    const [value] = useState("Read-only preview text.");

    return (
      <div className="mx-auto w-full max-w-md space-y-2">
        <p className="text-xs text-muted-foreground">No send button; emoji popover hidden when `readOnly`.</p>
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <ChatComposerToolbar value={value} onChange={() => {}} readOnly placeholder="Preview…" />
        </div>
      </div>
    );
  },
};

export const NotWrappedInForm: StoryObj<typeof meta> = {
  render: function NoFormWrapper() {
    const [value, setValue] = useState("");

    return (
      <div className="mx-auto w-full max-w-md space-y-2">
        <p className="text-xs text-muted-foreground">
          Set <code className="rounded bg-muted px-1">asForm</code> to false when a parent already wraps the row in
          a form element, to avoid invalid nested forms.
        </p>
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <ChatComposerToolbar
            value={value}
            onChange={setValue}
            onSubmit={() => setValue("")}
            asForm={false}
            placeholder="Outer form would handle submit…"
          />
        </div>
      </div>
    );
  },
};
