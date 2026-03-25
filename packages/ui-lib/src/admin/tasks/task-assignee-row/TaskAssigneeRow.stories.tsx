import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { TaskAssigneeRow } from "./TaskAssigneeRow";

const meta = {
  title: "Admin/Tasks & Work Items/TaskAssigneeRow",
  component: TaskAssigneeRow,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Assignee list row with avatar, optional badges, and row actions (or assign CTA when unassigned).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TaskAssigneeRow>;

export default meta;

function TaskAssigneeRowDefaultDemo() {
  const active = { label: "Active", variant: "default" as const };
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <TaskAssigneeRow
      assigneeName="Morgan Lee"
      subtitle="morgan@procertus.example"
      teamBadge="Engineering"
      status={active}
      avatarFallback="ML"
      menuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
      onViewProfile={() => undefined}
      onReassign={() => undefined}
      onRemove={() => undefined}
    />
  );
}

export const Default = {
  render: () => <TaskAssigneeRowDefaultDemo />,
} as unknown as StoryObj<typeof meta>;

function TaskAssigneeRowUnassignedDemo() {
  return (
    <TaskAssigneeRow
      unassigned
      menuOpen={false}
      onMenuOpenChange={() => undefined}
      onAssign={() => undefined}
    />
  );
}

/** No person yet — dashed row and primary assign action. */
export const Unassigned = {
  render: () => <TaskAssigneeRowUnassignedDemo />,
} as unknown as StoryObj<typeof meta>;
