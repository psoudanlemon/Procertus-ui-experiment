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
  /** Visual variant — "default" uses sidebar tokens, "transparent" uses background color throughout. */
  variant?: "default" | "transparent";
  /**
   * Pin the header to the top of the viewport on scroll. Off by default so the
   * marketing/registry header scrolls away naturally with the content; opt in for
   * shells where the header always needs to be reachable (e.g. dashboards).
   */
  stickyHeader?: boolean;
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

/**
 * Public registry / onboarding chrome.
 *
 * Composition contract:
 * - **Header** — always rendered, optionally sticky via `stickyHeader`.
 * - **Main** — scrollable content card, hosts page-level chrome (e.g. `TrajectLayout`).
 * - **Footer** — copyright/legal bar, always rendered at the **document end**,
 *   *not* pinned to the viewport.
 *
 * Page-level sticky UI (e.g. a traject action bar) belongs **inside `main`** and
 * uses `position: sticky; bottom: 0`. Because the footer lives outside the page
 * content wrapper, the sticky element releases naturally just above the footer
 * when the user scrolls to the document end.
 */
function PublicRegistryAppShell({
  header,
  footer,
  variant = "default",
  stickyHeader = false,
  requestUrl = "#",
  onRequestCertificate,
  hideFab = false,
  fillViewport = false,
  children,
}: PublicRegistryAppShellProps) {
  return (
    /*
     * The AppShell owns its own scroll context: a fixed-height flex column with
     * `overflow-y-auto`. That keeps `stickyHeader` and any page-level sticky UI
     * anchored to the shell's viewport, regardless of how the host app wraps it.
     *
     * `fillViewport` keeps the legacy "children manage their own scroll" wiring
     * (outer is still h-svh, but with `overflow-hidden` so an inner scroll
     * wrapper takes over).
     */
    <div
      data-slot="public-registry-app-shell"
      className={cn(
        "h-svh flex flex-col bg-sidebar [&_header]:border-b-0",
        fillViewport ? "overflow-hidden" : "overflow-y-auto",
      )}
    >
      <div
        data-slot="public-registry-header"
        className={cn(
          "shrink-0 bg-sidebar",
          stickyHeader && "sticky top-0 z-20",
        )}
      >
        <PublicRegistryHeader {...header} variant={variant} />
      </div>
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
      {footer && (
        <div data-slot="public-registry-footer" className="mx-section shrink-0">
          <Footer {...footer} variant={variant} />
        </div>
      )}
    </div>
  );
}

export { PublicRegistryAppShell };
