/**
 * Presentational ProjectHeader — project summary strip (section).
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@procertus-ui/ui";

export type ProjectHeaderProps = {
  className?: string;
  /** Display name of the project. */
  title: string;
  /** Short code or key (rendered mono). */
  code?: string;
  /** Longer subtitle or one-line summary. */
  description?: string;
  status?: { label: string; variant?: "default" | "secondary" | "destructive" | "outline" };
  /** Extra meta row (dates, owner, etc.). */
  meta?: ReactNode;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  children?: ReactNode;
};

export function ProjectHeader({
  className,
  title,
  code,
  description,
  status,
  meta,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  children,
}: ProjectHeaderProps) {
  const showFooter = (primaryLabel && onPrimary) || (secondaryLabel && onSecondary);

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl">{title}</CardTitle>
              {status ? (
                <Badge variant={status.variant ?? "secondary"}>{status.label}</Badge>
              ) : null}
            </div>
            {code ? (
              <p className="font-mono text-xs text-muted-foreground tracking-wide uppercase">
                {code}
              </p>
            ) : null}
            {description ? (
              <CardDescription className="text-base">{description}</CardDescription>
            ) : null}
          </div>
        </div>
        {meta ? <div className="text-sm text-muted-foreground">{meta}</div> : null}
      </CardHeader>
      {children ? (
        <>
          <Separator />
          <CardContent className="space-y-4 pt-6">{children}</CardContent>
        </>
      ) : null}
      {showFooter ? (
        <>
          {children ? null : <Separator />}
          <CardFooter className="flex flex-wrap justify-end gap-2 border-t bg-muted/30">
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
          </CardFooter>
        </>
      ) : null}
    </Card>
  );
}
