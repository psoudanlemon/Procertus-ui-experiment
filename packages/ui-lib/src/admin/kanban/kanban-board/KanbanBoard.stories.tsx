import type { Meta, StoryObj } from "@storybook/react-vite";

import { KanbanBoard } from "./KanbanBoard";

const meta = {
  title: "Admin/Kanban & Boards/KanbanBoard",
  component: KanbanBoard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Horizontal scroll container for kanban columns. v1 has no drag-and-drop library — use the optional `isDragging` prop from a parent when you add DnD later.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KanbanBoard>;

export default meta;

export const Default = {
  render: () => (
    <KanbanBoard
      title="Sprint board"
      description="Mock columns — see Three column board for a full example."
    >
      <div className="flex h-40 min-w-[12rem] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        Drop KanbanColumn children here
      </div>
    </KanbanBoard>
  ),
} as unknown as StoryObj<typeof meta>;

export const DraggingVisual = {
  render: () => (
    <KanbanBoard title="Dragging (visual only)" isDragging>
      <div className="flex h-40 min-w-[12rem] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        Column placeholder
      </div>
    </KanbanBoard>
  ),
} as unknown as StoryObj<typeof meta>;
