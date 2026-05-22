/**
 * Opt-in "feature shell" card with a muted title strip, a body slot, and an
 * optional muted footer strip. Picks up a Procertus logomark watermark in the
 * bottom-right by default; pass `watermark` to override or `hideWatermark` to
 * suppress. Use for detail / feature pages where one composed card frames the
 * entire surface (catalogue detail, expert-call intake, …). For ordinary
 * cards, keep using the base `Card` primitive from `@procertus-ui/ui`.
 *
 * Body content is structured with `DetailCardSection`: each section has an
 * optional title + description and a free-form content slot. Sections are
 * separated by `gap-section`; inside a section, the title/description block
 * sits at `gap-component` from the content.
 *
 * **Design system:** `Card` family + `H2` + `H4` + `CardDescription` from
 * `@procertus-ui/ui`.
 */
import type { ReactNode } from "react";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  FieldDescription,
  H2,
  H4,
} from "@procertus-ui/ui";
import procertusLogomark from "@procertus-ui/ui/assets/logomark.svg";

export type DetailCardProps = {
  title: ReactNode;
  description?: ReactNode;
  /**
   * Bottom-right watermark inside the card body. Pass any node (typically an
   * `<img>`); falls back to the Procertus logomark.
   */
  watermark?: ReactNode;
  /** Suppress the default watermark without supplying one. */
  hideWatermark?: boolean;
  /** Footer strip — typically a help link + primary CTA. */
  footer?: ReactNode;
  /**
   * When provided, renders a close icon button in the top-right of the header.
   * Typically used to return from a detail view to its overview.
   */
  onClose?: () => void;
  /** Accessible label for the close button. */
  closeLabel?: string;
  /** Body content — alerts, sections, document lists, etc. */
  children: ReactNode;
  className?: string;
};

const defaultWatermark = (
  <img
    aria-hidden
    src={procertusLogomark}
    alt=""
    className="pointer-events-none absolute right-8 -bottom-16 -z-10 size-96 select-none opacity-10"
  />
);

export function DetailCard({
  title,
  description,
  watermark,
  hideWatermark = false,
  footer,
  onClose,
  closeLabel = "Sluiten",
  children,
  className,
}: DetailCardProps) {
  const watermarkNode = hideWatermark ? null : (watermark ?? defaultWatermark);

  return (
    <Card className={cn("flex flex-col gap-0 pt-0 shadow-proc-xs md:shadow-proc-sm", className)}>
      <CardHeader className="gap-1 border-b bg-muted/40 p-region [.border-b]:pb-region">
        <div className="flex items-start justify-between gap-component">
          <div className="flex min-w-0 flex-col gap-1">
            <H2>{title}</H2>
            {description ? (
              <CardDescription className="text-base leading-normal">{description}</CardDescription>
            ) : null}
          </div>
          {onClose ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="-mt-1 -mr-1 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <HugeiconsIcon icon={Cancel01Icon} />
              <span className="sr-only">{closeLabel}</span>
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="relative isolate flex flex-col gap-region overflow-hidden p-region">
        {watermarkNode}
        {children}
      </CardContent>

      {footer ? (
        <CardFooter className="flex-wrap-reverse justify-between gap-component border-t bg-muted/40 p-region sm:flex-nowrap">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}

export type DetailCardSectionProps = {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * Body unit inside `DetailCard`. Renders an optional title + description
 * block followed by free-form content. Spacing is fixed by the stramien:
 * title and description sit flush against each other, the header block
 * sits at `gap-component` from the content, and sections themselves are
 * separated by `gap-section` via the parent `DetailCard`.
 */
export function DetailCardSection({
  title,
  description,
  children,
  className,
}: DetailCardSectionProps) {
  const hasHeader = Boolean(title || description);
  return (
    <section className={cn("flex flex-col gap-component", className)}>
      {hasHeader ? (
        <header className="flex flex-col gap-micro">
          {title ? <H4 className="leading-none">{title}</H4> : null}
          {description ? <FieldDescription>{description}</FieldDescription> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
