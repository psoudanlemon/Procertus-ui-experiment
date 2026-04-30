import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { ArrowRight02Icon, AtIcon, SmilePlusIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
  Kbd,
  KbdGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from "@procertus-ui/ui";

import { CHAT_COMPOSER_DEFAULT_EMOJI_PRESETS } from "../../components/portal-chat/chat-default-emoji-presets";

export type ChatComposerToolbarProps = {
  value: string;
  onChange: (value: string) => void;
  /** Called on Cmd/Ctrl+Enter or send button click. */
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  inputClassName?: string;
  /** Omit emoji popover entirely. */
  hideEmojiPicker?: boolean;
  /** Omit the mention (@) button entirely. */
  hideMentionButton?: boolean;
  /** Called when the mention button is pressed. Defaults to inserting "@" into the value. */
  onMention?: () => void;
  /** Quick-pick emojis in the popover (defaults to `CHAT_COMPOSER_DEFAULT_EMOJI_PRESETS`). */
  emojiPresets?: readonly string[];
  /** When true, wraps the row in `<form>` so the send button submits. */
  asForm?: boolean;
  /** Disable send even when `value` is non-empty. */
  sendDisabled?: boolean;
  /** Accessible label for the send control. */
  sendAriaLabel?: string;
  /** Accessible label for the textarea (defaults to `placeholder`). */
  "aria-label"?: string;
};

/**
 * Bottom chat bar: auto-growing textarea wrapped in `InputGroup`, with the emoji
 * popover trigger and send action sitting inside the group as addon buttons.
 *
 * Enter inserts a newline; Cmd/Ctrl+Enter submits.
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
  hideMentionButton = false,
  onMention,
  emojiPresets = CHAT_COMPOSER_DEFAULT_EMOJI_PRESETS,
  asForm = true,
  sendDisabled,
  sendAriaLabel = "Verzenden",
  "aria-label": ariaLabel,
}: ChatComposerToolbarProps) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiQuery, setEmojiQuery] = useState("");
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform));
  }, []);

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

  const submit = () => {
    if (sendBlocked) return;
    onSubmit?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
      return;
    }
    if ((e.key === "e" || e.key === "E") && (e.metaKey || e.ctrlKey)) {
      if (hideEmojiPicker || readOnly || disabled) return;
      e.preventDefault();
      setEmojiOpen((open) => !open);
    }
  };

  const modifierKey = isMac ? "⌘" : "Ctrl";

  const showEmoji = !hideEmojiPicker && !readOnly;
  const showMention = !hideMentionButton && !readOnly;
  const showSend = !readOnly && Boolean(onSubmit);

  const lockRadius =
    "hover:!rounded-[calc(var(--radius)-3px)] aria-expanded:!rounded-[calc(var(--radius)-3px)]";

  const handleMention = () => {
    if (disabled) return;
    if (onMention) {
      onMention();
      return;
    }
    onChange(value.length === 0 || value.endsWith(" ") ? `${value}@` : `${value} @`);
  };

  const group = (
    <InputGroup className={cn("bg-transparent dark:bg-transparent", inputClassName)}>
      <InputGroupTextarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        rows={1}
        aria-label={ariaLabel ?? placeholder}
        className="min-h-9 max-h-28 overflow-y-auto"
      />
      {showEmoji || showMention || showSend ? (
        <InputGroupAddon align="block-end">
          {showEmoji ? (
            <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <InputGroupButton
                        size="icon-xs"
                        variant="ghost"
                        disabled={disabled}
                        aria-label="Emoji invoegen"
                        className={lockRadius}
                      >
                        <HugeiconsIcon icon={SmilePlusIcon} />
                      </InputGroupButton>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <span>Emoji&apos;s</span>
                    <KbdGroup>
                      <Kbd>{modifierKey}</Kbd>
                      <Kbd>E</Kbd>
                    </KbdGroup>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <PopoverContent
                side="top"
                align="end"
                className="w-auto max-w-[min(100vw,280px)] gap-component p-component"
              >
                <Input
                  value={emojiQuery}
                  onChange={(e) => setEmojiQuery(e.target.value)}
                  placeholder="Zoek emoji…"
                  className="h-8 rounded-md text-xs"
                  aria-label="Zoek emoji"
                />
                <div className="max-h-[175px] overflow-y-auto">
                  <div className="grid grid-cols-5 gap-micro">
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
          {showMention ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    size="icon-xs"
                    variant="ghost"
                    disabled={disabled}
                    onClick={handleMention}
                    aria-label="Iemand vermelden"
                    className={lockRadius}
                  >
                    <HugeiconsIcon icon={AtIcon} />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span>Mentions</span>
                  <KbdGroup>
                    <Kbd>/</Kbd>
                  </KbdGroup>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
          {showSend ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    type={asForm ? "submit" : "button"}
                    variant="default"
                    size="icon-xs"
                    disabled={sendBlocked}
                    onClick={asForm ? undefined : submit}
                    aria-label={sendAriaLabel}
                    className={cn("ml-auto", lockRadius)}
                  >
                    <HugeiconsIcon icon={ArrowRight02Icon} />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span>{sendAriaLabel}</span>
                  <KbdGroup>
                    <Kbd>{modifierKey}</Kbd>
                    <Kbd>↵</Kbd>
                  </KbdGroup>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );

  const innerClass = cn("border-t border-border p-section", className);

  if (asForm && onSubmit && !readOnly) {
    return (
      <form
        className={innerClass}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {group}
      </form>
    );
  }

  return <div className={innerClass}>{group}</div>;
}
