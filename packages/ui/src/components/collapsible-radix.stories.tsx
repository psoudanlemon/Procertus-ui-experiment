import * as React from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUpDownIcon,
  File01Icon,
  Folder01Icon,
  Maximize01Icon,
  Minimize01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { H4 } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Muted, P, Small } from "@/components/ui/typography";

/**
 * An interactive component that expands and collapses a panel.
 */
const meta = {
  title: "components/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A collapsible section with a trigger button and expandable content.
 */
export const Default: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex w-[350px] flex-col gap-2">
        <div className="flex items-center justify-between gap-4 px-4">
          <Small className="font-semibold">Order #4189</Small>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <HugeiconsIcon icon={ArrowUpDownIcon} />
              <span className="sr-only">Toggle details</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
          <Muted>Status</Muted>
          <Small className="font-medium">Shipped</Small>
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className="rounded-md border px-4 py-2 text-sm">
            <Small className="font-medium">Shipping address</Small>
            <Muted>100 Market St, San Francisco</Muted>
          </div>
          <div className="rounded-md border px-4 py-2 text-sm">
            <Small className="font-medium">Items</Small>
            <Muted>2x Studio Headphones</Muted>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

/**
 * A collapsible inside a card with a chevron trigger.
 */
export const Basic: Story = {
  render: () => (
    <Card className="mx-auto w-full max-w-sm">
      <CardContent>
        <Collapsible className="rounded-md data-[state=open]:bg-muted">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="group w-full">
              Product details
              <HugeiconsIcon icon={ArrowDown01Icon} className="ml-auto group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
            <div>This panel can be expanded or collapsed to reveal additional content.</div>
            <Button size="xs">Learn more</Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  ),
};

/**
 * A settings panel that reveals additional radius inputs when expanded.
 */
export const SettingsPanel: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <Card className="mx-auto w-full max-w-xs">
        <CardHeader>
          <CardTitle>Radius</CardTitle>
          <CardDescription>Set the corner radius of the element.</CardDescription>
        </CardHeader>
        <CardContent>
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex items-start gap-2">
            <FieldGroup className="grid w-full grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="radius-tl" className="sr-only">
                  Radius X
                </FieldLabel>
                <Input id="radius-tl" placeholder="0" defaultValue={0} />
              </Field>
              <Field>
                <FieldLabel htmlFor="radius-tr" className="sr-only">
                  Radius Y
                </FieldLabel>
                <Input id="radius-tr" placeholder="0" defaultValue={0} />
              </Field>
              <CollapsibleContent className="col-span-full grid grid-cols-subgrid gap-2">
                <Field>
                  <FieldLabel htmlFor="radius-bl" className="sr-only">
                    Radius X
                  </FieldLabel>
                  <Input id="radius-bl" placeholder="0" defaultValue={0} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="radius-br" className="sr-only">
                    Radius Y
                  </FieldLabel>
                  <Input id="radius-br" placeholder="0" defaultValue={0} />
                </Field>
              </CollapsibleContent>
            </FieldGroup>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="icon">
                {isOpen ? <HugeiconsIcon icon={Minimize01Icon} /> : <HugeiconsIcon icon={Maximize01Icon} />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </CardContent>
      </Card>
    );
  },
};

type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };

function renderItem(fileItem: FileTreeItem) {
  if ("items" in fileItem) {
    return (
      <Collapsible key={fileItem.name}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} className="transition-transform group-data-[state=open]:rotate-90" />
            <HugeiconsIcon icon={Folder01Icon} />
            {fileItem.name}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 ml-5">
          <div className="flex flex-col gap-1">
            {fileItem.items.map((child) => renderItem(child))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
  return (
    <Button
      key={fileItem.name}
      variant="link"
      size="sm"
      className="w-full justify-start gap-2 text-foreground"
    >
      <HugeiconsIcon icon={File01Icon} />
      <span>{fileItem.name}</span>
    </Button>
  );
}

const fileTree: FileTreeItem[] = [
  {
    name: "components",
    items: [
      {
        name: "ui",
        items: [
          { name: "button.tsx" },
          { name: "card.tsx" },
          { name: "dialog.tsx" },
          { name: "input.tsx" },
          { name: "select.tsx" },
          { name: "table.tsx" },
        ],
      },
      { name: "login-form.tsx" },
      { name: "register-form.tsx" },
    ],
  },
  {
    name: "lib",
    items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],
  },
  {
    name: "hooks",
    items: [
      { name: "use-media-query.ts" },
      { name: "use-debounce.ts" },
      { name: "use-local-storage.ts" },
    ],
  },
  {
    name: "types",
    items: [{ name: "index.d.ts" }, { name: "api.d.ts" }],
  },
  {
    name: "public",
    items: [{ name: "favicon.ico" }, { name: "logo.svg" }, { name: "images" }],
  },
  { name: "app.tsx" },
  { name: "layout.tsx" },
  { name: "globals.css" },
  { name: "package.json" },
  { name: "tsconfig.json" },
  { name: "README.md" },
  { name: ".gitignore" },
];

/**
 * Nested collapsibles used to build a file tree explorer.
 */
export const FileTree: Story = {
  render: () => (
    <Card className="mx-auto w-[16rem] gap-2">
      <CardHeader>
        <Tabs defaultValue="explorer">
          <TabsList className="w-full">
            <TabsTrigger value="explorer">Explorer</TabsTrigger>
            <TabsTrigger value="outline">Outline</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">{fileTree.map((item) => renderItem(item))}</div>
      </CardContent>
    </Card>
  ),
};
