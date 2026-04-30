/**
 * Product tree for Procertus decision-tree drilldown. Parent holds expansion state;
 * this component is presentational only — no `fetch` or client-side graph resolution.
 */
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Input,
  Tree,
  TreeItem,
  TreeItemLabel,
  cn,
} from "@procertus-ui/ui";

export type ProductTreeProductNode = {
  kind: "product";
  id: string;
  label: string;
  description?: string;
  productTypeId?: string;
  /**
   * When false, the row stays visible but cannot be selected. Use this when the full
   * product taxonomy should remain browsable even if the active intent is unavailable.
   */
  selectable?: boolean;
  unavailableReason?: string;
  statusLabel?: string;
  selected?: boolean;
  /** When true, the row renders with the search-match treatment (bold). */
  searchMatch?: boolean;
};

export type ProductTreeGroupNode = {
  kind: "group";
  id: string;
  label: string;
  children: ProductTreeNode[];
};

export type ProductTreeNode = ProductTreeGroupNode | ProductTreeProductNode;

function collectGroupIds(nodes: readonly ProductTreeNode[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.kind === "group") {
      ids.push(node.id);
      ids.push(...collectGroupIds(node.children));
    }
  }
  return ids;
}

function ScrollFades({
  scrollerRef,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(true);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      setScrolled(el.scrollTop > 0);
      setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [scrollerRef]);

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-linear-to-b from-card to-transparent transition-opacity duration-200",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-linear-to-t from-card to-transparent transition-opacity duration-200",
          atBottom ? "opacity-0" : "opacity-100",
        )}
      />
    </>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex-1">
      <div
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      >
        <HugeiconsIcon icon={Search01Icon} className="size-4" strokeWidth={1.5} />
      </div>
      <Input
        className="pl-9"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter tree"
      />
    </div>
  );
}

type TreeItemProps = {
  item: ProductTreeItemInstance;
};

type ProductTreeItemInstance = {
  id: string;
  node: ProductTreeNode;
  level: number;
  getId: () => string;
  getItemName: () => string;
  getItemMeta: () => { level: number };
  getProps: () => ButtonHTMLAttributes<HTMLButtonElement> & { "data-disabled"?: string };
  isExpanded: () => boolean;
  isFocused: () => boolean;
  isFolder: () => boolean;
  isSelected: () => boolean;
  isDragTarget: () => boolean;
  isMatchingSearch: () => boolean;
};

function makeTreeItemInstance({
  node,
  level,
  expanded,
  onSelectProduct,
  onToggle,
}: {
  node: ProductTreeNode;
  level: number;
  expanded: boolean;
  onSelectProduct: (product: ProductTreeProductNode) => void;
  onToggle: (id: string, open: boolean) => void;
}): ProductTreeItemInstance {
  const isGroup = node.kind === "group";
  const selectable = node.kind === "product" ? node.selectable !== false : true;
  return {
    id: node.id,
    node,
    level,
    getId: () => node.id,
    getItemName: () => node.label,
    getItemMeta: () => ({ level }),
    getProps: () => ({
      type: "button",
      "aria-disabled": node.kind === "product" && !selectable ? true : undefined,
      onClick: () => {
        if (node.kind === "group") {
          onToggle(node.id, !expanded);
          return;
        }
        if (selectable) {
          onSelectProduct(node);
        }
      },
    }),
    isExpanded: () => expanded,
    isFocused: () => false,
    isFolder: () => isGroup,
    isSelected: () => node.kind === "product" && Boolean(node.selected),
    isDragTarget: () => false,
    isMatchingSearch: () =>
      node.kind === "product" && Boolean(node.searchMatch),
  };
}

function ProductTreeNodeView({
  node,
  level,
  expandedIds,
  onSelectProduct,
  onToggle,
  searchQuery,
}: {
  node: ProductTreeNode;
  level: number;
  expandedIds: ReadonlySet<string>;
  onSelectProduct: (product: ProductTreeProductNode) => void;
  onToggle: (id: string, open: boolean) => void;
  searchQuery?: string;
}) {
  const isGroup = node.kind === "group";
  const expanded = isGroup && expandedIds.has(node.id);
  const item = makeTreeItemInstance({ node, level, expanded, onSelectProduct, onToggle });

  return (
    <>
      <TreeItem
        item={item as never}
        className="relative bg-[length:var(--tree-padding)_100%] bg-no-repeat bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)/2-0.5px),var(--border)_calc(var(--tree-indent)/2-0.5px),var(--border)_calc(var(--tree-indent)/2+0.5px),transparent_calc(var(--tree-indent)/2+0.5px),transparent_var(--tree-indent))]"
      >
        <ProductTreeItemLabel item={item} searchQuery={searchQuery} />
      </TreeItem>
      {isGroup ? (
        <div
          inert={!expanded}
          aria-hidden={!expanded}
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-out",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            {node.children.map((child) => (
              <ProductTreeNodeView
                key={child.id}
                node={child}
                level={level + 1}
                expandedIds={expandedIds}
                onSelectProduct={onSelectProduct}
                onToggle={onToggle}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

function HighlightedLabel({ name, query }: { name: string; query?: string }) {
  const q = query?.trim() ?? "";
  if (!q) return <>{name}</>;
  const idx = name.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{name}</>;
  return (
    <>
      {name.slice(0, idx)}
      <mark className="rounded-sm bg-secondary px-0.5 text-secondary-foreground">
        {name.slice(idx, idx + q.length)}
      </mark>
      {name.slice(idx + q.length)}
    </>
  );
}

function ProductTreeItemLabel({
  item,
  searchQuery,
}: TreeItemProps & { searchQuery?: string }) {
  const node = item.node;

  if (node.kind === "group") {
    return (
      <TreeItemLabel
        className={cn(
          "relative cursor-pointer bg-card before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:bg-card hover:bg-accent hover:text-accent-foreground in-data-[selected=true]:bg-muted/40",
          "py-component pl-component text-sm font-semibold text-foreground",
        )}
      >
        <span className="min-w-0 wrap-break-word">
          <HighlightedLabel name={node.label} query={searchQuery} />
        </span>
        {node.children.length === 0 ? (
          <span className="ml-auto text-xs font-normal text-muted-foreground">Leeg</span>
        ) : null}
      </TreeItemLabel>
    );
  }

  const selectable = node.selectable !== false;
  const selected = Boolean(node.selected);

  return (
    <TreeItemLabel
      className={cn(
        "relative cursor-pointer items-start border border-transparent bg-card before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:bg-card",
        "hover:bg-accent hover:text-accent-foreground",
        "in-data-[selected=true]:border-primary in-data-[selected=true]:bg-accent in-data-[selected=true]:text-foreground",
        "in-data-[selected=true]:hover:bg-accent in-data-[selected=true]:hover:text-foreground",
        "py-component pl-component text-left transition-[background-color,border-color,color]",
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-micro">
        <span className="flex min-w-0 flex-wrap items-start gap-component">
          <span
            className={cn(
              "min-w-0 flex-1 wrap-break-word text-sm",
              selectable ? "font-medium text-foreground" : "font-normal text-muted-foreground",
              selectable && selected && "text-accent-foreground",
            )}
          >
            <HighlightedLabel name={node.label} query={searchQuery} />
          </span>
          {node.statusLabel ? (
            <Badge
              variant={selectable ? "secondary" : "outline"}
              className="shrink-0 whitespace-normal text-left font-normal"
            >
              {node.statusLabel}
            </Badge>
          ) : null}
        </span>
        {node.productTypeId ? (
          <span className="text-xs text-muted-foreground">
            Product type id: {node.productTypeId}
          </span>
        ) : null}
        {node.description ? (
          <span className="text-xs leading-snug text-muted-foreground">{node.description}</span>
        ) : null}
        {!selectable && node.unavailableReason ? (
          <span className="text-xs leading-snug text-muted-foreground">
            {node.unavailableReason}
          </span>
        ) : null}
      </span>
    </TreeItemLabel>
  );
}

export type ProductTreePanelProps = {
  className?: string;
  title: string;
  description?: string;
  /** If true, `searchValue` and `onSearchChange` are used. Filtering is a parent concern—pass a filtered `nodes` copy or filter yourself in `onSearchChange`. */
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actions?: ReactNode;
  nodes: ProductTreeNode[];
  /** Ids of **group** nodes that are expanded. */
  expandedIds: readonly string[];
  /** When provided, a single button toggles between fully expanded and fully collapsed. */
  onToggleExpandAll?: () => void;
  onToggle: (groupId: string, open: boolean) => void;
  onSelectProduct: (product: ProductTreeProductNode) => void;
  /** `Empty` is shown when `nodes` is empty. Override for custom copy. */
  emptyState?: ReactNode;
};

export function ProductTreePanel({
  className,
  title,
  description,
  showSearch = true,
  searchPlaceholder = "Filter…",
  searchValue = "",
  onSearchChange,
  actions,
  nodes,
  expandedIds: expanded,
  onToggleExpandAll,
  onToggle,
  onSelectProduct,
  emptyState,
}: ProductTreePanelProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const expandedSet = new Set(expanded);
  const tree = {
    getContainerProps: () => ({ role: "tree" }),
    getItems: () => [],
  };

  const groupIds = useMemo(() => collectGroupIds(nodes), [nodes]);
  const allExpanded = groupIds.length > 0 && groupIds.every((id) => expandedSet.has(id));

  const hasToolbarRow =
    (showSearch && Boolean(onSearchChange)) ||
    Boolean(actions) ||
    Boolean(onToggleExpandAll);

  return (
    <Card className={cn("mx-auto w-full max-w-5xl overflow-hidden py-section", className)}>
      <CardHeader className={cn("px-section", hasToolbarRow && "gap-section")}>
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {showSearch && onSearchChange ? (
          <div className="flex flex-col gap-component">
            <SearchInput
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
            {onToggleExpandAll || actions ? (
              <div className="flex flex-wrap items-center justify-between gap-micro">
                {onToggleExpandAll ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onToggleExpandAll}
                    className="gap-micro"
                    aria-pressed={allExpanded}
                  >
                    {allExpanded ? (
                      <ChevronsDownUp className="size-4" aria-hidden />
                    ) : (
                      <ChevronsUpDown className="size-4" aria-hidden />
                    )}
                    {allExpanded ? "Collapse all" : "Expand all"}
                  </Button>
                ) : (
                  <span aria-hidden />
                )}
                {actions ? <div className="flex flex-wrap gap-micro">{actions}</div> : null}
              </div>
            ) : null}
          </div>
        ) : actions || onToggleExpandAll ? (
          <div className="flex flex-wrap justify-end gap-micro">
            {onToggleExpandAll ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onToggleExpandAll}
                className="gap-micro"
                aria-pressed={allExpanded}
              >
                {allExpanded ? (
                  <ChevronsDownUp className="size-4" aria-hidden />
                ) : (
                  <ChevronsUpDown className="size-4" aria-hidden />
                )}
                {allExpanded ? "Collapse all" : "Expand all"}
              </Button>
            ) : null}
            {actions}
          </div>
        ) : null}
      </CardHeader>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <ScrollFades scrollerRef={scrollerRef} />
        <div
          ref={scrollerRef}
          data-slot="card-content"
          className="min-h-0 flex-1 space-y-component overflow-y-auto px-section"
        >
          {nodes.length === 0 ? (
            (emptyState ?? (
              <Empty>
                <EmptyIcon />
                <EmptyTitle>No product nodes</EmptyTitle>
                <EmptyDescription>
                  Adjust filters or start from another cluster (story / demo)
                </EmptyDescription>
              </Empty>
            ))
          ) : (
            <Tree tree={tree} indent={24} className="min-w-0">
              {nodes.map((node) => (
                <ProductTreeNodeView
                  key={node.id}
                  node={node}
                  level={0}
                  expandedIds={expandedSet}
                  onSelectProduct={onSelectProduct}
                  onToggle={onToggle}
                  searchQuery={searchValue}
                />
              ))}
            </Tree>
          )}
        </div>
      </div>
    </Card>
  );
}
