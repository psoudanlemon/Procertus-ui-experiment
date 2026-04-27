import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/ui/button";
import { SplitView } from "./SplitView";

const meta = {
  title: "sewdn/SplitView",
  component: SplitView,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SplitView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultRender() {
    const [open, setOpen] = useState(true);

    return (
      <div className="h-screen p-6">
        <SplitView
          isOpen={open}
          onClose={() => setOpen(false)}
          primaryContent={
            <div className="flex h-full flex-col gap-3 p-4">
              <Button className="w-fit" onClick={() => setOpen(true)}>
                Open details
              </Button>
              <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                Primary workspace content.
              </div>
            </div>
          }
          secondaryContent={
            <div className="h-full bg-card p-6 text-sm">
              Secondary detail panel content.
            </div>
          }
          sheetTitle="Certification details"
        />
      </div>
    );
  },
};
