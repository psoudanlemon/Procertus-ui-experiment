/**
 * Detail card for a certification entry. Header with title + description on a
 * muted strip; isolate body with an optional Procertus watermark in the
 * bottom-right; optional footer slot. Pure shell — caller owns the body
 * sections (alerts, document lists, timelines, …).
 *
 * **Design system:** `Card` family + `H2` + `CardDescription` from
 * `@procertus-ui/ui`. Default watermark is the Procertus logomark; pass
 * `watermark` to override or `hideWatermark` to suppress.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  H2,
} from "@procertus-ui/ui";
import procertusLogomark from "@procertus-ui/ui/assets/logomark.svg";

export type CertificationCardProps = {
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

export function CertificationCard({
  title,
  description,
  watermark,
  hideWatermark = false,
  footer,
  children,
  className,
}: CertificationCardProps) {
  const watermarkNode = hideWatermark ? null : (watermark ?? defaultWatermark);

  return (
    <Card className={cn("flex flex-col gap-0 pt-0 shadow-proc-xs md:shadow-proc-sm", className)}>
      <CardHeader className="gap-1 border-b bg-muted/40 px-region pt-region pb-section">
        <H2>{title}</H2>
        {description ? (
          <CardDescription className="text-base leading-normal">{description}</CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="relative isolate flex flex-col gap-region overflow-hidden p-region">
        {watermarkNode}
        {children}
      </CardContent>

      {footer ? (
        <CardFooter className="flex-wrap-reverse justify-end gap-component border-t bg-muted/40 p-region sm:flex-nowrap sm:justify-between">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
