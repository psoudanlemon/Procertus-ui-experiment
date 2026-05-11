import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
  cn,
} from "@procertus-ui/ui";
import { motion } from "framer-motion";
import { Fragment, type ReactNode } from "react";

function renderHighlightedLabel(label: ReactNode, query: string | undefined): ReactNode {
  if (!query || typeof label !== "string") return label;
  const needle = query.trim();
  if (!needle) return label;
  const haystack = label.toLowerCase();
  const lower = needle.toLowerCase();
  const out: ReactNode[] = [];
  let cursor = 0;
  let idx = haystack.indexOf(lower, cursor);
  let key = 0;
  while (idx !== -1) {
    if (idx > cursor) out.push(label.slice(cursor, idx));
    out.push(
      <mark
        key={key++}
        className="rounded-sm bg-accent px-0.5 text-accent-foreground"
      >
        {label.slice(idx, idx + lower.length)}
      </mark>,
    );
    cursor = idx + lower.length;
    idx = haystack.indexOf(lower, cursor);
  }
  if (cursor < label.length) out.push(label.slice(cursor));
  return (
    <>
      {out.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  );
}

export type ProductRowProps = {
  /** Stable id for AnimatePresence keying — required so the exit animation can play. */
  id: string;
  label: ReactNode;
  /**
   * Optionele volledige categoriepad-prefix ("Beton en mortel > Stortklaar
   * beton"). Wordt boven het product getoond in zoekmodus zodat de
   * browse-context behouden blijft, identiek aan de stijl van `SelectedRow`
   * in `ProductBasket`.
   */
  categoryTrail?: string;
  /**
   * Wanneer aanwezig wordt het eerste voorkomen van deze substring in
   * `label` (case-insensitief) gemarkeerd met `<mark>`-styling in
   * accent-kleur. Alleen actief als `label` een string is.
   */
  highlight?: string;
  onAdd: () => void;
  className?: string;
};

/**
 * Single product row in the catalogus discovery list. Click anywhere on the
 * row to add to the basket; the row animates out (slide right + collapse) so
 * sibling rows reflow. Built on the {@link Item} primitive (label → `ItemTitle`,
 * plus → `ItemActions`) wrapped in a `motion.li` so it can be rendered inside
 * an `AnimatePresence` list.
 */
export function ProductRow({
  id,
  label,
  categoryTrail,
  highlight,
  onAdd,
  className,
}: ProductRowProps) {
  return (
    <motion.li
      key={id}
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, x: 80, scale: 0.96, height: 0 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden border-t border-border"
    >
      <Item
        asChild
        className={cn(
          "cursor-pointer rounded-none border-transparent p-component text-left transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none",
          className,
        )}
      >
        <button
          type="button"
          onClick={onAdd}
          aria-label={
            typeof label === "string" ? `Voeg ${label} toe aan selectie` : undefined
          }
        >
          <ItemContent className="min-w-0">
            <ItemTitle className="line-clamp-2 w-full text-sm font-medium leading-snug">
              {categoryTrail ? (
                <>
                  <span className="font-normal text-muted-foreground">
                    {categoryTrail}
                  </span>
                  <span
                    aria-hidden
                    className="mx-1 font-normal text-muted-foreground"
                  >
                    &gt;
                  </span>
                </>
              ) : null}
              {renderHighlightedLabel(label, highlight)}
            </ItemTitle>
          </ItemContent>
          <ItemActions>
            <HugeiconsIcon
              icon={Add01Icon}
              aria-hidden
              className="size-5 text-muted-foreground transition-transform group-hover/item:scale-110 group-hover/item:text-accent-foreground"
            />
          </ItemActions>
        </button>
      </Item>
    </motion.li>
  );
}
