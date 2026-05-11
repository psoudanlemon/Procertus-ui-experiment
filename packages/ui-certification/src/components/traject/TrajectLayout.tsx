import {
  Button,
  PageHeader,
  PublicRegistryAppShell,
  cn,
  type FooterProps,
} from "@procertus-ui/ui";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

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
  const bodyTopSpacingClass = bodyGap === "section" ? "pt-section" : "pt-region";
  const hasHeader = backAction != null || title != null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [topFaded, setTopFaded] = useState(false);
  const [bottomFaded, setBottomFaded] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setTopFaded(el.scrollTop > 0);
      setBottomFaded(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <PublicRegistryAppShell
      hideFab
      fillViewport
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
      <div className="flex min-h-0 flex-1 flex-col">
        {hasHeader ? (
          <div
            data-slot="traject-layout-header"
            className={cn(
              "mx-auto flex w-full max-w-7xl flex-col px-boundary pt-boundary",
              gapClass,
            )}
          >
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
          </div>
        ) : null}
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            ref={scrollRef}
            className="flex min-h-0 flex-1 flex-col overflow-y-auto"
          >
            <div
              className={cn(
                "mx-auto flex w-full max-w-7xl flex-col px-boundary pb-boundary",
                hasHeader ? bodyTopSpacingClass : "pt-boundary",
              )}
            >
              {children}
            </div>
          </div>
          <div
            aria-hidden
            data-slot="traject-layout-scroll-fade-top"
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background to-transparent transition-opacity duration-200",
              topFaded ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            aria-hidden
            data-slot="traject-layout-scroll-fade-bottom"
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-background to-transparent transition-opacity duration-200",
              bottomFaded ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      </div>
      {actionBar ? (
        <div className="z-10 rounded-b-xl border-t border-border bg-muted">
          <div className="flex w-full items-center justify-between gap-component px-boundary py-section">
            {actionBar}
          </div>
        </div>
      ) : null}
    </PublicRegistryAppShell>
  );
}
