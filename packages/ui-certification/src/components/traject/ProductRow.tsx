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
import type { ReactNode } from "react";

export type ProductRowProps = {
  /** Stable id for AnimatePresence keying — required so the exit animation can play. */
  id: string;
  label: ReactNode;
  /** Optionele ondertitel, bv. het categoriepad waar dit product onder valt. Wordt zoals in `CategoryPicker` afgekapt op één regel. */
  description?: ReactNode;
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
  description,
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
      className="overflow-hidden"
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
              {description ? (
                <>
                  <span className="font-normal text-muted-foreground">
                    {description}
                  </span>
                  <span
                    aria-hidden
                    className="mx-1 font-normal text-muted-foreground"
                  >
                    &gt;
                  </span>
                </>
              ) : null}
              {label}
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
