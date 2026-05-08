/**
 * Presentational primitive for a downloadable document (rulesets, guides, PDFs)
 * with two layout variants and matching layout helpers. No fetching — pass `items`
 * from the parent or a hook.
 *
 * - `DownloadableItem` — the primitive. `variant="row"` (default) renders a
 *   responsive list row; `variant="card"` renders a stacked tile that pairs with
 *   `DownloadableItemGrid`.
 * - `DownloadableItemList` — vertical list of row-variant items inside an
 *   `ItemGroup`.
 * - `DownloadableItemGrid` — responsive 1/2/3-column grid of card-variant tiles
 *   via the `card-grid` utility's container queries.
 *
 * No surrounding card chrome / title / description — the consumer owns the
 * section header (e.g. via `DetailCardSection`).
 */
import { Delete02Icon, Download01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export type DownloadableItemData = {
  id: string;
  title: string;
  description?: string;
  /** Date line, e.g. "15/09/2025" */
  date?: string;
  /** Format/size line, e.g. "PDF · 1.2 MB" or "39.2 MB" */
  formatHint?: string;
  href: string;
};

export type DownloadableItemProps = DownloadableItemData & {
  className?: string;
  /**
   * Layout variant.
   * - `"row"` (default): traditional list row — file icon on the left, title/description in the
   *   middle, format-hint and download/delete actions on the right. Reflows to a stacked layout
   *   on small viewports via `Item`'s `responsive` flag.
   * - `"card"`: always-stacked tile — title/description on top, format-hint bottom-left, download
   *   affordance bottom-right. Pairs with `DownloadableItemGrid` to form a responsive 1/2/3-column
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

export function DownloadableItem({
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
}: DownloadableItemProps) {
  const linkAriaLabel = downloadAriaLabel ?? `Download ${title}`;
  const deleteLabel = deleteAriaLabel ?? `Delete ${title}`;
  const isCard = variant === "card";
  const isInteractiveCard = isCard && !onDelete;
  const isCardWithDelete = isCard && Boolean(onDelete);

  const itemClassName = cn(
    "min-w-0",
    isCard
      ? "grid grid-cols-[auto_1fr] bg-card text-card-foreground"
      : "bg-transparent",
    isInteractiveCard && "[&:is(a):hover,&:has(a:hover)]:bg-card",
    isCardWithDelete &&
      "[&:is(a):hover,&:has(a:hover)]:bg-card [&:is(a):hover,&:has(a:hover)]:border-border [&:is(a):hover,&:has(a:hover)]:text-card-foreground",
    className,
  );

  const formatHintNode = date || formatHint ? (
    <div
      className={cn(
        "flex items-center gap-micro text-xs leading-tight text-muted-foreground/90",
        isCard ? "justify-start" : "justify-start sm:justify-end",
      )}
    >
      {formatHint ? <span>{formatHint}</span> : null}
      {formatHint && date ? (
        <span aria-hidden className="text-muted-foreground/60">
          ·
        </span>
      ) : null}
      {date ? <span>{date}</span> : null}
    </div>
  ) : null;

  const fileIconNode = (
    <ItemMedia
      variant="icon"
      className="text-muted-foreground transition-colors group-hover/item:text-accent-foreground"
      aria-hidden
    >
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
              className="size-5 text-muted-foreground transition-colors group-hover/item:text-accent-foreground"
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

export type DownloadableItemListProps = {
  className?: string;
  items: DownloadableItemData[];
  /** When provided, each row renders a delete button calling this with the item id */
  onDelete?: (id: string) => void;
};

/** Vertical stack of `card`-variant tiles — the default tile styling, stacked. */
export function DownloadableItemList({ className, items, onDelete }: DownloadableItemListProps) {
  return (
    <div role="list" className={cn("flex w-full flex-col gap-component", className)}>
      {items.map((item) => (
        <DownloadableItem
          key={item.id}
          variant="card"
          {...item}
          onDelete={onDelete ? () => onDelete(item.id) : undefined}
        />
      ))}
    </div>
  );
}

export type DownloadableItemGridProps = {
  className?: string;
  items: DownloadableItemData[];
  /** When provided, each card renders a delete button calling this with the item id */
  onDelete?: (id: string) => void;
};

/**
 * Responsive grid of `card`-variant tiles. Steps explicitly between 1 / 2 / 3
 * columns based on the grid's own inline size (via the `card-grid` utility's
 * container queries): 1 column under 42rem, 2 columns at 42rem+, 3 columns at
 * 64rem+. The outer `@container` wrapper establishes the query container.
 */
export function DownloadableItemGrid({ className, items, onDelete }: DownloadableItemGridProps) {
  return (
    <div className="@container w-full">
      <div role="list" className={cn("card-grid gap-component", className)}>
        {items.map((item) => (
          <DownloadableItem
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
