import * as React from "react";

import { cn } from "@/lib/utils";

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center gap-section rounded-lg border border-dashed p-region text-center",
        className,
      )}
      {...props}
    />
  );
}

function EmptyIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-icon"
      className={cn(
        "flex size-12 items-center justify-center rounded-full bg-white dark:bg-white/10 [&>svg]:size-6 [&>svg]:text-brand-primary-700 dark:[&>svg]:text-brand-primary-200",
        className,
      )}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="empty-title"
      className={cn("-mb-4 text-lg font-semibold text-brand-primary-700 dark:text-brand-primary-200", className)}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn("max-w-sm text-base leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

function EmptyActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-actions"
      className={cn("flex flex-wrap justify-center gap-section", className)}
      {...props}
    />
  );
}

export { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions };
