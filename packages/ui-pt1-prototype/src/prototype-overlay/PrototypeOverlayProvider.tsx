import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { createPortal } from "react-dom";

import { Button } from "@procertus-ui/ui";

import { PrototypeCard } from "../mock-prototype-auth/PrototypeCard";
import { cn } from "../lib/utils";

import type { PrototypeOverlayOptions } from "./prototype-overlay-types";
import {
  PROTOTYPE_OVERLAY_DEFAULT_EASING,
  PROTOTYPE_OVERLAY_DEFAULT_SHOW_DELAY_MS,
  PROTOTYPE_OVERLAY_DEFAULT_TRANSITION_MS,
} from "./prototype-overlay-types";

// Above app chrome and default dialog stack (e.g. dialog content uses z-40 in @procertus-ui/ui).
const OVERLAY_Z = "z-[100]";

const placementClass: Record<NonNullable<PrototypeOverlayOptions["placement"]>, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
};

function resolveTransitionMs(options: PrototypeOverlayOptions | null) {
  return options?.transitionDurationMs ?? PROTOTYPE_OVERLAY_DEFAULT_TRANSITION_MS;
}

function resolveEasing(options: PrototypeOverlayOptions | null) {
  return options?.transitionEasing ?? PROTOTYPE_OVERLAY_DEFAULT_EASING;
}

export type PrototypeOverlayDispatch = {
  /** Show or replace the global prototype overlay card (portal to `document.body`). */
  show: (options: PrototypeOverlayOptions) => void;
  /** Start exit transition, then unmount. Safe to call when already dismissed. */
  dismiss: () => void;
};

const PrototypeOverlayContext = React.createContext<PrototypeOverlayDispatch | undefined>(
  undefined,
);

export type PrototypeOverlayProviderProps = {
  children: React.ReactNode;
};

/**
 * Single host for “prototype question” cards: imperative API (like {@link DialogProvider}),
 * fixed positioning, enter/exit transitions, dismiss control, and stacking above the rest of the UI.
 *
 * Default timing: {@link PROTOTYPE_OVERLAY_DEFAULT_SHOW_DELAY_MS} before enter, then
 * {@link PROTOTYPE_OVERLAY_DEFAULT_TRANSITION_MS} with {@link PROTOTYPE_OVERLAY_DEFAULT_EASING}
 * (fade + slide in from the right: `translate-x-10` → `translate-x-0`). Override per call via
 * `showDelayMs` / `transitionDurationMs` / `transitionEasing`.
 */
export function PrototypeOverlayProvider({ children }: PrototypeOverlayProviderProps) {
  const [payload, setPayload] = React.useState<PrototypeOverlayOptions | null>(null);
  const [entered, setEntered] = React.useState(false);
  const enteredRef = React.useRef(false);
  const dismissRequestedRef = React.useRef(false);
  const enterDelayTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useLayoutEffect(() => {
    enteredRef.current = entered;
  }, [entered]);

  React.useEffect(() => {
    return () => {
      if (enterDelayTimerRef.current != null) {
        clearTimeout(enterDelayTimerRef.current);
      }
    };
  }, []);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const clearEnterDelay = React.useCallback(() => {
    if (enterDelayTimerRef.current != null) {
      clearTimeout(enterDelayTimerRef.current);
      enterDelayTimerRef.current = null;
    }
  }, []);

  const dismiss = React.useCallback(() => {
    clearEnterDelay();
    dismissRequestedRef.current = true;
    setEntered(false);
  }, [clearEnterDelay]);

  const show = React.useCallback(
    (options: PrototypeOverlayOptions) => {
      clearEnterDelay();
      dismissRequestedRef.current = false;
      setPayload(options);
      if (enteredRef.current) {
        return;
      }
      setEntered(false);
      const delayMs = options.showDelayMs ?? PROTOTYPE_OVERLAY_DEFAULT_SHOW_DELAY_MS;
      const runEnter = () => {
        enterDelayTimerRef.current = null;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setEntered(true));
        });
      };
      if (delayMs <= 0) {
        runEnter();
      } else {
        enterDelayTimerRef.current = setTimeout(runEnter, delayMs);
      }
    },
    [clearEnterDelay],
  );

  const handleTransitionEnd = React.useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== "opacity") return;
      if (!enteredRef.current) {
        dismissRequestedRef.current = false;
        setPayload(null);
      }
    },
    [],
  );

  const exitFallbackMs = resolveTransitionMs(payload) + 100;

  // Fallback if transition end does not fire after an explicit dismiss (e.g. background tab).
  React.useEffect(() => {
    if (entered || !payload || !dismissRequestedRef.current) return;
    const t = window.setTimeout(() => {
      dismissRequestedRef.current = false;
      setPayload(null);
    }, exitFallbackMs);
    return () => window.clearTimeout(t);
  }, [entered, payload, exitFallbackMs]);

  const value = React.useMemo<PrototypeOverlayDispatch>(() => ({ show, dismiss }), [dismiss, show]);

  const transitionMs = resolveTransitionMs(payload);
  const transitionEasing = resolveEasing(payload);

  const portal =
    mounted && payload && typeof document !== "undefined"
      ? createPortal(
          <div className={cn("pointer-events-none fixed inset-0", OVERLAY_Z)}>
            <div
              className={cn(
                "pointer-events-auto absolute w-[min(22rem,calc(100vw-2rem))] text-left shadow-(--shadow-proc-md) will-change-[opacity,transform]",
                placementClass[payload.placement ?? "top-right"],
                entered
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0",
              )}
              style={{
                transitionProperty: "opacity, transform",
                transitionDuration: `${transitionMs}ms`,
                transitionTimingFunction: transitionEasing,
              }}
              role="dialog"
              aria-modal="false"
              aria-label={payload.overlayAriaLabel ?? "Prototype-notitie"}
              onTransitionEnd={handleTransitionEnd}
            >
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-2 left-2 z-20 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={dismiss}
                  aria-label="Sluiten"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-4" aria-hidden />
                </Button>
                <PrototypeCard
                  title={payload.title}
                  description={payload.description}
                  notice={payload.notice}
                  showDemoBadge={payload.showDemoBadge}
                  demoBadgeLabel={payload.demoBadgeLabel}
                  demoBadgeTitle={payload.demoBadgeTitle}
                  className={cn("pt-10", payload.className)}
                  cardContentClassName={payload.cardContentClassName}
                >
                  {payload.children ?? null}
                </PrototypeCard>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <PrototypeOverlayContext.Provider value={value}>
      {children}
      {portal}
    </PrototypeOverlayContext.Provider>
  );
}

export function usePrototypeOverlay(): PrototypeOverlayDispatch {
  const ctx = React.useContext(PrototypeOverlayContext);
  if (ctx === undefined) {
    throw new Error("usePrototypeOverlay must be used within a PrototypeOverlayProvider");
  }
  return ctx;
}
