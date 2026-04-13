import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { StatusContent } from "./StatusContent";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StatusPageAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  icon?: LucideIcon;
};

export type StatusPageProps = {
  /** Logo element rendered at the very top. Defaults to the PROCERTUS wordmark image. Pass `null` to hide. */
  logo?: React.ReactNode | null;
  /** Large icon displayed above the heading. */
  icon?: LucideIcon;
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
      className="pointer-events-none absolute right-0 bottom-0 h-auto w-[420px] translate-x-[15%] translate-y-[10%] opacity-100 sm:w-[540px] md:w-[660px]"
      viewBox="0 0 979 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Light mode paths */}
      <path
        className="block dark:hidden"
        d="M547.152 485.365L404.547 358.595C359.607 318.697 355.626 249.96 395.523 205.019L398.797 201.304L580.681 362.929L818.297 91.4304C859.257 44.6324 930.471 39.8553 977.269 80.8146L978.065 81.5223L629.248 480.234C608.105 504.385 571.303 506.773 547.241 485.365H547.152Z"
        fill="#D4F3EC"
      />
      <path
        className="block dark:hidden"
        d="M430.913 14.6355L573.518 141.406C618.458 181.303 622.439 250.041 582.542 294.981L579.268 298.696L397.385 137.071L159.768 408.57C118.808 455.368 47.5941 460.145 0.796186 419.186L0 418.478L348.817 19.7665C369.96 -4.38444 406.762 -6.773 430.824 14.6355H430.913Z"
        fill="#E1F2FD"
      />
      {/* Dark mode paths */}
      <path
        className="hidden dark:block"
        d="M547.652 485.365L404.916 358.595C359.935 318.697 355.95 249.96 395.884 205.019L399.161 201.304L581.21 362.929L819.044 91.4304C860.041 44.6324 931.32 39.8553 978.161 80.8146L978.957 81.5223L629.822 480.234C608.66 504.385 571.825 506.773 547.74 485.365H547.652Z"
        fill="#0A2F47"
      />
      <path
        className="hidden dark:block"
        d="M431.306 14.6355L574.041 141.406C619.023 181.303 623.007 250.041 583.073 294.981L579.797 298.696L397.747 137.071L159.913 408.57C118.917 455.368 47.6376 460.145 0.796912 419.186L0 418.478L349.135 19.7665C370.298 -4.38444 407.133 -6.773 431.217 14.6355H431.306Z"
        fill="#0B2827"
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
      src="/Procertus Logo 1.png"
      alt="PROCERTUS — Certification that builds trust"
      className="h-16 w-auto dark:hidden"
    />
    <img
      src="/Procertus Logo 2.png"
      alt="PROCERTUS — Certification that builds trust"
      className="hidden h-16 w-auto dark:block"
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
