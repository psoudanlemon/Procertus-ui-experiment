"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FadingScrollListProps = {
  children: React.ReactNode;
  /** Inline `max-height` value applied to the scroll container. */
  maxHeight?: string;
  /**
   * A Tailwind `from-*` color class matching the parent's background, e.g.
   * `from-popover`, `from-sidebar`, `from-background`. Used by the gradient
   * overlays so the scroll edges visually melt into the surrounding surface.
   */
  fadeColor?: string;
  /** Height of the top/bottom fade overlays. Defaults to `h-8` (32px). */
  fadeHeight?: string;
  /** Classes applied to the inner scrollable container. */
  className?: string;
};

/**
 * A scrollable container that renders top and bottom gradient overlays which
 * appear only when content can be scrolled in that direction. Useful inside
 * popovers, drawers, sheets, and sidebars where you want the scroll edges to
 * melt into the surrounding surface.
 */
function FadingScrollList({
  children,
  maxHeight,
  fadeColor = "from-background",
  fadeHeight = "h-8",
  className,
}: FadingScrollListProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = React.useState(false);
  const [canScrollDown, setCanScrollDown] = React.useState(false);

  const updateScroll = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateScroll();
    el.addEventListener("scroll", updateScroll, { passive: true });
    const observer = new ResizeObserver(updateScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      observer.disconnect();
    };
  }, [updateScroll]);

  return (
    <div data-slot="fading-scroll-list" className="relative">
      <div
        ref={ref}
        className={cn("flex flex-col overflow-y-auto", className)}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {children}
      </div>
      <div
        aria-hidden
        data-slot="fading-scroll-list-fade-top"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b to-transparent transition-opacity duration-150",
          fadeHeight,
          fadeColor,
          canScrollUp ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden
        data-slot="fading-scroll-list-fade-bottom"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent transition-opacity duration-150",
          fadeHeight,
          fadeColor,
          canScrollDown ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

export { FadingScrollList };
export type { FadingScrollListProps };
