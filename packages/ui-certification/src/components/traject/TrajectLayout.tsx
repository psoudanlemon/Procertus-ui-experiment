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
}: TrajectLayoutProps) {
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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-region p-boundary">
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
    </PublicRegistryAppShell>
  );
}
