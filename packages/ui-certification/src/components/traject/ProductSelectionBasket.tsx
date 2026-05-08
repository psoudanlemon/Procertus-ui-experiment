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
import { ProductRow } from "./ProductRow";

const CLUSTER_ICONS: Record<string, IconSvgElement> = {
  "beton-en-mortel": BrickWallIcon,
  "bestanddelen-voor-beton": MoleculesIcon,
  staal: FactoryIcon,
};

type Trail = ReadonlyArray<{ id: string; label: string }>;

type SelectedProduct = { id: string; label: string };

type SearchHit = {
  id: string;
  label: string;
  clusterLabel: string;
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
  ids: ReadonlySet<string>,
  roots: readonly TreeNode[],
): SelectedProduct[] {
  const out: SelectedProduct[] = [];
  const walk = (input: readonly TreeNode[]) => {
    for (const n of input) {
      if (n.kind === "product" && ids.has(n.id)) {
        out.push({ id: n.id, label: n.label });
      }
      if (n.children?.length) walk(n.children);
    }
  };
  walk(roots);
  return out;
}

function searchProducts(query: string, roots: readonly TreeNode[]): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: SearchHit[] = [];
  const walk = (input: readonly TreeNode[], clusterLabel: string) => {
    for (const n of input) {
      if (n.kind === "product" && n.label.toLowerCase().includes(q)) {
        out.push({ id: n.id, label: n.label, clusterLabel });
      }
      if (n.children?.length) walk(n.children, clusterLabel);
    }
  };
  for (const cluster of roots) {
    walk(cluster.children ?? [], cluster.label);
  }
  return out;
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
  groupedSearchResults: ReadonlyArray<{ cluster: string; hits: readonly SearchHit[] }>;
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
  const visibleProducts = useMemo(
    () => nodes.filter((n) => n.kind === "product" && !selectedSet.has(n.id)),
    [nodes, selectedSet],
  );

  const searchResults = useMemo(
    () => searchProducts(searchValue, doc.clusters),
    [searchValue, doc],
  );
  const visibleSearchResults = useMemo(
    () => searchResults.filter((r) => !selectedSet.has(r.id)),
    [searchResults, selectedSet],
  );

  const groupedSearchResults = useMemo(() => {
    const map = new Map<string, SearchHit[]>();
    for (const hit of visibleSearchResults) {
      const arr = map.get(hit.clusterLabel) ?? [];
      arr.push(hit);
      map.set(hit.clusterLabel, arr);
    }
    return Array.from(map.entries()).map(([cluster, hits]) => ({ cluster, hits }));
  }, [visibleSearchResults]);

  const selectedProducts = useMemo(
    () => collectSelectedProducts(selectedSet, doc.clusters),
    [selectedSet, doc],
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
      groupedSearchResults,
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
      groupedSearchResults,
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
    <div className="grid grid-cols-1 gap-section lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
      <DiscoveryArea {...basket} />
      <SelectionSidebar
        selected={basket.selectedProducts}
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
  groupedSearchResults,
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
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Zoek op productnaam of code..."
          className="h-12 bg-card pl-10 text-base"
          aria-label="Zoek in de gehele catalogus"
        />
      </div>

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
              visibleResults={groupedSearchResults.reduce((sum, g) => sum + g.hits.length, 0)}
            />
            {groupedSearchResults.length === 0 ? (
              <SearchEmptyState
                query={searchQuery}
                totalResults={searchResultsTotal}
              />
            ) : (
              <div className="flex flex-col gap-region">
                {groupedSearchResults.map((group) => (
                  <section key={group.cluster} className="flex flex-col gap-component">
                    <SubHeader>Gevonden in {group.cluster}</SubHeader>
                    <ProductsList>
                      {group.hits.map((hit) => (
                        <ProductRow
                          key={hit.id}
                          id={hit.id}
                          label={hit.label}
                          onAdd={() => addProduct(hit.id)}
                        />
                      ))}
                    </ProductsList>
                  </section>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={path.join("/") || "root"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-component"
          >
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  {isRoot ? (
                    <BreadcrumbPage>Catalogus</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <button type="button" onClick={goRoot} className="cursor-pointer">
                        Catalogus
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

            <div className="flex flex-col gap-region">
              {categories.length > 0 ? (
                <CategoriesGrid
                  items={categories}
                  isAtClusterLevel={isRoot}
                  onSelect={goTo}
                />
              ) : null}
              {visibleProducts.length > 0 ? (
                <section className="flex flex-col gap-component">
                  <SubHeader>Producten</SubHeader>
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
                </section>
              ) : null}
              {categories.length === 0 && visibleProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Alle producten op dit niveau staan al in je selectie.
                </p>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
    <header className="flex flex-col gap-component">
      <div className="flex flex-wrap items-baseline gap-component">
        <h2 className="text-xl font-semibold tracking-tight">
          Zoekresultaten voor &ldquo;{query}&rdquo;
        </h2>
        <span className="text-sm text-muted-foreground">
          {visibleResults} van {totalResults}
        </span>
      </div>
      <Badge variant="outline" className="self-start gap-micro">
        <HugeiconsIcon icon={Search01Icon} className="size-3" />
        Zoeken in de gehele catalogus
      </Badge>
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

function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h3>
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
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      <AnimatePresence initial={false} mode="popLayout">
        {children}
      </AnimatePresence>
    </ul>
  );
}

function SelectionSidebar({
  selected,
  onRemove,
  onClear,
}: {
  selected: readonly SelectedProduct[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const isEmpty = selected.length === 0;
  return (
    <aside
      aria-label="Gekozen producten"
      className="flex flex-col gap-section rounded-lg border border-border bg-muted/30 p-section lg:sticky lg:top-component lg:max-h-sticky-rail"
    >
      <header className="flex items-center justify-between gap-component">
        <span className="text-sm font-semibold">Gekozen producten</span>
        <Badge variant={isEmpty ? "outline" : "secondary"}>{selected.length}</Badge>
      </header>

      {isEmpty ? (
        <EmptyBasket />
      ) : (
        <>
          <ul className="flex min-h-0 flex-1 flex-col divide-y divide-border/60 overflow-y-auto rounded-md border border-border bg-card">
            <AnimatePresence initial={false}>
              {selected.map((p) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <SelectedRow label={p.label} onRemove={() => onRemove(p.id)} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="self-start text-muted-foreground"
          >
            Wis selectie
          </Button>
        </>
      )}
    </aside>
  );
}

function EmptyBasket() {
  return (
    <div className="flex flex-col items-center gap-micro rounded-md border border-dashed border-border/60 bg-card/50 px-component py-section text-center">
      <HugeiconsIcon icon={PackageIcon} className="size-6 text-muted-foreground/60" />
      <span className="text-sm font-medium">Nog geen producten geselecteerd</span>
      <span className="text-xs text-muted-foreground">
        Voeg producten toe vanuit de catalogus links.
      </span>
    </div>
  );
}

function SelectedRow({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-component px-component py-component">
      <span className="min-w-0 flex-1 truncate text-sm leading-snug">{label}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        aria-label={`Verwijder ${label}`}
        className="-mr-1 size-7 shrink-0 text-muted-foreground hover:text-destructive"
      >
        <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
      </Button>
    </div>
  );
}
