import { Button, PageHeader, PublicRegistryAppShell, cn, type FooterProps } from "@procertus-ui/ui";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type TrajectLayoutAction = {
  label: string;
  onClick: () => void;
};

export type TrajectPageFrameProps = {
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
   * Optional action bar pinned to the viewport bottom while the page scrolls. Sits
   * directly inside the page's main card, so it visually closes off the card and
   * releases just above the public footer when the user scrolls to the document end.
   */
  actionBar?: ReactNode;
  /**
   * Optional row rendered inside the sticky action bar, directly above the `actionBar`
   * buttons. Used by pages that need a mobile-only context bar (e.g. basket summary
   * on the product selection page); the consumer gates its own visibility (e.g. `md:hidden`).
   */
  aboveActionBar?: ReactNode;
  /**
   * Vertical gap between back-link / `PageHeader` / `children`. Defaults to `"region"` per the
   * top-level rhythm guideline; pages whose body owns its own internal spacing (e.g. tightly
   * coupled overview + sticky toolbar) can drop to `"section"` for a tighter join.
   */
  bodyGap?: "region" | "section";
};

export type TrajectLayoutProps = TrajectPageFrameProps & {
  /** Header sign-in callback (standalone shell — omitted when using {@link TrajectPageFrame} inside a host shell). */
  onSignInClick: () => void;
  /** Footer config for {@link PublicRegistryAppShell}. Omit for pages that should not show the public footer. */
  footer?: FooterProps;
};

/**
 * Traject page chrome inside an existing {@link PublicRegistryAppShell} (or Storybook wrapper).
 * Title column, optional sticky action bar, no outer registry shell — see {@link TrajectLayout} for the full shell.
 */
export function TrajectPageFrame({
  backAction,
  kicker,
  title,
  description,
  children,
  actionBar,
  aboveActionBar,
  bodyGap = "region",
}: TrajectPageFrameProps) {
  const gapClass = bodyGap === "section" ? "gap-section" : "gap-region";
  // Wanneer `aboveActionBar` aanwezig is (mobile-only samenvattingsbalk via `md:hidden`),
  // levert die zelf zijn `pb-component` (12px). De action-rij laat dan haar eigen top-padding
  // vallen op mobiel zodat de visuele tussenruimte exact 12px is, en herstelt `pt-region`
  // vanaf `md:` waar de bovenste balk is uitgeschakeld.
  const actionRowSpacing = aboveActionBar != null ? "pt-0 pb-section md:pt-section" : "py-section";

  const actionBarRef = useRef<HTMLDivElement>(null);
  const [hasContentBelow, setHasContentBelow] = useState(false);

  useEffect(() => {
    if (actionBar == null) return;
    const barEl = actionBarRef.current;
    if (barEl == null || typeof document === "undefined") return;

    /**
     * Guest/public layouts (`html[data-public-layout]`) often scroll the document instead of an
     * inner overflow pane. Prefer ancestors whose overflow settings actually absorb scroll; fall
     * back to the document when `html` is the scroll root.
     */
    function resolveScrollRoot(start: HTMLElement): HTMLElement | null {
      let parent: HTMLElement | null = start.parentElement;
      while (parent != null) {
        const overflowY = getComputedStyle(parent).overflowY;
        if (
          overflowY === "auto" ||
          overflowY === "scroll" ||
          overflowY === "overlay"
        ) {
          if (parent.scrollHeight > parent.clientHeight + 2) return parent;
        }
        parent = parent.parentElement;
      }
      const docEl = document.documentElement;
      if (docEl.scrollHeight > window.innerHeight + 2) return docEl;
      return null;
    }

    const scrollRoot = resolveScrollRoot(barEl);
    const isDocumentScroll =
      scrollRoot == null || scrollRoot === document.documentElement;

    const update = () => {
      if (isDocumentScroll) {
        const docEl = document.documentElement;
        const top = window.scrollY || docEl.scrollTop;
        setHasContentBelow(top + window.innerHeight < docEl.scrollHeight - 1);
        return;
      }
      setHasContentBelow(
        scrollRoot.scrollTop + scrollRoot.clientHeight < scrollRoot.scrollHeight - 1,
      );
    };

    update();

    const scrollTarget: Window | HTMLElement = isDocumentScroll ? window : scrollRoot;
    scrollTarget.addEventListener("scroll", update, { passive: true });

    const ro = new ResizeObserver(update);
    ro.observe(isDocumentScroll ? document.documentElement : scrollRoot);

    return () => {
      scrollTarget.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [actionBar]);

  return (
    <div data-slot="traject-layout" className="flex flex-1 flex-col">
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
        <div
          ref={actionBarRef}
          data-slot="traject-action-bar"
          className="sticky bottom-0 z-10 mt-auto rounded-b-xl bg-background"
        >
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 -top-8 h-8 bg-linear-to-t from-card to-transparent transition-opacity duration-200",
              hasContentBelow ? "opacity-100" : "opacity-0",
            )}
          />
          <div className="rounded-b-md bg-card">
            {aboveActionBar}
            <div
              className={`mx-auto flex w-full max-w-7xl items-center justify-between gap-component px-boundary ${actionRowSpacing}`}
            >
              {actionBar}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Storybook / standalone: full {@link PublicRegistryAppShell} plus {@link TrajectPageFrame}.
 * Host apps that already render the registry shell should use {@link TrajectPageFrame} only.
 */
export function TrajectLayout({ onSignInClick, footer, ...frame }: TrajectLayoutProps) {
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
      <TrajectPageFrame {...frame} />
    </PublicRegistryAppShell>
  );
}
