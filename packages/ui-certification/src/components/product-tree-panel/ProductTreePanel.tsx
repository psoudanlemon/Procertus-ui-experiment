/**
 * Product tree for Procertus decision-tree drilldown. Parent holds expansion state;
 * this component is presentational only — no `fetch` or client-side graph resolution.
 */
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
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
};

export type ProductTreeGroupNode = {
  kind: "group";
  id: string;
  label: string;
  children: ProductTreeNode[];
};

export type ProductTreeNode = ProductTreeGroupNode | ProductTreeProductNode;

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
    <div className="relative max-w-md flex-1">
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

function buildTreeItems({
  expandedIds,
  level = 0,
  nodes,
  onSelectProduct,
  onToggle,
}: {
  expandedIds: ReadonlySet<string>;
  level?: number;
  nodes: readonly ProductTreeNode[];
  onSelectProduct: (product: ProductTreeProductNode) => void;
  onToggle: (id: string, open: boolean) => void;
}): ProductTreeItemInstance[] {
  return nodes.flatMap((node) => {
    const isGroup = node.kind === "group";
    const expanded = isGroup && expandedIds.has(node.id);
    const selectable = node.kind === "product" ? node.selectable !== false : true;
    const item: ProductTreeItemInstance = {
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
      isMatchingSearch: () => false,
    };

    if (!isGroup || !expanded) return [item];
    return [
      item,
      ...buildTreeItems({
        expandedIds,
        level: level + 1,
        nodes: node.children,
        onSelectProduct,
        onToggle,
      }),
    ];
  });
}

function ProductTreeItemLabel({ item }: TreeItemProps) {
  const node = item.node;

  if (node.kind === "group") {
    return (
      <TreeItemLabel
        className={cn(
          "relative cursor-pointer bg-card before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:bg-card hover:bg-accent hover:text-accent-foreground in-data-[selected=true]:bg-muted/40",
          "py-component text-sm font-semibold text-foreground",
        )}
      >
        <span className="min-w-0 wrap-break-word">{node.label}</span>
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
        "relative cursor-pointer items-start bg-card before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:bg-card hover:bg-accent hover:text-accent-foreground in-data-[selected=true]:text-foreground",
        selected &&
          "border-l-4 border-l-accent-foreground bg-accent/40 pl-[calc(var(--spacing-component)-4px)] hover:bg-accent/50",
        "py-component text-left transition-[background-color,border-color,color]",
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-micro">
        <span className="flex min-w-0 flex-wrap items-start gap-component">
          <span
            className={cn(
              "min-w-0 flex-1 wrap-break-word text-sm",
              selectable ? "font-medium text-foreground" : "font-normal text-muted-foreground",
            )}
          >
            {node.label}
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
  onCollapseAll?: () => void;
  onExpandAll?: () => void;
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
  onCollapseAll,
  onExpandAll,
  onToggle,
  onSelectProduct,
  emptyState,
}: ProductTreePanelProps) {
  const set = new Set(expanded);
  const items = buildTreeItems({
    expandedIds: set,
    nodes,
    onSelectProduct,
    onToggle,
  });
  const tree = {
    getContainerProps: () => ({ role: "tree" }),
    getItems: () => items,
  };

  return (
    <Card className={cn("mx-auto w-full max-w-5xl overflow-hidden", className)}>
      <CardHeader className="gap-section">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {showSearch && onSearchChange ? (
          <div className="flex flex-col gap-component sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
            <div className="flex shrink-0 flex-wrap gap-micro">
              {onCollapseAll ? (
                <Button type="button" variant="outline" size="sm" onClick={onCollapseAll}>
                  Collapse All
                </Button>
              ) : null}
              {onExpandAll ? (
                <Button type="button" variant="outline" size="sm" onClick={onExpandAll}>
                  Expand All
                </Button>
              ) : null}
              {actions}
            </div>
          </div>
        ) : actions ? (
          <div className="flex flex-wrap justify-end gap-micro">
            {onCollapseAll ? (
              <Button type="button" variant="outline" size="sm" onClick={onCollapseAll}>
                Collapse All
              </Button>
            ) : null}
            {onExpandAll ? (
              <Button type="button" variant="outline" size="sm" onClick={onExpandAll}>
                Expand All
              </Button>
            ) : null}
            {actions}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-component px-section pb-section">
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
          <Tree
            tree={tree}
            indent={24}
            className="relative min-w-0 before:absolute before:inset-0 before:-ms-1.25 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
          >
            {items.map((item) => (
              <TreeItem key={item.id} item={item as never} className="relative">
                <ProductTreeItemLabel item={item} />
              </TreeItem>
            ))}
          </Tree>
        )}
      </CardContent>
    </Card>
  );
}
