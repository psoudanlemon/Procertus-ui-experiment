import * as React from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

/**
 * Augments native scroll functionality for custom, cross-browser styling.
 */
const meta = {
  title: "components/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A vertical scroll area with a list of tags.
 */
export const Default: Story = {
  render: () => (
    <Card className="w-48">
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          {tags.map((tag) => (
            <React.Fragment key={tag}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  ),
};

/**
 * A horizontal scroll area with colored cards.
 */
export const Horizontal: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="whitespace-nowrap">
          <div className="flex w-max space-x-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <figure key={i} className="shrink-0">
                <div className="overflow-hidden rounded-md">
                  <div className="flex h-40 w-[300px] items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                    Panel {i + 1}
                  </div>
                </div>
                <figcaption className="pt-2 text-xs text-muted-foreground">
                  Item <span className="font-semibold text-foreground">{i + 1}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  ),
};

/**
 * Both vertical and horizontal scrollbars active at the same time.
 */
export const Both: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Wide &amp; Tall Content</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <div className="w-[600px]">
            {Array.from({ length: 30 }).map((_, i) => (
              <React.Fragment key={i}>
                <div className="text-sm whitespace-nowrap">
                  Row {i + 1} — This content is wider than the scroll area container to demonstrate
                  horizontal scrolling.
                </div>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  ),
};
