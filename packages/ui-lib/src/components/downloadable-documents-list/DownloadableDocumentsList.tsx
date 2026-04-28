/**
 * Presentational list of downloadable documents (rulesets, guides, PDFs). No fetching —
 * pass `items` from the parent or a hook.
 */
import { File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@procertus-ui/ui";

export type DownloadableDocumentListItemData = {
  id: string;
  title: string;
  description?: string;
  /** Shown next to the action, e.g. "PDF · 1.2 MB" */
  formatHint?: string;
  href: string;
};

export type DownloadableDocumentListItemProps = DownloadableDocumentListItemData & {
  className?: string;
  /** Accessible name for the download control; defaults to `Download ${title}` */
  downloadAriaLabel?: string;
};

export function DownloadableDocumentListItem({
  className,
  title,
  description,
  formatHint,
  href,
  downloadAriaLabel,
}: DownloadableDocumentListItemProps) {
  const aria = downloadAriaLabel ?? `Download ${title}`;
  return (
    <li
      className={cn(
        "flex flex-col gap-3 border-b border-border/60 py-component last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 gap-3">
        <span className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden>
          <HugeiconsIcon icon={File01Icon} className="size-5" strokeWidth={1.5} />
        </span>
        <div className="min-w-0 space-y-micro">
          <p className="font-medium leading-snug text-foreground">{title}</p>
          {description ? (
            <p className="text-sm leading-normal text-muted-foreground">{description}</p>
          ) : null}
          {formatHint ? (
            <p className="text-xs text-muted-foreground/90">{formatHint}</p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 sm:pt-0.5">
        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
          <a href={href} download rel="noopener noreferrer" aria-label={aria}>
            Download
          </a>
        </Button>
      </div>
    </li>
  );
}

export type DownloadableDocumentsListProps = {
  className?: string;
  title: string;
  description?: ReactNode;
  items: DownloadableDocumentListItemData[];
  /** Shown when `items` is empty */
  emptyContent?: ReactNode;
};

export function DownloadableDocumentsList({
  className,
  title,
  description,
  items,
  emptyContent,
}: DownloadableDocumentsListProps) {
  return (
    <Card className={cn("gap-section p-section", className)}>
      <CardHeader className="gap-micro px-0 pt-0">
        <CardTitle className="text-heading-sm">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {items.length === 0 ? (
          emptyContent ?? (
            <p className="text-sm text-muted-foreground">Geen documenten om weer te geven.</p>
          )
        ) : (
          <ul className="m-0 list-none p-0">
            {items.map((item) => (
              <DownloadableDocumentListItem key={item.id} {...item} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
