import { DownloadableItem, cn } from "@procertus-ui/ui";

import type { PortalEmailMessage } from "../../components/portal-chat/portal-email-thread-types";

import { EmailThreadMarkdownBody } from "./email-thread-markdown-body";

const defaultDetailTimestamp = (iso: string) =>
  new Intl.DateTimeFormat("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export type PortalEmailMessageDetailBodyProps = {
  message: PortalEmailMessage;
  formatTimestamp?: (iso: string) => string;
  className?: string;
};

/**
 * Minimal full-message transcript: sender, time, subject, complete markdown body, and attachments.
 */
export function PortalEmailMessageDetailBody({
  message,
  formatTimestamp = defaultDetailTimestamp,
  className,
}: PortalEmailMessageDetailBodyProps) {
  return (
    <div className={cn("space-y-8 text-card-foreground", className)}>
      <div className="space-y-1">
        <p className="text-lg font-semibold leading-snug text-foreground">{message.authorLabel}</p>
        <time className="block text-sm tabular-nums text-muted-foreground" dateTime={message.atIso}>
          {formatTimestamp(message.atIso)}
        </time>
        {message.subject ? (
          <p className="pt-3 text-base font-medium leading-snug text-foreground">{message.subject}</p>
        ) : null}
      </div>

      <EmailThreadMarkdownBody markdown={message.body} className="email-thread-markdown text-base leading-relaxed" />

      {message.attachments && message.attachments.length > 0 ? (
        <div className="space-y-micro border-border border-t border-dashed pt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Bijlagen</p>
          <div role="list" className="flex flex-col gap-micro">
            {message.attachments.map((a) => (
              <DownloadableItem key={a.id} variant="row" {...a} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
