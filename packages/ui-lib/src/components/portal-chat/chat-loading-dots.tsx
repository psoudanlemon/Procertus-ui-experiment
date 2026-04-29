import { cn } from "@/lib/utils";

export type ChatLoadingDotsProps = {
  /** Dot diameter in pixels (Svelte default 4). */
  size?: number;
  className?: string;
};

/**
 * Three-dot typing indicator (ported from shadcn-svelte-extras `loading-dots.svelte`).
 */
export function ChatLoadingDots({ size = 4, className }: ChatLoadingDotsProps) {
  const px = `${size}px`;
  return (
    <>
      <style>{`
        @keyframes portal-chat-loading-dot {
          0%, 80%, 100% { opacity: 0.25; }
          40% { opacity: 1; }
        }
        .portal-chat-loading-dot {
          animation: portal-chat-loading-dot 1.4s ease-in-out infinite both;
        }
        .portal-chat-loading-dot:nth-of-type(2) { animation-delay: 0.2s; }
        .portal-chat-loading-dot:nth-of-type(3) { animation-delay: 0.4s; }
      `}</style>
      <div
        className={cn("inline-flex items-center gap-micro", className)}
        style={{ ["--loading-dot-size" as string]: px }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="portal-chat-loading-dot bg-primary inline-block rounded-full"
            style={{ width: px, height: px }}
          />
        ))}
      </div>
    </>
  );
}
