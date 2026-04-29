import type { ReactNode } from "react";

/** Who sent the line: extranet user vs PROCERTUS staff (drives bubble alignment and style). */
export type PortalChatMessagePlacement = "requester" | "portal";

export type PortalChatMessage = {
  id: string;
  placement: PortalChatMessagePlacement;
  authorLabel: string;
  /** ISO 8601 timestamp; formatted via `formatTimestamp` or default locale formatter. */
  atIso: string;
  body: string;
  /** Optional avatar image inside `ChatBubbleAvatar`. */
  avatarImageSrc?: string;
  /** Optional text in `AvatarFallback` (defaults to initials from `authorLabel`). */
  avatarFallback?: string;
};

export type PortalChatComposerToolbarOptions = {
  hideEmojiPicker?: boolean;
  emojiPresets?: readonly string[];
  /** Wrap row in `<form>` for Enter-to-send. Default true. */
  asForm?: boolean;
  sendDisabled?: boolean;
  sendAriaLabel?: string;
};

export type PortalChatComposerProps = {
  /** When false, no composer row is rendered. Default true. */
  show?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  /** Called when the user sends. */
  onSubmit?: () => void;
  /**
   * Optional `ChatComposerToolbar` overrides (emoji presets, send label, …).
   * The toolbar is always rendered; pass `false`/omit to use defaults.
   */
  toolbar?: boolean | PortalChatComposerToolbarOptions;
};

export type PortalChatWindowProps = {
  messages: readonly PortalChatMessage[];
  /** Screen reader label for the message list region. */
  "aria-label"?: string;
  className?: string;
  /** Applied to the scroll container around messages (height / max-height). */
  scrollAreaClassName?: string;
  formatTimestamp?: (iso: string) => string;
  /** Optional footer (read-only preview input, textarea, or nothing). */
  composer?: PortalChatComposerProps;
  /** Shown when `messages` is empty instead of the scroll list. */
  emptyContent?: ReactNode;
};
