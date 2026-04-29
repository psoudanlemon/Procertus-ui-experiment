import * as React from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { Button, Card, CardContent, H1 } from "@procertus-ui/ui";

import type { StatusPageAction } from "./StatusPage";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StatusContentProps = {
  /** Large icon displayed above the heading. */
  icon?: IconSvgElement;
  /** Optional image/illustration element — replaces the icon when provided. */
  illustration?: React.ReactNode;
  /** Main heading. */
  heading: string;
  /** Supporting description — string or richer markup (e.g. multiple paragraphs). */
  description?: React.ReactNode;
  /** Action buttons. */
  actions?: StatusPageAction[];
  /** Additional className on the Card. */
  className?: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function StatusContent({
  icon,
  illustration,
  heading,
  description,
  actions,
  className,
}: StatusContentProps) {
  return (
    <Card className={`relative z-10 w-full max-w-md shadow-[var(--shadow-proc-md)] ring-0 ${className ?? ""}`}>
      <CardContent className="flex flex-col items-center gap-section px-section py-section text-center">
        {/* Visual */}
        {illustration ? (
          <div className="flex items-center justify-center">{illustration}</div>
        ) : icon ? (
          <div className="flex size-16 items-center justify-center rounded-full bg-background">
            <HugeiconsIcon icon={icon} className="size-8 text-brand-primary-700 dark:text-brand-primary-200" />
          </div>
        ) : null}

        {/* Copy */}
        <div className="space-y-2">
          <H1>{heading}</H1>
          {description != null &&
          (typeof description === "string" ? (
            <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
          ) : (
            <div className="space-y-4 text-balance text-base leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline">
              {description}
            </div>
          ))}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-section">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant ?? "outline"}
                onClick={action.onClick}
                asChild={!!action.href}
              >
                {action.href ? (
                  <a href={action.href}>
                    {action.icon && <HugeiconsIcon icon={action.icon} className="size-4" />}
                    {action.label}
                  </a>
                ) : (
                  <>
                    {action.icon && <HugeiconsIcon icon={action.icon} className="size-4" />}
                    {action.label}
                  </>
                )}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { StatusContent };
