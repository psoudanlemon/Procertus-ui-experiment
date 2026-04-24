import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilePlusIcon } from "@hugeicons/core-free-icons";

import { Button } from "@procertus-ui/ui";

import { PublicRegistryFooter, type PublicRegistryFooterProps } from "./PublicRegistryFooter";
import { PublicRegistryHeader, type PublicRegistryHeaderProps } from "./PublicRegistryHeader";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PublicRegistryAppShellProps = {
  header: PublicRegistryHeaderProps;
  footer?: PublicRegistryFooterProps;
  /** Visual variant — "default" uses sidebar tokens, "transparent" uses background color throughout. */
  variant?: "default" | "transparent";
  /** URL for the request certificate flow. */
  requestUrl?: string;
  /** Callback when the FAB is clicked (overrides requestUrl). */
  onRequestCertificate?: () => void;
  /** Hide the FAB — useful for pages that have their own CTA. */
  hideFab?: boolean;
  children: React.ReactNode;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function PublicRegistryAppShell({
  header,
  footer,
  variant = "default",
  requestUrl = "#",
  onRequestCertificate,
  hideFab = false,
  children,
}: PublicRegistryAppShellProps) {
  return (
    <div data-slot="public-registry-app-shell" className="flex min-h-svh flex-col bg-background">
      <PublicRegistryHeader {...header} variant={variant} />
      <main className="flex-1">{children}</main>
      {footer && <PublicRegistryFooter {...footer} variant={variant} />}

      {/* FAB — Request certificate */}
      {!hideFab && (
        <Button
          size="lg"
          className="fixed right-boundary bottom-boundary z-40 h-12 gap-component rounded-full px-component shadow-[var(--shadow-proc-lg)]"
          asChild
        >
          <a href={requestUrl} onClick={onRequestCertificate}>
            <HugeiconsIcon icon={FilePlusIcon} className="size-5" />
            <span className="hidden sm:inline">Certificaat aanvragen</span>
            <span className="sm:hidden">Aanvragen</span>
          </a>
        </Button>
      )}
    </div>
  );
}

export { PublicRegistryAppShell };
