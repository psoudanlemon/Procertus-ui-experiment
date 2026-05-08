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
  cn,
} from "@procertus-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useMemo, useState } from "react";

import { defaultProcertusCategorizationDoc } from "../../categorization-data";
import type { TreeNode } from "../../types";
import { CategoryPicker } from "./CategoryPicker";
import { ProductRow } from "./ProductRow";
import { TrajectLayout } from "./TrajectLayout";

const STORY_FOOTER = {
  companyDetails: [
    { label: "© 2026 PROCERTUS asbl/vzw" },
    { label: "TVA/BTW: BE 1000.472.054" },
  ],
  legalLinks: [
    { label: "Privacy policy", url: "#" },
    { label: "Contact", url: "#" },
  ],
};

const noop = () => {};

const meta = {
  title: "Traject/Layout",
  component: TrajectLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      children: null,
      description: {
        component:
          "Catalogus-prototype met global search en hiërarchische navigatie: 70/30 split, een dominante zoekbalk die naar een gehele-catalogus zoekmodus schakelt, een prominente action-header voor contextueel terugnavigeren, en een winkelmandje rechts dat geselecteerde producten uit de lijsten weghoudt.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TrajectLayout>;

export default meta;

const CLUSTER_ICONS: Record<string, IconSvgElement> = {
  "beton-en-mortel": BrickWallIcon,
  "bestanddelen-voor-beton": MoleculesIcon,
  staal: FactoryIcon,
};

type Trail = ReadonlyArray<{ id: string; label: string }>;

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
): Array<{ id: string; label: string }> {
  const out: Array<{ id: string; label: string }> = [];
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

type SearchHit = {
  id: string;
  label: string;
  clusterLabel: string;
};

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

/**
 * Catalogus met global search bovenaan en hiërarchische navigatie eronder. De
 * action-header (Terug naar X + huidige titel) vervangt de breadcrumb en
 * verdwijnt zodra de zoekmodus actief wordt. Geselecteerde producten worden
 * weggefilterd uit zowel de drilldown-lijst als de zoekresultaten en zijn alleen
 * nog zichtbaar in het winkelmandje rechts.
 */
export const ProductSelectionGrid: StoryObj<typeof meta> = {
  name: "Product selecteren (winkelmandje)",
  args: {
    onSignInClick: noop,
    footer: STORY_FOOTER,
    bodyGap: "section",
    kicker: "BENOR",
    title: "Selecteer het producttype",
    description:
      "Doorzoek de hele catalogus of blader stapsgewijs door categorieën. Je keuze blijft altijd zichtbaar in het winkelmandje rechts.",
    children: null,
  },
  render: (args) => <ProductSelectionGridStory args={args} />,
};

function ProductSelectionGridStory({
  args,
}: {
  args: React.ComponentProps<typeof TrajectLayout>;
}) {
  const [path, setPath] = useState<readonly string[]>([]);
  const [selectedIds, setSelectedIds] = useState<readonly string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const { trail, nodes } = useMemo(
    () => resolveLevel(path, defaultProcertusCategorizationDoc.clusters),
    [path],
  );

  const isRoot = path.length === 0;
  const isSearching = searchValue.trim().length > 0;

  const categories = useMemo(() => nodes.filter((n) => n.kind === "group"), [nodes]);
  const visibleProducts = useMemo(
    () => nodes.filter((n) => n.kind === "product" && !selectedSet.has(n.id)),
    [nodes, selectedSet],
  );

  const searchResults = useMemo(
    () => searchProducts(searchValue, defaultProcertusCategorizationDoc.clusters),
    [searchValue],
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
    () => collectSelectedProducts(selectedSet, defaultProcertusCategorizationDoc.clusters),
    [selectedSet],
  );

  const goRoot = () => setPath([]);
  const goTo = (id: string) => setPath((prev) => [...prev, id]);
  const goUpTo = (depth: number) => setPath((prev) => prev.slice(0, depth));

  const addProduct = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const removeProduct = (id: string) =>
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  const clearSelection = () => setSelectedIds([]);

  const actionBar = (
    <>
      <Button type="button" variant="ghost" onClick={noop}>
        Annuleren
      </Button>
      <Button type="button" disabled={selectedIds.length === 0} onClick={noop}>
        Verder ({selectedIds.length})
      </Button>
    </>
  );

  return (
    <TrajectLayout {...args} actionBar={actionBar}>
      <div className="grid grid-cols-1 gap-section lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
        <DiscoveryArea
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          isSearching={isSearching}
          isRoot={isRoot}
          path={path}
          trail={trail}
          categories={categories}
          isAtClusterLevel={isRoot}
          visibleProducts={visibleProducts}
          searchQuery={searchValue.trim()}
          searchResultsTotal={searchResults.length}
          groupedSearchResults={groupedSearchResults}
          onGoRoot={goRoot}
          onGoTo={goTo}
          onGoUpTo={goUpTo}
          onAddProduct={addProduct}
        />
        <SelectionSidebar
          selected={selectedProducts}
          onRemove={removeProduct}
          onClear={clearSelection}
        />
      </div>
    </TrajectLayout>
  );
}

type DiscoveryAreaProps = {
  searchValue: string;
  onSearchChange: (next: string) => void;
  isSearching: boolean;
  isRoot: boolean;
  path: readonly string[];
  trail: Trail;
  categories: readonly TreeNode[];
  isAtClusterLevel: boolean;
  visibleProducts: readonly TreeNode[];
  searchQuery: string;
  searchResultsTotal: number;
  groupedSearchResults: ReadonlyArray<{ cluster: string; hits: readonly SearchHit[] }>;
  onGoRoot: () => void;
  onGoTo: (id: string) => void;
  onGoUpTo: (depth: number) => void;
  onAddProduct: (id: string) => void;
};

function DiscoveryArea({
  searchValue,
  onSearchChange,
  isSearching,
  isRoot,
  path,
  trail,
  categories,
  isAtClusterLevel,
  visibleProducts,
  searchQuery,
  searchResultsTotal,
  groupedSearchResults,
  onGoRoot,
  onGoTo,
  onGoUpTo,
  onAddProduct,
}: DiscoveryAreaProps) {
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
          onChange={(e) => onSearchChange(e.target.value)}
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
                          label={hit.label}
                          onAdd={() => onAddProduct(hit.id)}
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
                      <button type="button" onClick={onGoRoot} className="cursor-pointer">
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
                              onClick={() => onGoUpTo(idx + 1)}
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
                  isAtClusterLevel={isAtClusterLevel}
                  onSelect={onGoTo}
                />
              ) : null}
              {visibleProducts.length > 0 ? (
                <section className="flex flex-col gap-component">
                  <SubHeader>Producten</SubHeader>
                  <ProductsList>
                    {visibleProducts.map((p) => (
                      <ProductRow
                        key={p.id}
                        label={p.label}
                        onAdd={() => onAddProduct(p.id)}
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

function describeChildCount(node: TreeNode, count: number): string {
  if (firstChildIsProduct(node)) {
    return count === 1 ? "1 product" : `${count} producten`;
  }
  return count === 1 ? "1 categorie" : `${count} categorieën`;
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
  selected: ReadonlyArray<{ id: string; label: string }>;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const isEmpty = selected.length === 0;
  return (
    <aside
      aria-label="Gekozen producten"
      className="flex flex-col gap-section rounded-lg border border-border bg-muted/30 p-section lg:sticky lg:top-component lg:max-h-[calc(100svh-12rem)]"
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
