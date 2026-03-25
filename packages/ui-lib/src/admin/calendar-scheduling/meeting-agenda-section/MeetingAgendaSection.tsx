/**
 * Section card for meeting agenda: header, optional badge, body, footer actions.
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

export type MeetingAgendaSectionProps = {
  className?: string;
  badge?: string;
  title: string;
  description?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  children?: ReactNode;
};

export function MeetingAgendaSection({
  className,
  badge,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  children,
}: MeetingAgendaSectionProps) {
  return (
    <Card className={cn("mx-auto w-full max-w-2xl overflow-hidden", className)}>
      <CardHeader className="gap-2">
        {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description ? (
          <CardDescription className="text-base">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-6">{children}</CardContent>
      {onPrimary || (secondaryLabel && onSecondary) ? (
        <CardFooter className="flex flex-wrap justify-end gap-2 border-t bg-muted/30">
          {secondaryLabel && onSecondary ? (
            <Button type="button" variant="outline" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          ) : null}
          {onPrimary ? (
            <Button type="button" onClick={onPrimary}>
              {primaryLabel}
            </Button>
          ) : null}
        </CardFooter>
      ) : null}
    </Card>
  );
}
