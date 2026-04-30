import * as React from "react";

import { usePrototypeOverlay } from "./PrototypeOverlayProvider";
import type { PrototypeOverlayOptions } from "./prototype-overlay-types";

/**
 * Shows a prototype overlay for the lifetime of the calling component.
 * On unmount, the overlay is dismissed (same exit transition as {@link usePrototypeOverlay dismiss}).
 *
 * Prefer a stable `getOptions` (e.g. read from constants defined outside the component) or pass
 * `deps` when option fields depend on props/state.
 */
export function usePrototypeOverlayOnMount(
  getOptions: () => PrototypeOverlayOptions,
  deps: React.DependencyList = [],
): void {
  const { show, dismiss } = usePrototypeOverlay();

  React.useEffect(() => {
    show(getOptions());
    return () => dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps argument carries intentional deps
  }, [show, dismiss, ...deps]);
}
