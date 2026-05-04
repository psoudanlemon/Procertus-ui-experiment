/**
 * Presentational list of downloadable documents (rulesets, guides, PDFs). No fetching —
 * pass `items` from the parent or a hook.
 */
import { Delete02Icon, Download01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export type DownloadableDocumentListItemData = {
  id: string;
  title: string;
  description?: string;
  /** Date line, e.g. "15/09/2025" */
  date?: string;
  /** Format/size line, e.g. "PDF · 1.2 MB" or "39.2 MB" */
  formatHint?: string;
  href: string;
};

export type DownloadableDocumentListItemProps = DownloadableDocumentListItemData & {
  className?: string;
  /** Accessible name for the row link; defaults to `Download ${title}` */
  downloadAriaLabel?: string;
  /** When provided, renders a delete button on the right of the row */
  onDelete?: () => void;
  /** Accessible name for the delete button; defaults to `Delete ${title}` */
  deleteAriaLabel?: string;
};

export function DownloadableDocumentListItem({
  className,
  title,
  description,
  date,
  formatHint,
  href,
  downloadAriaLabel,
  onDelete,
  deleteAriaLabel,
}: DownloadableDocumentListItemProps) {
  const linkAriaLabel = downloadAriaLabel ?? `Download ${title}`;
  const deleteLabel = deleteAriaLabel ?? `Delete ${title}`;
  return (
    <Item
      role="listitem"
      variant="outline"
      size="sm"
      responsive
      className={cn("min-w-0 bg-transparent", className)}
    >
      <ItemMedia variant="icon" className="text-muted-foreground" aria-hidden>
        <HugeiconsIcon icon={File01Icon} className="size-5" strokeWidth={1.5} />
      </ItemMedia>
      <ItemContent className="gap-0">
        <ItemTitle>{title}</ItemTitle>
        {description ? <ItemDescription>{description}</ItemDescription> : null}
      </ItemContent>
      <ItemActions className="shrink-0">
        {date || formatHint ? (
          <div className="flex flex-col items-start gap-micro text-xs leading-tight text-muted-foreground/90 sm:items-end">
            {formatHint ? <span>{formatHint}</span> : null}
            {date ? <span>{date}</span> : null}
          </div>
        ) : null}
        {onDelete ? (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onDelete}
            aria-label={deleteLabel}
            className="ms-micro"
          >
            <HugeiconsIcon icon={Delete02Icon} className="size-5" strokeWidth={1.5} />
          </Button>
        ) : null}
        <Button
          asChild
          variant="ghost"
          size="icon"
          aria-label={linkAriaLabel}
          className="text-muted-foreground hover:text-foreground"
        >
          <a href={href} download rel="noopener noreferrer">
            <HugeiconsIcon icon={Download01Icon} className="size-5" strokeWidth={1.5} />
          </a>
        </Button>
      </ItemActions>
    </Item>
  );
}

export type DownloadableDocumentsListProps = {
  className?: string;
  title: string;
  description?: ReactNode;
  items: DownloadableDocumentListItemData[];
  /** When provided, each row renders a delete button calling this with the item id */
  onDelete?: (id: string) => void;
  /** Shown when `items` is empty */
  emptyContent?: ReactNode;
};

export function DownloadableDocumentsList({
  className,
  title,
  description,
  items,
  onDelete,
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
          <ItemGroup className="w-full">
            {items.map((item) => (
              <DownloadableDocumentListItem
                key={item.id}
                {...item}
                onDelete={onDelete ? () => onDelete(item.id) : undefined}
              />
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}
