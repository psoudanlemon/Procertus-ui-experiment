import { useCallback, useLayoutEffect, useRef, useState } from "react";

function isNearBottom(el: HTMLDivElement, tolerance = 2) {
  return el.scrollTop + el.clientHeight >= el.scrollHeight - tolerance;
}

/**
 * Mirrors shadcn-svelte-extras `UseAutoScroll`: scroll container ref, bottom detection,
 * optional auto-scroll on content growth, scroll-to-bottom control.
 */
export function useChatAutoScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const lastScrollHeightRef = useRef(0);
  const userHasScrolledRef = useRef(false);
  const [atBottom, setAtBottom] = useState(true);

  const syncBottomState = useCallback(() => {
    const el = ref.current;
    if (!el) {
      setAtBottom(true);
      return;
    }
    const bottom = isNearBottom(el);
    setAtBottom(bottom);
    if (bottom) {
      userHasScrolledRef.current = false;
    } else {
      userHasScrolledRef.current = true;
    }
  }, []);

  const scrollToBottom = useCallback((auto = false) => {
    const el = ref.current;
    if (!el) return;
    if (auto && userHasScrolledRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
    userHasScrolledRef.current = false;
    setAtBottom(true);
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    lastScrollHeightRef.current = el.scrollHeight;
    el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
    setAtBottom(true);
    userHasScrolledRef.current = false;

    const onScroll = () => {
      syncBottomState();
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    const observer = new MutationObserver(() => {
      if (!el) return;
      if (el.scrollHeight !== lastScrollHeightRef.current) {
        lastScrollHeightRef.current = el.scrollHeight;
        scrollToBottom(true);
      }
    });
    observer.observe(el, { childList: true, subtree: true });

    const onResize = () => {
      scrollToBottom(true);
    };
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [scrollToBottom, syncBottomState]);

  return { ref, isAtBottom: atBottom, scrollToBottom };
}
