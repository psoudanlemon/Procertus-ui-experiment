/**
 * Presentational KanbanCard — task tile for a lane (list-item style).
 *
 * v1: optional `isDragging` for lifted / dimmed visuals only — no DnD behavior here.
 */
import { MoreHorizontal } from "lucide-react";

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

export type KanbanCardTag = {
  label: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
};

export type KanbanCardProps = {
  className?: string;
  title: string;
  subtitle?: string;
  tag?: KanbanCardTag;
  avatarUrl?: string;
  /** When omitted, the avatar column is not rendered. */
  avatarFallback?: string;
  /** Parent-controlled “card is being dragged” styling. */
  isDragging?: boolean;
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  onEdit?: () => void;
  onMove?: () => void;
  onArchive?: () => void;
};

export function KanbanCard({
  className,
  title,
  subtitle,
  tag,
  avatarUrl,
  avatarFallback,
  isDragging = false,
  menuOpen,
  onMenuOpenChange,
  onEdit,
  onMove,
  onArchive,
}: KanbanCardProps) {
  const showMenu = onMenuOpenChange !== undefined && Boolean(onEdit || onMove || onArchive);

  return (
    <div
      className={cn(
        "flex w-full items-start gap-2 rounded-lg border border-border bg-card p-2.5 text-card-foreground shadow-xs transition-[box-shadow,opacity,transform]",
        isDragging && "scale-[1.02] opacity-90 shadow-md ring-2 ring-primary/20",
        className,
      )}
    >
      {avatarFallback ? (
        <Avatar className="size-8 shrink-0">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
          <AvatarFallback className="text-xs">{avatarFallback}</AvatarFallback>
        </Avatar>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 gap-y-1">
          <p className="min-w-0 flex-1 font-medium leading-snug">{title}</p>
          {tag ? (
            <Badge variant={tag.variant ?? "outline"} className="shrink-0">
              {tag.label}
            </Badge>
          ) : null}
        </div>
        {subtitle ? (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {showMenu ? (
        <DropdownMenu open={menuOpen} onOpenChange={onMenuOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              aria-label="Card actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
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
            {onMove ? (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  onMove();
                }}
              >
                Move
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
      ) : null}
    </div>
  );
}
