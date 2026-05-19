import { cn } from "@procertus-ui/ui";

/** Named container for the dashboard page shell and bento grid (inline-size breakpoints below). */
export const DASHBOARD_CONTAINER = "dashboard";

/**
 * Dashboard layout responds to content-area width, not viewport.
 *
 * - Under 40rem: single column, compact page gutters
 * - ≥ 40rem: roomier gutters
 * - ≥ 48rem: two-column bento (session+invoices | certification), notifications full width
 * - ≥ 64rem: three-column bento (4 + 5 + 3), equal-height columns
 *
 * Keep `@container/dashboard` as a literal string so Tailwind emits the utility (template
 * strings are not scanned).
 */
export const dashboardContainerClass = "@container/dashboard w-full min-w-0";

/** Shared flat card shell for dashboard bento tiles. */
export const DASHBOARD_FLAT_CARD_CLASS =
  "border-0 p-section shadow-none ring-0 backdrop-blur-0";

/** Drop inner horizontal padding on CardHeader / CardContent when the card uses outer `p-section`. */
export const DASHBOARD_FLAT_CARD_CHROME_CLASS = "px-0";

export function dashboardFlatCardClassName(extra?: string) {
  return cn(DASHBOARD_FLAT_CARD_CLASS, extra);
}
