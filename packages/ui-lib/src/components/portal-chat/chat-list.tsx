import * as React from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button, cn } from "@procertus-ui/ui";

import { useChatAutoScroll } from "./use-chat-auto-scroll";

export type ChatListProps = React.ComponentProps<"div">;

/**
 * Scrollable message column with optional “scroll to bottom” control
 * (ported from `chat-list.svelte` + `UseAutoScroll`).
 */
export function ChatList({ className, children, ...props }: ChatListProps) {
  const { ref, isAtBottom, isAtTop, scrollToBottom } = useChatAutoScroll();

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full flex-col gap-4 overflow-y-auto p-4 scroll-smooth",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
        {...props}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-linear-to-b from-card to-transparent transition-opacity duration-200",
          isAtTop ? "opacity-0" : "opacity-100",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-linear-to-t from-card to-transparent transition-opacity duration-200",
          isAtBottom ? "opacity-0" : "opacity-100",
        )}
      />
      {!isAtBottom ? (
        <div className="pointer-events-auto absolute bottom-2 left-1/2 z-10 -translate-x-1/2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full shadow-md"
            onClick={() => scrollToBottom(false)}
            aria-label="Scroll naar beneden"
          >
            <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
