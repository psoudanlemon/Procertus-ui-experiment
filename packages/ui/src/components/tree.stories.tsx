import {
  createOnDropHandler,
  createTree,
  dragAndDropFeature,
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature,
  type ItemInstance,
  type TreeConfig,
  type TreeInstance,
} from "@headless-tree/core";
import {
  File01Icon,
  Folder01Icon,
  Folder02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Tree, TreeDragLine, TreeItem, TreeItemLabel } from "./tree";

type FileNode = {
  id: string;
  name: string;
  kind: "folder" | "file";
  children?: FileNode[];
};

type StoryTreeItem = {
  id: string;
  node: FileNode;
  level: number;
  getId: () => string;
  getItemName: () => string;
  getItemMeta: () => { level: number };
  getProps: () => React.ButtonHTMLAttributes<HTMLButtonElement>;
  getChildren: () => FileNode[];
  isExpanded: () => boolean;
  isFocused: () => boolean;
  isFolder: () => boolean;
  isSelected: () => boolean;
  isDragTarget: () => boolean;
  isMatchingSearch: () => boolean;
};

const fileTree: FileNode[] = [
  {
    id: "app",
    name: "app",
    kind: "folder",
    children: [
      { id: "app-page", name: "page.tsx", kind: "file" },
      { id: "app-layout", name: "layout.tsx", kind: "file" },
      {
        id: "app-features",
        name: "features",
        kind: "folder",
        children: [
          { id: "wizard", name: "certification-wizard.tsx", kind: "file" },
          { id: "review", name: "review-panel.tsx", kind: "file" },
        ],
      },
    ],
  },
  {
    id: "packages",
    name: "packages",
    kind: "folder",
    children: [
      { id: "ui", name: "ui", kind: "file" },
      { id: "ui-lib", name: "ui-lib", kind: "file" },
    ],
  },
  { id: "readme", name: "README.md", kind: "file" },
];

const defaultExpanded = new Set(["app", "app-features", "packages"]);

const meta = {
  title: "components/Tree",
  component: Tree,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tree presentation components. Default, WithLine, WithIcon and Search use lightweight item instances; DragLine wires up a real headless-tree instance so rows can be reordered.",
      },
      canvas: { layout: "padded" },
    },
  },
} satisfies Meta<typeof Tree>;

export default meta;

type Story = StoryObj;

function buildItems({
  nodes,
  expandedIds,
  selectedId,
  toggle,
  matchesQuery,
  level = 0,
}: {
  nodes: FileNode[];
  expandedIds: Set<string>;
  selectedId?: string;
  toggle: (id: string) => void;
  matchesQuery?: (node: FileNode) => boolean;
  level?: number;
}): StoryTreeItem[] {
  return nodes.flatMap((node) => {
    const isFolder = node.kind === "folder";
    const isExpanded = expandedIds.has(node.id);
    const item: StoryTreeItem = {
      id: node.id,
      node,
      level,
      getId: () => node.id,
      getItemName: () => node.name,
      getItemMeta: () => ({ level }),
      getProps: () => ({
        type: "button",
        onClick: () => {
          if (isFolder) toggle(node.id);
        },
      }),
      getChildren: () => node.children ?? [],
      isExpanded: () => isExpanded,
      isFocused: () => false,
      isFolder: () => isFolder,
      isSelected: () => selectedId === node.id,
      isDragTarget: () => false,
      isMatchingSearch: () => Boolean(matchesQuery?.(node)),
    };

    if (!isFolder || !isExpanded) return [item];

    return [
      item,
      ...buildItems({
        nodes: node.children ?? [],
        expandedIds,
        selectedId,
        toggle,
        matchesQuery,
        level: level + 1,
      }),
    ];
  });
}

function useStoryTree(selectedId = "wizard") {
  const [expandedIds, setExpandedIds] = useState(defaultExpanded);
  const toggle = (id: string) =>
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const items = useMemo(
    () => buildItems({ nodes: fileTree, expandedIds, selectedId, toggle }),
    [expandedIds, selectedId]
  );

  const tree = useMemo(
    () => ({
      getContainerProps: () => ({ role: "tree" }),
      getItems: () => items,
    }),
    [items]
  );

  return { tree, items };
}

function TreeCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "flex w-full max-w-sm flex-col gap-component rounded-xl border bg-card p-section " +
        (className ?? "")
      }
    >
      <h3 className="px-component text-base font-medium leading-snug">{title}</h3>
      {children}
    </div>
  );
}

function PlainNodeLabel({ item }: { item: StoryTreeItem }) {
  return <TreeItemLabel>{item.getItemName()}</TreeItemLabel>;
}

function IconNodeLabel({ item }: { item: StoryTreeItem }) {
  const isFolder = item.isFolder();
  const isOpenFolder = isFolder && item.isExpanded();
  const icon = isFolder
    ? item.isExpanded()
      ? Folder02Icon
      : Folder01Icon
    : File01Icon;

  return (
    <TreeItemLabel>
      <HugeiconsIcon
        icon={icon}
        className={
          "size-4 shrink-0 " +
          (isOpenFolder ? "text-brand-primary-500" : "text-muted-foreground")
        }
      />
      <span className="min-w-0 flex-1 truncate">{item.getItemName()}</span>
    </TreeItemLabel>
  );
}

export const Default: Story = {
  render: function DefaultRender() {
    const { tree, items } = useStoryTree();

    return (
      <TreeCard title="Project files">
        <Tree tree={tree}>
          {items.map((item) => (
            <TreeItem key={item.getId()} item={item as never}>
              <PlainNodeLabel item={item} />
            </TreeItem>
          ))}
        </Tree>
      </TreeCard>
    );
  },
};

export const WithLine: Story = {
  render: function WithLineRender() {
    const { tree, items } = useStoryTree("ui");

    return (
      <TreeCard title="Project files">
        <Tree tree={tree} showLines>
          {items.map((item) => (
            <TreeItem key={item.getId()} item={item as never}>
              <PlainNodeLabel item={item} />
            </TreeItem>
          ))}
        </Tree>
      </TreeCard>
    );
  },
};

export const WithIcon: Story = {
  render: function WithIconRender() {
    const { tree, items } = useStoryTree("ui-lib");

    return (
      <TreeCard title="Project files">
        <Tree tree={tree}>
          {items.map((item) => (
            <TreeItem key={item.getId()} item={item as never}>
              <IconNodeLabel item={item} />
            </TreeItem>
          ))}
        </Tree>
      </TreeCard>
    );
  },
};

function collectAncestorIds(nodes: FileNode[], target: (node: FileNode) => boolean): string[] {
  const ancestors: string[] = [];
  const walk = (list: FileNode[]): boolean => {
    for (const node of list) {
      if (target(node)) return true;
      if (node.kind === "folder" && node.children && walk(node.children)) {
        ancestors.push(node.id);
        return true;
      }
    }
    return false;
  };
  walk(nodes);
  return ancestors;
}

function filterTreeByQuery(nodes: FileNode[], query: string): FileNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;
  return nodes.flatMap((node) => {
    const matches = node.name.toLowerCase().includes(q);
    if (node.kind === "folder") {
      const filteredChildren = filterTreeByQuery(node.children ?? [], q);
      if (matches || filteredChildren.length > 0) {
        return [{ ...node, children: filteredChildren }];
      }
      return [];
    }
    return matches ? [node] : [];
  });
}

function HighlightedName({ name, query }: { name: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{name}</>;
  const lower = name.toLowerCase();
  const lowerQuery = q.toLowerCase();
  const idx = lower.indexOf(lowerQuery);
  if (idx === -1) return <>{name}</>;
  const before = name.slice(0, idx);
  const match = name.slice(idx, idx + q.length);
  const after = name.slice(idx + q.length);
  return (
    <>
      {before}
      <mark className="rounded-sm bg-secondary px-0.5 text-secondary-foreground">
        {match}
      </mark>
      {after}
    </>
  );
}

function SearchNodeLabel({ item, query }: { item: StoryTreeItem; query: string }) {
  return (
    <TreeItemLabel>
      <span className="min-w-0 flex-1 truncate">
        <HighlightedName name={item.getItemName()} query={query} />
      </span>
    </TreeItemLabel>
  );
}

export const Search: Story = {
  render: function SearchRender() {
    const [query, setQuery] = useState("ui");
    const [expandedIds, setExpandedIds] = useState(defaultExpanded);

    const filteredNodes = useMemo(() => filterTreeByQuery(fileTree, query), [query]);

    const effectiveExpanded = useMemo(() => {
      if (!query.trim()) return expandedIds;
      const q = query.trim().toLowerCase();
      const ancestorIds = collectAncestorIds(fileTree, (node) =>
        node.name.toLowerCase().includes(q)
      );
      const next = new Set(expandedIds);
      ancestorIds.forEach((id) => next.add(id));
      return next;
    }, [expandedIds, query]);

    const toggle = (id: string) =>
      setExpandedIds((current) => {
        const next = new Set(current);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });

    const matchesQuery = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return undefined;
      return (node: FileNode) => node.name.toLowerCase().includes(q);
    }, [query]);

    const items = useMemo(
      () =>
        buildItems({
          nodes: filteredNodes,
          expandedIds: effectiveExpanded,
          toggle,
          matchesQuery,
        }),
      [filteredNodes, effectiveExpanded, matchesQuery]
    );

    const tree = useMemo(
      () => ({
        getContainerProps: () => ({ role: "tree" }),
        getItems: () => items,
      }),
      [items]
    );

    return (
      <TreeCard title="Project files">
        <div className="relative px-component">
          <HugeiconsIcon
            icon={Search01Icon}
            className="pointer-events-none absolute top-1/2 left-[calc(var(--spacing-component)+0.5rem)] size-4 -translate-y-1/2 text-muted-foreground [stroke-width:1.33px]"
          />
          <Input
            type="search"
            value={query}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(event.target.value)
            }
            placeholder="Search files"
            className="pl-8"
            aria-label="Search project files"
          />
        </div>
        {items.length === 0 ? (
          <p className="px-component text-sm text-muted-foreground">
            No matches for &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <Tree tree={tree}>
            {items.map((item) => (
              <TreeItem key={item.getId()} item={item as never}>
                <SearchNodeLabel item={item} query={query} />
              </TreeItem>
            ))}
          </Tree>
        )}
      </TreeCard>
    );
  },
};

type DragItem = { name: string; children?: string[] };

const initialDragItems: Record<string, DragItem> = {
  root: { name: "root", children: ["app", "packages", "readme"] },
  app: { name: "app", children: ["app-page", "app-layout", "app-features"] },
  "app-page": { name: "page.tsx" },
  "app-layout": { name: "layout.tsx" },
  "app-features": { name: "features", children: ["wizard", "review"] },
  wizard: { name: "certification-wizard.tsx" },
  review: { name: "review-panel.tsx" },
  packages: { name: "packages", children: ["ui", "ui-lib"] },
  ui: { name: "ui", children: [] },
  "ui-lib": { name: "ui-lib", children: [] },
  readme: { name: "README.md" },
};

function useHeadlessTree<T>(buildConfig: () => Omit<TreeConfig<T>, "setState">): TreeInstance<T> {
  const [, forceRender] = useReducer((tick: number) => tick + 1, 0);
  const treeRef = useRef<TreeInstance<T> | null>(null);

  if (!treeRef.current) {
    treeRef.current = createTree<T>({
      ...buildConfig(),
      setState: () => forceRender(),
    });
  }

  useEffect(() => {
    const tree = treeRef.current;
    if (!tree) return;
    tree.setMounted(true);
    tree.rebuildTree();
    return () => {
      tree.setMounted(false);
    };
  }, []);

  return treeRef.current;
}

export const DragLine: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Wired to a real `@headless-tree/core` instance with `dragAndDropFeature`. Drag a row onto a folder to nest it, or drop between rows to reorder. The blue insertion bar tracks the live drop target.",
      },
    },
  },
  render: function DragLineRender() {
    const itemsRef = useRef<Record<string, DragItem>>({ ...initialDragItems });

    const tree = useHeadlessTree<DragItem>(() => ({
      rootItemId: "root",
      getItemName: (item) => item.getItemData().name,
      isItemFolder: (item) => Array.isArray(item.getItemData().children),
      canReorder: true,
      onDrop: createOnDropHandler<DragItem>((parent, newChildren) => {
        const id = parent.getId();
        const current = itemsRef.current[id];
        if (!current) return;
        itemsRef.current = {
          ...itemsRef.current,
          [id]: { ...current, children: newChildren },
        };
      }),
      dataLoader: {
        getItem: (itemId) => itemsRef.current[itemId],
        getChildren: (itemId) => itemsRef.current[itemId]?.children ?? [],
      },
      initialState: {
        expandedItems: ["app", "app-features", "packages"],
      },
      features: [
        syncDataLoaderFeature,
        selectionFeature,
        dragAndDropFeature,
        hotkeysCoreFeature,
      ],
    }));

    return (
      <TreeCard title="Project files" className="relative">
        <Tree tree={tree}>
          {tree.getItems().map((item: ItemInstance<DragItem>) => (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel />
            </TreeItem>
          ))}
          <TreeDragLine />
        </Tree>
      </TreeCard>
    );
  },
};
