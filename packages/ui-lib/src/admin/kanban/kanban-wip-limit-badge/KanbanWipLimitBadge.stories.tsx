import type { Meta, StoryObj } from "@storybook/react-vite";

import { KanbanWipLimitBadge } from "./KanbanWipLimitBadge";

const meta = {
  title: "Admin/Kanban & Boards/KanbanWipLimitBadge",
  component: KanbanWipLimitBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Minimal WIP readout. Omits the denominator when `limit` is not set.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KanbanWipLimitBadge>;

export default meta;

export const WithLimit = {
  render: () => <KanbanWipLimitBadge current={2} limit={5} />,
} as unknown as StoryObj<typeof meta>;

export const OverLimit = {
  render: () => <KanbanWipLimitBadge current={7} limit={5} />,
} as unknown as StoryObj<typeof meta>;

export const NoCap = {
  render: () => <KanbanWipLimitBadge current={12} />,
} as unknown as StoryObj<typeof meta>;
