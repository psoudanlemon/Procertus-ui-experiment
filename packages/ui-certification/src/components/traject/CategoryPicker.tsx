import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  cn,
} from "@procertus-ui/ui";
import type { ReactNode } from "react";

export type CategoryPickerProps = {
  label: ReactNode;
  description?: ReactNode;
  icon: IconSvgElement;
  onSelect: () => void;
  className?: string;
};

/**
 * Hierarchical category card for the traject discovery flow. Click navigates
 * one level deeper in the catalogus, this is not a selection toggle. Built on
 * the {@link Item} primitive: icon tile in `ItemMedia`, title + description in
 * `ItemContent`, trailing chevron in `ItemActions`. The hover lift, accent
 * recolor and tile color shift are layered on top via `className` because
 * `Item`'s built-in hover styles are scoped to anchor children.
 */
export function CategoryPicker({
  label,
  description,
  icon,
  onSelect,
  className,
}: CategoryPickerProps) {
  return (
    <Item
      asChild
      variant="outline"
      className={cn(
        "cursor-pointer bg-card p-section text-left transition-colors",
        "hover:border-accent-foreground hover:bg-accent hover:text-accent-foreground",
        className,
      )}
    >
      <button type="button" onClick={onSelect}>
        <ItemMedia>
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors",
              "group-hover/item:bg-primary/10 group-hover/item:text-primary [&_svg]:size-5",
            )}
          >
            <HugeiconsIcon icon={icon} />
          </div>
        </ItemMedia>
        <ItemContent className="gap-0">
          <ItemTitle className="text-base font-semibold">{label}</ItemTitle>
          {description ? (
            <ItemDescription className="line-clamp-1 text-xs">
              {description}
            </ItemDescription>
          ) : null}
        </ItemContent>
        <ItemActions>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4 text-muted-foreground transition-colors group-hover/item:text-accent-foreground"
          />
        </ItemActions>
      </button>
    </Item>
  );
}
