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
} from "@procertus-ui/ui";
import { AnimatePresence, motion } from "framer-motion";
import {
  Fragment,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ProcertusCategorizationDoc, TreeNode } from "../../types";
import { CategoryPicker } from "./CategoryPicker";
import { ProductBasket } from "./ProductBasket";
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

function collectAllProducts(roots: readonly TreeNode[]): TreeNode[] {
  const out: TreeNode[] = [];
  const walk = (input: readonly TreeNode[]) => {
    for (const n of input) {
      if (n.kind === "product") {
        out.push(n);
      }
      if (n.children?.length) walk(n.children);
    }
  };
  walk(roots);
  return out.sort(byLabel);
}

function searchProducts(query: string, roots: readonly TreeNode[]): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: SearchHit[] = [];
  const walk = (input: readonly TreeNode[], trail: readonly string[]) => {
    for (const n of input) {
      if (n.kind === "product" && n.label.toLowerCase().includes(q)) {
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

function describeChildCount(node: TreeNode, count: number): string {
  if (firstChildIsProduct(node)) {
    return count === 1 ? "1 product" : `${count} producten`;
  }
  return count === 1 ? "1 categorie" : `${count} categorieën`;
}

type ContextValue = {
  isRoot: boolean;
  isSearching: boolean;
  path: readonly string[];
  trail: Trail;
  searchValue: string;
  setSearchValue: (next: string) => void;
  categories: readonly TreeNode[];
  visibleProducts: readonly TreeNode[];
  searchQuery: string;
  searchResultsTotal: number;
  searchHits: readonly SearchHit[];
  selectedProducts: readonly SelectedProduct[];
  selectedIds: readonly string[];
  goRoot: () => void;
  goTo: (id: string) => void;
  goUpTo: (depth: number) => void;
  addProduct: (id: string) => void;
  removeProduct: (id: string) => void;
  clearSelection: () => void;
  onCancel?: () => void;
  onContinue: (ids: readonly string[]) => void;
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

export type ProductSelectionBasketProviderProps = {
  doc: ProcertusCategorizationDoc;
  initialSelectedIds?: readonly string[];
  onSelectionChange?: (ids: string[]) => void;
  onCancel?: () => void;
  onContinue: (ids: readonly string[]) => void;
  children: ReactNode;
};

/**
 * Multi-product picker with global search, hierarchical drilldown and a
 * sticky basket sidebar. Provider holds state so {@link TrajectLayout}'s
 * `actionBar` slot and the body can both read selection without prop
 * drilling. Mirrors the {@link ProductSelectionExperimentProvider} contract
 * so consumers can pick whichever picker suits their flow.
 */
export function ProductSelectionBasketProvider({
  doc,
  initialSelectedIds,
  onSelectionChange,
  onCancel,
  onContinue,
  children,
}: ProductSelectionBasketProviderProps) {
  const [path, setPath] = useState<readonly string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => [
    ...(initialSelectedIds ?? []),
  ]);
  const [searchValue, setSearchValue] = useState("");
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const { trail, nodes } = useMemo(
    () => resolveLevel(path, doc.clusters),
    [path, doc],
  );

  const isRoot = path.length === 0;
  const isSearching = searchValue.trim().length > 0;

  const categories = useMemo(() => nodes.filter((n) => n.kind === "group"), [nodes]);
  const visibleProducts = useMemo(() => {
    const pool = isRoot
      ? collectAllProducts(doc.clusters)
      : [...nodes.filter((n) => n.kind === "product")].sort(byLabel);
    return pool.filter((n) => !selectedSet.has(n.id));
  }, [isRoot, doc, nodes, selectedSet]);

  const searchResults = useMemo(
    () => searchProducts(searchValue, doc.clusters),
    [searchValue, doc],
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

  const addProduct = (id: string) =>
    updateSelection(selectedIds.includes(id) ? selectedIds : [...selectedIds, id]);
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
      goRoot,
      goTo,
      goUpTo,
      addProduct,
      removeProduct,
      clearSelection,
      onCancel,
      onContinue,
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
    ],
  );

  return (
    <ProductSelectionBasketContext.Provider value={value}>
      {children}
    </ProductSelectionBasketContext.Provider>
  );
}

/** Body grid: discovery area on the left, basket sidebar on the right. */
export function ProductSelectionBasketBody() {
  const basket = useBasket();
  return (
    <div className="grid grid-cols-1 gap-region lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
      <DiscoveryArea {...basket} />
      <ProductBasket
        items={basket.selectedProducts}
        onRemove={basket.removeProduct}
        onClear={basket.clearSelection}
      />
    </div>
  );
}

/** Sticky action bar buttons; render inside `TrajectLayout.actionBar`. */
export function ProductSelectionBasketActionBar() {
  const { selectedIds, onCancel, onContinue } = useBasket();
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        disabled={onCancel == null}
      >
        Annuleren
      </Button>
      <Button
        type="button"
        disabled={selectedIds.length === 0}
        onClick={() => onContinue(selectedIds)}
      >
        Verder ({selectedIds.length})
      </Button>
    </>
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
}: ContextValue) {
  return (
    <div className="flex min-w-0 flex-col gap-section">
      <div className="relative w-full">
        <HugeiconsIcon
          icon={Search01Icon}
          className="pointer-events-none absolute left-component top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
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
                />
                {searchHits.length === 0 ? (
                  <SearchEmptyState
                    query={searchQuery}
                    totalResults={searchResultsTotal}
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
                {categories.length > 0 ? (
                  <CategoriesGrid
                    items={categories}
                    isAtClusterLevel={isRoot}
                    onSelect={goTo}
                  />
                ) : null}

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
}: {
  query: string;
  totalResults: number;
  visibleResults: number;
}) {
  return (
    <header className="flex flex-wrap items-baseline gap-component">
      <h2 className="text-xl font-semibold tracking-tight">
        Zoekresultaten voor &ldquo;{query}&rdquo;
      </h2>
      <span className="text-sm text-muted-foreground">
        {visibleResults} van {totalResults}
      </span>
    </header>
  );
}

function SearchEmptyState({
  query,
  totalResults,
}: {
  query: string;
  totalResults: number;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 px-section py-region text-center text-sm text-muted-foreground">
      {totalResults === 0
        ? `Geen producten gevonden voor "${query}". Probeer een andere zoekterm.`
        : `Alle resultaten voor "${query}" staan al in je selectie.`}
    </div>
  );
}

function CategoriesGrid({
  items,
  isAtClusterLevel,
  onSelect,
}: {
  items: readonly TreeNode[];
  isAtClusterLevel: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-component sm:grid-cols-2">
      {items.map((node) => {
        const icon = isAtClusterLevel
          ? (CLUSTER_ICONS[node.id] ?? Layers01Icon)
          : firstChildIsProduct(node)
            ? PackageIcon
            : Layers01Icon;
        const childCount = node.children?.length ?? 0;
        return (
          <CategoryPicker
            key={node.id}
            label={node.label}
            icon={icon}
            description={describeChildCount(node, childCount)}
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

