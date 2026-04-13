"use client";

import * as React from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

// ---------------------------------------------------------------------------
// SidebarNavIcon
// ---------------------------------------------------------------------------

type SidebarNavIconProps = {
  icon: IconSvgElement;
  className?: string;
};

/**
 * A sidebar navigation icon using Hugeicons Stroke style with Symbolic Duality
 * colorway. Designed to sit inside a `SidebarMenuButton` whose parent
 * `SidebarMenuItem` carries `group/menu-item`.
 *
 * Resting state:
 *   Icon color: brand-primary-700.
 *
 * Hover / active state:
 *   Icon color: brand-primary-700 (unchanged, text shifts to match).
 *
 * Color transitions are handled via `transition-colors duration-200`.
 */
const SidebarNavIcon = React.memo(function SidebarNavIcon({
  icon,
  className,
}: SidebarNavIconProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center transition-colors duration-200 [&_svg]:size-4 [&_svg]:shrink-0 ${className ?? ""}`}
    >
      <HugeiconsIcon
        icon={icon}
        size={16}
        color="var(--color-brand-primary-700)"
        className="dark:hidden"
      />
      <HugeiconsIcon
        icon={icon}
        size={16}
        color="var(--color-brand-accent-300)"
        className="hidden dark:inline-block"
      />
    </span>
  );
});

export { SidebarNavIcon };
export type { SidebarNavIconProps };
