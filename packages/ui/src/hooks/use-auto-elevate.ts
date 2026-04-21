"use client";

import * as React from "react";

// Portaled overlays (tooltip, popover, dropdown, select, menu, ...) render at
// a fixed tier z-index. When the trigger lives inside a higher-elevation
// context (sheet, modal, stacked panel), the overlay's tier z-index can sit
// behind that context. This hook walks the trigger's ancestors on mount, finds
// the deepest stacking context, and lifts the overlay one layer above it so
// overlays are always visible from wherever they were triggered.
//
// Detection first tries `aria-controls` / `aria-describedby` pointing at the
// content element's id (used by tooltip, popover, dropdown, select). When
// that link is missing (hover-card, context-menu), it falls back to the
// currently open trigger identified by `[data-state="open"]` on a trigger
// data-slot.
export function useAutoElevate(
  contentRef: React.RefObject<HTMLElement | null>,
): number | undefined {
  const [zIndex, setZIndex] = React.useState<number | undefined>();

  React.useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const trigger =
      (content.id &&
        document.querySelector<HTMLElement>(
          `[aria-controls~="${content.id}"], [aria-describedby~="${content.id}"]`,
        )) ||
      document.querySelector<HTMLElement>(
        '[data-state="open"][data-slot$="-trigger"]',
      );
    if (!trigger) return;

    let max = 0;
    let el: HTMLElement | null = trigger.parentElement;
    while (el && el !== document.body) {
      const z = Number.parseInt(window.getComputedStyle(el).zIndex, 10);
      if (!Number.isNaN(z) && z > max) max = z;
      el = el.parentElement;
    }

    const own =
      Number.parseInt(window.getComputedStyle(content).zIndex, 10) || 0;
    if (max >= own) setZIndex(max + 1);
  }, [contentRef]);

  return zIndex;
}
