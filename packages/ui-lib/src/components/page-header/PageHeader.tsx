import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { H1 } from "@procertus-ui/ui";

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

/** Trailing column for optional {@link PageHeaderProps.icon} or {@link PageHeaderProps.media} (mutually exclusive). */
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

/** Trailing slot: either a compact icon (same column as media) or hero media — never both. */
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
 * Presentational page masthead: optional trailing {@link PageHeaderProps.icon} or
 * {@link PageHeaderProps.media} (mutually exclusive) aligns with the **kicker + title** block only;
 * description, `children`, and `actions` span the full width below that row.
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
  const trailing = icon ?? media;
  const descriptionNode = renderDescription(description);

  return (
    <header className={cn("pb-region", className)} {...props}>
      <div className="flex flex-col gap-region">
        <div className="flex min-w-0 flex-col gap-micro">
          <div className="flex flex-col gap-micro sm:flex-row sm:items-start sm:justify-between sm:gap-region">
            <div className="flex min-w-0 flex-1 flex-col gap-micro text-left">
              {renderKicker(kicker)}
              {renderTitle(title)}
            </div>
            {trailing != null ? <PageHeaderMedia>{trailing}</PageHeaderMedia> : null}
          </div>
          {descriptionNode}
        </div>
        {children != null ? (
          <PageHeaderBelow className="pt-0">{children}</PageHeaderBelow>
        ) : null}
        {actions != null ? (
          <PageHeaderActions className="pt-0">{actions}</PageHeaderActions>
        ) : null}
      </div>
    </header>
  );
}
