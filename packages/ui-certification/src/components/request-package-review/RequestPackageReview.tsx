/**
 * Read-only **request package** summary before submit. Parents pass rows built from
 * customer context + draft lines; no `fetch` here.
 */
import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@procertus-ui/ui";

export type RequestPackageRow = {
  id: string;
  /** e.g. “Product type” */
  label: string;
  /** e.g. stream id or free text. */
  value: ReactNode;
};

export type RequestPackageReviewProps = {
  className?: string;
  title: string;
  description?: string;
  /** Optional intro above the table. */
  notice?: ReactNode;
  /** Key/value rows. */
  rows: RequestPackageRow[];
  /** Renders when `rows` is empty. */
  emptyState?: ReactNode;
};

export function RequestPackageReview({
  className,
  title,
  description,
  notice,
  rows,
  emptyState,
}: RequestPackageReviewProps) {
  return (
    <Card className={cn("w-full max-w-2xl overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {notice ? <div className="text-sm text-muted-foreground">{notice}</div> : null}
        {rows.length === 0 ? (
          (emptyState ?? <p className="text-sm text-muted-foreground" role="status">Nothing to review — add at least one request.</p>)
        ) : (
          <div className="overflow-x-auto rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/5">Item</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground align-top">
                      {r.label}
                    </TableCell>
                    <TableCell className="min-w-0 break-words align-top font-medium text-foreground">{r.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
