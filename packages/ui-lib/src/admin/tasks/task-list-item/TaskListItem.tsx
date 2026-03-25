/**
 * Presentational task row — UI only (list-item template).
 * Checkbox, title, optional priority badge, due hint, overflow menu. Callbacks only; no data layer.
 */
import { MoreHorizontal } from "lucide-react";
import { useId } from "react";

import { cn } from "@/lib/utils";
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@procertus-ui/ui";

import { TaskPriorityBadge, type TaskPriority } from "../task-priority-badge/TaskPriorityBadge";

export type TaskListItemIntent = "default" | "emphasis" | "muted" | "danger";

export type TaskListItemStatus = {
  label: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
};

export type TaskListItemProps = {
  className?: string;
  intent?: TaskListItemIntent;
  selected?: boolean;
  title: string;
  subtitle?: string;
  completed?: boolean;
  /** When set, shows a completion checkbox wired to the parent */
  onToggleComplete?: () => void;
  priority?: TaskPriority;
  status?: TaskListItemStatus;
  /** Short due summary shown before the menu, e.g. "Due Fri" */
  dueHint?: string;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
};

const intentClass: Record<TaskListItemIntent, string> = {
  default: "border-border bg-card",
  emphasis: "border-primary/30 bg-card ring-2 ring-primary/15",
  muted: "border-transparent bg-muted/50 text-muted-foreground",
  danger: "border-destructive/35 bg-card",
};

export function TaskListItem({
  className,
  intent = "default",
  selected = false,
  title,
  subtitle,
  completed = false,
  onToggleComplete,
  priority,
  status,
  dueHint,
  menuOpen,
  onMenuOpenChange,
  onEdit,
  onDuplicate,
  onArchive,
}: TaskListItemProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const checkboxId = `${uid}-done`;

  return (
    <div
      data-selected={selected ? "" : undefined}
      className={cn(
        "flex w-full max-w-xl items-center gap-3 rounded-xl border p-3 text-card-foreground shadow-sm transition-colors",
        intentClass[intent],
        selected && "bg-accent/25",
        completed && "opacity-80",
        className,
      )}
    >
      {onToggleComplete ? (
        <Checkbox
          id={checkboxId}
          checked={completed}
          onCheckedChange={() => onToggleComplete()}
          aria-labelledby={titleId}
          className="mt-0.5 shrink-0"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p id={titleId} className={cn("truncate font-medium", completed && "line-through")}>
            {title}
          </p>
          {priority ? <TaskPriorityBadge priority={priority} /> : null}
          {status ? <Badge variant={status.variant ?? "outline"}>{status.label}</Badge> : null}
        </div>
        {subtitle ? <p className="truncate text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {dueHint ? (
        <p className="hidden shrink-0 text-xs text-muted-foreground sm:block">{dueHint}</p>
      ) : null}
      <DropdownMenu open={menuOpen} onOpenChange={onMenuOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Task actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {onEdit ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onEdit();
              }}
            >
              Edit
            </DropdownMenuItem>
          ) : null}
          {onDuplicate ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onDuplicate();
              }}
            >
              Duplicate
            </DropdownMenuItem>
          ) : null}
          {onArchive ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  onArchive();
                }}
              >
                Archive
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
