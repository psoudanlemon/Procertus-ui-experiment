import { useMemo, useState } from "react";
import { MailSend01Icon, SmilePlusIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@procertus-ui/ui";

import { CHAT_COMPOSER_DEFAULT_EMOJI_PRESETS } from "./chat-default-emoji-presets";

export type ChatComposerToolbarProps = {
  value: string;
  onChange: (value: string) => void;
  /** Called on send button click or form submit (Enter). */
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  inputClassName?: string;
  /** Omit emoji popover entirely. */
  hideEmojiPicker?: boolean;
  /** Quick-pick emojis in the popover (defaults to `CHAT_COMPOSER_DEFAULT_EMOJI_PRESETS`). */
  emojiPresets?: readonly string[];
  /** When true, wraps the row in `<form>` so Enter submits. */
  asForm?: boolean;
  /** Disable send even when `value` is non-empty. */
  sendDisabled?: boolean;
  /** Accessible label for the send control. */
  sendAriaLabel?: string;
};

/**
 * Bottom chat bar: emoji popover (Shadcn `Popover` + quick picks) + rounded `Input` + send `Button`,
 * mirroring the shadcn-svelte-extras compose row (emoji-picker + input + send).
 */
export function ChatComposerToolbar({
  value,
  onChange,
  onSubmit,
  placeholder = "Typ een bericht…",
  disabled = false,
  readOnly = false,
  className,
  inputClassName,
  hideEmojiPicker = false,
  emojiPresets = CHAT_COMPOSER_DEFAULT_EMOJI_PRESETS,
  asForm = true,
  sendDisabled,
  sendAriaLabel = "Verzenden",
}: ChatComposerToolbarProps) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiQuery, setEmojiQuery] = useState("");

  const filteredPresets = useMemo(() => {
    const q = emojiQuery.trim().toLowerCase();
    if (!q) return [...emojiPresets];
    return emojiPresets.filter((e) => e.toLowerCase().includes(q));
  }, [emojiPresets, emojiQuery]);

  const appendEmoji = (emoji: string) => {
    onChange(value + emoji);
    setEmojiOpen(false);
    setEmojiQuery("");
  };

  const sendBlocked =
    disabled || readOnly || sendDisabled === true || value.trim().length === 0;

  const row = (
    <>
      {!hideEmojiPicker && !readOnly ? (
        <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 rounded-full"
              disabled={disabled}
              aria-label="Emoji invoegen"
            >
              <HugeiconsIcon icon={SmilePlusIcon} className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-auto max-w-[min(100vw,280px)] gap-2 p-2">
            <Input
              value={emojiQuery}
              onChange={(e) => setEmojiQuery(e.target.value)}
              placeholder="Zoek emoji…"
              className="h-8 rounded-md text-xs"
              aria-label="Zoek emoji"
            />
            <div className="max-h-[175px] overflow-y-auto">
              <div className="grid grid-cols-5 gap-1">
                {filteredPresets.map((em, i) => (
                  <button
                    key={`${em}-${i}`}
                    type="button"
                    className="flex size-9 items-center justify-center rounded-md text-lg hover:bg-muted"
                    onClick={() => appendEmoji(em)}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : null}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        className={cn("min-w-0 flex-1 rounded-full bg-background", inputClassName)}
        aria-label={placeholder}
      />
      {!readOnly && onSubmit ? (
        <Button
          type="submit"
          variant="default"
          size="icon"
          className="shrink-0 rounded-full"
          disabled={sendBlocked}
          aria-label={sendAriaLabel}
        >
          <HugeiconsIcon icon={MailSend01Icon} className="size-4" />
        </Button>
      ) : null}
    </>
  );

  const innerClass = cn("flex place-items-center gap-2 p-2", className);

  if (asForm && onSubmit && !readOnly) {
    return (
      <form
        className={innerClass}
        onSubmit={(e) => {
          e.preventDefault();
          if (!sendBlocked) onSubmit();
        }}
      >
        {row}
      </form>
    );
  }

  return <div className={innerClass}>{row}</div>;
}
