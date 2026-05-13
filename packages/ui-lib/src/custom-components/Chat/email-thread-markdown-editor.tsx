import {
  ArrowRight02Icon,
  Heading02Icon,
  Heading03Icon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  QuotesIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Editor as TiptapEditor } from "@tiptap/core";
import { Link as LinkExt } from "@tiptap/extension-link";
import { Placeholder as PlaceholderExt } from "@tiptap/extension-placeholder";
import { Markdown } from "@tiptap/markdown";
import { EditorContent, useEditor } from "@tiptap/react";
import type { EditorProps } from "@tiptap/pm/view";
import StarterKit from "@tiptap/starter-kit";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";

import {
  cn,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  Kbd,
  KbdGroup,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@procertus-ui/ui";

const baseMarkdownExtensionsWithoutPlaceholder = [
  StarterKit.configure({
    bulletList: { keepMarks: true },
    orderedList: { keepMarks: true },
    codeBlock: false,
    horizontalRule: false,
    heading: { levels: [2, 3] },
  }),
  LinkExt.configure({
    autolink: true,
    openOnClick: false,
    linkOnPaste: true,
    defaultProtocol: "https",
    HTMLAttributes: {
      class: cn("font-medium underline underline-offset-2"),
      rel: "noopener noreferrer nofollow",
      target: "_blank",
    },
  }),
  Markdown.configure({
    markedOptions: { gfm: true, breaks: false },
    indentation: { style: "space", size: 2 },
  }),
];

export type EmailMarkdownEditorSurface = "inline" | "dialog";

export type EmailThreadMarkdownEditorProps = {
  value: string;
  onChange?: (markdown: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** When true and `onSubmit` is set, the send control is type="button" (parent supplies `<form>`). */
  nestedInForm?: boolean;
  "aria-label"?: string;
  className?: string;
  editorClassName?: string;
  /** Panel vs full overlay: controls min/max height of the prose region. */
  surface?: EmailMarkdownEditorSurface;
  /** Slots directly under ProseMirror (e.g. attachments + expand actions). */
  composerBelowSurface?: ReactNode;
  /** Disable send UI even when there is editable content. */
  sendDisabled?: boolean;
  sendAriaLabel?: string;
  /** Hide send control (keyboard submit may still fire if wired). */
  hideSend?: boolean;
};

function isEditorMarkdownEmpty(editor: TiptapEditor): boolean {
  try {
    if (editor.isEmpty) return true;
    return editor.getMarkdown().replace(/\u00a0|\s+/g, "").length === 0;
  } catch {
    return true;
  }
}

export function EmailThreadMarkdownEditor({
  value,
  onChange,
  onSubmit,
  placeholder = "Schrijf uw bericht…",
  disabled = false,
  readOnly = false,
  nestedInForm = false,
  className,
  editorClassName,
  surface = "inline",
  composerBelowSurface,
  "aria-label": ariaLabel = placeholder,
  sendDisabled: sendForcedDisabled,
  sendAriaLabel = "Verzenden",
  hideSend = false,
}: EmailThreadMarkdownEditorProps) {
  const editorApiRef = useRef<TiptapEditor | null>(null);
  const onChangeRef = useRef(onChange);
  const onSubmitRef = useRef(onSubmit);
  const blockedRef = useRef({
    readOnly,
    disabled,
    sendForced: Boolean(sendForcedDisabled),
    hideSend,
  });

  onChangeRef.current = onChange;
  onSubmitRef.current = onSubmit;
  blockedRef.current = {
    readOnly,
    disabled,
    sendForced: Boolean(sendForcedDisabled),
    hideSend,
  };

  const editable = !readOnly && !disabled;

  const modifierKeyLabel = useMemo(() => {
    if (typeof navigator === "undefined") return "Ctrl";
    return /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ? "⌘" : "Ctrl";
  }, []);

  const editorProps: EditorProps = useMemo(
    () => ({
      attributes: {
        class: cn(
          "outline-none",
          surface === "dialog"
            ? cn(
                // At least ~3 lines of body text (`lh`), even when layout would shrink the editor.
                "[&_.ProseMirror]:min-h-[max(3lh,min(52vh,36rem))] [&_.ProseMirror]:max-h-none",
                "[&_.ProseMirror]:flex-1 [&_.ProseMirror]:overflow-y-auto",
              )
            : cn(
                "[&_.ProseMirror]:min-h-[max(3lh,min(46vh,22rem))] [&_.ProseMirror]:max-h-[min(64vh,40rem)]",
                "[&_.ProseMirror]:overflow-y-auto",
              ),
          // Comfortable inset for the editable surface (semantic section token + vertical rhythm).
          "[&_.ProseMirror]:w-full [&_.ProseMirror]:cursor-text [&_.ProseMirror]:px-section [&_.ProseMirror]:py-4",
          "[&_.ProseMirror:focus]:outline-none",
          "[&_.ProseMirror_p]:my-2 [&_.ProseMirror_p:first-child]:mt-0 [&_.ProseMirror_p:last-child]:mb-2",
          // Preflight resets list markers — restore them for TipTap (storage was fine; preview was bare).
          "[&_.ProseMirror_ul]:my-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ps-8 [&_.ProseMirror_ul]:pe-2",
          "[&_.ProseMirror_ol]:my-3 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ps-8 [&_.ProseMirror_ol]:pe-2",
          "[&_.ProseMirror_li]:my-0.5 [&_.ProseMirror_li]:ps-1",
          "[&_.ProseMirror_li>p]:my-1 [&_.ProseMirror_li>p:first-child]:mt-1 [&_.ProseMirror_li>p:last-child]:mb-1",
          "[&_.ProseMirror_blockquote]:my-2 [&_.ProseMirror_h2,&_.ProseMirror_h3]:mt-3 [&_.ProseMirror_h2,&_.ProseMirror_h3]:mb-2",
          "text-sm leading-relaxed text-foreground",
          "data-slot=input-group-control",
          editorClassName,
        ),
        tabindex: "0",
        spellcheck: "true",
        ...(ariaLabel ? { "aria-label": ariaLabel, role: "textbox" } : { role: "textbox" }),
      },
      handleKeyDown(_view, event: KeyboardEvent) {
        const editor = editorApiRef.current;
        if (!editor || editor.isDestroyed) return false;
        const b = blockedRef.current;

        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          if (
            !b.readOnly &&
            !b.disabled &&
            onSubmitRef.current &&
            !b.hideSend &&
            !b.sendForced &&
            !isEditorMarkdownEmpty(editor)
          ) {
            event.preventDefault();
            onSubmitRef.current();
            return true;
          }
        }

        const mod = event.metaKey || event.ctrlKey;
        if (!b.readOnly && !b.disabled && mod && !event.altKey) {
          if (event.key === "b" || event.key === "B") {
            event.preventDefault();
            editor.chain().focus().toggleBold().run();
            return true;
          }
          if (event.key === "i" || event.key === "I") {
            event.preventDefault();
            editor.chain().focus().toggleItalic().run();
            return true;
          }
        }
        return false;
      },
    }),
    [ariaLabel, editorClassName, surface],
  );

  const extensions = useMemo(
    () => [...baseMarkdownExtensionsWithoutPlaceholder, PlaceholderExt.configure({ placeholder })],
    [placeholder],
  );

  const editor = useEditor(
    {
      immediatelyRender: false,
      /** Prototype / Storybook SSR — mount before first paint mismatch. */
      shouldRerenderOnTransaction: true,
      extensions,
      content: value,
      contentType: "markdown",
      editorProps,
      onCreate({ editor: ed }) {
        editorApiRef.current = ed;
      },
      onDestroy() {
        editorApiRef.current = null;
      },
      onUpdate({ editor: ed }) {
        onChangeRef.current?.(ed.getMarkdown());
      },
    },
    [extensions, editorProps],
  );

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const next = value ?? "";
    try {
      const cur = editor.getMarkdown();
      if (cur.trim() !== next.trim()) {
        editor.commands.setContent(next, { contentType: "markdown", emitUpdate: false });
      }
    } catch {
      editor.commands.setContent("", { contentType: "markdown", emitUpdate: false });
    }
  }, [editor, value]);

  const submit = () => {
    const b = blockedRef.current;
    const ed = editorApiRef.current;
    if (
      b.readOnly ||
      b.disabled ||
      !ed ||
      ed.isDestroyed ||
      b.hideSend ||
      b.sendForced ||
      !onSubmitRef.current ||
      isEditorMarkdownEmpty(ed)
    )
      return;
    onSubmitRef.current();
  };

  const showSend = Boolean(onSubmit) && !hideSend && !readOnly;
  /** Avoid native `disabled` on send when draft is empty — InputGroup dims the whole composer via `:has(:disabled)`. */
  const sendHardDisabled =
    !editor ||
    editor.isDestroyed ||
    blockedRef.current.disabled ||
    blockedRef.current.readOnly ||
    blockedRef.current.hideSend ||
    blockedRef.current.sendForced;
  const sendEmpty = Boolean(editor && !editor.isDestroyed && isEditorMarkdownEmpty(editor));
  const sendAriaUnavailable = sendHardDisabled || sendEmpty;

  const toolbarDisabled = disabled || readOnly || !editor;

  const lockRadius =
    "hover:!rounded-[calc(var(--radius)-3px)] aria-expanded:!rounded-[calc(var(--radius)-3px)]";

  const editorSurface = editor ? (
    <div
      className={cn(
        "relative w-full shrink-0",
        surface === "dialog" &&
          "flex min-h-0 flex-1 flex-col [&>div]:min-h-0 [&>div]:flex-1 [&>div]:flex [&>div]:flex-col",
      )}
    >
      <EditorContent
        editor={editor}
        className={cn(
          "w-full",
          surface === "dialog"
            ? "min-h-0 shrink-0 flex-1 flex-col [&_.ProseMirror]:min-h-0"
            : "shrink-0",
        )}
      />
    </div>
  ) : (
    <div
      aria-hidden
      className={cn(
        "w-full shrink-0 animate-pulse rounded-md bg-muted/35 px-3 py-2",
        surface === "dialog" ? "min-h-[min(40vh,22rem)]" : "min-h-[min(46vh,22rem)]",
      )}
    />
  );

  const addons = editor ? (
    <InputGroupAddon
      align="block-end"
      className="flex flex-row flex-wrap items-center gap-micro border-t pb-2"
    >
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <InputGroupButton
                type="button"
                variant={editor.isActive("bold") ? "secondary" : "ghost"}
                size="icon-xs"
                disabled={toolbarDisabled}
                aria-pressed={editor.isActive("bold")}
                aria-label="Vet"
                className={lockRadius}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <HugeiconsIcon
                  icon={TextBoldIcon}
                  className="size-3.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </InputGroupButton>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <span>Vet</span>
            <KbdGroup>
              <Kbd>{modifierKeyLabel}</Kbd>
              <Kbd>B</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <InputGroupButton
                type="button"
                variant={editor.isActive("italic") ? "secondary" : "ghost"}
                size="icon-xs"
                disabled={toolbarDisabled}
                aria-pressed={editor.isActive("italic")}
                aria-label="Cursief"
                className={lockRadius}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <HugeiconsIcon
                  icon={TextItalicIcon}
                  className="size-3.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </InputGroupButton>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <span>Cursief</span>
            <KbdGroup>
              <Kbd>{modifierKeyLabel}</Kbd>
              <Kbd>I</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <InputGroupButton
                type="button"
                variant={editor.isActive("strike") ? "secondary" : "ghost"}
                size="icon-xs"
                disabled={toolbarDisabled}
                aria-pressed={editor.isActive("strike")}
                aria-label="Doorhalen"
                className={lockRadius}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <HugeiconsIcon
                  icon={TextStrikethroughIcon}
                  className="size-3.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </InputGroupButton>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <span>Doorhalen</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden />

      <InputGroupButton
        type="button"
        variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
        size="icon-xs"
        disabled={toolbarDisabled}
        aria-pressed={editor.isActive("heading", { level: 2 })}
        aria-label="Kop niveau 2"
        className={lockRadius}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <HugeiconsIcon icon={Heading02Icon} className="size-3.5" strokeWidth={1.5} aria-hidden />
      </InputGroupButton>

      <InputGroupButton
        type="button"
        variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
        size="icon-xs"
        disabled={toolbarDisabled}
        aria-pressed={editor.isActive("heading", { level: 3 })}
        aria-label="Kop niveau 3"
        className={lockRadius}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <HugeiconsIcon icon={Heading03Icon} className="size-3.5" strokeWidth={1.5} aria-hidden />
      </InputGroupButton>

      <InputGroupButton
        type="button"
        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
        size="icon-xs"
        disabled={toolbarDisabled}
        aria-pressed={editor.isActive("bulletList")}
        aria-label="Lijst met opsommingstekens"
        className={lockRadius}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <HugeiconsIcon
          icon={LeftToRightListBulletIcon}
          className="size-3.5"
          strokeWidth={1.5}
          aria-hidden
        />
      </InputGroupButton>

      <InputGroupButton
        type="button"
        variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
        size="icon-xs"
        disabled={toolbarDisabled}
        aria-pressed={editor.isActive("orderedList")}
        aria-label="Genummerde lijst"
        className={lockRadius}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <HugeiconsIcon
          icon={LeftToRightListNumberIcon}
          className="size-3.5"
          strokeWidth={1.5}
          aria-hidden
        />
      </InputGroupButton>

      <InputGroupButton
        type="button"
        variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
        size="icon-xs"
        disabled={toolbarDisabled}
        aria-pressed={editor.isActive("blockquote")}
        aria-label="Citaat"
        className={lockRadius}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <HugeiconsIcon icon={QuotesIcon} className="size-3.5" strokeWidth={1.5} aria-hidden />
      </InputGroupButton>

      <div className="flex flex-1" />

      {showSend ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(sendHardDisabled && "pointer-events-none")}>
                <InputGroupButton
                  type={nestedInForm ? "button" : "submit"}
                  variant="default"
                  size="icon-xs"
                  aria-label={sendAriaLabel}
                  disabled={sendHardDisabled}
                  aria-disabled={sendAriaUnavailable}
                  className={cn("ml-auto", lockRadius)}
                  onClick={nestedInForm ? submit : undefined}
                >
                  <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" aria-hidden />
                </InputGroupButton>
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>{sendAriaLabel}</span>
              <KbdGroup>
                <Kbd>{modifierKeyLabel}</Kbd>
                <Kbd>↵</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </InputGroupAddon>
  ) : null;

  const core = (
    <InputGroup
      className={cn(
        "p-4 h-auto min-h-0 w-full min-w-0 flex-col items-stretch bg-transparent dark:bg-transparent",
        surface === "dialog" && "min-h-0 flex-1",
        className,
      )}
    >
      {editorSurface}
      {composerBelowSurface ? (
        <div
          className="w-full shrink-0 border-border border-t bg-card/70 px-section py-2"
          data-slot="email-composer-below-surface"
        >
          {composerBelowSurface}
        </div>
      ) : null}
      {addons}
    </InputGroup>
  );

  if (nestedInForm || !showSend) {
    return core;
  }

  return (
    <form
      className={cn("w-full min-w-0", surface === "dialog" && "flex min-h-0 flex-1 flex-col")}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {core}
    </form>
  );
}
