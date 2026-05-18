import {
  BrickWallIcon,
  Cancel01Icon,
  FactoryIcon,
  Layers01Icon,
  MoleculesIcon,
  PackageIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  Input,
  cn,
} from "@procertus-ui/ui";
import { AnimatePresence, motion } from "framer-motion";
import {
  Fragment,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  productEligibleForCatalogEntry,
  subtreeHasProductEligibleForCatalogEntry,
} from "../../certification-request/product-tree";
import type {
  AvailableEntry,
  AvailableEntryKey,
  ProcertusCategorizationDoc,
  TreeNode,
} from "../../types";
import { CategoryPicker } from "./CategoryPicker";
import { ProductBasket, SelectedRow } from "./ProductBasket";
import { ProductRow } from "./ProductRow";

const CLUSTER_ICONS: Record<string, IconSvgElement> = {
  "beton-en-mortel": BrickWallIcon,
  "bestanddelen-voor-beton": MoleculesIcon,
  staal: FactoryIcon,
};

type Trail = ReadonlyArray<{ id: string; label: string }>;

type SelectedProduct = {
  id: string;
  label: string;
  /**
   * Volledig categoriepad als platte string ("Beton en mortel > Stortklaar beton"),
   * cluster en alle tussenliggende groepen, zonder het product zelf. In de
   * winkelmand verloren we de browse-context, dus tonen we het pad als prefix
   * boven het product, identiek aan de breadcrumb-stijl van `CategoryPicker`.
   */
  categoryTrail: string;
};

type SearchHit = {
  id: string;
  label: string;
  /**
   * Volledig categoriepad als platte string ("Beton en mortel > Stortklaar
   * beton"). Wordt in de zoekresultaten als prefix boven de productnaam
   * getoond zodat de browse-context behouden blijft, identiek aan de stijl
   * van het basketrij-pad in `ProductBasket`.
   */
  categoryTrail: string;
};

function resolveLevel(
  path: readonly string[],
  roots: readonly TreeNode[],
): { trail: Trail; nodes: readonly TreeNode[] } {
  let current: readonly TreeNode[] = roots;
  const trail: Array<{ id: string; label: string }> = [];
  for (const id of path) {
    const next = current.find((n) => n.id === id);
    if (!next || !next.children?.length) {
      return { trail, nodes: [] };
    }
    trail.push({ id: next.id, label: next.label });
    current = next.children;
  }
  return { trail, nodes: current };
}

function collectSelectedProducts(
  selectedIds: readonly string[],
  roots: readonly TreeNode[],
): SelectedProduct[] {
  const want = new Set(selectedIds);
  const found = new Map<string, SelectedProduct>();
  const walk = (input: readonly TreeNode[], trail: readonly string[]) => {
    for (const n of input) {
      if (n.kind === "product" && want.has(n.id) && !found.has(n.id)) {
        found.set(n.id, {
          id: n.id,
          label: n.label,
          categoryTrail: trail.join(" > "),
        });
      }
      if (n.children?.length) {
        walk(n.children, [...trail, n.label]);
      }
    }
  };
  walk(roots, []);
  return selectedIds
    .map((id) => found.get(id))
    .filter((p): p is SelectedProduct => p != null);
}

const byLabel = (a: { label: string }, b: { label: string }) =>
  a.label.localeCompare(b.label, "nl", { sensitivity: "base" });

type VisibleProduct = {
  id: string;
  label: string;
  /**
   * Categoriepad relatief aan het huidige browse-niveau. Leeg voor producten
   * die directe kinderen van de actieve categorie zijn; gevuld voor producten
   * die in subcategorieën leven ("Granulaten" of "Granulaten > Zand"). Wordt
   * als prefix boven de productnaam getoond zodat de browse-context behouden
   * blijft, identiek aan de stijl van `SearchHit`.
   */
  categoryTrail: string;
};

function collectDescendantProducts(
  nodes: readonly TreeNode[],
  routeEntry: AvailableEntry | undefined,
): VisibleProduct[] {
  const out: VisibleProduct[] = [];
  const walk = (input: readonly TreeNode[], trail: readonly string[]) => {
    for (const n of input) {
      if (n.kind === "product") {
        if (!productEligibleForCatalogEntry(n, routeEntry)) {
          continue;
        }
        out.push({
          id: n.id,
          label: n.label,
          categoryTrail: trail.join(" > "),
        });
      }
      if (n.children?.length) {
        walk(n.children, [...trail, n.label]);
      }
    }
  };
  walk(nodes, []);
  return out.sort(byLabel);
}

function searchProducts(
  query: string,
  roots: readonly TreeNode[],
  routeEntry: AvailableEntry | undefined,
): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: SearchHit[] = [];
  const walk = (input: readonly TreeNode[], trail: readonly string[]) => {
    for (const n of input) {
      if (
        n.kind === "product" &&
        n.label.toLowerCase().includes(q) &&
        productEligibleForCatalogEntry(n, routeEntry)
      ) {
        out.push({ id: n.id, label: n.label, categoryTrail: trail.join(" > ") });
      }
      if (n.children?.length) {
        walk(n.children, [...trail, n.label]);
      }
    }
  };
  walk(roots, []);
  return out.sort((a, b) => {
    const byTrail = a.categoryTrail.localeCompare(b.categoryTrail, "nl", {
      sensitivity: "base",
    });
    return byTrail !== 0 ? byTrail : byLabel(a, b);
  });
}

function firstChildIsProduct(node: TreeNode): boolean {
  return node.children?.[0]?.kind === "product";
}

/** Aantal catalogus-producten onder `root` dat voor de route in aanmerking komt en nog niet geselecteerd is. */
function countEligibleVisibleProductsInSubtree(
  root: TreeNode,
  routeEntry: AvailableEntry | undefined,
  selectedSet: ReadonlySet<string>,
): number {
  let count = 0;
  const walk = (n: TreeNode) => {
    if (n.kind === "product") {
      if (productEligibleForCatalogEntry(n, routeEntry) && !selectedSet.has(n.id)) {
        count++;
      }
      return;
    }
    for (const c of n.children ?? []) walk(c);
  };
  walk(root);
  return count;
}

function describeFilteredProductCount(count: number): string {
  return count === 1 ? "1 product" : `${count} producten`;
}

export type CategoryBrowseItem = {
  node: TreeNode;
  visibleProductCount: number;
};

type ContextValue = {
  isRoot: boolean;
  isSearching: boolean;
  path: readonly string[];
  trail: Trail;
  searchValue: string;
  setSearchValue: (next: string) => void;
  categories: readonly CategoryBrowseItem[];
  visibleProducts: readonly VisibleProduct[];
  searchQuery: string;
  searchResultsTotal: number;
  searchHits: readonly SearchHit[];
  selectedProducts: readonly SelectedProduct[];
  selectedIds: readonly string[];
  /**
   * Monotone teller die enkel wordt verhoogd wanneer er daadwerkelijk een
   * nieuw product wordt toegevoegd (geen no-op). Wordt gebruikt als `key`
   * voor de pulse-animatie op de mobiele samenvattings-bar.
   */
  addPulseKey: number;
  goRoot: () => void;
  goTo: (id: string) => void;
  goUpTo: (depth: number) => void;
  addProduct: (id: string) => void;
  removeProduct: (id: string) => void;
  clearSelection: () => void;
  onBack?: () => void;
  onContinue: (ids: readonly string[]) => void;
  /**
   * Escape route wanneer een gebruiker zijn product niet in de catalogus vindt.
   * Wanneer beschikbaar verschijnt er in elke productlijst een "Mijn product
   * staat niet in de lijst"-rij bovenaan, plus dezelfde call-to-action in de
   * empty state van een zoekopdracht. De callback springt in de productie-flow
   * direct naar "Aanvraag controleren" en slaat de bundle-stap over; in stories
   * staat hij doorgaans op `noop` om de affordance zichtbaar te maken.
   */
  onProductNotFound?: () => void;
};

const ProductSelectionBasketContext = createContext<ContextValue | null>(null);

function useBasket(): ContextValue {
  const ctx = useContext(ProductSelectionBasketContext);
  if (!ctx) {
    throw new Error(
      "ProductSelectionBasketBody / ActionBar must be used within ProductSelectionBasketProvider",
    );
  }
  return ctx;
}

/**
 * Public read of the basket: exposes the selection state and the
 * `onBack` / `onContinue` callbacks wired into {@link ProductSelectionBasketProvider}.
 * Use this when you want to render a custom action bar (e.g. a Storybook footer
 * template) outside the shipped {@link ProductSelectionBasketActionBar}.
 */
export function useProductSelectionBasket(): Pick<
  ContextValue,
  "selectedIds" | "onBack" | "onContinue"
> {
  const { selectedIds, onBack, onContinue } = useBasket();
  return { selectedIds, onBack, onContinue };
}

export type ProductSelectionBasketProviderProps = {
  doc: ProcertusCategorizationDoc;
  initialSelectedIds?: readonly string[];
  onSelectionChange?: (ids: string[]) => void;
  onBack?: () => void;
  onContinue: (ids: readonly string[]) => void;
  /**
   * Wanneer aanwezig verschijnt de "Mijn product staat niet in de lijst"-
   * affordance op twee plekken in de discovery-area: als vaste rij bovenaan
   * elke productlijst (browse + zoekresultaten) en als primary call-to-action
   * in de zoek empty state. De host wireert hier doorgaans de sprong naar
   * "Aanvraag controleren" — zo slaat de gebruiker de bundle-stap over en
   * landt direct in review.
   */
  onProductNotFound?: () => void;
  /**
   * Traject: id van de gekozen wegwijzer-route (bv. `ce`). Indien gezet en de entry heeft
   * een {@link AvailableEntry.productAvailabilityKey}, worden browse, zoekresultaten en
   * categorieën beperkt tot producten die in de dataset voor die route beschikbaar zijn.
   * Routes zonder sleutel (bv. EPD: verplicht product kiezen, wel volledige catalogus) geven
   * deze prop doorgaans niet door zodat geen filtering wordt toegepast.
   */
  productRouteEntryId?: AvailableEntryKey;
  children: ReactNode;
};

/**
 * Multi-product picker with global search, hierarchical drilldown and a
 * sticky basket sidebar. Provider holds state so {@link TrajectLayout}'s
 * `actionBar` slot and the body can both read selection without prop
 * drilling.
 */
export function ProductSelectionBasketProvider({
  doc,
  initialSelectedIds,
  onSelectionChange,
  onBack,
  onContinue,
  onProductNotFound,
  productRouteEntryId,
  children,
}: ProductSelectionBasketProviderProps) {
  const [path, setPath] = useState<readonly string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => [
    ...(initialSelectedIds ?? []),
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [addPulseKey, setAddPulseKey] = useState(0);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const { trail, nodes } = useMemo(
    () => resolveLevel(path, doc.clusters),
    [path, doc],
  );

  const routeAvailabilityEntry = useMemo((): AvailableEntry | undefined => {
    if (!productRouteEntryId) return undefined;
    return doc.meta.availableEntries?.find((e) => e.id === productRouteEntryId);
  }, [doc, productRouteEntryId]);

  const isRoot = path.length === 0;
  const isSearching = searchValue.trim().length > 0;

  const categories = useMemo((): readonly CategoryBrowseItem[] => {
    const groups = nodes.filter((n) => n.kind === "group");
    const entry = routeAvailabilityEntry;
    const routeFiltered = entry?.productAvailabilityKey
      ? groups.filter((g) => subtreeHasProductEligibleForCatalogEntry(g, entry))
      : groups;

    const withCounts = routeFiltered.map((node) => ({
      node,
      visibleProductCount: countEligibleVisibleProductsInSubtree(
        node,
        routeAvailabilityEntry,
        selectedSet,
      ),
    }));

    return withCounts
      .filter((x) => x.visibleProductCount > 0)
      .sort((a, b) => byLabel(a.node, b.node));
  }, [nodes, routeAvailabilityEntry, selectedSet]);

  const visibleProducts = useMemo<readonly VisibleProduct[]>(() => {
    const visibleCategoryIds = new Set(categories.map((c) => c.node.id));
    const browseNodes = nodes.filter((n) => {
      if (n.kind === "product") return true;
      return visibleCategoryIds.has(n.id);
    });
    return collectDescendantProducts(browseNodes, routeAvailabilityEntry).filter(
      (p) => !selectedSet.has(p.id),
    );
  }, [nodes, categories, routeAvailabilityEntry, selectedSet]);

  const searchResults = useMemo(
    () => searchProducts(searchValue, doc.clusters, routeAvailabilityEntry),
    [searchValue, doc.clusters, routeAvailabilityEntry],
  );
  const visibleSearchResults = useMemo(
    () => searchResults.filter((r) => !selectedSet.has(r.id)),
    [searchResults, selectedSet],
  );

  const selectedProducts = useMemo(
    () => collectSelectedProducts(selectedIds, doc.clusters),
    [selectedIds, doc],
  );

  const updateSelection = (next: string[]) => {
    setSelectedIds(next);
    onSelectionChange?.(next);
  };

  const goRoot = () => setPath([]);
  const goTo = (id: string) => setPath((prev) => [...prev, id]);
  const goUpTo = (depth: number) => setPath((prev) => prev.slice(0, depth));

  const addProduct = (id: string) => {
    if (selectedIds.includes(id)) return;
    setAddPulseKey((k) => k + 1);
    updateSelection([...selectedIds, id]);
  };
  const removeProduct = (id: string) =>
    updateSelection(selectedIds.filter((x) => x !== id));
  const clearSelection = () => updateSelection([]);

  const value = useMemo<ContextValue>(
    () => ({
      isRoot,
      isSearching,
      path,
      trail,
      searchValue,
      setSearchValue,
      categories,
      visibleProducts,
      searchQuery: searchValue.trim(),
      searchResultsTotal: searchResults.length,
      searchHits: visibleSearchResults,
      selectedProducts,
      selectedIds,
      addPulseKey,
      goRoot,
      goTo,
      goUpTo,
      addProduct,
      removeProduct,
      clearSelection,
      onBack,
      onContinue,
      onProductNotFound,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isRoot,
      isSearching,
      path,
      trail,
      searchValue,
      categories,
      visibleProducts,
      searchResults,
      visibleSearchResults,
      selectedProducts,
      selectedIds,
      addPulseKey,
    ],
  );

  return (
    <ProductSelectionBasketContext.Provider value={value}>
      {children}
    </ProductSelectionBasketContext.Provider>
  );
}

/**
 * Body grid: discovery area on the left, basket sidebar on the right. Op mobile
 * (`<md`) verdwijnt de zijdelingse winkelmand uit de standaard flow; daar wordt
 * de selectie samengevat in een bar boven de actie-footer (zie
 * {@link ProductSelectionBasketMobileSummaryBar}) en opent een bottom sheet
 * voor details. `TrajectLayout` host de catalogus in een eigen scroll-container,
 * dus extra padding-bottom voor scroll-ruimte is hier niet nodig: de actiebalk
 * ligt naast de scrollende lijst, niet erbovenop.
 */
export function ProductSelectionBasketBody() {
  const basket = useBasket();
  return (
    <div className="grid grid-cols-1 gap-region lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
      <DiscoveryArea {...basket} />
      <ProductBasket
        items={basket.selectedProducts}
        onRemove={basket.removeProduct}
        onClear={basket.clearSelection}
        className="hidden md:flex"
      />
    </div>
  );
}

/**
 * Mobiele samenvattings-bar. Bedoeld voor `TrajectLayout.aboveActionBar` of
 * losse stories. Zonder selectie blijft de bar zichtbaar als rustige empty
 * state; met selectie wordt de rij een tap-target die een in-place tray
 * omhoog uitschuift boven de bar (geen overlay): de lijst leeft in dezelfde
 * chrome, dus de buttons-rij en het zwevende karakter blijven behouden. Een
 * grip-handle bovenaan de tray markeert de uitschuif-affordance; de chevron
 * op de bar roteert van omhoog (gesloten) naar omlaag (open) om de volgende
 * actie te communiceren. De teller krijgt een spring-pop wanneer er een
 * product wordt toegevoegd ({@link ContextValue.addPulseKey}).
 *
 * Het component is zelf niet viewport-gegate; productie-consumers passen
 * `className="md:hidden"` toe zodat de desktop-weergave ongewijzigd blijft,
 * terwijl stories de bar ongegate kunnen renderen om de mobiele flow te
 * reviewen.
 */
export function ProductSelectionBasketMobileSummaryBar({
  className,
}: { className?: string } = {}) {
  const {
    selectedProducts,
    addPulseKey,
    removeProduct,
    clearSelection,
  } = useBasket();
  const [open, setOpen] = useState(false);
  const count = selectedProducts.length;

  useEffect(() => {
    if (count === 0 && open) setOpen(false);
  }, [count, open]);

  if (count === 0) {
    return (
      <div className={cn("px-boundary pt-section", className)}>
        <div
          aria-live="polite"
          className="flex min-h-11 items-center gap-component rounded-md border border-dashed border-border/60 bg-card/50 px-component py-micro text-sm text-muted-foreground"
        >
          <HugeiconsIcon icon={PackageIcon} className="size-4" aria-hidden />
          <span>Nog geen producten geselecteerd</span>
        </div>
      </div>
    );
  }

  const countLabel = `${count} ${count === 1 ? "product" : "producten"} geselecteerd`;
  const trayId = "basket-tray";

  return (
    <div className={className}>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="tray"
            id={trayId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-component px-boundary pt-component pb-component">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Verberg lijst"
                className="-my-micro mx-auto flex h-6 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span aria-hidden className="h-1 w-10 rounded-full bg-border" />
              </button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="w-full text-muted-foreground"
              >
                Wis selectie
              </Button>
              <ul className="flex max-h-sticky-rail flex-col gap-component overflow-y-auto">
                <AnimatePresence initial={false} mode="popLayout">
                  {selectedProducts.map((p) => (
                    <SelectedRow
                      key={p.id}
                      id={p.id}
                      label={p.label}
                      categoryTrail={p.categoryTrail}
                      onRemove={() => removeProduct(p.id)}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={trayId}
        aria-label={`${countLabel}. ${open ? "Verberg" : "Bekijk"} lijst.`}
        className={cn(
          "group/basket-bar block w-full cursor-pointer px-boundary text-left focus-visible:outline-none",
          // Wanneer de lade open is, levert de inner tray haar eigen `pb-component`; we laten
          // dan onze top-padding vallen zodat de visuele afstand tussen items en bar exact
          // `--spacing-component` is. Bij gesloten lade behoudt de bar zijn ademruimte
          // tegen de chrome-top.
          open ? "pt-0" : "pt-section",
        )}
      >
        <span
          className={cn(
            "flex w-full items-center justify-between gap-component rounded-md bg-card p-section",
            "transition-colors group-hover/basket-bar:bg-accent group-hover/basket-bar:text-accent-foreground",
            "group-focus-visible/basket-bar:ring-2 group-focus-visible/basket-bar:ring-ring",
          )}
        >
          <span className="text-sm font-medium">
            {count === 1 ? "product geselecteerd" : "producten geselecteerd"}
          </span>
          <motion.span
            key={addPulseKey}
            initial={{ scale: 1.35 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 14 }}
            className="inline-block"
          >
            <Badge variant="secondary" className="border-border">
              {count}
            </Badge>
          </motion.span>
        </span>
      </button>
    </div>
  );
}

/**
 * Sticky action bar buttons; render inside `TrajectLayout.actionBar`. Eerste
 * stap van de flow, dus volgt de first-step variant: enkel "Terug" (outline)
 * naar het voorgaande scherm en "Bevestig selectie" (primary) naar de
 * volgende stap. Op mobile stapelen beide knoppen verticaal op volledige
 * breedte; vanaf `md` zitten ze als groep rechts.
 */
export function ProductSelectionBasketActionBar() {
  const { selectedIds, onBack, onContinue } = useBasket();
  const continueDisabled = selectedIds.length === 0;
  return (
    <div className="grid w-full grid-cols-2 items-center gap-component md:flex">
      <Button
        type="button"
        size="lg"
        className="col-span-2 h-12 w-full px-6 md:order-3 md:col-auto md:h-9 md:w-auto md:px-4"
        disabled={continueDisabled}
        onClick={() => onContinue(selectedIds)}
      >
        Bevestig selectie
      </Button>
      {onBack ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="col-span-2 h-12 w-full px-6 md:order-2 md:col-auto md:ml-auto md:h-9 md:w-auto md:px-4"
          onClick={onBack}
        >
          Terug
        </Button>
      ) : null}
    </div>
  );
}

function DiscoveryArea({
  searchValue,
  setSearchValue,
  isSearching,
  isRoot,
  path,
  trail,
  categories,
  visibleProducts,
  searchQuery,
  searchResultsTotal,
  searchHits,
  goRoot,
  goTo,
  goUpTo,
  addProduct,
  onProductNotFound,
}: ContextValue) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Zet bij eerste render direct focus op het zoekveld: de search is de
  // dominante affordance op deze pagina en gebruikers landen hier meestal
  // met een product in gedachten — meteen kunnen typen scheelt een klik.
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);
  const resetSearch = () => {
    setSearchValue("");
    searchInputRef.current?.focus();
  };
  return (
    <div className="flex min-w-0 flex-col gap-section">
      <div className="relative w-full">
        <HugeiconsIcon
          icon={Search01Icon}
          className="pointer-events-none absolute left-component top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          ref={searchInputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Zoek op category of productnaam"
          className="h-12 bg-card pl-10 pr-10 text-base"
          aria-label="Zoek in de gehele catalogus"
        />
        {searchValue.length > 0 ? (
          <button
            type="button"
            onClick={() => setSearchValue("")}
            aria-label="Wis zoekopdracht"
            className="absolute right-component top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </button>
        ) : null}
      </div>

      <Card>
        <CardContent>
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="search-mode"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex flex-col gap-section"
              >
                <SearchHeader
                  query={searchQuery}
                  totalResults={searchResultsTotal}
                  visibleResults={searchHits.length}
                  onProductNotFound={onProductNotFound}
                />
                {searchHits.length === 0 ? (
                  <SearchEmptyState
                    query={searchQuery}
                    totalResults={searchResultsTotal}
                    onResetSearch={resetSearch}
                  />
                ) : (
                  <ProductsList>
                    {searchHits.map((hit) => (
                      <ProductRow
                        key={hit.id}
                        id={hit.id}
                        label={hit.label}
                        categoryTrail={hit.categoryTrail}
                        highlight={searchQuery}
                        onAdd={() => addProduct(hit.id)}
                      />
                    ))}
                  </ProductsList>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="browse-mode"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col gap-section"
              >
                <div className="flex flex-wrap items-center justify-between gap-component">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        {isRoot ? (
                          <BreadcrumbPage>Alle producten</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <button type="button" onClick={goRoot} className="cursor-pointer">
                              Alle producten
                            </button>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {trail.map((seg, idx) => {
                        const isLast = idx === trail.length - 1;
                        return (
                          <Fragment key={seg.id}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              {isLast ? (
                                <BreadcrumbPage>{seg.label}</BreadcrumbPage>
                              ) : (
                                <BreadcrumbLink asChild>
                                  <button
                                    type="button"
                                    onClick={() => goUpTo(idx + 1)}
                                    className="cursor-pointer"
                                  >
                                    {seg.label}
                                  </button>
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                          </Fragment>
                        );
                      })}
                    </BreadcrumbList>
                  </Breadcrumb>
                  {onProductNotFound ? (
                    <ProductNotFoundLink onClick={onProductNotFound} />
                  ) : null}
                </div>

                <div className="flex flex-col gap-section">
                  {categories.length > 0 ? (
                    <CategoriesGrid
                      items={categories}
                      isAtClusterLevel={isRoot}
                      onSelect={goTo}
                    />
                  ) : null}

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={path.join("/") || "root-products"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {visibleProducts.length > 0 ? (
                        <ProductsList>
                          {visibleProducts.map((p) => (
                            <ProductRow
                              key={p.id}
                              id={p.id}
                              label={p.label}
                              categoryTrail={p.categoryTrail}
                              onAdd={() => addProduct(p.id)}
                            />
                          ))}
                        </ProductsList>
                      ) : null}
                      {categories.length === 0 && visibleProducts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Alle producten op dit niveau staan al in je selectie.
                        </p>
                      ) : null}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

function SearchHeader({
  query,
  totalResults,
  visibleResults,
  onProductNotFound,
}: {
  query: string;
  totalResults: number;
  visibleResults: number;
  onProductNotFound?: () => void;
}) {
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-component">
      <div className="flex flex-wrap items-baseline gap-component">
        <h2 className="text-xl font-semibold tracking-tight">
          Zoekresultaten voor &ldquo;{query}&rdquo;
        </h2>
        <span className="text-sm text-muted-foreground">
          {visibleResults} van {totalResults}
        </span>
      </div>
      {onProductNotFound ? (
        <ProductNotFoundLink onClick={onProductNotFound} />
      ) : null}
    </header>
  );
}

/**
 * "Mijn product staat niet in de lijst"-affordance als sm link-button.
 * Verschijnt rechts naast de breadcrumb (browse) en rechts in de search-header
 * (zodra er resultaten zijn). Functioneel identiek aan de primary button in de
 * search empty state: triggert de `onProductNotFound`-callback die in productie
 * de gebruiker direct naar "Aanvraag controleren" stuurt en de bundle-stap dus
 * overslaat.
 */
function ProductNotFoundLink({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="link"
      size="xs"
      onClick={onClick}
    >
      Mijn product staat niet in de lijst?
    </Button>
  );
}

function SearchEmptyState({
  query,
  totalResults,
  onResetSearch,
}: {
  query: string;
  totalResults: number;
  onResetSearch: () => void;
}) {
  const noResults = totalResults === 0;
  return (
    <div className="flex flex-col items-center gap-section rounded-lg border border-dashed border-border/70 bg-muted/20 px-section py-region text-center">
      <p className="text-sm text-muted-foreground">
        {noResults
          ? `Geen producten gevonden voor "${query}".`
          : `Alle resultaten voor "${query}" staan al in je selectie.`}
      </p>
      {noResults ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResetSearch}
        >
          Probeer opnieuw
        </Button>
      ) : null}
    </div>
  );
}

function CategoriesGrid({
  items,
  isAtClusterLevel,
  onSelect,
}: {
  items: readonly CategoryBrowseItem[];
  isAtClusterLevel: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-component sm:grid-cols-2">
      {items.map(({ node, visibleProductCount }) => {
        const icon = isAtClusterLevel
          ? (CLUSTER_ICONS[node.id] ?? Layers01Icon)
          : firstChildIsProduct(node)
            ? PackageIcon
            : Layers01Icon;
        return (
          <CategoryPicker
            key={node.id}
            label={node.label}
            icon={icon}
            description={describeFilteredProductCount(visibleProductCount)}
            onSelect={() => onSelect(node.id)}
          />
        );
      })}
    </div>
  );
}

function ProductsList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex flex-col gap-component">
      <AnimatePresence initial={false} mode="popLayout">
        {children}
      </AnimatePresence>
    </ul>
  );
}

