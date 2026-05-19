import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { H1 } from "@/components/ui/heading";

function isTextNode(node: ReactNode): node is string | number {
  return typeof node === "string" || typeof node === "number";
}

/** Small uppercase eyebrow above the page title (slot). */
export function PageHeaderKicker({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-kicker"
      className={cn(
        "text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Muted supporting copy under the title (slot). */
export function PageHeaderDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-description"
      className={cn("leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Trailing column for {@link PageHeaderProps.media} (row layout at wide header widths). */
export function PageHeaderMedia({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-media"
      className={cn("flex shrink-0 items-start justify-end", className)}
      {...props}
    />
  );
}

/**
 * Region directly under the description (and above {@link PageHeaderActions} when both are set).
 * Use for alerts, meta rows, chips, or any extra body before the action row.
 */
export function PageHeaderBelow({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-below"
      className={cn("flex min-w-0 flex-col gap-micro pt-micro", className)}
      {...props}
    />
  );
}

/**
 * Row for primary / secondary controls (outline + default buttons, links, etc.).
 * Compose your own button variants inside this slot; there are no separate primary/secondary props.
 */
export function PageHeaderActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn("flex flex-wrap gap-component pt-micro", className)}
      {...props}
    />
  );
}

type PageHeaderSharedProps = Omit<ComponentProps<"header">, "title"> & {
  /** Small label above the title; strings are wrapped in {@link PageHeaderKicker}. */
  kicker?: ReactNode;
  /** Primary heading; plain text is wrapped in {@link H1}, otherwise pass your own heading node. */
  title: ReactNode;
  /** Supporting copy; strings are wrapped in {@link PageHeaderDescription}. Full width below the kicker+title row. */
  description?: ReactNode;
  /**
   * Optional body rendered below the description and above {@link PageHeaderActions}.
   * Rendered inside {@link PageHeaderBelow}; pass plain nodes (alerts, lists) without wrapping in
   * another {@link PageHeaderBelow} unless you want doubled vertical spacing.
   */
  children?: ReactNode;
  /** Action row (e.g. secondary outline + primary buttons). */
  actions?: ReactNode;
};

/** Trailing slot: either a compact icon (top-right) or hero media — never both. */
export type PageHeaderProps = PageHeaderSharedProps &
  (
    | { media?: ReactNode; icon?: never }
    | { icon?: ReactNode; media?: never }
  );

function renderKicker(kicker: ReactNode | undefined) {
  if (kicker == null) return null;
  if (isTextNode(kicker)) return <PageHeaderKicker>{kicker}</PageHeaderKicker>;
  return kicker;
}

function renderDescription(description: ReactNode | undefined) {
  if (description == null) return null;
  if (isTextNode(description)) return <PageHeaderDescription>{description}</PageHeaderDescription>;
  return description;
}

function renderTitle(title: ReactNode) {
  if (isTextNode(title)) return <H1>{title}</H1>;
  return title;
}

/**
 * Presentational page masthead. Kicker, title, and description share one text column.
 * {@link PageHeaderProps.media} floats top-right from 48rem header width upward (container query).
 * {@link PageHeaderProps.icon} is always pinned to the top-right corner (absolute).
 * `actions` align bottom-right on wide headers; otherwise they follow the text column.
 * `children` render full-width below the entire header row.
 */
export function PageHeader({
  className,
  icon,
  kicker,
  title,
  description,
  children,
  media,
  actions,
  ...props
}: PageHeaderProps) {
  const descriptionNode = renderDescription(description);
  const hasIcon = icon != null;

  return (
    <header className={cn("@container/page-header w-full min-w-0", className)} {...props}>
      <div className="flex flex-col gap-region">
        <div className="relative">
          {hasIcon ? (
            <div
              data-slot="page-header-icon"
              className="absolute top-0 right-0 z-10 flex shrink-0 items-start justify-end"
            >
              {icon}
            </div>
          ) : null}
          <div className="flex flex-col gap-region @min-[48rem]/page-header:flex-row @min-[48rem]/page-header:justify-between @min-[48rem]/page-header:gap-region">
            <div className="flex min-w-0 max-w-3xl flex-1 flex-col gap-micro [&_[data-slot=page-header-description]]:[text-box:trim-start_text]">
              <div
                className={cn(
                  "flex min-w-0 flex-col gap-component text-left [&_[data-slot=heading]]:[text-box:trim-end_text] [&_[data-slot=page-header-kicker]]:[text-box:trim-both_cap_alphabetic]",
                  hasIcon && "pe-12",
                )}
              >
                {renderKicker(kicker)}
                {renderTitle(title)}
              </div>
              {descriptionNode}
            </div>
            {media != null ? (
              <PageHeaderMedia className="@min-[48rem]/page-header:self-start">{media}</PageHeaderMedia>
            ) : null}
            {actions != null ? (
              <PageHeaderActions
                className={cn(
                  "shrink-0 pt-0 @min-[48rem]/page-header:self-end",
                  hasIcon && "@min-[48rem]/page-header:pt-12",
                )}
              >
                {actions}
              </PageHeaderActions>
            ) : null}
          </div>
        </div>
        {children != null ? (
          <PageHeaderBelow className="pt-0">{children}</PageHeaderBelow>
        ) : null}
      </div>
    </header>
  );
}
