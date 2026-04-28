import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import { DragDropVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "../lib/utils";
import { Sortable, SortableItem, SortableItemHandle } from "./sortable";
import { Badge } from "./ui/badge";

type UploadItem = {
  id: string;
  title: string;
  description: string;
  type: "image" | "document" | "video" | "audio";
  size: string;
};

const uploads: UploadItem[] = [
  {
    id: "hero-image",
    title: "Hero Image",
    description: "Main banner image",
    type: "image",
    size: "2.4 MB",
  },
  {
    id: "product-spec",
    title: "Product Specification",
    description: "Technical details document",
    type: "document",
    size: "1.2 MB",
  },
  {
    id: "demo-video",
    title: "Product Demo Video",
    description: "How to use the product",
    type: "video",
    size: "15.7 MB",
  },
  {
    id: "audio-guide",
    title: "Product Audio Guide",
    description: "Audio instructions",
    type: "audio",
    size: "8.3 MB",
  },
  {
    id: "gallery-photo",
    title: "Gallery Photo",
    description: "Additional product view",
    type: "image",
    size: "3.1 MB",
  },
];

const meta = {
  title: "components/Sortable",
  component: Sortable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "ReUI sortable wraps dnd-kit for reorderable vertical lists, grids, and nested-looking sections. Drag by the handle or use keyboard focus on the sortable item.",
      },
    },
  },
} satisfies Meta<typeof Sortable>;

export default meta;

type Story = StoryObj;

const typeVariant = {
  image: "success",
  document: "info",
  video: "warning",
  audio: "secondary",
} as const satisfies Record<UploadItem["type"], React.ComponentProps<typeof Badge>["variant"]>;

function DragHandle() {
  return (
    <HugeiconsIcon
      icon={DragDropVerticalIcon}
      aria-hidden
      className="size-6 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground group-data-[dragging=true]:text-foreground [&_path]:fill-current"
    />
  );
}

function UploadCard({ item, dense = false }: { item: UploadItem; dense?: boolean }) {
  return (
    <SortableItemHandle asChild>
      <Card
        className={cn(
          "group gap-0 py-0 shadow-sm transition-shadow hover:shadow-md hover:border-foreground/15 data-[dragging=true]:shadow-lg",
          dense ? "rounded-lg" : "rounded-xl"
        )}
      >
        <CardContent
          className={cn(
            "flex items-center gap-component",
            dense ? "p-component" : "p-section"
          )}
        >
          <DragHandle />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{item.title}</div>
            <div className="truncate text-xs text-muted-foreground">
              {item.description}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-component">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {item.size}
            </span>
            <Badge variant={typeVariant[item.type]}>{item.type}</Badge>
          </div>
        </CardContent>
      </Card>
    </SortableItemHandle>
  );
}

export const Vertical: Story = {
  render: function VerticalRender() {
    const [items, setItems] = useState(uploads);

    return (
      <Sortable
        value={items}
        onValueChange={setItems}
        getItemValue={(item) => item.id}
        className="flex w-full max-w-2xl flex-col gap-section"
      >
        {items.map((item) => (
          <SortableItem key={item.id} value={item.id}>
            <UploadCard item={item} />
          </SortableItem>
        ))}
      </Sortable>
    );
  },
};

export const Grid: Story = {
  render: function GridRender() {
    const [items, setItems] = useState(uploads);

    return (
      <Sortable
        value={items}
        onValueChange={setItems}
        getItemValue={(item) => item.id}
        strategy="grid"
        className="grid w-full max-w-4xl grid-cols-1 gap-section sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item) => (
          <SortableItem key={item.id} value={item.id}>
            <SortableItemHandle asChild>
              <Card className="group h-full gap-0 py-0 shadow-sm transition-shadow hover:shadow-md hover:border-foreground/15 data-[dragging=true]:shadow-lg">
                <div className="flex flex-col gap-component p-section">
                  <div className="flex items-center justify-between gap-component">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-sm">{item.title}</CardTitle>
                      <CardDescription className="truncate">
                        {item.description}
                      </CardDescription>
                    </div>
                    <DragHandle />
                  </div>
                  <div className="flex items-center justify-between gap-component">
                    <span className="truncate text-xs text-muted-foreground">
                      {item.size}
                    </span>
                    <Badge variant={typeVariant[item.type]}>{item.type}</Badge>
                  </div>
                </div>
              </Card>
            </SortableItemHandle>
          </SortableItem>
        ))}
      </Sortable>
    );
  },
};

export const NestedSections: Story = {
  render: function NestedSectionsRender() {
    const [colors, setColors] = useState([
      { id: "white", title: "White", description: "Default color" },
      { id: "black", title: "Black", description: "High contrast" },
      { id: "green", title: "Green", description: "Accent option" },
    ]);
    const [sizes, setSizes] = useState([
      { id: "small", title: "Small", description: "Compact fit" },
      { id: "medium", title: "Medium", description: "Standard fit" },
      { id: "large", title: "Large", description: "Roomy fit" },
    ]);

    const renderOption = (item: (typeof colors)[number]) => (
      <SortableItem key={item.id} value={item.id}>
        <SortableItemHandle asChild>
          <div className="group flex items-center gap-component rounded-lg border bg-muted/25 p-component shadow-xs transition-shadow hover:shadow-sm hover:border-foreground/15 data-[dragging=true]:shadow-lg">
            <DragHandle />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{item.title}</div>
              <div className="truncate text-xs text-muted-foreground">{item.description}</div>
            </div>
          </div>
        </SortableItemHandle>
      </SortableItem>
    );

    return (
      <div className="grid w-full max-w-4xl gap-section md:grid-cols-2">
        <Card className="py-section">
          <CardHeader className="px-section">
            <CardTitle>Colors</CardTitle>
            <CardDescription>Reorder options inside this group.</CardDescription>
          </CardHeader>
          <CardContent className="px-section">
            <Sortable
              value={colors}
              onValueChange={setColors}
              getItemValue={(item) => item.id}
              className="flex flex-col gap-component"
            >
              {colors.map(renderOption)}
            </Sortable>
          </CardContent>
        </Card>
        <Card className="py-section">
          <CardHeader className="px-section">
            <CardTitle>Sizes</CardTitle>
            <CardDescription>Each section owns its own sortable value.</CardDescription>
          </CardHeader>
          <CardContent className="px-section">
            <Sortable
              value={sizes}
              onValueChange={setSizes}
              getItemValue={(item) => item.id}
              className="flex flex-col gap-component"
            >
              {sizes.map(renderOption)}
            </Sortable>
          </CardContent>
        </Card>
      </div>
    );
  },
};

export const DisabledItem: Story = {
  render: function DisabledItemRender() {
    const [items, setItems] = useState(uploads);

    return (
      <Sortable
        value={items}
        onValueChange={setItems}
        getItemValue={(item) => item.id}
        className="flex w-full max-w-2xl flex-col gap-section"
      >
        {items.map((item) => (
          <SortableItem
            key={item.id}
            value={item.id}
            disabled={item.id === "product-spec"}
          >
            <UploadCard item={item} dense />
          </SortableItem>
        ))}
      </Sortable>
    );
  },
};
