import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { KanbanBoard } from "./kanban-board/KanbanBoard";
import { KanbanCard } from "./kanban-card/KanbanCard";
import { KanbanColumn } from "./kanban-column/KanbanColumn";
import { KanbanColumnHeader } from "./kanban-column-header/KanbanColumnHeader";
import { KanbanWipLimitBadge } from "./kanban-wip-limit-badge/KanbanWipLimitBadge";

const meta: Meta = {
  title: "Admin/Kanban & Boards/Showcase",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "v1 board mock: three lanes and sample cards. There is **no** drag-and-drop library — `isDragging` exists only for future wiring or Storybook demos.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

function CardWithMenu(props: {
  title: string;
  subtitle?: string;
  tag?: { label: string; variant?: "default" | "secondary" | "outline" | "destructive" };
  avatarFallback?: string;
  isDragging?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <KanbanCard
      {...props}
      menuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
      onEdit={() => undefined}
      onMove={() => undefined}
      onArchive={() => undefined}
    />
  );
}

export const ThreeColumnBoard = {
  render: () => (
    <div className="bg-background p-6">
      <KanbanBoard
        title="Procertus — delivery board"
        description="Mock data only; interactions are no-ops. Add @dnd-kit or similar when you need real drag-and-drop."
      >
        <KanbanColumn
          header={
            <KanbanColumnHeader
              title="Backlog"
              subtitle="3 cards"
              trailing={<KanbanWipLimitBadge current={3} />}
            />
          }
        >
          <CardWithMenu
            title="Spec: tenant audit log"
            subtitle="Product · compliance"
            tag={{ label: "Spec", variant: "outline" }}
            avatarFallback="AL"
          />
          <CardWithMenu
            title="Design tokens — dark mode"
            subtitle="UI platform"
            tag={{ label: "Design", variant: "secondary" }}
            avatarFallback="TK"
          />
          <KanbanCard
            title="Spike: Effect HTTP client"
            subtitle="Time-boxed exploration"
            tag={{ label: "Spike", variant: "outline" }}
          />
        </KanbanColumn>

        <KanbanColumn
          header={
            <KanbanColumnHeader
              title="In progress"
              subtitle="2 cards · WIP 3"
              trailing={<KanbanWipLimitBadge current={2} limit={3} />}
            />
          }
        >
          <CardWithMenu
            title="Kanban primitives in ui-lib"
            subtitle="Admin boards track"
            tag={{ label: "Build", variant: "default" }}
            avatarFallback="KB"
          />
          <CardWithMenu
            title="Storybook — Admin stories"
            subtitle="Docs sidebar grouping"
            tag={{ label: "Docs", variant: "secondary" }}
            avatarFallback="SB"
          />
        </KanbanColumn>

        <KanbanColumn
          header={
            <KanbanColumnHeader
              title="Done"
              subtitle="2 cards"
              trailing={<KanbanWipLimitBadge current={2} limit={5} />}
            />
          }
        >
          <CardWithMenu
            title="Lint ui-lib admin slice"
            subtitle="oxlint + stories"
            tag={{ label: "Chore", variant: "outline" }}
            avatarFallback="LX"
          />
          <KanbanCard
            title="Release notes draft"
            subtitle="v0.2.0"
            tag={{ label: "Ship", variant: "secondary" }}
            avatarFallback="RN"
            isDragging
          />
        </KanbanColumn>
      </KanbanBoard>
    </div>
  ),
} satisfies StoryObj<Meta>;
