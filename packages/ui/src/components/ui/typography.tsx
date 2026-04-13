import * as React from "react";

import { cn } from "@/lib/utils";

function P({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="typography"
      className={cn("text-base text-foreground", className)}
      {...props}
    />
  );
}

function Lead({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="typography"
      className={cn("text-xl text-muted-foreground", className)}
      {...props}
    />
  );
}

function Large({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="typography"
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function Small({ className, ...props }: React.ComponentProps<"small">) {
  return (
    <small
      data-slot="typography"
      className={cn("text-sm font-normal text-foreground", className)}
      {...props}
    />
  );
}

function Muted({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="typography"
      className={cn("text-sm font-normal text-muted-foreground", className)}
      {...props}
    />
  );
}

function Blockquote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      data-slot="typography"
      className={cn(
        "border-l-2 border-border pl-6 text-base italic text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function InlineCode({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="typography"
      className={cn(
        "rounded-sm bg-muted px-1 py-0.5 font-mono text-sm text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function List({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="typography"
      className={cn(
        "list-disc pl-6 text-base text-foreground [&>li]:mt-2",
        className,
      )}
      {...props}
    />
  );
}

export { P, Lead, Large, Small, Muted, Blockquote, InlineCode, List };
