import { Button, H2 } from "@procertus-ui/ui";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import { hasCertifiableChip } from "../../helpers";
import {
  ProductTreePanel,
  type ProductTreeNode,
  type ProductTreeProductNode,
} from "../product-tree-panel";
import type {
  CertificationLabelKey,
  ProcertusCategorizationDoc,
  ProductAttestationKey,
  TreeNode,
} from "../../types";

/** Identifies the traject context the user came from (BENOR-keuring, ATG-attest, …). */
export type TrajectKey = CertificationLabelKey | ProductAttestationKey;

const CERTIFICATION_TRAJECT_KEYS = new Set<TrajectKey>(["ce", "benor", "ssd"]);

function productSupportsTraject(
  node: { certification?: { ce: string; benor: string; ssd: string }; attestations?: { atg: string; procertus: string; epd: string } },
  traject: TrajectKey,
): boolean {
  if (CERTIFICATION_TRAJECT_KEYS.has(traject)) {
    const value = node.certification?.[traject as CertificationLabelKey];
    return value != null && hasCertifiableChip(value);
  }
  const value = node.attestations?.[traject as ProductAttestationKey];
  return value != null && hasCertifiableChip(value);
}

/**
 * "Product selecteren" surface. Drives the Procertus decision-tree drilldown
 * (`ProductTreePanel`) at full width, with a pinned rail above it that keeps
 * multi-selected products visible across search/expand state. Splits into
 * provider + body + action-bar so the surrounding `TrajectLayout` can host
 * the action bar at the registry card level (`TrajectLayout.actionBar`)
 * while the body lives in `children`.
 */
export type ProductSelectionExperimentProviderProps = {
  doc: ProcertusCategorizationDoc;
  /** Limits selectability in the tree to products that support the chosen traject. */
  traject: TrajectKey;
  initialSelectedIds?: readonly string[];
  onSelectionChange?: (ids: string[]) => void;
  onCancel: () => void;
  onBack: () => void;
  onContinue: (ids: string[]) => void;
  children: ReactNode;
};

type ProductInfo = { id: string; label: string };

type ContextValue = {
  doc: ProcertusCategorizationDoc;
  traject: TrajectKey;
  selectedIds: string[];
  selectedSet: Set<string>;
  selectedProducts: ProductInfo[];
  searchValue: string;
  setSearchValue: (next: string) => void;
  expandedIds: string[];
  onToggleGroup: (id: string, open: boolean) => void;
  toggleExpandAll: () => void;
  toggleProduct: (id: string) => void;
  clearSelection: () => void;
  onCancel: () => void;
  onBack: () => void;
  onContinue: (ids: string[]) => void;
};

const ProductSelectionExperimentContext = createContext<ContextValue | null>(null);

function useExperiment(): ContextValue {
  const ctx = useContext(ProductSelectionExperimentContext);
  if (!ctx) {
    throw new Error(
      "ProductSelectionExperiment.Body / ActionBar must be used within ProductSelectionExperimentProvider",
    );
  }
  return ctx;
}

function buildProductIndex(clusters: readonly TreeNode[]): Map<string, ProductInfo> {
  const map = new Map<string, ProductInfo>();
  const walk = (nodes: readonly TreeNode[]) => {
    for (const n of nodes) {
      if (n.kind === "product") map.set(n.id, { id: n.id, label: n.label });
      else if (n.children?.length) walk(n.children);
    }
  };
  walk(clusters);
  return map;
}

function collectAllGroupIds(clusters: readonly TreeNode[]): string[] {
  const ids: string[] = [];
  const walk = (nodes: readonly TreeNode[]) => {
    for (const n of nodes) {
      if (n.kind === "group") {
        ids.push(n.id);
        if (n.children?.length) walk(n.children);
      }
    }
  };
  walk(clusters);
  return ids;
}

function buildTree({
  clusters,
  traject,
  selectedSet,
  query,
}: {
  clusters: readonly TreeNode[];
  traject: TrajectKey;
  selectedSet: Set<string>;
  query: string;
}): { nodes: ProductTreeNode[]; autoExpandedIds: Set<string> } {
  const normalizedQuery = query.trim().toLowerCase();
  const filtering = normalizedQuery.length > 0;
  const autoExpandedIds = new Set<string>();

  const walk = (input: readonly TreeNode[]): ProductTreeNode[] => {
    const out: ProductTreeNode[] = [];
    for (const node of input) {
      if (node.kind === "product") {
        if (!productSupportsTraject(node, traject)) continue;
        const matches = !filtering || node.label.toLowerCase().includes(normalizedQuery);
        if (filtering && !matches) continue;
        out.push({
          kind: "product",
          id: node.id,
          label: node.label,
          productTypeId: node.productTypeStreamLabel,
          selectable: true,
          selected: selectedSet.has(node.id),
          searchMatch: filtering && matches,
        });
      } else if (node.children?.length) {
        const children = walk(node.children);
        if (children.length === 0) continue;
        if (filtering) autoExpandedIds.add(node.id);
        out.push({ kind: "group", id: node.id, label: node.label, children });
      }
    }
    return out;
  };

  return { nodes: walk(clusters), autoExpandedIds };
}

export function ProductSelectionExperimentProvider({
  doc,
  traject,
  initialSelectedIds,
  onSelectionChange,
  onCancel,
  onBack,
  onContinue,
  children,
}: ProductSelectionExperimentProviderProps) {
  const productIndex = useMemo(() => buildProductIndex(doc.clusters), [doc]);
  const allGroupIds = useMemo(() => collectAllGroupIds(doc.clusters), [doc]);

  const [searchValue, setSearchValue] = useState("");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => [...(initialSelectedIds ?? [])]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedProducts = useMemo(
    () =>
      selectedIds
        .map((id) => productIndex.get(id))
        .filter((p): p is ProductInfo => p != null),
    [selectedIds, productIndex],
  );

  const updateSelection = (next: string[]) => {
    setSelectedIds(next);
    onSelectionChange?.(next);
  };
  const toggleProduct = (id: string) =>
    updateSelection(
      selectedSet.has(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id],
    );
  const clearSelection = () => updateSelection([]);

  const onToggleGroup = (id: string, open: boolean) =>
    setExpandedIds((prev) => {
      const set = new Set(prev);
      if (open) set.add(id);
      else set.delete(id);
      return Array.from(set);
    });

  const toggleExpandAll = () =>
    setExpandedIds((prev) => (prev.length >= allGroupIds.length ? [] : [...allGroupIds]));

  const value = useMemo<ContextValue>(
    () => ({
      doc,
      traject,
      selectedIds,
      selectedSet,
      selectedProducts,
      searchValue,
      setSearchValue,
      expandedIds,
      onToggleGroup,
      toggleExpandAll,
      toggleProduct,
      clearSelection,
      onCancel,
      onBack,
      onContinue,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [doc, traject, selectedIds, selectedProducts, searchValue, expandedIds],
  );

  return (
    <ProductSelectionExperimentContext.Provider value={value}>
      {children}
    </ProductSelectionExperimentContext.Provider>
  );
}

export function ProductSelectionExperimentBody() {
  const {
    doc,
    traject,
    selectedSet,
    selectedProducts,
    searchValue,
    setSearchValue,
    expandedIds,
    onToggleGroup,
    toggleExpandAll,
    toggleProduct,
    clearSelection,
  } = useExperiment();

  const { nodes, autoExpandedIds } = useMemo(
    () =>
      buildTree({
        clusters: doc.clusters,
        traject,
        selectedSet,
        query: searchValue,
      }),
    [doc, traject, selectedSet, searchValue],
  );

  const effectiveExpanded =
    searchValue.trim().length > 0 ? Array.from(autoExpandedIds) : expandedIds;

  return (
    <div className="grid grid-cols-1 gap-section lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
      <ProductTreePanel
        className="max-w-none"
        title="Product zoeken"
        description="Drill down in de Procertus-beslissingsboom of filter op productnaam."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Zoek product of categorie..."
        nodes={nodes}
        expandedIds={effectiveExpanded}
        onToggleExpandAll={toggleExpandAll}
        onToggle={onToggleGroup}
        onSelectProduct={(product: ProductTreeProductNode) => toggleProduct(product.id)}
        showSearch
      />
      <PinnedRail
        selectedRows={selectedProducts}
        onRemove={(id) => toggleProduct(id)}
        onClear={clearSelection}
      />
    </div>
  );
}

export function ProductSelectionExperimentActionBar() {
  const { selectedIds, onCancel, onBack, onContinue } = useExperiment();
  const selectedCount = selectedIds.length;
  return (
    <>
      <Button type="button" variant="ghost" onClick={onCancel}>
        Annuleren
      </Button>
      <div className="flex items-center gap-component">
        <Button type="button" variant="outline" onClick={onBack}>
          Terug
        </Button>
        <Button
          type="button"
          disabled={selectedCount === 0}
          onClick={() => onContinue(selectedIds)}
        >
          Verder
        </Button>
      </div>
    </>
  );
}

function PinnedRail({
  selectedRows,
  onRemove,
  onClear,
}: {
  selectedRows: ProductInfo[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <section
      className="flex flex-col gap-component rounded-lg border border-dashed border-border/70 bg-muted/30 p-section"
      aria-label="Geselecteerde producten"
    >
      <header className="flex flex-col gap-micro">
        <H2>
          {selectedRows.length === 0
            ? "Geen producten geselecteerd"
            : `${selectedRows.length} ${selectedRows.length === 1 ? "product" : "producten"} geselecteerd`}
        </H2>
        <p className="text-xs text-muted-foreground">
          {selectedRows.length === 0
            ? "Geselecteerde producten verschijnen hier en blijven zichtbaar terwijl je door de boom navigeert."
            : "Producten in deze rij blijven altijd zichtbaar, los van zoekterm of openstaande takken."}
        </p>
      </header>
      {selectedRows.length > 0 ? (
        <ul className="flex flex-wrap gap-component">
          {selectedRows.map((row) => (
            <li key={row.id}>
              <PinnedChip row={row} onRemove={() => onRemove(row.id)} />
            </li>
          ))}
        </ul>
      ) : null}
      {selectedRows.length > 0 ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="self-start text-muted-foreground"
        >
          Wis selectie
        </Button>
      ) : null}
    </section>
  );
}

function PinnedChip({ row, onRemove }: { row: ProductInfo; onRemove: () => void }) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={onRemove}
      className="h-auto min-h-9 items-start gap-component py-micro text-left whitespace-normal"
      aria-label={`Verwijder ${row.label} uit selectie`}
    >
      <span className="break-words">{row.label}</span>
      <span aria-hidden className="text-muted-foreground">
        ✕
      </span>
    </Button>
  );
}
