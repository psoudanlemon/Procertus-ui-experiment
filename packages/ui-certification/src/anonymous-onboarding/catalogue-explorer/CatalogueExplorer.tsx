/**
 * Catalogue browser composition: a `ChoiceBar` followed by an animated body
 * region that re-mounts on selection change so its enter transition replays.
 * Owns the internal vertical rhythm (`gap-section`) and animation only —
 * page-edge padding is the caller's concern, leaving the composition reusable
 * inside any shell.
 *
 * Body content is fully composed by the caller — typically a
 * `CertificationCard` for active items, or alternative UI (e.g. an external
 * referral grid) when the active id represents an "other / overflow" branch.
 */
import type { ReactNode } from "react";

import { ChoiceBar, type ChoiceBarItem } from "@procertus-ui/ui-lib";
import { cn } from "@procertus-ui/ui";

export type CatalogueExplorerProps = {
  items: readonly ChoiceBarItem[];
  /** Currently active item id. Must match one of `items[].value`. */
  activeId: string;
  onActiveIdChange: (id: string) => void;
  /** Accessible name for the underlying radio group. */
  ariaLabel: string;
  /** Body for the active item. Re-keyed on `activeId` so transitions replay. */
  children: ReactNode;
  className?: string;
};

export function CatalogueExplorer({
  items,
  activeId,
  onActiveIdChange,
  ariaLabel,
  children,
  className,
}: CatalogueExplorerProps) {
  return (
    <div className={cn("flex w-full flex-col gap-section", className)}>
      <ChoiceBar
        items={items}
        value={activeId}
        onValueChange={onActiveIdChange}
        aria-label={ariaLabel}
      />
      <div
        key={activeId}
        className="min-w-0 animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
      >
        {children}
      </div>
    </div>
  );
}
