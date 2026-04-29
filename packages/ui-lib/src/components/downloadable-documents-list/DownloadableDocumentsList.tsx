/**
 * Presentational list of downloadable documents (rulesets, guides, PDFs). No fetching —
 * pass `items` from the parent or a hook.
 */
import { Download01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@procertus-ui/ui";

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
  /** Accessible name for the row link; defaults to `Download ${title}` */
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
  const linkAriaLabel = downloadAriaLabel ?? `Download ${title}`;
  return (
    <Item asChild role="listitem" variant="outline" size="sm" className={cn("min-w-0", className)}>
      <a href={href} download rel="noopener noreferrer" aria-label={linkAriaLabel}>
        <ItemMedia variant="icon" className="text-muted-foreground" aria-hidden>
          <HugeiconsIcon icon={File01Icon} className="size-5" strokeWidth={1.5} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="underline decoration-foreground/35 underline-offset-4 group-hover/item:decoration-foreground/80">
            {title}
          </ItemTitle>
          {description ?? formatHint ? (
            <ItemDescription>
              {description}
              {formatHint ? (
                <span
                  className={
                    description
                      ? "mt-1 block text-xs text-muted-foreground/90"
                      : "block text-xs text-muted-foreground/90"
                  }
                >
                  {formatHint}
                </span>
              ) : null}
            </ItemDescription>
          ) : null}
        </ItemContent>
        <ItemActions className="shrink-0 text-muted-foreground" aria-hidden>
          <HugeiconsIcon icon={Download01Icon} className="size-5" strokeWidth={1.5} />
        </ItemActions>
      </a>
    </Item>
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
          <ItemGroup className="w-full">
            {items.map((item) => (
              <DownloadableDocumentListItem key={item.id} {...item} />
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}
