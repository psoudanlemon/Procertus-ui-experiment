/**
 * Approval chain — data panel with optional search and a presentational list of approvers.
 */
import type { ReactNode } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@procertus-ui/ui";

export type ApprovalChainListMember = {
  id: string;
  name: string;
  title?: string;
  statusLabel: string;
  statusVariant?: "default" | "secondary" | "outline" | "destructive";
  avatarUrl?: string;
  avatarFallback: string;
};

type ToolbarProps = {
  showSearch: boolean;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  actions?: ReactNode;
};

function ApprovalChainListToolbar({
  showSearch,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  actions,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {showSearch ? (
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            className="pl-9"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Filter approvers"
          />
        </div>
      ) : null}
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export type ApprovalChainListProps = {
  className?: string;
  title: string;
  description?: string;
  members: readonly ApprovalChainListMember[];
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  actions?: ReactNode;
  showSearch?: boolean;
  emptyLabel?: string;
};

export function ApprovalChainList({
  className,
  title,
  description,
  members,
  searchPlaceholder = "Search approvers…",
  searchValue,
  onSearchChange,
  actions,
  showSearch = true,
  emptyLabel = "No approvers in this chain.",
}: ApprovalChainListProps) {
  return (
    <Card className={cn("mx-auto w-full max-w-5xl overflow-hidden", className)}>
      <CardHeader className="gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {showSearch || actions ? (
          <ApprovalChainListToolbar
            showSearch={showSearch}
            searchPlaceholder={searchPlaceholder}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            actions={actions}
          />
        ) : null}
      </CardHeader>
      <CardContent className="px-0 pb-6">
        {members.length === 0 ? (
          <p className="px-6 text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="divide-y divide-border">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-6 py-3">
                <Avatar className="size-9">
                  {m.avatarUrl ? <AvatarImage src={m.avatarUrl} alt="" /> : null}
                  <AvatarFallback>{m.avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{m.name}</p>
                  {m.title ? (
                    <p className="truncate text-sm text-muted-foreground">{m.title}</p>
                  ) : null}
                </div>
                <Badge variant={m.statusVariant ?? "outline"} className="shrink-0">
                  {m.statusLabel}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
