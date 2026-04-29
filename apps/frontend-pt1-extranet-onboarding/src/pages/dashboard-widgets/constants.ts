import { cn } from "@procertus-ui/ui";

/** Shared flat card shell for dashboard bento tiles. */
export const DASHBOARD_FLAT_CARD_CLASS =
  "border-0 p-section shadow-none ring-0 backdrop-blur-0";

/** Drop inner horizontal padding on CardHeader / CardContent when the card uses outer `p-section`. */
export const DASHBOARD_FLAT_CARD_CHROME_CLASS = "px-0";

export function dashboardFlatCardClassName(extra?: string) {
  return cn(DASHBOARD_FLAT_CARD_CLASS, extra);
}
