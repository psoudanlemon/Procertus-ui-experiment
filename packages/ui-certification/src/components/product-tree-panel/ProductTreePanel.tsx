/**
 * Collapsible **group / product** tree for Procertus decision-tree drilldown (not Q2B as
 * the operational taxonomy). Parent holds expansion state; this component is presentational
 * only — no `fetch` or client-side graph resolution.
 */
import { ArrowRight01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Input,
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
      <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" aria-hidden>
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
  node: ProductTreeNode;
  depth: number;
  maxDepth: number;
  expandedIds: ReadonlySet<string>;
  onToggle: (id: string, open: boolean) => void;
  onSelectProduct: (product: ProductTreeProductNode) => void;
};

function TreeItem({ node, depth, maxDepth, expandedIds, onToggle, onSelectProduct }: TreeItemProps) {
  const indentLevel = Math.min(depth, maxDepth);
  const indentStyle = { paddingLeft: `calc(${indentLevel} * var(--spacing-section))` };
  if (node.kind === "product") {
    const selectable = node.selectable !== false;
    return (
      <div style={indentStyle} className="min-w-0">
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "h-auto w-full min-w-0 flex-col items-stretch justify-start gap-micro rounded-md border px-component py-component text-left transition",
            node.selected
              ? "border-primary/60 bg-primary/5 hover:border-primary/70 hover:bg-primary/10"
              : "border-transparent hover:border-border/60 hover:bg-muted/30",
            !selectable && "cursor-not-allowed border-border/50 bg-muted/10 opacity-100 hover:bg-muted/10",
          )}
          disabled={!selectable}
          aria-disabled={!selectable}
          onClick={() => {
            if (selectable) {
              onSelectProduct(node);
            }
          }}
        >
          <span className="flex w-full min-w-0 flex-wrap items-start gap-component">
            <span className="min-w-0 flex-1 wrap-break-word font-medium text-foreground">{node.label}</span>
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
            <span className="text-xs text-muted-foreground">Product type id: {node.productTypeId}</span>
          ) : null}
          {node.description ? <span className="text-xs text-muted-foreground">{node.description}</span> : null}
          {!selectable && node.unavailableReason ? (
            <span className="text-xs font-medium text-muted-foreground">{node.unavailableReason}</span>
          ) : null}
        </Button>
      </div>
    );
  }
  const open = expandedIds.has(node.id);
  if (!node.children.length) {
    return (
      <div style={indentStyle} className="min-w-0 text-sm text-muted-foreground">
        {node.label} (empty)
      </div>
    );
  }
  return (
    <div style={indentStyle} className="min-w-0">
      <Collapsible
        open={open}
        onOpenChange={(o) => {
          onToggle(node.id, o);
        }}
        className="group"
      >
        <div
          className={cn(
            "overflow-hidden rounded-md border border-border/50 bg-muted/5",
            depth > 0 && "border-border/30",
          )}
        >
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-auto w-full min-w-0 items-start justify-between gap-component rounded-none px-component py-component text-left font-medium hover:bg-muted/30"
            >
              <span className="min-w-0 wrap-break-word">{node.label}</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="mt-micro size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90"
                strokeWidth={1.5}
                aria-hidden
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-micro border-t border-border/30 p-micro">
              {node.children.map((c) => (
                <TreeItem
                  key={c.id}
                  node={c}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  expandedIds={expandedIds}
                  onToggle={onToggle}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
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
  onToggle: (groupId: string, open: boolean) => void;
  onSelectProduct: (product: ProductTreeProductNode) => void;
  /** `Empty` is shown when `nodes` is empty. Override for custom copy. */
  emptyState?: ReactNode;
  /** Stops runaway margin at deep nesting. @default 8 */
  maxDepth?: number;
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
  onToggle,
  onSelectProduct,
  emptyState,
  maxDepth = 8,
}: ProductTreePanelProps) {
  const set = new Set(expanded);
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
            {actions ? <div className="flex shrink-0 flex-wrap gap-component">{actions}</div> : null}
          </div>
        ) : actions ? (
          <div className="flex flex-wrap justify-end gap-component">{actions}</div>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-component px-section pb-section">
        {nodes.length === 0 ? (
          (emptyState ?? (
            <Empty>
              <EmptyIcon />
              <EmptyTitle>No product nodes</EmptyTitle>
              <EmptyDescription>Adjust filters or start from another cluster (story / demo)</EmptyDescription>
            </Empty>
          ))
        ) : (
          <div className="flex flex-col gap-component">
            {nodes.map((n) => (
              <TreeItem
                key={n.id}
                node={n}
                depth={0}
                maxDepth={maxDepth}
                expandedIds={set}
                onToggle={onToggle}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
