/**
 * Availability matrix: column time labels, row participant labels, tone per cell + optional toolbar.
 */
import type { ReactNode } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@procertus-ui/ui";

export type AvailabilityCellTone = "free" | "busy" | "tentative" | "outOfOffice";

export type AvailabilityGridRow = {
  id: string;
  label: string;
  /** One tone per column, left to right. */
  cells: AvailabilityCellTone[];
};

const toneClass: Record<AvailabilityCellTone, string> = {
  free: "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100",
  busy: "bg-destructive/15 text-destructive",
  tentative: "bg-amber-500/20 text-amber-950 dark:text-amber-100",
  outOfOffice: "bg-muted text-muted-foreground",
};

type AvailabilityGridToolbarProps = {
  showSearch: boolean;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  actions?: ReactNode;
};

function AvailabilityGridToolbar({
  showSearch,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  actions,
}: AvailabilityGridToolbarProps) {
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
            aria-label="Filter participants"
          />
        </div>
      ) : null}
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export type AvailabilityGridProps = {
  className?: string;
  title: string;
  description?: string;
  /** Time or slot headers (e.g. “9:00”, “9:30”). */
  columnLabels: string[];
  rows: AvailabilityGridRow[];
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  actions?: ReactNode;
  showSearch?: boolean;
  /** Shown under the grid (e.g. legend). */
  footer?: ReactNode;
};

export function AvailabilityGrid({
  className,
  title,
  description,
  columnLabels,
  rows,
  searchPlaceholder = "Filter by name…",
  searchValue,
  onSearchChange,
  actions,
  showSearch = true,
  footer,
}: AvailabilityGridProps) {
  return (
    <Card className={cn("mx-auto w-full max-w-5xl overflow-hidden", className)}>
      <CardHeader className="gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {showSearch || actions ? (
          <AvailabilityGridToolbar
            showSearch={showSearch}
            searchPlaceholder={searchPlaceholder}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            actions={actions}
          />
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-6">
        <div className="overflow-x-auto px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 min-w-[8rem] bg-card font-medium">
                  Participant
                </TableHead>
                {columnLabels.map((label) => (
                  <TableHead key={label} className="min-w-[4.5rem] text-center text-xs font-medium">
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="sticky left-0 z-10 bg-card font-medium">
                    {row.label}
                  </TableCell>
                  {columnLabels.map((label, i) => {
                    const tone = row.cells[i] ?? "free";
                    return (
                      <TableCell key={`${row.id}-${label}`} className="p-1">
                        <span
                          className={cn(
                            "block min-h-8 rounded-md border border-transparent px-1 py-2 text-center text-xs",
                            toneClass[tone],
                          )}
                          title={tone}
                        >
                          {" "}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {footer ? <div className="px-6 text-sm text-muted-foreground">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}
