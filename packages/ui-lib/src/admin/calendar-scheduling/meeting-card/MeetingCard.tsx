/**
 * Presentational meeting row for lists — time, title, organizer avatar, status, overflow menu.
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

export type MeetingCardIntent = "default" | "emphasis" | "muted" | "danger";

export type MeetingCardStatus = {
  label: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
};

export type MeetingCardProps = {
  className?: string;
  intent?: MeetingCardIntent;
  selected?: boolean;
  title: string;
  /** Typically time range and location or video link label. */
  subtitle?: string;
  /** Short label (e.g. “Stand-up”, “1:1”). */
  meetingTypeLabel?: string;
  status?: MeetingCardStatus;
  avatarUrl?: string;
  avatarFallback: string;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onCopyInvite?: () => void;
  onDuplicate?: () => void;
  onCancel?: () => void;
};

const intentClass: Record<MeetingCardIntent, string> = {
  default: "border-border bg-card",
  emphasis: "border-primary/30 bg-card ring-2 ring-primary/15",
  muted: "border-transparent bg-muted/50 text-muted-foreground",
  danger: "border-destructive/35 bg-card",
};

export function MeetingCard({
  className,
  intent = "default",
  selected = false,
  title,
  subtitle,
  meetingTypeLabel,
  status,
  avatarUrl,
  avatarFallback,
  menuOpen,
  onMenuOpenChange,
  onEdit,
  onCopyInvite,
  onDuplicate,
  onCancel,
}: MeetingCardProps) {
  return (
    <div
      data-selected={selected ? "" : undefined}
      className={cn(
        "flex w-full max-w-xl items-center gap-3 rounded-xl border p-3 text-card-foreground shadow-sm transition-colors",
        intentClass[intent],
        selected && "bg-accent/25",
        className,
      )}
    >
      <Avatar>
        {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium">{title}</p>
          {meetingTypeLabel ? <Badge variant="secondary">{meetingTypeLabel}</Badge> : null}
          {status ? <Badge variant={status.variant ?? "outline"}>{status.label}</Badge> : null}
        </div>
        {subtitle ? <p className="truncate text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <DropdownMenu open={menuOpen} onOpenChange={onMenuOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Meeting actions">
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
          {onCopyInvite ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onCopyInvite();
              }}
            >
              Copy invite
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
          {onCancel ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  onCancel();
                }}
              >
                Cancel meeting
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
