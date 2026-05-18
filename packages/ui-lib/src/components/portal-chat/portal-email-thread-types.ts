import type { ReactNode } from "react";

import type { DownloadableItemData } from "@procertus-ui/ui";

import type {
  PortalChatComposerToolbarOptions,
  PortalChatMessagePlacement,
} from "./portal-chat-types";

/** Attachment line in the thread or in the compose area — maps to `DownloadableItem`. */
export type PortalEmailAttachment = DownloadableItemData;

export type PortalEmailMessage = {
  id: string;
  placement: PortalChatMessagePlacement;
  authorLabel: string;
  /** ISO 8601; formatted via `formatTimestamp`. */
  atIso: string;
  /** Markdown source (serialized via `@tiptap/markdown`; read-only render uses react-markdown + GFM). */
  body: string;
  /** Optional subject line — shown like an email subject when set. */
  subject?: string;
  attachments?: readonly PortalEmailAttachment[];
};

export type PortalEmailComposerProps = {
  show?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Current draft as Markdown (`@tiptap/markdown` round-trip string). */
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  "aria-label"?: string;
  onSubmit?: () => void;
  toolbar?: boolean | PortalChatComposerToolbarOptions;
  /**
   * Optional subject for the outbound reply (shown above the body).
   * Omit handlers to hide the field.
   */
  subject?: string;
  onSubjectChange?: (value: string) => void;
  subjectPlaceholder?: string;
  /** When false, no subject row is rendered. Default true when `onSubjectChange` is set. */
  showSubjectField?: boolean;
  /**
   * Staged files for the next message — rendered inline above the TipTap Markdown editor with optional remove.
   */
  pendingAttachments?: readonly PortalEmailAttachment[];
  onRemovePendingAttachment?: (id: string) => void;
  /** Called after the user picks local files — parent typically builds `blob:` URLs. */
  onPickFiles?: (files: readonly File[]) => void;
  pickFilesAccept?: string;
  pickFilesAriaLabel?: string;
};

export type PortalEmailThreadSummary = {
  /** e.g. request / dossier title */
  title?: string;
  subtitle?: string;
};

/** Passed to `PortalEmailThreadWindow` when the user opens full message view (e.g. stacked detail panel). */
export type PortalEmailThreadMessageDetailOpen = {
  readonly message: PortalEmailMessage;
  readonly index: number;
  readonly messages: readonly PortalEmailMessage[];
};

export type PortalEmailThreadWindowProps = {
  messages: readonly PortalEmailMessage[];
  "aria-label"?: string;
  className?: string;
  scrollAreaClassName?: string;
  formatTimestamp?: (iso: string) => string;
  composer?: PortalEmailComposerProps;
  emptyContent?: ReactNode;
  /** Optional banner above the scroll area (conversation context). */
  threadSummary?: PortalEmailThreadSummary;
  /** When set, card bodies clip with a fade and show a CTA to open the full message. */
  onOpenMessageDetail?: (target: PortalEmailThreadMessageDetailOpen) => void;
  /** Max height of the markdown preview in each card (`rem`). Default 12. */
  messageBodyPreviewMaxRem?: number;
};
