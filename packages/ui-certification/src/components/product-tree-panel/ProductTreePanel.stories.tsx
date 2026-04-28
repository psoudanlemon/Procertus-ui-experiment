import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useMemo, useState } from "react";

import type { ProductTreeNode, ProductTreeProductNode } from "./ProductTreePanel";
import { ProductTreePanel } from "./ProductTreePanel";

const fixtureTree: ProductTreeNode[] = [
  {
    kind: "group",
    id: "g-a",
    label: "Cladding and panels",
    children: [
      {
        kind: "group",
        id: "g-a-1",
        label: "Facade systems",
        children: [
          {
            kind: "product",
            id: "p-1",
            label: "Rainscreen (example)",
            productTypeId: "BR01",
            description: "Narrowed by Procertus model — fixture only",
            statusLabel: "BENOR available",
          },
        ],
      },
      {
        kind: "product",
        id: "p-2",
        label: "Siding product (example)",
        productTypeId: "Q2B-99",
        description: "Select to create a draft in the parent (story).",
        statusLabel: "Selectable",
      },
    ],
  },
  {
    kind: "group",
    id: "g-b",
    label: "Other (collapsed in story)",
    children: [
      {
        kind: "product",
        id: "p-3",
        label: "Isolated product row",
        description: "For multi-select in the next step, parent may map each id to a draft.",
        selectable: false,
        statusLabel: "Not available",
        unavailableReason:
          "The active intent is not offered for this product type, but the product remains visible for context.",
      },
    ],
  },
] satisfies ProductTreeNode[];

const meta = {
  title: "Certification Request/ProductTreePanel",
  component: ProductTreePanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Procertus **decision-tree** drilldown surface: `group` nodes are collapsible; selectable `product` rows call `onSelectProduct`. Unavailable product rows stay visible with a reason so users can understand why the active intent cannot be requested for that product. Expansion is **controlled** via `expandedIds` and `onToggle` (use `set` from React or Immer in the app).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProductTreePanel>;

export default meta;

function WithTree() {
  const [expanded, setExpanded] = useState<string[]>(["g-a", "g-a-1"]);
  const [q, setQ] = useState("");
  const [log, setLog] = useState("");

  const onToggle = useCallback((id: string, open: boolean) => {
    setExpanded((prev) => {
      const s = new Set(prev);
      if (open) {
        s.add(id);
      } else {
        s.delete(id);
      }
      return Array.from(s);
    });
  }, []);

  const onSelect = useCallback((p: ProductTreeProductNode) => {
    setLog(`Selected: ${p.label} (${p.id})`);
  }, []);

  const emptyTree = useMemo<ProductTreeNode[]>(
    () => (q.length > 20 ? [] : fixtureTree),
    [q],
  );

  return (
    <div className="max-w-5xl space-y-component">
      <ProductTreePanel
        title="Find your product"
        description="Reference fixture — 3 product rows under nested groups, including one unavailable row. Filter demo clears the tree on a long query (story-only)."
        searchValue={q}
        onSearchChange={setQ}
        nodes={emptyTree}
        expandedIds={expanded}
        onToggle={onToggle}
        onSelectProduct={onSelect}
        showSearch
      />
      <p className="text-sm text-muted-foreground" role="status">
        {log || "No product row clicked yet (story). Type 21+ chars to show empty state."}
      </p>
    </div>
  );
}

export const Default = { render: () => <WithTree /> } as unknown as StoryObj<typeof meta>;

function NoSearch() {
  const [expanded, setExpanded] = useState<string[]>([]);
  return (
    <ProductTreePanel
      title="No search (toolbar off)"
      description="Group expansion only; parent may filter nodes before pass."
      showSearch={false}
      nodes={fixtureTree}
      expandedIds={expanded}
      onToggle={(id, o) =>
        setExpanded((prev) => {
          const s = new Set(prev);
          if (o) {
            s.add(id);
          } else {
            s.delete(id);
          }
          return Array.from(s);
        })
      }
      onSelectProduct={() => undefined}
    />
  );
}

export const SearchHidden = { render: () => <NoSearch /> } as unknown as StoryObj<typeof meta>;
