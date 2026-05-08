import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@procertus-ui/ui";

export type SubformCompletionBadgeProps = {
  complete: boolean;
  /**
   * When false, renders nothing if `complete` is false (e.g. VAT field: only show success).
   * When true, shows a dimmed empty circle until the section validates.
   */
  showIncompletePlaceholder?: boolean;
  /** For the valid state (VAT “geldig formaat” control). */
  className?: string;
  title?: string;
};

export function SubformCompletionBadge({
  complete,
  showIncompletePlaceholder = false,
  className,
  title,
}: SubformCompletionBadgeProps) {
  if (!complete && !showIncompletePlaceholder) {
    return null;
  }

  const label = complete ? (title ?? "Volledig ingevuld") : "Nog niet volledig";

  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border shadow-sm dark:shadow-none",
        complete
          ? "border-sys-success-400/70 bg-sys-success-100 dark:border-sys-success-600/80 dark:bg-sys-success-950/90"
          : "border-muted-foreground/20 bg-muted/25 dark:border-muted-foreground/25 dark:bg-muted/20",
        className,
      )}
      aria-label={label}
      title={label}
    >
      {complete ? (
        <HugeiconsIcon
          icon={Tick02Icon}
          className="size-5 text-sys-success-700 dark:text-sys-success-300"
          aria-hidden
          strokeWidth={2.5}
        />
      ) : null}
    </span>
  );
}
