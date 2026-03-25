import type { Meta, StoryObj } from "@storybook/react-vite";

import { TaskDueDateDisplay } from "./TaskDueDateDisplay";

const meta = {
  title: "Admin/Tasks & Work Items/TaskDueDateDisplay",
  component: TaskDueDateDisplay,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Compact due date line with optional relative copy and urgency tone.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TaskDueDateDisplay>;

export default meta;

export const Default = {
  args: {
    primaryLabel: "Mar 28, 2026",
    secondaryLabel: "Due in 3 days",
    tone: "default",
  },
} satisfies StoryObj<typeof meta>;

/** Past due — destructive tone. */
export const Overdue = {
  args: {
    primaryLabel: "Mar 18, 2026",
    secondaryLabel: "5 days overdue",
    tone: "overdue",
  },
} satisfies StoryObj<typeof meta>;

/** No schedule set — neutral placeholder. */
export const NoDueDate = {
  args: {
    primaryLabel: "",
    secondaryLabel: "",
    tone: "none",
  },
} satisfies StoryObj<typeof meta>;
