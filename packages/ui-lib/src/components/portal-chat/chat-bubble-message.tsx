import * as React from "react";

import { cn } from "@/lib/utils";

import { ChatLoadingDots } from "./chat-loading-dots";

export type ChatBubbleMessageProps = React.ComponentProps<"div"> & {
  /** When true, shows `ChatLoadingDots` instead of children (ported from `chat-bubble-message.svelte`). */
  typing?: boolean;
};

/**
 * Message body chrome inside a `ChatBubble` (ported from `chat-bubble-message.svelte`).
 */
export const ChatBubbleMessage = React.forwardRef<HTMLDivElement, ChatBubbleMessageProps>(
  function ChatBubbleMessage({ className, typing = false, children, ...props }, forwardedRef) {
    return (
      <div
        ref={forwardedRef}
        className={cn(
          "order-2 rounded-lg bg-secondary p-4 text-sm group-data-[variant=sent]/chat-bubble:order-1 group-data-[variant=sent]/chat-bubble:rounded-br-none group-data-[variant=sent]/chat-bubble:bg-primary group-data-[variant=sent]/chat-bubble:text-primary-foreground group-data-[variant=received]/chat-bubble:rounded-bl-none",
          className,
        )}
        {...props}
      >
        {typing ? (
          <div className="flex size-full place-items-center justify-center">
            <ChatLoadingDots />
          </div>
        ) : (
          children
        )}
      </div>
    );
  },
);
