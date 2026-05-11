import { useEffect, useRef, useState } from "react";

export type UseForceScrollConfirmationResult = {
  /** Attach to the scroll container that should be fully read. */
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  /** `true` once the sentinel (at the bottom of the page body) has entered the viewport. */
  hasReachedBottom: boolean;
};

/**
 * Mounts an `IntersectionObserver` on a sentinel placed at the document end and
 * flips `hasReachedBottom` to `true` once it scrolls into view. Used to gate the
 * "Bevestig en verzend"-knop op de aanvraag-validatiepagina.
 *
 * The hook latches: once the user has reached the bottom, the flag stays true
 * even if they scroll back up.
 */
export function useForceScrollConfirmation(): UseForceScrollConfirmationResult {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);

  useEffect(() => {
    if (hasReachedBottom) return;
    const el = sentinelRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setHasReachedBottom(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasReachedBottom(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -120px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasReachedBottom]);

  return { sentinelRef, hasReachedBottom };
}
