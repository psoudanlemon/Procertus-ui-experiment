"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FadingScrollListProps = {
  children: React.ReactNode;
  /** Inline `max-height` (vertical) or `max-width` (horizontal) value applied to the scroll container. */
  maxHeight?: string;
  /**
   * A Tailwind `from-*` color class matching the parent's background, e.g.
   * `from-popover`, `from-sidebar`, `from-background`. Used by the gradient
   * overlays so the scroll edges visually melt into the surrounding surface.
   */
  fadeColor?: string;
  /**
   * Size of the fade overlays along the scroll axis. Defaults to `h-8` for
   * vertical (32px tall) and `w-8` for horizontal (32px wide).
   */
  fadeHeight?: string;
  /** Classes applied to the inner scrollable container. */
  className?: string;
  /**
   * Classes applied to the outer relative wrapper. Use when the list must
   * stretch to fill a flex parent (e.g. `flex flex-1 min-h-0 flex-col`).
   */
  wrapperClassName?: string;
  /**
   * Scroll axis. `vertical` fades top/bottom, `horizontal` fades left/right.
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal";
};

/**
 * A scrollable container that renders gradient overlays at the scroll edges
 * which appear only when content can be scrolled in that direction. Useful
 * inside popovers, drawers, sheets, and sidebars (vertical) or chip strips
 * and tab rows (horizontal) where the scroll edges should melt into the
 * surrounding surface.
 */
function FadingScrollList({
  children,
  maxHeight,
  fadeColor = "from-background",
  fadeHeight,
  className,
  wrapperClassName,
  orientation = "vertical",
}: FadingScrollListProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = React.useState(false);
  const [canScrollEnd, setCanScrollEnd] = React.useState(false);
  const isHorizontal = orientation === "horizontal";

  const updateScroll = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (isHorizontal) {
      setCanScrollStart(el.scrollLeft > 0);
      setCanScrollEnd(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    } else {
      setCanScrollStart(el.scrollTop > 0);
      setCanScrollEnd(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    }
  }, [isHorizontal]);

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

  const fadeSize = fadeHeight ?? (isHorizontal ? "w-8" : "h-8");

  return (
    <div data-slot="fading-scroll-list" className={cn("relative", wrapperClassName)}>
      <div
        ref={ref}
        data-orientation={orientation}
        className={cn(
          isHorizontal ? "overflow-x-auto" : "flex flex-col overflow-y-auto",
          className,
        )}
        style={
          maxHeight
            ? isHorizontal
              ? { maxWidth: maxHeight }
              : { maxHeight }
            : undefined
        }
      >
        {children}
      </div>
      <div
        aria-hidden
        data-slot="fading-scroll-list-fade-start"
        className={cn(
          "pointer-events-none absolute transition-opacity duration-150 to-transparent",
          isHorizontal
            ? cn("inset-y-0 left-0 bg-gradient-to-r", fadeSize)
            : cn("inset-x-0 top-0 bg-gradient-to-b", fadeSize),
          fadeColor,
          canScrollStart ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden
        data-slot="fading-scroll-list-fade-end"
        className={cn(
          "pointer-events-none absolute transition-opacity duration-150 to-transparent",
          isHorizontal
            ? cn("inset-y-0 right-0 bg-gradient-to-l", fadeSize)
            : cn("inset-x-0 bottom-0 bg-gradient-to-t", fadeSize),
          fadeColor,
          canScrollEnd ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

export { FadingScrollList };
export type { FadingScrollListProps };
