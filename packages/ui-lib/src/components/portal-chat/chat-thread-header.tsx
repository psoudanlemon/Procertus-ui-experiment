import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ChatThreadHeaderProps = {
  className?: string;
  /** Primary line (e.g. display name). */
  title: string;
  /** Secondary line (e.g. “Active 2 mins ago”). */
  subtitle?: ReactNode;
  /** Leading avatar (typically `Avatar` + `AvatarImage` / `AvatarFallback`). */
  avatar: ReactNode;
  /** Trailing actions (icon buttons). */
  actions?: ReactNode;
};

/**
 * Top bar for a chat surface: peer avatar + title stack + optional action icons
 * (matches the header row from the shadcn-svelte-extras chat example).
 */
export function ChatThreadHeader({ className, title, subtitle, avatar, actions }: ChatThreadHeaderProps) {
  return (
    <div
      className={cn(
        "bg-background flex place-items-center justify-between border-b border-border p-section",
        className,
      )}
    >
      <div className="flex min-w-0 place-items-center gap-component">
        {avatar}
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{title}</span>
          {subtitle != null && subtitle !== "" ? (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 place-items-center gap-micro">{actions}</div> : null}
    </div>
  );
}
