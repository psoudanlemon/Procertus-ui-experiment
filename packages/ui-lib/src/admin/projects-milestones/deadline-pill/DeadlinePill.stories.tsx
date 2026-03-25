import type { Meta, StoryObj } from "@storybook/react-vite";

import { DeadlinePill } from "./DeadlinePill";

const meta = {
  title: "Admin/Projects & Milestones/DeadlinePill",
  component: DeadlinePill,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Small calendar-styled chip for milestone or project deadlines.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DeadlinePill>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    label: "Due Mar 28, 2025",
    tone: "default",
  },
};

export const Muted: StoryObj<typeof meta> = {
  args: {
    label: "No fixed date",
    tone: "muted",
  },
};

export const Warning: StoryObj<typeof meta> = {
  args: {
    label: "5 days left",
    tone: "warning",
  },
};

export const Critical: StoryObj<typeof meta> = {
  args: {
    label: "Overdue",
    tone: "critical",
  },
};
