import * as React from "react";
import type { IconSvgElement } from "@hugeicons/react";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";

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
  /** Logo element rendered at the very top. Defaults to the PROCERTUS wordmark image. Pass `null` to hide. */
  logo?: React.ReactNode | null;
  /** Large icon displayed above the heading. */
  icon?: IconSvgElement;
  /** Optional image/illustration element — replaces the icon when provided. */
  illustration?: React.ReactNode;
  /** Main heading. */
  heading: string;
  /** Supporting description text. */
  description?: string;
  /** Action buttons. */
  actions?: StatusPageAction[];
  /** Additional className on the outer container. */
  className?: string;
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
  icon,
  illustration,
  heading,
  description,
  actions,
  className,
}: StatusPageProps) {
  return (
    <div
      className={`relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-background p-boundary ${className ?? ""}`}
    >
      {/* Brand watermark — bottom-right, partially off-screen */}
      <BrandWatermark />

      {/* Logo — top center */}
      {logo !== null && (
        <div className="absolute top-boundary left-1/2 -translate-x-1/2">{logo}</div>
      )}

      <StatusContent
        icon={icon}
        illustration={illustration}
        heading={heading}
        description={description}
        actions={actions}
      />
    </div>
  );
}

export { StatusPage };
