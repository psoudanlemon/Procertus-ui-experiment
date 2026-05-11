import { cn } from "@procertus-ui/ui";

export type ProductCategoryTrailProps = {
  /**
   * Volledig categoriepad als platte string ("Beton en mortel > Stortklaar
   * beton"), root-to-leaf met " > " als delimiter. Het pad bevat de cluster
   * en alle tussenliggende groepen, zonder het product zelf.
   *
   * Lege of whitespace-only strings renderen niets, dus call-sites kunnen het
   * pad onvoorwaardelijk doorgeven zonder zelf op `trail` te checken.
   */
  trail: string;
  className?: string;
};

/**
 * Inline categoriepad dat naast een productlabel verschijnt en de browse-
 * context teruggeeft. Toont het pad deepest-first ("› Stortklaar beton ›
 * Beton en mortel") zodat de productnaam visueel leidt en de chevrons de
 * gebruiker naar de bredere cluster terugleiden. De leidende `›` (U+203A)
 * fungeert als visuele scharnier tussen het productlabel en de trail, en
 * dezelfde glyph wordt als separator gebruikt zodat alle chevrons even
 * zwaar wegen.
 *
 * Gebruikt overal waar een productlabel met categoriecontext getoond wordt
 * (catalogus-rij, basket-rij, bundle matrix) zodat de visuele behandeling
 * 1-op-1 hetzelfde is. Wijzig stijl- of orderbeslissingen op één plek: hier.
 */
export function ProductCategoryTrail({
  trail,
  className,
}: ProductCategoryTrailProps) {
  const segments = trail
    .split(" > ")
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (segments.length === 0) return null;
  const formatted = `› ${segments.reverse().join(" › ")}`;
  return (
    <span
      className={cn(
        "ms-component text-xs font-normal text-muted-foreground",
        className,
      )}
    >
      {formatted}
    </span>
  );
}
