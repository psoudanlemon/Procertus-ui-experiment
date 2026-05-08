import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export type SkeletonPrefillFieldProps = {
  /** Field label (e.g. "Bedrijfsnaam"). */
  label: ReactNode;
  /**
   * When `false`, shows a dashed affordance for manual entry. When `true`, shows a skeleton
   * bar for an async prefill in flight or resolved.
   */
  prefilled: boolean;
  /**
   * When `prefilled` is true: `true` = value resolved (static bar), `false` = still loading (pulse).
   * Ignored when `prefilled` is false.
   */
  resolved?: boolean;
  className?: string;
  /**
   * Copy in the manual-entry state. Default matches the onboarding Dutch hint.
   */
  manualHint?: ReactNode;
};

const defaultManualHint = "Handmatig invullen";

/**
 * Skeleton variant for async **form field** prefill rows: either a dashed manual placeholder,
 * or a skeleton bar that distinguishes loading vs resolved. Presentational only, parent decides
 * `prefilled` / `resolved` from lookup or hydration state.
 */
function SkeletonPrefillField({
  label,
  prefilled,
  resolved = false,
  className,
  manualHint = defaultManualHint,
}: SkeletonPrefillFieldProps) {
  return (
    <Field className={className} data-slot="skeleton-prefill-field">
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        {!prefilled ? (
          <div className="flex h-9 items-center rounded-md border border-dashed border-border/60 bg-muted/10 px-3 text-xs text-muted-foreground">
            {manualHint}
          </div>
        ) : (
          <Skeleton
            className={cn("h-9 w-full rounded-md", resolved ? "bg-muted/70" : "animate-pulse")}
          />
        )}
      </FieldContent>
    </Field>
  );
}

export { Skeleton, SkeletonPrefillField };
