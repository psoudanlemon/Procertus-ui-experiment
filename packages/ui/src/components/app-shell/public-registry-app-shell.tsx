import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilePlusIcon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Footer, type FooterProps } from "@/components/footer";
import { PublicRegistryHeader, type PublicRegistryHeaderProps } from "@/components/public-header";
import { Button } from "@/components/ui/button";

export type PublicRegistryAppShellProps = {
  header: PublicRegistryHeaderProps;
  footer?: FooterProps;
  /**
   * Optional sticky action bar rendered above the footer inside the same bottom chrome.
   * Stays pinned to the viewport bottom on scroll so page-level CTAs remain reachable
   * without overlapping the footer.
   */
  actionBar?: React.ReactNode;
  /** Visual variant — "default" uses sidebar tokens, "transparent" uses background color throughout. */
  variant?: "default" | "transparent";
  /** URL for the request certificate flow. */
  requestUrl?: string;
  /** Callback when the FAB is clicked (overrides requestUrl). */
  onRequestCertificate?: () => void;
  /** Hide the FAB — useful for pages that have their own CTA. */
  hideFab?: boolean;
  /**
   * Lock the shell to the viewport so children manage their own internal scroll.
   * `fillViewport` flips `main` to `min-h-0 overflow-hidden` so the content area can use
   * `flex-1 + overflow-y-auto` itself. By default the AppShell already owns scroll on its
   * outer container — see commentary on the root `<div>` below.
   */
  fillViewport?: boolean;
  children: React.ReactNode;
};

function PublicRegistryAppShell({
  header,
  footer,
  actionBar,
  variant = "default",
  requestUrl = "#",
  onRequestCertificate,
  hideFab = false,
  fillViewport = false,
  children,
}: PublicRegistryAppShellProps) {
  const hasBottomChrome = actionBar != null || footer != null;
  const outerRef = React.useRef<HTMLDivElement>(null);
  const [scrolledAboveBottom, setScrolledAboveBottom] = React.useState(false);

  React.useEffect(() => {
    if (fillViewport || !hasBottomChrome) return;
    const el = outerRef.current;
    if (!el) return;

    const update = () => {
      setScrolledAboveBottom(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [fillViewport, hasBottomChrome]);

  return (
    /*
     * The AppShell owns its own scroll context. Rather than relying on document scroll
     * (which requires every ancestor — `body`, `#root`, `.app-wrapper`, `.app-height-chain` — to
     * release the `globals.css` `overflow:hidden` lock via `data-public-layout`), the outer is
     * a fixed-height flex column with `overflow-y-auto`. That way the sticky bottom chrome
     * pins reliably to the viewport bottom regardless of how the host app wraps the shell,
     * and the page header naturally scrolls away with the content above it.
     *
     * `fillViewport` keeps the legacy "children manage their own scroll" wiring (outer is
     * still h-svh, but with `overflow-hidden` so an inner scroll wrapper takes over).
     */
    <div
      ref={outerRef}
      data-slot="public-registry-app-shell"
      className={cn(
        "h-svh flex flex-col bg-sidebar [&>header]:border-b-0",
        fillViewport ? "overflow-hidden" : "overflow-y-auto",
      )}
    >
      <PublicRegistryHeader {...header} variant={variant} />
      <main
        className={cn(
          "relative mt-micro mx-section flex flex-1 flex-col rounded-xl bg-background",
          fillViewport && "min-h-0 overflow-hidden",
        )}
      >
        {children}

        {!hideFab && (
          <Button
            size="lg"
            className="absolute right-boundary bottom-boundary z-40 h-12 gap-component rounded-full px-component shadow-proc-lg"
            asChild
          >
            <a href={requestUrl} onClick={onRequestCertificate}>
              <HugeiconsIcon icon={FilePlusIcon} className="size-5" />
              <span className="hidden sm:inline">Certificaat aanvragen</span>
              <span className="sm:hidden">Aanvragen</span>
            </a>
          </Button>
        )}
      </main>
      {hasBottomChrome && (
        <div
          data-slot="public-registry-bottom-chrome"
          className={cn(
            "z-20 mx-section flex flex-col",
            fillViewport ? "static" : "sticky bottom-0",
          )}
        >
          <div
            aria-hidden
            data-slot="public-registry-bottom-chrome-scroll-fade"
            className={cn(
              "pointer-events-none absolute inset-x-0 -top-8 h-8 bg-linear-to-t from-background to-transparent transition-opacity duration-200",
              scrolledAboveBottom ? "opacity-100" : "opacity-0",
            )}
          />
          {actionBar}
          {footer && <Footer {...footer} variant={variant} />}
        </div>
      )}
    </div>
  );
}

export { PublicRegistryAppShell };
