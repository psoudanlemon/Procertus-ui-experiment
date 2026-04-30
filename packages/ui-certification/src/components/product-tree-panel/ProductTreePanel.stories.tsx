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
            description: "Narrowed by Procertus model, fixture only",
            statusLabel: "BENOR available",
          },
          {
            kind: "product",
            id: "p-1b",
            label: "Ventilated facade panel",
            productTypeId: "BR02",
            description: "Aluminium-backed cladding panel for high-rise applications",
            statusLabel: "BENOR available",
          },
          {
            kind: "product",
            id: "p-1c",
            label: "Fibre cement board",
            productTypeId: "BR03",
            description: "Pressed cement composite, A2-s1,d0 fire class",
            statusLabel: "ATG available",
          },
        ],
      },
      {
        kind: "group",
        id: "g-a-2",
        label: "Sandwich and insulation panels",
        children: [
          {
            kind: "product",
            id: "p-1d",
            label: "PUR core sandwich panel",
            productTypeId: "SP01",
            description: "Insulated metal panel for cold storage and industrial buildings",
            statusLabel: "Selectable",
          },
          {
            kind: "product",
            id: "p-1e",
            label: "Mineral wool sandwich panel",
            productTypeId: "SP02",
            description: "Non-combustible insulation core",
            statusLabel: "Selectable",
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
    id: "g-c",
    label: "Roofing systems",
    children: [
      {
        kind: "group",
        id: "g-c-1",
        label: "Pitched roof coverings",
        children: [
          {
            kind: "product",
            id: "p-4",
            label: "Concrete roof tile",
            productTypeId: "RT01",
            description: "Standard interlocking profile",
            statusLabel: "BENOR available",
          },
          {
            kind: "product",
            id: "p-5",
            label: "Clay roof tile",
            productTypeId: "RT02",
            description: "Traditional fired clay, multiple profiles",
            statusLabel: "BENOR available",
          },
          {
            kind: "product",
            id: "p-6",
            label: "Slate roof covering",
            productTypeId: "RT03",
            description: "Natural slate, hand-graded",
            statusLabel: "Selectable",
          },
        ],
      },
      {
        kind: "group",
        id: "g-c-2",
        label: "Flat roof membranes",
        children: [
          {
            kind: "product",
            id: "p-7",
            label: "Bitumen membrane (SBS)",
            productTypeId: "FM01",
            description: "Torch-applied modified bitumen",
            statusLabel: "ATG available",
          },
          {
            kind: "product",
            id: "p-8",
            label: "EPDM single-ply membrane",
            productTypeId: "FM02",
            description: "Mechanically fastened or fully adhered",
            statusLabel: "ATG available",
          },
          {
            kind: "product",
            id: "p-9",
            label: "PVC single-ply membrane",
            productTypeId: "FM03",
            description: "Hot-air welded seams",
            statusLabel: "Selectable",
          },
        ],
      },
    ],
  },
  {
    kind: "group",
    id: "g-d",
    label: "Structural elements",
    children: [
      {
        kind: "group",
        id: "g-d-1",
        label: "Concrete products",
        children: [
          {
            kind: "product",
            id: "p-10",
            label: "Precast concrete beam",
            productTypeId: "PC01",
            description: "Prestressed for spans up to 18m",
            statusLabel: "BENOR available",
          },
          {
            kind: "product",
            id: "p-11",
            label: "Hollow-core slab",
            productTypeId: "PC02",
            description: "Prestressed concrete floor element",
            statusLabel: "BENOR available",
          },
          {
            kind: "product",
            id: "p-12",
            label: "Concrete masonry block",
            productTypeId: "PC03",
            description: "Loadbearing and partition variants",
            statusLabel: "BENOR available",
          },
        ],
      },
      {
        kind: "group",
        id: "g-d-2",
        label: "Steel and timber",
        children: [
          {
            kind: "product",
            id: "p-13",
            label: "Cold-formed steel profile",
            productTypeId: "ST01",
            description: "C and Z sections for purlins and rails",
            statusLabel: "Selectable",
          },
          {
            kind: "product",
            id: "p-14",
            label: "Glulam timber beam",
            productTypeId: "TB01",
            description: "Engineered laminated timber, structural grade",
            statusLabel: "Selectable",
          },
        ],
      },
    ],
  },
  {
    kind: "group",
    id: "g-e",
    label: "Insulation",
    children: [
      {
        kind: "product",
        id: "p-15",
        label: "Mineral wool slab",
        productTypeId: "IN01",
        description: "Non-combustible thermal and acoustic insulation",
        statusLabel: "ATG available",
      },
      {
        kind: "product",
        id: "p-16",
        label: "PIR rigid insulation board",
        productTypeId: "IN02",
        description: "High thermal performance, foil-faced",
        statusLabel: "ATG available",
      },
      {
        kind: "product",
        id: "p-17",
        label: "Cellular glass block",
        productTypeId: "IN03",
        description: "Closed-cell, vapour-tight",
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
      {
        kind: "product",
        id: "p-3b",
        label: "Legacy adhesive product",
        description: "Discontinued in the current intent set.",
        selectable: false,
        statusLabel: "Not available",
        unavailableReason: "Withdrawn from the certification scheme as of 2025.",
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
  const [expanded, setExpanded] = useState<string[]>([
    "g-a",
    "g-a-1",
    "g-a-2",
    "g-c",
    "g-c-1",
    "g-c-2",
    "g-d",
    "g-d-1",
    "g-e",
  ]);
  const [q, setQ] = useState("");
  const [log, setLog] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    setSelectedId((prev) => (prev === p.id ? null : p.id));
    setLog(`Selected: ${p.label} (${p.id})`);
  }, []);

  const { displayTree, autoExpandedIds } = useMemo(() => {
    const lower = q.trim().toLowerCase();
    const filtering = lower.length > 0;

    const walk = (
      nodes: readonly ProductTreeNode[],
    ): { items: ProductTreeNode[]; matchedAncestors: Set<string> } => {
      const matchedAncestors = new Set<string>();
      const items: ProductTreeNode[] = [];
      for (const node of nodes) {
        if (node.kind === "group") {
          const sub = walk(node.children);
          if (filtering && sub.items.length === 0) continue;
          if (filtering) matchedAncestors.add(node.id);
          sub.matchedAncestors.forEach((id) => matchedAncestors.add(id));
          items.push({ ...node, children: sub.items });
          continue;
        }
        const matches =
          filtering && node.label.toLowerCase().includes(lower);
        if (filtering && !matches) continue;
        items.push({
          ...node,
          selected: node.id === selectedId,
          searchMatch: Boolean(matches),
        });
      }
      return { items, matchedAncestors };
    };

    const { items, matchedAncestors } = walk(fixtureTree);
    return { displayTree: items, autoExpandedIds: matchedAncestors };
  }, [q, selectedId]);

  const effectiveExpanded = q.trim().length > 0 ? Array.from(autoExpandedIds) : expanded;

  return (
    <div className="max-w-5xl space-y-component">
      <ProductTreePanel
        className="h-[650px]"
        title="Find your product"
        description="Reference fixture, type to filter products. Matching rows render with the search-match treatment and groups containing matches auto-expand."
        searchValue={q}
        onSearchChange={setQ}
        nodes={displayTree}
        expandedIds={effectiveExpanded}
        onToggle={onToggle}
        onSelectProduct={onSelect}
        showSearch
      />
      <p className="text-sm text-muted-foreground" role="status">
        {log || "No product row clicked yet (story). Type to filter the tree."}
      </p>
    </div>
  );
}

export const Default = { render: () => <WithTree /> } as unknown as StoryObj<typeof meta>;

function NoSearch() {
  const [expanded, setExpanded] = useState<string[]>([]);
  return (
    <ProductTreePanel
      className="h-[650px]"
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
