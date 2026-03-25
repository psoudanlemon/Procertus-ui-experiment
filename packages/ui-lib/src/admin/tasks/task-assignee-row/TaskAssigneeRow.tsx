/**
 * Presentational assignee row — UI only (list-item template).
 * Avatar, name, optional team/status badges, row menu. Unassigned state supported without API calls.
 */
import { MoreHorizontal, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@procertus-ui/ui";

export type TaskAssigneeRowIntent = "default" | "emphasis" | "muted" | "danger";

export type TaskAssigneeRowStatus = {
  label: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
};

export type TaskAssigneeRowProps = {
  className?: string;
  intent?: TaskAssigneeRowIntent;
  selected?: boolean;
  /** When true, shows placeholder copy and assign affordance instead of a person */
  unassigned?: boolean;
  /** Display name when assigned */
  assigneeName?: string;
  subtitle?: string;
  teamBadge?: string;
  status?: TaskAssigneeRowStatus;
  avatarUrl?: string;
  avatarFallback?: string;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onViewProfile?: () => void;
  onReassign?: () => void;
  onRemove?: () => void;
  onAssign?: () => void;
};

const intentClass: Record<TaskAssigneeRowIntent, string> = {
  default: "border-border bg-card",
  emphasis: "border-primary/30 bg-card ring-2 ring-primary/15",
  muted: "border-transparent bg-muted/50 text-muted-foreground",
  danger: "border-destructive/35 bg-card",
};

export function TaskAssigneeRow({
  className,
  intent = "default",
  selected = false,
  unassigned = false,
  assigneeName,
  subtitle,
  teamBadge,
  status,
  avatarUrl,
  avatarFallback,
  menuOpen,
  onMenuOpenChange,
  onViewProfile,
  onReassign,
  onRemove,
  onAssign,
}: TaskAssigneeRowProps) {
  const name = unassigned ? "Unassigned" : (assigneeName ?? "Unknown");
  const fallback = unassigned ? "?" : (avatarFallback ?? name.slice(0, 2).toUpperCase());

  return (
    <div
      data-selected={selected ? "" : undefined}
      className={cn(
        "flex w-full max-w-xl items-center gap-3 rounded-xl border p-3 text-card-foreground shadow-sm transition-colors",
        intentClass[intent],
        selected && "bg-accent/25",
        unassigned && "border-dashed",
        className,
      )}
    >
      <Avatar>
        {avatarUrl && !unassigned ? <AvatarImage src={avatarUrl} alt="" /> : null}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium">{name}</p>
          {teamBadge ? <Badge variant="secondary">{teamBadge}</Badge> : null}
          {status ? <Badge variant={status.variant ?? "outline"}>{status.label}</Badge> : null}
        </div>
        {subtitle ? <p className="truncate text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {unassigned && onAssign ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1"
          onClick={onAssign}
        >
          <UserPlus className="size-4" aria-hidden />
          Assign
        </Button>
      ) : (
        <DropdownMenu open={menuOpen} onOpenChange={onMenuOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Assignee actions">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onViewProfile ? (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  onViewProfile();
                }}
              >
                View profile
              </DropdownMenuItem>
            ) : null}
            {onReassign ? (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  onReassign();
                }}
              >
                Reassign
              </DropdownMenuItem>
            ) : null}
            {onRemove ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    onRemove();
                  }}
                >
                  Remove assignee
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
