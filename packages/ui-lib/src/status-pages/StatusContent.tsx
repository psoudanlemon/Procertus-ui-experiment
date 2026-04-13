import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { Button, Card, CardContent, H1 } from "@procertus-ui/ui";

import type { StatusPageAction } from "./StatusPage";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StatusContentProps = {
  /** Large icon displayed above the heading. */
  icon?: LucideIcon;
  /** Optional image/illustration element — replaces the icon when provided. */
  illustration?: React.ReactNode;
  /** Main heading. */
  heading: string;
  /** Supporting description text. */
  description?: string;
  /** Action buttons. */
  actions?: StatusPageAction[];
  /** Additional className on the Card. */
  className?: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function StatusContent({
  icon: Icon,
  illustration,
  heading,
  description,
  actions,
  className,
}: StatusContentProps) {
  return (
    <Card className={`relative z-10 w-full max-w-md shadow-[var(--shadow-proc-md)] ring-0 ${className ?? ""}`}>
      <CardContent className="flex flex-col items-center gap-component px-section py-section text-center">
        {/* Visual */}
        {illustration ? (
          <div className="flex items-center justify-center">{illustration}</div>
        ) : Icon ? (
          <div className="flex size-16 items-center justify-center rounded-full bg-background">
            <Icon className="size-8 text-brand-primary-700 dark:text-brand-primary-200" />
          </div>
        ) : null}

        {/* Copy */}
        <div className="space-y-2">
          <H1>{heading}</H1>
          {description && (
            <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-component">
            {actions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant={action.variant ?? "outline"}
                  onClick={action.onClick}
                  asChild={!!action.href}
                >
                  {action.href ? (
                    <a href={action.href}>
                      {ActionIcon && <ActionIcon className="size-4" />}
                      {action.label}
                    </a>
                  ) : (
                    <>
                      {ActionIcon && <ActionIcon className="size-4" />}
                      {action.label}
                    </>
                  )}
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { StatusContent };
