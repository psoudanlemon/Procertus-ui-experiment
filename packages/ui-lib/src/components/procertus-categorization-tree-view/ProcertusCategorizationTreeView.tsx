/**
 * Procertus certification tree browser — presentational UI (scaffold: data-panel → full tree).
 * Pass a {@link ProcertusCategorizationDoc} from the app (e.g. context or default import from `@procertus-ui/procertus-categorization`).
 */
import {
  CERTIFICATION_LABEL_META,
  CERTIFICATION_LABEL_ORDER,
  type Certification,
  type CertificationLabelKey,
  type ProcertusCategorizationDoc,
  type Procedures,
  type TreeNode,
  chipDisplay,
  chipVariant,
  collectGroupIds,
  filterClustersByCertLabel,
  flattenProducts,
  getCertValue,
  getCertifiableRowsForLabel,
  hasAnyProcedureData,
  hasCertifiableChip,
  statusTextWhenNoChip,
} from "@procertus-ui/procertus-categorization";
import { ChevronRight, FileJson2, PanelRightOpen } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@procertus-ui/ui";

export type { CertificationLabelKey } from "@procertus-ui/procertus-categorization";

function CertificationChipsRow({ certification }: { certification: Certification }) {
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {CERTIFICATION_LABEL_ORDER.map((key) => {
        const v = getCertValue(certification, key);
        if (!hasCertifiableChip(v)) {
          return null;
        }
        const { short } = CERTIFICATION_LABEL_META[key];
        return (
          <Badge key={key} variant={chipVariant(v)} className="font-normal">
            {chipDisplay(short, v)}
          </Badge>
        );
      })}
    </div>
  );
}

function ProcedureChipsRow({ procedures }: { procedures: Procedures }) {
  if (!hasAnyProcedureData(procedures)) {
    return null;
  }
  const items: Array<{ key: string; label: string; v: string }> = [];
  if (procedures.procertus.trim()) {
    items.push({
      key: "procertus",
      label: "PROCERTUS",
      v: procedures.procertus.trim(),
    });
  }
  if (procedures.partijkeuring.trim()) {
    items.push({
      key: "partij",
      label: "Partijkeuring",
      v: procedures.partijkeuring.trim(),
    });
  }
  if (procedures.epd.trim()) {
    items.push({ key: "epd", label: "EPD", v: procedures.epd.trim() });
  }
  if (items.length === 0) {
    return null;
  }
  return (
    <div className="mt-2 flex flex-wrap gap-1 border-t border-border/30 pt-2">
      {items.map(({ key, label, v }) =>
        hasCertifiableChip(v) ? (
          <Badge key={key} variant={chipVariant(v)} className="font-normal">
            {chipDisplay(label, v)}
          </Badge>
        ) : (
          <span key={key} className="text-[11px] text-muted-foreground">
            {label}: {statusTextWhenNoChip(v)}
          </span>
        ),
      )}
    </div>
  );
}

function ProductRow({ node }: { node: TreeNode }) {
  if (node.kind !== "product" || !node.certification || !node.procedures) {
    return null;
  }
  const { certification, procedures } = node;
  return (
    <Collapsible className="group">
      <div className="rounded-md border border-border/40 bg-muted/5">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-start justify-between gap-2 px-3 py-2 text-left text-sm transition hover:bg-muted/30"
          >
            <div className="min-w-0 flex-1">
              <div className="font-medium text-foreground">{node.label}</div>
              {node.productTypeStreamLabel ? (
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Product type{" "}
                  <span className="font-mono text-foreground">{node.productTypeStreamLabel}</span>
                </div>
              ) : null}
              <CertificationChipsRow certification={certification} />
            </div>
            <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t border-border/40 px-3 py-2">
          <p className="mb-2 text-[11px] leading-relaxed text-muted-foreground">
            Symbolen: <span className="font-mono">/</span> = certificatie niet mogelijk;{" "}
            <span className="font-mono">-</span> = niet door ons;{" "}
            <span className="font-mono">(x)</span> = mogelijk later / via federatie; leeg = niet
            aangeboden; <span className="font-mono">x</span> of niveau (bv.{" "}
            <span className="font-mono">2+</span>) = certificeerbaar volgens bron.
          </p>
          <CertificationChipsRow certification={certification} />
          <div className="mt-2 flex flex-col gap-1">
            {CERTIFICATION_LABEL_ORDER.map((key) => {
              const v = getCertValue(certification, key);
              if (hasCertifiableChip(v)) {
                return null;
              }
              return (
                <div key={key} className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {CERTIFICATION_LABEL_META[key].short}
                  </span>
                  : {statusTextWhenNoChip(v)}
                </div>
              );
            })}
          </div>
          <ProcedureChipsRow procedures={procedures} />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function GroupBranch({
  node,
  openIds,
  setGroupOpen,
  depth,
}: {
  node: TreeNode;
  openIds: Set<string>;
  setGroupOpen: (id: string, open: boolean) => void;
  depth: number;
}) {
  if (node.kind !== "group" || !node.children?.length) {
    return null;
  }
  return (
    <Collapsible
      className="group"
      open={openIds.has(node.id)}
      onOpenChange={(o) => setGroupOpen(node.id, o)}
    >
      <div
        className={cn(
          "overflow-hidden rounded-lg border border-border/60 bg-background",
          depth > 0 && "border-border/40",
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-muted/40"
          >
            <span className="font-medium text-foreground">{node.label}</span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t border-border/50 bg-muted/5 px-2 py-2">
          <ProcertusTreeNodes
            nodes={node.children}
            openIds={openIds}
            setGroupOpen={setGroupOpen}
            depth={depth + 1}
          />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function ProcertusTreeNodes({
  nodes,
  openIds,
  setGroupOpen,
  depth,
}: {
  nodes: TreeNode[];
  openIds: Set<string>;
  setGroupOpen: (id: string, open: boolean) => void;
  depth: number;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        depth > 0 && "ml-1 border-l border-border/30 pl-2 sm:ml-2 sm:pl-3",
      )}
    >
      {nodes.map((node) =>
        node.kind === "group" ? (
          <GroupBranch
            key={node.id}
            node={node}
            openIds={openIds}
            setGroupOpen={setGroupOpen}
            depth={depth}
          />
        ) : (
          <ProductRow key={node.id} node={node} />
        ),
      )}
    </div>
  );
}

function formatCeLevelForEmbeddedList(value: string): string {
  const v = value.trim();
  if (v === "x") {
    return "niveau 1 (standaard)";
  }
  if (v === "(x)") {
    return "later / via federatie";
  }
  return `niveau ${v}`;
}

function formatEmbeddedProductCommaPart(
  label: string,
  certValue: string,
  selected: CertificationLabelKey,
): string {
  if (selected !== "ce") {
    return label;
  }
  return `${label} (${formatCeLevelForEmbeddedList(certValue)})`;
}

function buildEmbeddedCertificationListItems(
  nodes: TreeNode[],
  selected: CertificationLabelKey,
): ReactNode[] {
  const out: ReactNode[] = [];
  let productRun: Array<{ id: string; text: string }> = [];

  const flushProducts = () => {
    if (productRun.length === 0) {
      return;
    }
    out.push(
      <li key={productRun.map((p) => p.id).join("\0")} className="text-sm text-foreground">
        {productRun.map((p) => p.text).join(", ")}
      </li>,
    );
    productRun = [];
  };

  for (const node of nodes) {
    if (node.kind === "product") {
      const cert = node.certification;
      const v = cert ? getCertValue(cert, selected) : "";
      if (!hasCertifiableChip(v)) {
        continue;
      }
      productRun.push({
        id: node.id,
        text: formatEmbeddedProductCommaPart(node.label, v, selected),
      });
    } else if (node.kind === "group" && node.children?.length) {
      flushProducts();
      const inner = buildEmbeddedCertificationListItems(node.children, selected);
      if (inner.length > 0) {
        out.push(
          <li key={node.id} className="text-sm">
            <span className="font-medium text-foreground">{node.label}</span>
            <ol className="mt-1.5 list-decimal space-y-1.5 pl-5 text-sm marker:text-muted-foreground">
              {inner}
            </ol>
          </li>,
        );
      }
    }
  }

  flushProducts();
  return out;
}

function EmbeddedCertificationNestedList({
  clusters,
  selected,
}: {
  clusters: readonly TreeNode[];
  selected: CertificationLabelKey;
}) {
  const items = useMemo(
    () => buildEmbeddedCertificationListItems([...clusters], selected),
    [clusters, selected],
  );

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Geen producten voor dit label.</p>;
  }

  return (
    <ol className="list-outside list-decimal space-y-2 pl-5 text-sm marker:text-muted-foreground">
      {items}
    </ol>
  );
}

function EmbeddedCertificationDrilldown({
  clusters,
  flatProducts,
}: {
  clusters: readonly TreeNode[];
  flatProducts: ReturnType<typeof flattenProducts>;
}) {
  return (
    <div className="flex flex-col gap-2 px-3 py-3 sm:px-5 sm:py-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Zelfde hiërarchie als de bron: geneste genummerde lijst per cluster. Bladproducten onder
        dezelfde ouder staan in één regel, komma-gescheiden; bij CE staat het niveau tussen haakjes
        per product. Voor paden, chips en procedures: open het zijpaneel — het hele paneel scrollt
        door tot het einde van de drilldown.
      </p>
      <div className="flex flex-col gap-2">
        {CERTIFICATION_LABEL_ORDER.map((labelKey) => {
          const count = getCertifiableRowsForLabel(flatProducts, labelKey).length;
          const { short, description } = CERTIFICATION_LABEL_META[labelKey];
          return (
            <Collapsible
              key={labelKey}
              className="group rounded-lg border border-border/60 bg-muted/5"
            >
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">{short}</div>
                    <div className="text-xs text-muted-foreground">{description}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t border-border/50 px-3 py-2">
                <EmbeddedCertificationNestedList clusters={clusters} selected={labelKey} />
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}

const sheetDescription =
  "Scroll this panel to reach the end of the content. Use the product hierarchy tab for the full tree, or the certification tab to filter by CE, BENOR, ATG, or SSD and drill down the same organizational structure (only branches with at least one certifiable product for that label).";

export type ProcertusCategorizationTreeViewProps = {
  /** Categorization snapshot (e.g. from `useProcertusCategorizationDoc()` or `defaultProcertusCategorizationDoc`). */
  doc: ProcertusCategorizationDoc;
  title?: string;
  className?: string;
};

export function ProcertusCategorizationTreeView({
  doc,
  title = "Procertus certification decision tree",
  className,
}: ProcertusCategorizationTreeViewProps) {
  const groupIds = useMemo(() => collectGroupIds(doc.clusters), [doc]);
  const flatProducts = useMemo(() => flattenProducts(doc.clusters, []), [doc]);
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(doc.clusters.map((c) => c.id)));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTab, setSheetTab] = useState<"tree" | "byLabel">("tree");
  const [selectedLabel, setSelectedLabel] = useState<CertificationLabelKey>("ce");

  const filteredByLabelClusters = useMemo(
    () => filterClustersByCertLabel([...doc.clusters], selectedLabel),
    [doc, selectedLabel],
  );

  const byLabelGroupIds = useMemo(
    () => collectGroupIds(filteredByLabelClusters),
    [filteredByLabelClusters],
  );

  const [byLabelOpenIds, setByLabelOpenIds] = useState<Set<string>>(() => {
    const filtered = filterClustersByCertLabel([...doc.clusters], "ce");
    return new Set(filtered.map((c) => c.id));
  });

  useEffect(() => {
    setOpenIds(new Set(doc.clusters.map((c) => c.id)));
  }, [doc]);

  useEffect(() => {
    const filtered = filterClustersByCertLabel([...doc.clusters], selectedLabel);
    setByLabelOpenIds(new Set(filtered.map((c) => c.id)));
  }, [doc, selectedLabel]);

  const setGroupOpen = useCallback((id: string, open: boolean) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (open) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const setByLabelGroupOpen = useCallback((id: string, open: boolean) => {
    setByLabelOpenIds((prev) => {
      const next = new Set(prev);
      if (open) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const allExpanded = groupIds.length > 0 && groupIds.every((id) => openIds.has(id));
  const allCollapsed = groupIds.length === 0 || groupIds.every((id) => !openIds.has(id));

  const handleExpandAll = useCallback(() => {
    setOpenIds(new Set(groupIds));
  }, [groupIds]);

  const handleCollapseAll = useCallback(() => {
    setOpenIds(new Set());
  }, []);

  const byLabelAllExpanded =
    byLabelGroupIds.length > 0 && byLabelGroupIds.every((id) => byLabelOpenIds.has(id));
  const byLabelAllCollapsed =
    byLabelGroupIds.length === 0 || byLabelGroupIds.every((id) => !byLabelOpenIds.has(id));

  const handleByLabelExpandAll = useCallback(() => {
    setByLabelOpenIds(new Set(byLabelGroupIds));
  }, [byLabelGroupIds]);

  const handleByLabelCollapseAll = useCallback(() => {
    setByLabelOpenIds(new Set());
  }, []);

  const tree = (
    <ProcertusTreeNodes
      nodes={[...doc.clusters]}
      openIds={openIds}
      setGroupOpen={setGroupOpen}
      depth={0}
    />
  );

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleExpandAll}
        disabled={allExpanded}
      >
        Expand all
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCollapseAll}
        disabled={allCollapsed}
      >
        Collapse all
      </Button>
    </div>
  );

  const source = doc.meta.source.spreadsheetExport;

  return (
    <div className={cn("not-prose flex flex-col gap-6", className)}>
      <section className="overflow-hidden rounded-xl border border-border/60 bg-background">
        <div className="flex flex-col gap-3 border-b border-border/60 px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <FileJson2 className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="font-medium">Data v{doc.meta.treeVersion}</span>
              <span className="text-muted-foreground">·</span>
              <span className="truncate" title={source.fileName}>
                {source.fileName}
              </span>
            </span>
            {doc.meta.wizard?.entryPoints?.length ? (
              <span className="text-xs">
                Intake entry points: {doc.meta.wizard.entryPoints.join(", ")}
              </span>
            ) : null}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setSheetOpen(true)}
          >
            <PanelRightOpen className="size-4" aria-hidden />
            Open side panel
          </Button>
        </div>

        <EmbeddedCertificationDrilldown clusters={doc.clusters} flatProducts={flatProducts} />
      </section>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex h-full max-h-dvh w-full flex-col gap-0 overflow-y-auto overscroll-y-contain border-l p-6 sm:max-w-3xl">
          <SheetHeader className="space-y-1 p-0 text-left">
            <SheetTitle className="pr-10 text-2xl leading-tight">{title}</SheetTitle>
            <SheetDescription>{sheetDescription}</SheetDescription>
          </SheetHeader>

          <Tabs
            value={sheetTab}
            onValueChange={(v) => setSheetTab(v as "tree" | "byLabel")}
            className="mt-6 flex flex-col gap-4 pb-8"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="tree">Product hierarchy</TabsTrigger>
              <TabsTrigger value="byLabel">By certification</TabsTrigger>
            </TabsList>

            <TabsContent
              value="tree"
              className="mt-0 flex flex-col gap-4 focus-visible:outline-none"
            >
              {toolbar}
              <div>{tree}</div>
            </TabsContent>

            <TabsContent
              value="byLabel"
              className="mt-0 flex flex-col gap-4 focus-visible:outline-none"
            >
              <div className="flex flex-wrap gap-2">
                {CERTIFICATION_LABEL_ORDER.map((key) => (
                  <Button
                    key={key}
                    type="button"
                    size="sm"
                    variant={selectedLabel === key ? "default" : "outline"}
                    onClick={() => setSelectedLabel(key)}
                  >
                    {CERTIFICATION_LABEL_META[key].short}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {CERTIFICATION_LABEL_META[selectedLabel].description} — zelfde boomstructuur als op
                het tabblad Product hierarchy, maar takken zonder certificeerbare producten voor{" "}
                <span className="font-medium text-foreground">
                  {CERTIFICATION_LABEL_META[selectedLabel].short}
                </span>{" "}
                zijn weggefilterd. Vouw clusters open voor detail (alle labels en procedures per
                product).
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleByLabelExpandAll}
                  disabled={byLabelAllExpanded || byLabelGroupIds.length === 0}
                >
                  Expand all
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleByLabelCollapseAll}
                  disabled={byLabelAllCollapsed}
                >
                  Collapse all
                </Button>
              </div>
              {filteredByLabelClusters.length === 0 ? (
                <p className="text-sm text-muted-foreground">Geen producten voor dit label.</p>
              ) : (
                <ProcertusTreeNodes
                  nodes={filteredByLabelClusters}
                  openIds={byLabelOpenIds}
                  setGroupOpen={setByLabelGroupOpen}
                  depth={0}
                />
              )}
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
}
