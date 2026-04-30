import type * as React from "react";

import type { PrototypeCardProps } from "../mock-prototype-auth/PrototypeCard";

/** Default wait after {@link show} before the enter animation starts (ms). */
export const PROTOTYPE_OVERLAY_DEFAULT_SHOW_DELAY_MS = 450;

/** Default enter/exit transition duration (ms). */
export const PROTOTYPE_OVERLAY_DEFAULT_TRANSITION_MS = 320;

/** Default easing for enter/exit (smooth deceleration). */
export const PROTOTYPE_OVERLAY_DEFAULT_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Content for a globally hosted prototype note card (portal + high z-index).
 * Mirrors {@link PrototypeCardProps} except `children` is optional for overlay-only copy.
 */
export type PrototypeOverlayOptions = Omit<Partial<PrototypeCardProps>, "children"> & {
  children?: React.ReactNode;
  /** Corner placement of the card within the viewport. @default "top-right" */
  placement?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Accessible label for the overlay region. */
  overlayAriaLabel?: string;
  /**
   * Ms to wait after `show` before starting the enter animation.
   * Set to `0` to appear immediately. @default {@link PROTOTYPE_OVERLAY_DEFAULT_SHOW_DELAY_MS}
   */
  showDelayMs?: number;
  /**
   * Enter/exit transition duration (ms). @default {@link PROTOTYPE_OVERLAY_DEFAULT_TRANSITION_MS}
   */
  transitionDurationMs?: number;
  /**
   * CSS `transition-timing-function` for enter/exit.
   * @default {@link PROTOTYPE_OVERLAY_DEFAULT_EASING}
   */
  transitionEasing?: string;
};
