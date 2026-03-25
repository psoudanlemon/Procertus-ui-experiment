import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { KanbanCard } from "./KanbanCard";

const meta = {
  title: "Admin/Kanban & Boards/KanbanCard",
  component: KanbanCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Task tile for a column. `isDragging` is presentational only in v1 — pair with your DnD layer when you add it.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KanbanCard>;

export default meta;

function KanbanCardWithMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <KanbanCard
      title="OAuth hardening"
      subtitle="Refresh token rotation + audit trail"
      tag={{ label: "Security", variant: "outline" }}
      avatarFallback="OH"
      menuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
      onEdit={() => undefined}
      onMove={() => undefined}
      onArchive={() => undefined}
    />
  );
}

export const Default = {
  render: () => <KanbanCardWithMenu />,
} as unknown as StoryObj<typeof meta>;

export const WithoutAvatarOrMenu = {
  render: () => (
    <KanbanCard
      title="Docs: Kanban overview"
      subtitle="Internal wiki — no owner avatar in this example"
      tag={{ label: "Docs", variant: "secondary" }}
    />
  ),
} as unknown as StoryObj<typeof meta>;

export const DraggingVisual = {
  render: () => (
    <KanbanCard
      title="Dragging (visual only)"
      subtitle="Parent sets isDragging while a drag session is active"
      avatarFallback="DV"
      isDragging
    />
  ),
} as unknown as StoryObj<typeof meta>;
