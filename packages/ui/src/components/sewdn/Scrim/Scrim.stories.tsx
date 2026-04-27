import type { Meta, StoryObj } from "@storybook/react-vite";

import { Scrim } from "./Scrim";

const meta = {
  title: "sewdn/Scrim",
  component: Scrim,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Scrim>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="relative h-64 w-96 overflow-hidden rounded-xl bg-gradient-to-br from-primary/40 via-muted to-secondary">
      <Scrim {...args} />
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-primary-foreground">
        <div className="text-lg font-semibold">Sewdn Scrim</div>
        <p className="text-sm opacity-90">Gradient overlay for readable media cards.</p>
      </div>
    </div>
  ),
};

export const Dark: Story = {
  ...Default,
  args: { variant: "dark" },
};

export const Light: Story = {
  ...Default,
  args: { variant: "light" },
};
