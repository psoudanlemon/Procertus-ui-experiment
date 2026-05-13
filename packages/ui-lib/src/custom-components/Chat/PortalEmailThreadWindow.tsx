import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import {
  FileAttachmentIcon,
  FullscreenIcon,
  MinimizeScreenIcon,
  SidebarBottomIcon,
  SidebarTopIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DownloadableItem,
  Input,
  Label,
  cn,
} from "@procertus-ui/ui";

import { ChatList } from "../../components/portal-chat/chat-list";
import type {
  PortalEmailComposerProps,
  PortalEmailMessage,
  PortalEmailThreadWindowProps,
} from "../../components/portal-chat/portal-email-thread-types";
import type { PortalChatComposerToolbarOptions } from "../../components/portal-chat/portal-chat-types";
import { EmailThreadMarkdownBody } from "./email-thread-markdown-body";
import { EmailThreadMarkdownEditor } from "./email-thread-markdown-editor";

const defaultFormatTimestamp = (iso: string) =>
  new Intl.DateTimeFormat("nl-BE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

function normalizeToolbarOptions(
  toolbar: PortalEmailComposerProps["toolbar"],
): PortalChatComposerToolbarOptions {
  if (toolbar == null || toolbar === false || toolbar === true) return {};
  return toolbar;
}

/** Plain preview for the docked compose strip (Markdown → short line). */
function emailDraftPeek(markdown: string, maxChars = 96): string {
  const trimmed = markdown.trim();
  if (!trimmed.length) return "";
  const flat = trimmed
    .replace(/\r?\n+/g, " ")
    .replace(/#{1,6}\s*/g, "")
    .replace(/[*`~]+/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  if (flat.length <= maxChars) return flat;
  return `${flat.slice(0, maxChars - 1)}…`;
}

function EmailThreadComposer({
  readOnly = true,
  disabled,
  value,
  onChange,
  onSubmit,
  placeholder,
  "aria-label": ariaLabel,
  className,
  toolbar,
  subject,
  onSubjectChange,
  subjectPlaceholder = "Onderwerp",
  showSubjectField,
  pendingAttachments = [],
  onRemovePendingAttachment,
  onPickFiles,
  pickFilesAccept,
  pickFilesAriaLabel = "Bestand bijvoegen",
}: PortalEmailComposerProps) {
  const subjectFieldId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolbarOpts = normalizeToolbarOptions(toolbar);
  const effectiveShowSubject = showSubjectField !== false && onSubjectChange != null;

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files;
      if (!list?.length || !onPickFiles) return;
      onPickFiles(Array.from(list));
      e.target.value = "";
    },
    [onPickFiles],
  );

  const sendBlocked =
    Boolean(disabled) ||
    Boolean(readOnly) ||
    toolbarOpts.sendDisabled === true ||
    (value ?? "").trim().length === 0;

  const submit = () => {
    if (sendBlocked) return;
    onSubmit?.();
  };

  const attachLayout = !readOnly && Boolean(onPickFiles);
  const fullscreenComposerAllowed = Boolean(onSubmit) && !readOnly;
  const [composeDialogOpen, setComposeDialogOpen] = useState(false);
  const [composerDocked, setComposerDocked] = useState(false);

  const expandComposer = useCallback(() => {
    setComposerDocked(false);
  }, []);

  const dockComposer = useCallback(() => {
    setComposeDialogOpen(false);
    setComposerDocked(true);
  }, []);

  useEffect(() => {
    if (readOnly) setComposerDocked(false);
  }, [readOnly]);

  const markdownProps = {
    value: value ?? "",
    onChange: (v: string) => onChange?.(v),
    onSubmit: onSubmit && !readOnly ? submit : undefined,
    placeholder: placeholder ?? "Schrijf uw bericht…",
    disabled,
    readOnly,
    "aria-label": ariaLabel,
    sendDisabled: toolbarOpts.sendDisabled,
    sendAriaLabel: toolbarOpts.sendAriaLabel ?? "Verzenden",
    hideSend: !onSubmit,
  };

  const composerActionStrip =
    attachLayout || fullscreenComposerAllowed ? (
      <div className="flex flex-wrap items-center gap-2">
        {attachLayout ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            aria-label={pickFilesAriaLabel}
            className="shrink-0 gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <HugeiconsIcon icon={FileAttachmentIcon} className="size-5" strokeWidth={1.5} />
            Bijlage toevoegen
          </Button>
        ) : null}
        {fullscreenComposerAllowed && !composeDialogOpen ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="shrink-0 gap-2"
            onClick={() => setComposeDialogOpen(true)}
          >
            <HugeiconsIcon icon={FullscreenIcon} className="size-5" strokeWidth={1.5} />
            Groot venster
          </Button>
        ) : null}
        {fullscreenComposerAllowed && composeDialogOpen ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="shrink-0 gap-2"
            onClick={() => setComposeDialogOpen(false)}
          >
            <HugeiconsIcon icon={MinimizeScreenIcon} className="size-5" strokeWidth={1.5} />
            Compacte invoer
          </Button>
        ) : null}
      </div>
    ) : null;

  const inlineMarkdownComposer = !composeDialogOpen ? (
    <EmailThreadMarkdownEditor
      {...markdownProps}
      nestedInForm={attachLayout}
      surface="inline"
      composerBelowSurface={composerActionStrip ?? undefined}
      className={cn(
        "border-0 bg-transparent shadow-none dark:bg-transparent",
        attachLayout ? "!border-t-0 p-0" : "border-t border-border/60 px-section pb-5 pt-4",
      )}
    />
  ) : (
    <div className="flex flex-col gap-component border-border border-t bg-muted/15 px-section py-6">
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
        U bewerkt het concept nu in een volledig scherm dat de hele toepassing bedekt. Met
        onderstaande knop keert u terug naar compacte invoer in dit paneel of sluit met het ✕
        rechtsboven dit venster.
      </p>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-fit shrink-0 gap-2 self-start"
        onClick={() => setComposeDialogOpen(false)}
      >
        <HugeiconsIcon icon={MinimizeScreenIcon} className="size-5" strokeWidth={1.5} aria-hidden />
        Compacte invoer
      </Button>
    </div>
  );

  const subjectInputs = effectiveShowSubject ? (
    <div className="space-y-1.5 border-border border-b px-section py-3">
      <Label htmlFor={subjectFieldId} className="text-xs text-muted-foreground">
        Onderwerp
      </Label>
      <Input
        id={subjectFieldId}
        value={subject ?? ""}
        onChange={(e) => onSubjectChange?.(e.target.value)}
        placeholder={subjectPlaceholder}
        readOnly={readOnly}
        disabled={disabled}
        className="h-9"
      />
    </div>
  ) : null;

  const pendingAttachmentsList =
    pendingAttachments.length > 0 ? (
      <div
        role="list"
        aria-label="Bijlagen voor uw antwoord"
        className="flex flex-col gap-micro border-border border-b px-section py-3"
      >
        {pendingAttachments.map((a) => (
          <DownloadableItem
            key={a.id}
            variant="row"
            {...a}
            onDelete={
              readOnly || !onRemovePendingAttachment
                ? undefined
                : () => onRemovePendingAttachment(a.id)
            }
          />
        ))}
      </div>
    ) : null;

  const hiddenPickField = onPickFiles ? (
    <input
      ref={fileInputRef}
      type="file"
      className="sr-only"
      tabIndex={-1}
      multiple
      accept={pickFilesAccept}
      aria-hidden
      onChange={onFileChange}
    />
  ) : null;

  const fullscreenComposePortal = fullscreenComposerAllowed ? (
    <Dialog open={composeDialogOpen} onOpenChange={setComposeDialogOpen}>
      <DialogContent
        showCloseButton
        className={cn(
          "flex h-full max-h-[80vh] min-h-0 w-full max-w-7xl flex-col gap-0 overflow-hidden rounded-xl bg-popover !p-0 shadow-proc-lg sm:max-w-7xl",
        )}
      >
        <DialogHeader className="shrink-0 border-border border-b px-section py-6 text-left">
          <DialogTitle>Groot composevenster</DialogTitle>
          <DialogDescription>
            Draft blijft hetzelfde als in het zijpaneel — wissel vrij tussen modi.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-component overflow-hidden px-section pb-section pt-component">
          {effectiveShowSubject ? (
            <div className="space-y-1.5">
              <Label htmlFor={`${subjectFieldId}-dialog`} className="text-xs text-muted-foreground">
                Onderwerp
              </Label>
              <Input
                id={`${subjectFieldId}-dialog`}
                value={subject ?? ""}
                onChange={(e) => onSubjectChange?.(e.target.value)}
                placeholder={subjectPlaceholder}
                readOnly={readOnly}
                disabled={disabled}
                className="h-10"
              />
            </div>
          ) : null}
          {pendingAttachments.length > 0 ? (
            <div role="list" aria-label="Bijlagen" className="flex flex-col gap-micro">
              {pendingAttachments.map((a) => (
                <DownloadableItem
                  key={`dialog-${a.id}`}
                  variant="row"
                  {...a}
                  onDelete={
                    readOnly || !onRemovePendingAttachment
                      ? undefined
                      : () => onRemovePendingAttachment(a.id)
                  }
                />
              ))}
            </div>
          ) : null}
          <div className="flex min-h-0 flex-1 flex-col">
            <EmailThreadMarkdownEditor
              {...markdownProps}
              surface="dialog"
              nestedInForm={false}
              composerBelowSurface={composerActionStrip ?? undefined}
              className="flex min-h-0 flex-1 flex-col rounded-xl border border-border/80 bg-card/70"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : null;

  const panelComposeChrome =
    attachLayout && !composeDialogOpen && !composerDocked ? (
      <form
        className="px-section pb-6 pt-1"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {inlineMarkdownComposer}
      </form>
    ) : (
      inlineMarkdownComposer
    );

  const draftStripLabel = emailDraftPeek(value ?? "");
  const dockedPlaceholder = placeholder ?? "Schrijf uw bericht…";
  const showDockControls = !readOnly;

  const dockedComposerStrip =
    composerDocked && showDockControls ? (
      <div className="border-border border-b bg-muted/20 px-section py-0">
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full min-h-11 items-center gap-3 py-2 text-left text-sm transition-colors",
            "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
            disabled && "pointer-events-none opacity-50",
          )}
          aria-expanded={false}
          aria-label="Concept uitklappen"
          onClick={expandComposer}
        >
          <HugeiconsIcon
            icon={SidebarTopIcon}
            className="size-5 shrink-0 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
          <span className="min-w-0 flex-1 truncate text-foreground">
            {draftStripLabel ? (
              draftStripLabel
            ) : (
              <span className="text-muted-foreground">{dockedPlaceholder}</span>
            )}
          </span>
        </button>
      </div>
    ) : null;

  return (
    <div className={cn("relative border-t border-border bg-card", className)}>
      {showDockControls && !composerDocked && !composeDialogOpen ? (
        <div className="pointer-events-none absolute end-2 top-2 z-10 sm:end-3">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="pointer-events-auto size-8 shrink-0 bg-card/95 shadow-sm backdrop-blur-sm"
            disabled={disabled}
            aria-expanded={true}
            aria-label="Composer minimaliseren voor meer gespreksruimte"
            onClick={dockComposer}
          >
            <HugeiconsIcon
              icon={SidebarBottomIcon}
              className="size-4"
              strokeWidth={1.5}
              aria-hidden
            />
          </Button>
        </div>
      ) : null}

      {hiddenPickField}
      {dockedComposerStrip}
      {!composerDocked ? (
        <>
          {subjectInputs}
          {pendingAttachmentsList}
          {panelComposeChrome}
        </>
      ) : null}

      {fullscreenComposePortal}
    </div>
  );
}

function MessageCard({
  m,
  formatTimestamp,
}: {
  m: PortalEmailMessage;
  formatTimestamp: (iso: string) => string;
}) {
  const isRequester = m.placement === "requester";

  return (
    <article
      aria-labelledby={`email-msg-${m.id}-heading`}
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
        isRequester ? "border-l-4 border-l-primary" : "border-l-4 border-l-muted-foreground/35",
      )}
    >
      <div className="border-b border-border/80 px-4 py-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 id={`email-msg-${m.id}-heading`} className="text-sm font-semibold leading-snug">
            {m.authorLabel}
          </h3>
          <time className="text-xs tabular-nums text-muted-foreground" dateTime={m.atIso}>
            {formatTimestamp(m.atIso)}
          </time>
        </div>
        {m.subject ? (
          <p className="mt-1 text-sm font-medium leading-snug text-foreground">{m.subject}</p>
        ) : null}
      </div>

      <div className="px-4 py-3">
        <EmailThreadMarkdownBody markdown={m.body} className="-mx-px" />

        {m.attachments && m.attachments.length > 0 ? (
          <div
            role="list"
            aria-label="Bijlagen"
            className="mt-4 flex flex-col gap-micro border-t border-dashed border-border pt-4"
          >
            {m.attachments.map((a) => (
              <DownloadableItem key={a.id} variant="row" {...a} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

/**
 * Single-thread email-style transcript with Markdown bodies (`EmailThreadMarkdownBody` + `@tiptap/markdown`).
 * Compose flow: taller inline TipTap field, Bijlage + groot-scherm acties onderaan de prose, attachments
 * boven het veld, een vrij te wisselen full-screen-dialog (zelfde draft), en minimaliseren naar één regel
 * onderaan voor meer gespreksruimte.
 */
export function PortalEmailThreadWindow({
  messages,
  "aria-label": ariaLabel = "Berichtendrad",
  className,
  scrollAreaClassName,
  formatTimestamp = defaultFormatTimestamp,
  composer,
  emptyContent,
  threadSummary,
}: PortalEmailThreadWindowProps) {
  const showComposer = composer?.show !== false;

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col gap-3 bg-card text-card-foreground",
        className,
      )}
    >
      {threadSummary?.title || threadSummary?.subtitle ? (
        <header className="shrink-0 border-b border-border px-section pb-3 pt-1">
          {threadSummary.title ? (
            <h2 className="text-base font-semibold leading-tight">{threadSummary.title}</h2>
          ) : null}
          {threadSummary.subtitle ? (
            <p className="mt-1 text-xs text-muted-foreground">{threadSummary.subtitle}</p>
          ) : null}
        </header>
      ) : null}

      {messages.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          {emptyContent ?? "Nog geen berichten in dit gesprek."}
        </div>
      ) : (
        <ChatList
          className={cn("gap-4 pb-2 pt-1", scrollAreaClassName)}
          role="log"
          aria-live="polite"
          aria-label={ariaLabel}
        >
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <MessageCard key={m.id} m={m} formatTimestamp={formatTimestamp} />
            ))}
          </div>
        </ChatList>
      )}

      {showComposer ? (
        <div className="shrink-0">
          <EmailThreadComposer {...(composer ?? {})} readOnly={composer?.readOnly ?? true} />
        </div>
      ) : null}
    </div>
  );
}
