import { Cancel01Icon, PackageIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Badge,
  Button,
  H3,
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
  cn,
} from "@procertus-ui/ui";
import { AnimatePresence, motion } from "framer-motion";

export type ProductBasketItem = {
  id: string;
  label: string;
  /**
   * Volledig categoriepad als platte string ("Beton en mortel > Stortklaar
   * beton"), cluster en alle tussenliggende groepen, zonder het product zelf.
   * In de winkelmand verloren we de browse-context, dus tonen we het pad als
   * prefix boven het product, identiek aan de breadcrumb-stijl van
   * `CategoryPicker`.
   */
  categoryTrail: string;
};

export type ProductBasketProps = {
  items: readonly ProductBasketItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
  className?: string;
};

/**
 * Winkelmand voor de product-selectieflow. Toont de gekozen producten met
 * verwijderacties per rij en een "wis selectie" actie onderaan. De empty
 * state nodigt uit om producten toe te voegen vanuit de catalogus. De
 * `aside` heeft sticky gedrag voor brede viewports en gebruikt dezelfde
 * muted-chrome als zijn buurman in de discovery-grid.
 */
export function ProductBasket({
  items,
  onRemove,
  onClear,
  className,
}: ProductBasketProps) {
  const isEmpty = items.length === 0;
  return (
    <aside
      aria-label="Gekozen producten"
      className={cn(
        "flex flex-col gap-section rounded-lg border border-border bg-muted/30 p-section lg:sticky lg:top-component lg:h-fit lg:max-h-sticky-rail",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-component">
        <H3>Gekozen producten</H3>
        <Badge
          variant={isEmpty ? "outline" : "secondary"}
          className={cn("bg-card", !isEmpty && "border-border")}
        >
          {items.length}
        </Badge>
      </header>

      {isEmpty ? (
        <EmptyBasket />
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-1">
          {/*
           * Onzichtbare empty-state als hoogtereferentie: de grid-cel
           * sized op de grootste child, dus de gevulde winkelmand is exact
           * even hoog als de empty state. De zichtbare lijst + wis-knop
           * leven in dezelfde cel, dus tellen niet bovenop die hoogte.
           */}
          <div aria-hidden className="invisible col-start-1 row-start-1">
            <EmptyBasket />
          </div>
          <div className="col-start-1 row-start-1 flex flex-col gap-section">
            <ul className="flex flex-col divide-y divide-border overflow-y-auto rounded-lg border border-border bg-card">
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((p) => (
                  <SelectedRow
                    key={p.id}
                    id={p.id}
                    label={p.label}
                    categoryTrail={p.categoryTrail}
                    onRemove={() => onRemove(p.id)}
                  />
                ))}
              </AnimatePresence>
            </ul>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="mt-auto w-full text-muted-foreground"
            >
              Wis alle producten
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}

function EmptyBasket() {
  return (
    <div className="flex flex-col items-center gap-micro rounded-md border border-dashed border-border/60 bg-card p-region text-center">
      <HugeiconsIcon icon={PackageIcon} className="size-6 text-muted-foreground/60" />
      <span className="text-sm font-medium">Nog geen producten geselecteerd</span>
      <span className="text-xs text-muted-foreground">
        Voeg producten toe vanuit de catalogus links.
      </span>
    </div>
  );
}

/**
 * Geselecteerd product in de winkelmand. Visuele tweeling van `ProductRow`,
 * zelfde Item-primitive en className-recept, zodat de rij voelt alsof hij van
 * de catalogus naar de winkelmand verhuist. Toont hier wel het volledige
 * categoriepad als prefix omdat de browse-context in de winkelmand verloren
 * is. Hele rij is klikbaar om te verwijderen, cancel-icoon staat op de plek
 * waar de catalogusrij een plus-icoon had.
 *
 * Geëxporteerd zodat de mobiele bottom-sheet in `ProductSelectionBasket`
 * dezelfde rij-presentatie kan hergebruiken.
 */
export function SelectedRow({
  id,
  label,
  categoryTrail,
  onRemove,
}: {
  id: string;
  label: string;
  categoryTrail: string;
  onRemove: () => void;
}) {
  return (
    <motion.li
      key={id}
      layout
      initial={{ opacity: 0, x: -80, scale: 0.96, height: 0 }}
      animate={{ opacity: 1, x: 0, scale: 1, height: "auto" }}
      exit={{ opacity: 0, x: -80, scale: 0.96, height: 0 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden"
    >
      <Item
        asChild
        className={cn(
          "cursor-pointer rounded-none border-transparent p-component text-left transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none",
        )}
      >
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Verwijder ${label} uit selectie`}
        >
          <ItemContent className="min-w-0">
            <ItemTitle className="line-clamp-none w-full whitespace-normal break-words text-sm font-medium leading-snug">
              {label}
              {categoryTrail ? (
                <span className="ms-2 text-xs font-normal text-muted-foreground">
                  {categoryTrail.split(" > ").reverse().join(" < ")}
                </span>
              ) : null}
            </ItemTitle>
          </ItemContent>
          <ItemActions>
            <HugeiconsIcon
              icon={Cancel01Icon}
              aria-hidden
              className="size-5 text-muted-foreground transition-transform group-hover/item:scale-110 group-hover/item:text-accent-foreground"
            />
          </ItemActions>
        </button>
      </Item>
    </motion.li>
  );
}
