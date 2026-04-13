import * as React from "react";

import { cn } from "@/lib/utils";

function H1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="heading"
      className={cn(
        "text-heading-xl font-semibold text-heading-foreground",
        className,
      )}
      {...props}
    />
  );
}

function H2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="heading"
      className={cn(
        "text-heading-lg font-semibold text-heading-foreground",
        className,
      )}
      {...props}
    />
  );
}

function H3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="heading"
      className={cn(
        "text-heading-md font-semibold text-heading-foreground",
        className,
      )}
      {...props}
    />
  );
}

function H4({ className, ...props }: React.ComponentProps<"h4">) {
  return (
    <h4
      data-slot="heading"
      className={cn(
        "text-heading-sm font-semibold uppercase text-heading-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { H1, H2, H3, H4 };
