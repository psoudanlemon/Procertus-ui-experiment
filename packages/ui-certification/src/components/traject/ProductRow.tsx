import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
  cn,
  highlightMatch,
} from "@procertus-ui/ui";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { ProductCategoryTrail } from "./ProductCategoryTrail";

export type ProductRowProps = {
  /** Stable id for AnimatePresence keying — required so the exit animation can play. */
  id: string;
  label: ReactNode;
  /**
   * Optionele volledige categoriepad ("Beton en mortel > Stortklaar beton"),
   * root-to-leaf met " > " als delimiter. Wordt na de productnaam gerenderd
   * via {@link ProductCategoryTrail}, die het pad deepest-first toont en de
   * visuele behandeling consistent houdt met basket-rij en bundle matrix.
   */
  categoryTrail?: string;
  /**
   * Wanneer aanwezig worden voorkomens van deze substring (case-insensitief)
   * in `label`, {@link productTypeStreamLabel} en {@link matchedSearchFields}
   * gemarkeerd met `<mark>` in accentkleur. Alleen actief voor stringvelden.
   */
  highlight?: string;
  /**
   * Alleen gezet in zoekmodus (catalogus doorzoeken). Toont de
   * `productTypeStreamLabel` als aparte regel; browse gebruikt deze prop niet,
   * zodat de productrij identiek blijft aan vroeger.
   */
  productTypeStreamLabel?: string;
  /**
   * Alleen gezet in zoekmodus: `searchFields`-waarden die op de huidige query
   * matchten; elk als aparte regel, zelfde stijl als producttype.
   */
  matchedSearchFields?: readonly string[];
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
  productTypeStreamLabel,
  matchedSearchFields,
  onAdd,
  className,
}: ProductRowProps) {
  const addAriaLabel =
    typeof label === "string"
      ? (() => {
          const bits: string[] = [label];
          if (productTypeStreamLabel) bits.push(`producttype ${productTypeStreamLabel}`);
          if (matchedSearchFields?.length) {
            bits.push(`zoektermen ${matchedSearchFields.join(", ")}`);
          }
          return `Voeg ${bits.join(", ")} toe aan selectie`;
        })()
      : undefined;

  return (
    <motion.li
      key={id}
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, x: 80, scale: 0.96, height: 0 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden"
    >
      <Item
        asChild
        variant="outline"
        className={cn(
          "cursor-pointer p-component text-left transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none",
          className,
        )}
      >
        <button
          type="button"
          onClick={onAdd}
          aria-label={addAriaLabel}
        >
          <ItemContent className="min-w-0">
            {productTypeStreamLabel ? (
              <ItemDescription
                className="line-clamp-1 text-xs font-medium tabular-nums tracking-tight text-muted-foreground"
                translate="no"
              >
                {highlightMatch(productTypeStreamLabel, highlight)}
              </ItemDescription>
            ) : null}
            {matchedSearchFields?.map((field, idx) => (
              <ItemDescription
                key={`sf-${idx}-${field}`}
                className="line-clamp-2 text-xs font-medium leading-snug text-muted-foreground"
                translate="no"
              >
                {highlightMatch(field, highlight)}
              </ItemDescription>
            ))}
            <ItemTitle className="line-clamp-2 w-full text-sm font-medium leading-snug">
              {highlightMatch(label, highlight)}
              {categoryTrail ? <ProductCategoryTrail trail={categoryTrail} /> : null}
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
