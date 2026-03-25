/**
 * Presentational SavedViewChips — saved list/report views as **Button** chips (minimal template).
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@procertus-ui/ui";

export type SavedViewChip = {
  id: string;
  label: string;
};

export type SavedViewChipsProps = {
  className?: string;
  /** e.g. “Saved views” */
  label?: ReactNode;
  views: SavedViewChip[];
  selectedId: string | null;
  onSelect?: (id: string) => void;
  saveViewLabel?: string;
  onSaveView?: () => void;
};

export function SavedViewChips({
  className,
  label,
  views,
  selectedId,
  onSelect,
  saveViewLabel = "Save view",
  onSaveView,
}: SavedViewChipsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} role="group" aria-label="Saved views">
      {label ? (
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        {views.map((v) => (
          <Button
            key={v.id}
            type="button"
            size="sm"
            variant={selectedId === v.id ? "default" : "outline"}
            onClick={() => onSelect?.(v.id)}
          >
            {v.label}
          </Button>
        ))}
        {onSaveView ? (
          <Button type="button" size="sm" variant="ghost" onClick={onSaveView}>
            {saveViewLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
