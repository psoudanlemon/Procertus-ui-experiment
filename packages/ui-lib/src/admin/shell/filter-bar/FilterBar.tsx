/**
 * Presentational FilterBar — list/directory toolbar inside a **Card** (data-panel template).
 *
 * **Input** search, optional `filters` slot, **Button** actions, and `children` for table or list body.
 */
import type { ReactNode } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@procertus-ui/ui";

type FilterBarToolbarProps = {
  showSearch: boolean;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: ReactNode;
  actions?: ReactNode;
};

function FilterBarToolbar({
  showSearch,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters,
  actions,
}: FilterBarToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {showSearch ? (
          <div className="relative max-w-md min-w-[12rem] flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              className="pl-9"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search"
            />
          </div>
        ) : null}
        {filters ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">{filters}</div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export type FilterBarProps = {
  className?: string;
  title: string;
  description?: string;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  /** Extra filter controls (selects, date ranges, etc.) */
  filters?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  showSearch?: boolean;
};

export function FilterBar({
  className,
  title,
  description,
  searchPlaceholder = "Search…",
  searchValue,
  onSearchChange,
  filters,
  actions,
  children,
  showSearch = true,
}: FilterBarProps) {
  return (
    <Card className={cn("w-full max-w-5xl overflow-hidden", className)}>
      <CardHeader className="gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {showSearch || filters || actions ? (
          <FilterBarToolbar
            showSearch={showSearch}
            searchPlaceholder={searchPlaceholder}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filters={filters}
            actions={actions}
          />
        ) : null}
      </CardHeader>
      <CardContent className="px-0 pb-6">{children}</CardContent>
    </Card>
  );
}
