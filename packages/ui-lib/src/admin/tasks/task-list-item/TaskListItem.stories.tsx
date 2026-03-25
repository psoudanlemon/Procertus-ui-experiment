import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { TaskListItem } from "./TaskListItem";

const meta = {
  title: "Admin/Tasks & Work Items/TaskListItem",
  component: TaskListItem,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Task row with optional completion checkbox, priority, status, due hint, and overflow actions.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TaskListItem>;

export default meta;

function TaskListItemDefaultDemo() {
  const inProgress = { label: "In progress", variant: "outline" as const };
  const [menuOpen, setMenuOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  return (
    <TaskListItem
      title="Draft compliance checklist"
      subtitle="Workspace · Legal"
      completed={completed}
      onToggleComplete={() => setCompleted((c) => !c)}
      priority="medium"
      status={inProgress}
      dueHint="Due Fri"
      menuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
      onEdit={() => undefined}
      onDuplicate={() => undefined}
      onArchive={() => undefined}
    />
  );
}

export const Default = {
  render: () => <TaskListItemDefaultDemo />,
} as unknown as StoryObj<typeof meta>;

function TaskListItemLongTitleCompletedDemo() {
  const blocked = { label: "Blocked", variant: "destructive" as const };
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <TaskListItem
      title="P1 — Consolidate vendor attestations, cross-link evidence packs, and publish the customer-facing summary without breaking the existing audit trail numbering scheme used in Q3"
      subtitle="Very long workspace path / program name that should truncate cleanly in the row"
      completed
      priority="urgent"
      status={blocked}
      dueHint="Overdue"
      intent="danger"
      menuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
      onEdit={() => undefined}
      onDuplicate={() => undefined}
      onArchive={() => undefined}
    />
  );
}

/** Long copy, completed styling, and destructive status — stresses truncation and visual hierarchy. */
export const LongTitleCompletedUrgent = {
  render: () => <TaskListItemLongTitleCompletedDemo />,
} as unknown as StoryObj<typeof meta>;
