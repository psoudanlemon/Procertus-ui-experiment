import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { H4 } from "@/components/ui/heading";

export type PanelSectionProps = {
  /** Section heading; omit for a headerless block (body only). */
  title?: ReactNode;
  /** Supporting copy under the title (muted body typography). */
  description?: ReactNode;
  /** Main body slot (timeline, lists, actions, etc.). */
  children: ReactNode;
  className?: string;
  /** Classes for the body wrapper below the optional header (e.g. `flex flex-wrap gap-2`). */
  contentClassName?: string;
};

function hasRenderableText(node: ReactNode): boolean {
  if (node == null) return false;
  if (typeof node === "string" || typeof node === "number") return String(node).trim().length > 0;
  return true;
}

/**
 * Stack for detail panels: optional title (`h2`) and description, then `children`.
 * No card chrome, spacing and typography only (`min-w-0` for overflow-safe bodies).
 */
export function PanelSection({
  title,
  description,
  children,
  className,
  contentClassName,
}: PanelSectionProps) {
  const titleId = useId();
  const showTitle = hasRenderableText(title);
  const showDescription = hasRenderableText(description);
  const showIntro = showTitle || showDescription;

  return (
    <section
      className={cn("flex w-full min-w-0 flex-col gap-section", className)}
      aria-labelledby={showTitle ? titleId : undefined}
    >
      {showIntro ? (
        <header className="flex min-w-0 flex-col">
          {showTitle ? (
            <H4
              id={titleId}
              className="text-base font-medium leading-snug text-foreground wrap-break-word"
            >
              {title}
            </H4>
          ) : null}
          {showDescription ? (
            <p className="text-sm leading-normal text-muted-foreground whitespace-normal wrap-break-word">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}
      <div className={cn("min-w-0", contentClassName)}>{children}</div>
    </section>
  );
}
