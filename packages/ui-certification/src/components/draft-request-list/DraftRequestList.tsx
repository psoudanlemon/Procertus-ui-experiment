/**
 * Draft certification requests in the session: **edit** and **remove** are callbacks
 * only — no navigation. Use with `ProductMultiSelect` output (one draft per selected
 * product type) or similar parent state.
 */
import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Separator,
  cn,
} from "@procertus-ui/ui";

export type DraftRequestItem = {
  id: string;
  title: string;
  subtitle?: string;
  /** Free slot (e.g. a `CertificationBadgeRow` preview). */
  details?: ReactNode;
};

export type DraftRequestListProps = {
  className?: string;
  title: string;
  description?: string;
  drafts: DraftRequestItem[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  /** Optional string override for the empty `Empty` block. */
  emptyTitle?: string;
  emptyDescription?: string;
  /** Edit / remove button labels. */
  editLabel?: string;
  removeLabel?: string;
};

export function DraftRequestList({
  className,
  title,
  description,
  drafts,
  onEdit,
  onRemove,
  emptyTitle = "No draft requests yet",
  emptyDescription = "Add product types from the previous step, or return to the drilldown to add more.",
  editLabel = "Edit",
  removeLabel = "Remove",
}: DraftRequestListProps) {
  return (
    <Card className={cn("w-full max-w-3xl overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {drafts.length === 0 ? (
          <Empty>
            <EmptyIcon />
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </Empty>
        ) : (
          <ul className="flex flex-col" role="list">
            {drafts.map((d, i) => (
              <li key={d.id} className="min-w-0">
                {i > 0 ? <Separator className="my-micro" /> : null}
                <div className="flex flex-col gap-component py-component sm:flex-row sm:items-start sm:justify-between sm:gap-section">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{d.title}</p>
                    {d.subtitle ? <p className="text-sm text-muted-foreground">{d.subtitle}</p> : null}
                    {d.details ? <div className="mt-component min-w-0">{d.details}</div> : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap justify-end gap-component">
                    <Button type="button" size="sm" variant="outline" onClick={() => onEdit(d.id)} aria-label={`${editLabel}: ${d.title}`}>
                      <HugeiconsIcon icon={PencilEdit02Icon} className="size-4" strokeWidth={1.5} />
                      {editLabel}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => onRemove(d.id)}
                      className="text-destructive-foreground hover:text-destructive-foreground"
                      aria-label={`${removeLabel}: ${d.title}`}
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="size-4" strokeWidth={1.5} />
                      {removeLabel}
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
