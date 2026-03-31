import * as React from "react";

import { cn } from "@/lib/utils";

function H1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="heading"
      className={cn(
        "text-[1.5rem] leading-[1.2] font-semibold tracking-tight text-brand-primary-700 dark:text-brand-primary-200",
        className,
      )}
      {...props}
    />
  );
}

export { H1 };
