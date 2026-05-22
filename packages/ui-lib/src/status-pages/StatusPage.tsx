import * as React from "react";
import type { IconSvgElement } from "@hugeicons/react";
import procertusLogo from "@procertus-ui/ui/assets/Procertus Logo with tagline.svg";

import { cn } from "@procertus-ui/ui";

import { StatusContent } from "./StatusContent";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StatusPageAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  icon?: IconSvgElement;
};

export type StatusPageProps = {
  /** Logo element rendered at the top of the inner column. Defaults to the PROCERTUS wordmark image. Pass `null` to hide. */
  logo?: React.ReactNode | null;
  /**
   * Href for the logo link (middle-click, copy link). When `onLogoClick` is set,
   * navigation uses that callback instead of a full document load. Default `/`.
   * Pass an empty string to skip the anchor wrapper (e.g. when the logo node
   * already contains its own link).
   */
  logoHref?: string;
  /** Client navigation for the logo (e.g. React Router). When set, click does not perform a full document load. */
  onLogoClick?: () => void;
  /** Accessible name for the logo link. Defaults to "Naar startpagina". */
  logoAriaLabel?: string;
  /** Large icon displayed above the heading. */
  icon?: IconSvgElement;
  /** Optional image/illustration element — replaces the icon when provided. */
  illustration?: React.ReactNode;
  /** Main heading. */
  heading: string;
  /** Supporting description — string or richer markup when passed through to {@link StatusContent}. */
  description?: React.ReactNode;
  /** Action buttons. */
  actions?: StatusPageAction[];
  /**
   * Optional content rendered below the status card, centered and outside the card
   * (same max width as the card for alignment).
   */
  children?: React.ReactNode;
  /** Additional className on the outer container. */
  className?: string;
  /**
   * Width and layout of the centered column containing the card and optional children.
   * Default stays narrow ({@link StatusPage} confirmations); widen for dense summaries.
   */
  innerColumnClassName?: string;
  /** ClassNames for the block below the primary status card (default centered text). */
  belowCardClassName?: string;
  /** Optional className merged into the primary {@link StatusContent} card (e.g. `max-w-full`). */
  statusContentClassName?: string;
};

// ---------------------------------------------------------------------------
// Watermark
// ---------------------------------------------------------------------------

function BrandWatermark() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-0 bottom-0 h-auto w-[420px] translate-x-[15%] translate-y-[10%] opacity-[0.12] sm:w-[540px] md:w-[660px] dark:opacity-[0.18]"
      viewBox="34 35 114 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M98.15 90.99L82.03 76.66C76.95 72.15 76.5 64.38 81.01 59.3L81.38 58.88L101.94 77.15L128.8 46.46C133.43 41.17 141.48 40.63 146.77 45.26L146.86 45.34L107.43 90.41C105.04 93.14 100.88 93.41 98.16 90.99H98.15Z"
        fill="#71D2C1"
      />
      <path
        d="M85.01 37.78L101.13 52.11C106.21 56.62 106.66 64.39 102.15 69.47L101.78 69.89L81.22 51.62L54.36 82.31C49.73 87.6 41.68 88.14 36.39 83.51L36.3 83.43L75.73 38.36C78.12 35.63 82.28 35.36 85 37.78H85.01Z"
        fill="#076293"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const defaultLogo = (
  <>
    <img
      src={procertusLogo}
      alt="PROCERTUS, certification that builds trust"
      className="h-16 w-auto dark:hidden"
    />
    <img
      src={procertusLogo}
      alt="PROCERTUS, certification that builds trust"
      className="hidden h-16 w-auto brightness-0 invert dark:block"
    />
  </>
);

function StatusPage({
  logo = defaultLogo,
  logoHref = "/",
  onLogoClick,
  logoAriaLabel = "Naar startpagina",
  icon,
  illustration,
  heading,
  description,
  actions,
  children,
  className,
  innerColumnClassName,
  belowCardClassName,
  statusContentClassName,
}: StatusPageProps) {
  const wrappedLogo =
    logo === null ? null : logoHref ? (
      <a
        href={logoHref}
        onClick={
          onLogoClick
            ? (e) => {
                e.preventDefault();
                onLogoClick();
              }
            : undefined
        }
        aria-label={logoAriaLabel}
        className="inline-flex rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {logo}
      </a>
    ) : (
      logo
    );

  return (
    <div
      className={`relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-background p-boundary ${className ?? ""}`}
    >
      {/* Brand watermark — bottom-right, partially off-screen */}
      <BrandWatermark />

      <div
        className={cn(
          "relative z-10 flex w-full flex-col items-center gap-region",
          innerColumnClassName ?? "max-w-md",
        )}
      >
        {wrappedLogo}
        <StatusContent
          icon={icon}
          illustration={illustration}
          heading={heading}
          description={description}
          actions={actions}
          className={statusContentClassName}
        />
        {children != null ? (
          <div
            className={cn(
              "flex w-full flex-col gap-section",
              belowCardClassName ?? "items-center text-center",
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { StatusPage };
