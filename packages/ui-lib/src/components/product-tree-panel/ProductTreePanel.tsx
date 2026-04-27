/**
 * Collapsible **group / product** tree for Procertus decision-tree drilldown (not Q2B as
 * the operational taxonomy). Parent holds expansion state; this component is presentational
 * only — no `fetch` or client-side graph resolution.
 */
import { ArrowRight01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
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
} from "@procertus-ui/ui";

export type ProductTreeProductNode = {
  kind: "product";
  id: string;
  label: string;
  description?: string;
  productTypeId?: string;
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
  const pad = Math.min(depth, maxDepth) * 12;
  if (node.kind === "product") {
    return (
      <div style={{ paddingLeft: pad }} className="min-w-0">
        <Button
          type="button"
          variant="ghost"
          className="h-auto w-full min-w-0 flex-col items-stretch justify-start gap-0.5 rounded-md border border-transparent px-3 py-2 text-left transition hover:border-border/60 hover:bg-muted/30"
          onClick={() => onSelectProduct(node)}
        >
          <span className="w-full min-w-0 break-words font-medium text-foreground">{node.label}</span>
          {node.productTypeId ? (
            <span className="text-xs text-muted-foreground">Product type id: {node.productTypeId}</span>
          ) : null}
          {node.description ? <span className="text-xs text-muted-foreground">{node.description}</span> : null}
        </Button>
      </div>
    );
  }
  const open = expandedIds.has(node.id);
  if (!node.children.length) {
    return (
      <div style={{ paddingLeft: pad }} className="min-w-0 text-sm text-muted-foreground">
        {node.label} (empty)
      </div>
    );
  }
  return (
    <div style={{ paddingLeft: pad }} className="min-w-0">
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
              className="h-auto w-full min-w-0 items-start justify-between gap-2 rounded-none px-3 py-2.5 text-left font-medium hover:bg-muted/30"
            >
              <span className="min-w-0 break-words">{node.label}</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90"
                strokeWidth={1.5}
                aria-hidden
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-0.5 border-t border-border/30 px-1.5 py-1.5">
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
      <CardHeader className="gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {showSearch && onSearchChange ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
            {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
          </div>
        ) : actions ? (
          <div className="flex flex-wrap justify-end gap-2">{actions}</div>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-6 sm:px-6">
        {nodes.length === 0 ? (
          (emptyState ?? (
            <Empty>
              <EmptyIcon />
              <EmptyTitle>No product nodes</EmptyTitle>
              <EmptyDescription>Adjust filters or start from another cluster (story / demo)</EmptyDescription>
            </Empty>
          ))
        ) : (
          <div className="flex flex-col gap-2">
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
