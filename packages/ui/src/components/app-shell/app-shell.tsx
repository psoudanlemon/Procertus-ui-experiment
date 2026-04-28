import * as React from "react";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * The bare layout primitive: a row-flex container that hosts a sidebar +
 * content + the global Toaster overlay. Use {@link ManagementAppShell} or
 * {@link PublicRegistryAppShell} for the opinionated, chrome-rich variants.
 */
export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex min-h-svh w-full flex-row", className)}
        {...props}
      >
        {children}
        <Toaster />
      </div>
    );
  },
);

AppShell.displayName = "AppShell";
