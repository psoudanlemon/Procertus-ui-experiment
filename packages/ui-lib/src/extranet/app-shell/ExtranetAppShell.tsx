import * as React from "react";
import { FilePlusIcon } from "lucide-react";

import { Button } from "@procertus-ui/ui";

import { ExtranetFooter, type ExtranetFooterProps } from "./ExtranetFooter";
import { ExtranetHeader, type ExtranetHeaderProps } from "./ExtranetHeader";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ExtranetAppShellProps = {
  header: ExtranetHeaderProps;
  footer?: ExtranetFooterProps;
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

function ExtranetAppShell({
  header,
  footer,
  variant = "default",
  requestUrl = "#",
  onRequestCertificate,
  hideFab = false,
  children,
}: ExtranetAppShellProps) {
  return (
    <div data-slot="extranet-app-shell" className="flex min-h-svh flex-col bg-background">
      <ExtranetHeader {...header} variant={variant} />
      <main className="flex-1">{children}</main>
      {footer && <ExtranetFooter {...footer} variant={variant} />}

      {/* FAB — Request certificate */}
      {!hideFab && (
        <Button
          size="lg"
          className="fixed right-4 bottom-4 z-40 h-12 gap-2 rounded-full px-5 shadow-lg sm:right-6 sm:bottom-6"
          asChild
        >
          <a href={requestUrl} onClick={onRequestCertificate}>
            <FilePlusIcon className="size-5" />
            <span className="hidden sm:inline">Certificaat aanvragen</span>
            <span className="sm:hidden">Aanvragen</span>
          </a>
        </Button>
      )}
    </div>
  );
}

export { ExtranetAppShell };
