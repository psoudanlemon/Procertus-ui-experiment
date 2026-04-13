"use client";

import * as React from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

// ---------------------------------------------------------------------------
// Two-tone utility
// ---------------------------------------------------------------------------

/**
 * Converts a stroke icon into a two-tone variant by marking every other path
 * with an `opacity` attribute. The HugeiconsIcon component detects these
 * opacity-marked elements as "secondary" and applies `secondaryColor` to them.
 */
function toTwoTone(icon: IconSvgElement): IconSvgElement {
  return icon.map((entry, index) => {
    if (index % 2 === 1) {
      const [tag, attrs] = entry;
      return [tag, { ...attrs, opacity: 0.4 }] as const;
    }
    return entry;
  }) as unknown as IconSvgElement;
}

// ---------------------------------------------------------------------------
// SidebarNavIcon
// ---------------------------------------------------------------------------

type SidebarNavIconProps = {
  icon: IconSvgElement;
  className?: string;
};

/**
 * A sidebar navigation icon that renders in Two-Tone mode by default and
 * transitions to Stroke on hover. Designed to sit inside a `SidebarMenuButton`
 * whose parent `SidebarMenuItem` carries `group/menu-item`.
 *
 * Static state:
 *   Two-Tone with brand-primary-700 (primary) and brand-accent-300 (secondary).
 *   Dark mode uses brand-primary-300 / brand-accent-500.
 *
 * Hover state:
 *   Pure Stroke with the sidebar accent foreground color.
 */
const SidebarNavIcon = React.memo(function SidebarNavIcon({
  icon,
  className,
}: SidebarNavIconProps) {
  const twoToneIcon = React.useMemo(() => toTwoTone(icon), [icon]);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center [&_svg]:size-4 [&_svg]:shrink-0 ${className ?? ""}`}
    >
      {/* Two-Tone: visible by default, hidden on hover */}
      <span className="contents group-hover/menu-button:hidden">
        <HugeiconsIcon
          icon={twoToneIcon}
          size={16}
          strokeWidth={1.33}
          primaryColor="var(--color-brand-primary-700)"
          secondaryColor="var(--color-brand-accent-300)"
          className="dark:hidden"
        />
        <HugeiconsIcon
          icon={twoToneIcon}
          size={16}
          strokeWidth={1.33}
          primaryColor="var(--color-brand-primary-300)"
          secondaryColor="var(--color-brand-accent-500)"
          className="hidden dark:inline-block"
        />
      </span>

      {/* Stroke: hidden by default, visible on hover */}
      <span className="hidden group-hover/menu-button:contents">
        <HugeiconsIcon
          icon={icon}
          size={16}
          strokeWidth={1.33}
          color="currentColor"
        />
      </span>
    </span>
  );
});

export { SidebarNavIcon, toTwoTone };
export type { SidebarNavIconProps };
