/**
 * Presentational AdminPageHeader — CRM/ERP record or list page title band (section template).
 *
 * Uses **Badge** and **Button** from `@procertus-ui/ui`. Pass **Tabs** (or links) in `children` for secondary navigation.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Badge, Button, Separator } from "@procertus-ui/ui";

export type AdminPageHeaderProps = {
  className?: string;
  breadcrumb?: ReactNode;
  badge?: string;
  title: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  children?: ReactNode;
};

export function AdminPageHeader({
  className,
  breadcrumb,
  badge,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  children,
}: AdminPageHeaderProps) {
  const hasActions = (primaryLabel && onPrimary) || (secondaryLabel && onSecondary);

  return (
    <header className={cn("border-b bg-background/95 pb-4", className)}>
      {breadcrumb ? <div className="mb-3 text-sm text-muted-foreground">{breadcrumb}</div> : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-1">
          {badge ? (
            <Badge variant="secondary" className="mb-1">
              {badge}
            </Badge>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {hasActions ? (
          <div className="flex shrink-0 flex-wrap gap-2">
            {secondaryLabel && onSecondary ? (
              <Button type="button" variant="outline" onClick={onSecondary}>
                {secondaryLabel}
              </Button>
            ) : null}
            {primaryLabel && onPrimary ? (
              <Button type="button" onClick={onPrimary}>
                {primaryLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
      {children ? (
        <>
          <Separator className="my-4" />
          <div className="min-w-0">{children}</div>
        </>
      ) : null}
    </header>
  );
}
