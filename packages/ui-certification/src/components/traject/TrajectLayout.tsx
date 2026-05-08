import {
  Button,
  PageHeader,
  PublicRegistryAppShell,
  type FooterProps,
} from "@procertus-ui/ui";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

export type TrajectLayoutAction = {
  label: string;
  onClick: () => void;
};

export type TrajectLayoutProps = {
  /** Header sign-in callback (rendered as the "Log in" link in the public header). */
  onSignInClick: () => void;
  /** Footer config for {@link PublicRegistryAppShell}. Omit for pages that should not show the public footer. */
  footer?: FooterProps;
  /** Optional “Terug” link rendered above the page title block. */
  backAction?: TrajectLayoutAction;
  /** Small uppercase eyebrow above the page title (e.g. category label). */
  kicker?: ReactNode;
  /** Page heading. Omit when the page body already provides its own primary header (e.g. an embedded wizard). */
  title?: ReactNode;
  /** Supporting copy below the title. */
  description?: ReactNode;
  /** Page body, rendered below the title block. */
  children: ReactNode;
  /**
   * Optional sticky action bar pinned to the bottom of the AppShell card. Surface stretches
   * full-width inside the registry card; the inner content stays capped at the same `max-w-7xl`
   * column as `children` so buttons align with the page content above.
   */
  actionBar?: ReactNode;
  /**
   * Vertical gap between back-link / `PageHeader` / `children`. Defaults to `"region"` per the
   * top-level rhythm guideline; pages whose body owns its own internal spacing (e.g. tightly
   * coupled overview + sticky toolbar) can drop to `"section"` for a tighter join.
   */
  bodyGap?: "region" | "section";
};

/**
 * Public traject pages (wegwijzer ➜ triage ➜ wizard ➜ expert call) share this chrome:
 * registry header, optional footer, capped 7xl content column with consistent boundary
 * padding, optional back link, and a `PageHeader` for the title block. Page-specific
 * content lives in `children`.
 */
export function TrajectLayout({
  onSignInClick,
  footer,
  backAction,
  kicker,
  title,
  description,
  children,
  actionBar,
  bodyGap = "region",
}: TrajectLayoutProps) {
  const gapClass = bodyGap === "section" ? "gap-section" : "gap-region";
  return (
    <PublicRegistryAppShell
      hideFab
      header={{
        logo: (
          <img
            src={procertusLogo}
            alt="PROCERTUS, certification that builds trust"
            className="h-8 w-auto dark:brightness-0 dark:invert"
          />
        ),
        onLogin: onSignInClick,
      }}
      footer={footer}
    >
      <div className={`mx-auto flex w-full max-w-7xl flex-col p-boundary ${gapClass}`}>
        {backAction ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2 self-start text-muted-foreground"
            onClick={backAction.onClick}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            {backAction.label}
          </Button>
        ) : null}
        {title != null ? (
          <PageHeader kicker={kicker} title={title} description={description} />
        ) : null}
        {children}
      </div>
      {actionBar ? (
        <div className="sticky bottom-0 z-10 mt-auto rounded-b-xl border-t border-border bg-muted">
          <div className="flex w-full items-center justify-between gap-component px-boundary py-section">
            {actionBar}
          </div>
        </div>
      ) : null}
    </PublicRegistryAppShell>
  );
}
