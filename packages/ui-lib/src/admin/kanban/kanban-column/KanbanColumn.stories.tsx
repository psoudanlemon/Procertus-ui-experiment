import type { Meta, StoryObj } from "@storybook/react-vite";

import { KanbanCard } from "../kanban-card/KanbanCard";
import { KanbanColumnHeader } from "../kanban-column-header/KanbanColumnHeader";
import { KanbanWipLimitBadge } from "../kanban-wip-limit-badge/KanbanWipLimitBadge";
import { KanbanColumn } from "./KanbanColumn";

const meta = {
  title: "Admin/Kanban & Boards/KanbanColumn",
  component: KanbanColumn,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Single lane: sticky `header` slot and scrollable body for cards. Compose with `KanbanColumnHeader` and `KanbanWipLimitBadge`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KanbanColumn>;

export default meta;

export const Default = {
  render: () => (
    <KanbanColumn
      header={
        <KanbanColumnHeader
          title="In progress"
          subtitle="2 tasks"
          trailing={<KanbanWipLimitBadge current={2} limit={3} />}
        />
      }
    >
      <KanbanCard title="Wire analytics" subtitle="Dashboards · Q2" avatarFallback="WA" />
      <KanbanCard title="Empty state copy" tag={{ label: "Content", variant: "secondary" }} />
    </KanbanColumn>
  ),
} as unknown as StoryObj<typeof meta>;

export const DraggingVisual = {
  render: () => (
    <KanbanColumn
      isDragging
      header={
        <KanbanColumnHeader
          title="Done"
          subtitle="Lane highlight"
          trailing={<KanbanWipLimitBadge current={0} />}
        />
      }
    >
      <p className="px-1 text-xs text-muted-foreground">Drop cards here…</p>
    </KanbanColumn>
  ),
} as unknown as StoryObj<typeof meta>;
