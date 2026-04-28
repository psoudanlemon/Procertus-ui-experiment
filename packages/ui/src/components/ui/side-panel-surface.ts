import { cn } from "@/lib/utils";

export const sidePanelSurfaceBase =
  "flex flex-col overflow-hidden bg-popover bg-clip-padding text-sm text-popover-foreground shadow-proc-md ring-1 ring-foreground/10";

export const sidePanelSurfaceShape =
  "rounded-xl max-sm:rounded-none";

export const sidePanelSurfaceInset =
  "m-4 max-sm:m-0";

export function sidePanelSurfaceClassName({
  className,
  inset = false,
  padded = true,
}: {
  className?: string;
  inset?: boolean;
  padded?: boolean;
} = {}) {
  return cn(
    sidePanelSurfaceBase,
    sidePanelSurfaceShape,
    inset && sidePanelSurfaceInset,
    padded && "p-section max-sm:p-boundary",
    className
  );
}

