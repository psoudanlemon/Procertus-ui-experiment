import * as React from "react";

import { Avatar, cn } from "@procertus-ui/ui";

export type ChatBubbleAvatarProps = React.ComponentProps<typeof Avatar>;

/**
 * Avatar slot inside a `ChatBubble` (ported from `chat-bubble-avatar.svelte`).
 */
export function ChatBubbleAvatar({ className, ...props }: ChatBubbleAvatarProps) {
  return (
    <Avatar
      size="sm"
      className={cn("order-1 group-data-[variant=sent]/chat-bubble:order-2", className)}
      {...props}
    />
  );
}
