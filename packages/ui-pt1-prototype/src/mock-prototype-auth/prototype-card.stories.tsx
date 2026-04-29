import type { Meta, StoryObj } from "@storybook/react-vite";

import { PrototypeCard } from "./PrototypeCard";

const meta: Meta<typeof PrototypeCard> = {
  title: "pt1-prototype/PrototypeCard",
  component: PrototypeCard,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PrototypeCard>;

export const ContentOnly: Story = {
  args: {
    children: (
      <p className="m-0 text-sm text-muted-foreground">
        Any React node can be passed as children (forms, copy, custom fields).
      </p>
    ),
  },
};

export const WithHeader: Story = {
  args: {
    title: "Prototype block",
    description: "Use this frame only in demo or internal builds.",
    notice: "Data is not persisted to production systems.",
    children: (
      <p className="m-0 text-sm">
        <code className="rounded bg-muted px-1 py-0.5 text-xs">children</code> stays fully flexible.
      </p>
    ),
  },
};

export const WithoutBadge: Story = {
  args: {
    showDemoBadge: false,
    title: "No badge",
    children: <p className="m-0 text-sm text-muted-foreground">Badge hidden via showDemoBadge=false.</p>,
  },
};
