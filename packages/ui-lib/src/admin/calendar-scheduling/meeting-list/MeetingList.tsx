/**
 * Presentational shell: title, optional search, actions, and scrollable meeting list content.
 */
import type { ReactNode } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@procertus-ui/ui";

type MeetingListToolbarProps = {
  showSearch: boolean;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  actions?: ReactNode;
};

function MeetingListToolbar({
  showSearch,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  actions,
}: MeetingListToolbarProps) {
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
            aria-label="Search meetings"
          />
        </div>
      ) : null}
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export type MeetingListProps = {
  className?: string;
  title: string;
  description?: string;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  actions?: ReactNode;
  children: ReactNode;
  showSearch?: boolean;
};

export function MeetingList({
  className,
  title,
  description,
  searchPlaceholder = "Search meetings…",
  searchValue,
  onSearchChange,
  actions,
  children,
  showSearch = true,
}: MeetingListProps) {
  return (
    <Card className={cn("mx-auto w-full max-w-5xl overflow-hidden", className)}>
      <CardHeader className="gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {showSearch || actions ? (
          <MeetingListToolbar
            showSearch={showSearch}
            searchPlaceholder={searchPlaceholder}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            actions={actions}
          />
        ) : null}
      </CardHeader>
      <CardContent className="px-0 pb-6">{children}</CardContent>
    </Card>
  );
}
