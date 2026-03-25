/**
 * Presentational task / work-item detail shell — UI only (data-panel template).
 * Header, optional filter field with label, actions slot, and main content (`children`).
 */
import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { useId } from "react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@procertus-ui/ui";

type TaskDetailPanelToolbarProps = {
  showSearch: boolean;
  searchFieldId: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  actions?: ReactNode;
};

function TaskDetailPanelToolbar({
  showSearch,
  searchFieldId,
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  actions,
}: TaskDetailPanelToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      {showSearch ? (
        <div className="max-w-md flex-1 space-y-2">
          <Label htmlFor={searchFieldId}>{searchLabel}</Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id={searchFieldId}
              className="pl-9"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
      ) : null}
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export type TaskDetailPanelProps = {
  className?: string;
  title: string;
  description?: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  actions?: ReactNode;
  children: ReactNode;
  showSearch?: boolean;
};

export function TaskDetailPanel({
  className,
  title,
  description,
  searchLabel = "Filter",
  searchPlaceholder = "Search tasks…",
  searchValue,
  onSearchChange,
  actions,
  children,
  showSearch = true,
}: TaskDetailPanelProps) {
  const searchFieldId = useId();

  return (
    <Card className={cn("mx-auto w-full max-w-5xl overflow-hidden", className)}>
      <CardHeader className="gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {showSearch || actions ? (
          <TaskDetailPanelToolbar
            showSearch={showSearch}
            searchFieldId={searchFieldId}
            searchLabel={searchLabel}
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
