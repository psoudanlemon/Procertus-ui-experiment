import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "@/components/ui/skeleton";

const meta = {
  title: "Applied Guidelines/Motion",
  tags: ["!autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8 p-12">
      <Skeleton className="h-6 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="flex gap-8">
        <Skeleton className="h-24 w-48 rounded-xl" />
        <Skeleton className="h-24 w-48 rounded-xl" />
        <Skeleton className="h-24 w-48 rounded-xl" />
      </div>
    </div>
  ),
};
