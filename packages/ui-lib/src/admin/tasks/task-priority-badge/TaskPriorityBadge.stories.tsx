import type { Meta, StoryObj } from "@storybook/react-vite";

import { TaskPriorityBadge } from "./TaskPriorityBadge";

const meta = {
  title: "Admin/Tasks & Work Items/TaskPriorityBadge",
  component: TaskPriorityBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Small priority chip mapped to semantic badge variants.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TaskPriorityBadge>;

export default meta;

export const Default = {
  args: {
    priority: "medium",
  },
} satisfies StoryObj<typeof meta>;

/** Custom label text while keeping urgent styling. */
export const UrgentCustomLabel = {
  args: {
    priority: "urgent",
    label: "P0 — exec review",
  },
} satisfies StoryObj<typeof meta>;
