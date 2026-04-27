import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toolbar } from "./Toolbar";

const meta = {
  title: "sewdn/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Toolbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toolbar className="rounded-xl border">
      <span className="text-sm font-medium">Certification workspace</span>
      <Separator orientation="vertical" className="mx-3 h-6" />
      <Button size="sm" variant="outline">Save</Button>
      <Button size="sm" className="ml-auto">Submit</Button>
    </Toolbar>
  ),
};

export const DensePrimary: Story = {
  args: {
    variant: "dense",
    colorScheme: "primary",
    children: <span className="text-sm font-medium">Primary toolbar</span>,
  },
};
