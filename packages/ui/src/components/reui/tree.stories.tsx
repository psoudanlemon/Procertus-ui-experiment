import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      { id: "ui", name: "ui", kind: "folder", children: [] },
      { id: "ui-lib", name: "ui-lib", kind: "folder", children: [] },
    ],
  },
  { id: "readme", name: "README.md", kind: "file" },
];

const defaultExpanded = new Set(["app", "app-features", "packages"]);

const meta = {
  title: "reui/Tree",
  component: Tree,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "ReUI tree presentation components for @headless-tree/core item instances. These stories use lightweight item instances to demonstrate indentation, labels, toggle icon styles, selected state, and drag-line placement.",
      },
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
  level = 0,
}: {
  nodes: FileNode[];
  expandedIds: Set<string>;
  selectedId?: string;
  toggle: (id: string) => void;
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
      isExpanded: () => isExpanded,
      isFocused: () => false,
      isFolder: () => isFolder,
      isSelected: () => selectedId === node.id,
      isDragTarget: () => false,
      isMatchingSearch: () => node.name.includes("ui"),
    };

    if (!isFolder || !isExpanded) return [item];

    return [
      item,
      ...buildItems({
        nodes: node.children ?? [],
        expandedIds,
        selectedId,
        toggle,
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
      getDragLineStyle: () => ({ left: 32, right: 8, top: 128 }),
      getItems: () => items,
    }),
    [items]
  );

  return { tree, items };
}

function NodeLabel({ item, withIcon = false }: { item: StoryTreeItem; withIcon?: boolean }) {
  if (!withIcon) return <TreeItemLabel>{item.getItemName()}</TreeItemLabel>;

  return (
    <TreeItemLabel>
      <span
        className="size-2.5 rounded-[3px] bg-muted-foreground/40 data-[folder=true]:bg-primary"
        data-folder={item.isFolder()}
      />
      <span className="truncate">{item.getItemName()}</span>
      {item.isSelected() ? (
        <Badge variant="outline" className="ml-auto">
          open
        </Badge>
      ) : null}
    </TreeItemLabel>
  );
}

export const Default: Story = {
  render: function DefaultRender() {
    const { tree, items } = useStoryTree();

    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Project Files</CardTitle>
        </CardHeader>
        <CardContent>
          <Tree tree={tree}>
            {items.map((item) => (
              <TreeItem key={item.getId()} item={item as never}>
                <NodeLabel item={item} />
              </TreeItem>
            ))}
          </Tree>
        </CardContent>
      </Card>
    );
  },
};

export const WithLine: Story = {
  render: function WithLineRender() {
    const { tree, items } = useStoryTree("ui");

    return (
      <div className="w-full max-w-sm rounded-xl border bg-card p-3">
        <Tree
          tree={tree}
          className="relative before:absolute before:top-8 before:bottom-2 before:left-3 before:w-px before:bg-border"
        >
          {items.map((item) => (
            <TreeItem key={item.getId()} item={item as never}>
              <NodeLabel item={item} />
            </TreeItem>
          ))}
        </Tree>
      </div>
    );
  },
};

export const WithIcon: Story = {
  render: function WithIconRender() {
    const { tree, items } = useStoryTree("ui-lib");

    return (
      <Tree tree={tree} className="w-full max-w-md rounded-xl border bg-card p-3">
        {items.map((item) => (
          <TreeItem key={item.getId()} item={item as never}>
            <NodeLabel item={item} withIcon />
          </TreeItem>
        ))}
      </Tree>
    );
  },
};

export const PlusMinusIcons: Story = {
  render: function PlusMinusIconsRender() {
    const { tree, items } = useStoryTree();

    return (
      <Tree
        tree={tree}
        toggleIconType="plus-minus"
        className="w-full max-w-sm rounded-xl border bg-card p-3"
      >
        {items.map((item) => (
          <TreeItem key={item.getId()} item={item as never}>
            <NodeLabel item={item} />
          </TreeItem>
        ))}
      </Tree>
    );
  },
};

export const DragLine: Story = {
  render: function DragLineRender() {
    const { tree, items } = useStoryTree();

    return (
      <div className="relative w-full max-w-sm rounded-xl border bg-card p-3">
        <Tree tree={tree}>
          {items.map((item) => (
            <TreeItem key={item.getId()} item={item as never}>
              <NodeLabel item={item} />
            </TreeItem>
          ))}
          <TreeDragLine />
        </Tree>
      </div>
    );
  },
};
