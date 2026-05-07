import React from "react";
import { motion } from "framer-motion";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { sidePanelSurfaceClassName } from "@/components/ui/side-panel-surface";
import { cn } from "@/lib/utils";
import type { CalculatedPanelState } from "./types";

// Expect the full state object
interface PanelProps {
  panel: CalculatedPanelState;
  onClose: (panelId: string) => void;
  onActivate: (panelId: string) => void;
}

// Animation Variants - Refined logic
const panelVariants = {
  initial: (position: CalculatedPanelState["position"]) => ({
    opacity: 0,
    right: -position.width,
  }),
  // Hidden state only affects opacity. `right` remains where it was.
  hidden: (position: CalculatedPanelState["position"]) => ({
    opacity: 0,
    right: position.right,
  }),
  // Use calculated position.right for visible states
  full: (position: CalculatedPanelState["position"]) => ({
    opacity: 1,
    right: position.right,
  }),
  stacked: (position: CalculatedPanelState["position"]) => ({
    opacity: 1,
    right: position.right,
  }),
  // Exit animates fully off-screen
  exit: (position: CalculatedPanelState["position"]) => ({
    opacity: 0,
    right: -position.width, // Animate fully off-screen on exit
  }),
};

// Define the transition
const panelTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 40,
  // Transitions apply to properties being animated by the target variant
};

export function Panel({ panel, onClose, onActivate }: PanelProps) {
  const { id, content, state, mode, position } = panel;

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent activating when closing
    onClose(id);
  };

  // Add onClick handler for activation
  const handleClick = () => {
    if (state === "stacked") {
      onActivate(id);
    }
  };

  return (
    <motion.div
      key={id}
      variants={panelVariants}
      transition={panelTransition}
      custom={position} // Pass position data to variants
      animate={state} // Animate between hidden, full, stacked
      initial="initial" // Start hidden (opacity 0, initial right might be 0 or from initial render)
      exit="exit"
      onClick={state === "stacked" ? handleClick : undefined}
      className={cn(
        "absolute inset-y-0 flex flex-col",
        {
          "fixed z-50": mode === "overlay",
        },
        state === "stacked" ? "cursor-pointer" : "cursor-default",
      )}
      style={{
        width: position.width,
        zIndex: position.zIndex,
        overflow: "hidden",
        // Set pointer events directly based on state, not animated
        pointerEvents: state === "hidden" ? "none" : "auto",
      }}
    >
      {/* Inner div ALWAYS uses position.width */}
      <div
        className={sidePanelSurfaceClassName({
          inset: true,
          padded: false,
          className: "relative h-[calc(100%-2rem)] max-sm:h-full",
        })}
        style={{ width: `calc(${position.width}px - 2rem)` }}
      >
        {content}
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="absolute right-3 top-3"
          onClick={handleClose}
        >
          <HugeiconsIcon icon={Cancel01Icon} />
          <span className="sr-only">Close panel</span>
        </Button>
      </div>
    </motion.div>
  );
}

// Remove constant that's now passed via position
// const DEFAULT_PANEL_WIDTH = 504;
