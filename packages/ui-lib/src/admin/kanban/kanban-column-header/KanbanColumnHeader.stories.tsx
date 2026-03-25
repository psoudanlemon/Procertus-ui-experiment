import type { Meta, StoryObj } from "@storybook/react-vite";

import { KanbanWipLimitBadge } from "../kanban-wip-limit-badge/KanbanWipLimitBadge";
import { KanbanColumnHeader } from "./KanbanColumnHeader";

const meta = {
  title: "Admin/Kanban & Boards/KanbanColumnHeader",
  component: KanbanColumnHeader,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Compact column title row. Use `trailing` for WIP or actions.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KanbanColumnHeader>;

export default meta;

export const Default = {
  render: () => (
    <div className="w-72 rounded-lg border bg-card p-3">
      <KanbanColumnHeader
        title="Review"
        subtitle="4 tasks"
        trailing={<KanbanWipLimitBadge current={4} limit={5} />}
      />
    </div>
  ),
} as unknown as StoryObj<typeof meta>;

export const OverWip = {
  render: () => (
    <div className="w-72 rounded-lg border bg-card p-3">
      <KanbanColumnHeader
        title="QA"
        subtitle="Over limit"
        trailing={<KanbanWipLimitBadge current={6} limit={5} />}
      />
    </div>
  ),
} as unknown as StoryObj<typeof meta>;
