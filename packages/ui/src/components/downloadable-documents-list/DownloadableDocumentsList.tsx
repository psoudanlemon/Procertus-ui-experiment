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
  /**
   * Layout variant.
   * - `"row"` (default): traditional list row — file icon on the left, title/description in the
   *   middle, format-hint and download/delete actions on the right. Reflows to a stacked layout
   *   on small viewports via `Item`'s `responsive` flag.
   * - `"card"`: always-stacked tile — title/description on top, format-hint bottom-left, download
   *   affordance bottom-right. Pairs with `DownloadableDocumentGrid` to form a responsive 1/2/3-column
   *   grid. When no `onDelete` is provided, the entire card becomes the download anchor.
   */
  variant?: "row" | "card";
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
  variant = "row",
}: DownloadableDocumentListItemProps) {
  const linkAriaLabel = downloadAriaLabel ?? `Download ${title}`;
  const deleteLabel = deleteAriaLabel ?? `Delete ${title}`;
  const isCard = variant === "card";
  const isInteractiveCard = isCard && !onDelete;

  const itemClassName = cn(
    "min-w-0",
    isCard ? "bg-card grid grid-cols-[auto_1fr]" : "bg-transparent",
    className,
  );

  const formatHintNode = date || formatHint ? (
    <div
      className={cn(
        "flex flex-col gap-micro text-xs leading-tight text-muted-foreground/90",
        isCard ? "items-start" : "items-start sm:items-end",
      )}
    >
      {formatHint ? <span>{formatHint}</span> : null}
      {date ? <span>{date}</span> : null}
    </div>
  ) : null;

  const fileIconNode = (
    <ItemMedia variant="icon" className="text-muted-foreground" aria-hidden>
      <HugeiconsIcon icon={File01Icon} className="size-5" strokeWidth={1.5} />
    </ItemMedia>
  );

  const titleBlock = (
    <ItemContent className="gap-0">
      <ItemTitle>{title}</ItemTitle>
      {description ? (
        <ItemDescription className={cn(isCard && "line-clamp-1")}>
          {description}
        </ItemDescription>
      ) : null}
    </ItemContent>
  );

  if (isInteractiveCard) {
    return (
      <Item
        asChild
        role="listitem"
        variant="outline"
        size="sm"
        className={itemClassName}
      >
        <a href={href} download rel="noopener noreferrer" aria-label={linkAriaLabel}>
          {fileIconNode}
          {titleBlock}
          <ItemActions className="col-start-2 justify-between">
            {formatHintNode ?? <span aria-hidden />}
            <HugeiconsIcon
              icon={Download01Icon}
              className="size-5 text-muted-foreground"
              strokeWidth={1.5}
              aria-hidden
            />
          </ItemActions>
        </a>
      </Item>
    );
  }

  return (
    <Item
      role="listitem"
      variant="outline"
      size="sm"
      responsive={!isCard}
      className={itemClassName}
    >
      {fileIconNode}
      {titleBlock}
      <ItemActions className={cn("shrink-0", isCard && "col-start-2 justify-between")}>
        {formatHintNode ?? (isCard ? <span aria-hidden /> : null)}
        <div className="flex items-center gap-component">
          {onDelete ? (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={onDelete}
              aria-label={deleteLabel}
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
        </div>
      </ItemActions>
    </Item>
  );
}

export type DownloadableDocumentGridProps = {
  className?: string;
  items: DownloadableDocumentListItemData[];
  /** When provided, each card renders a delete button calling this with the item id */
  onDelete?: (id: string) => void;
};

/**
 * Responsive grid of downloadable-document **card** tiles. Steps explicitly
 * between 1 / 2 / 3 columns based on the grid's own inline size (via the
 * `card-grid` utility's container queries): 1 column under 42rem, 2 columns
 * at 42rem+, 3 columns at 64rem+. Predictable column count per breakpoint —
 * no auto-fill "phantom" empty tracks. The outer `@container` wrapper
 * establishes the query container the utility needs.
 */
export function DownloadableDocumentGrid({
  className,
  items,
  onDelete,
}: DownloadableDocumentGridProps) {
  return (
    <div className="@container w-full">
      <div
        role="list"
        className={cn("card-grid gap-section", className)}
      >
        {items.map((item) => (
          <DownloadableDocumentListItem
            key={item.id}
            variant="card"
            {...item}
            onDelete={onDelete ? () => onDelete(item.id) : undefined}
          />
        ))}
      </div>
    </div>
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
  /** Drop the surrounding Card chrome so the list sits flush in its parent. */
  chromeless?: boolean;
};

export function DownloadableDocumentsList({
  className,
  title,
  description,
  items,
  onDelete,
  emptyContent,
  chromeless,
}: DownloadableDocumentsListProps) {
  const body =
    items.length === 0 ? (
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
    );

  if (chromeless) {
    return (
      <div className={cn("flex flex-col gap-section", className)}>
        <div className="flex flex-col gap-micro">
          <h3 className="text-heading-sm font-semibold leading-tight tracking-tight">{title}</h3>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {body}
      </div>
    );
  }

  return (
    <Card className={cn("gap-section p-section", className)}>
      <CardHeader className="gap-micro px-0 pt-0">
        <CardTitle className="text-heading-sm">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="px-0 pb-0">{body}</CardContent>
    </Card>
  );
}
