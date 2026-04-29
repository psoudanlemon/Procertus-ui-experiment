import * as React from "react";

import { cn } from "@/lib/utils";

import type { ChatBubbleVariant } from "./chat-types";

export type ChatBubbleProps = React.ComponentProps<"div"> & {
  variant: ChatBubbleVariant;
};

/**
 * Row wrapper for one chat line (ported from `chat-bubble.svelte`).
 * Use with `ChatBubbleAvatar` + `ChatBubbleMessage` as children.
 */
export const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(function ChatBubble(
  { className, variant, ...props },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      data-variant={variant}
      className={cn(
        "group/chat-bubble flex max-w-[80%] flex-row place-items-end gap-component data-[variant=sent]:place-self-end",
        className,
      )}
      {...props}
    />
  );
});
