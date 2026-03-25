import type { Meta, StoryObj } from "@storybook/react-vite";

import { MilestoneNode } from "./MilestoneNode";

const meta = {
  title: "Admin/Projects & Milestones/MilestoneNode",
  component: MilestoneNode,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Single milestone column for use on a horizontal rail or in custom layouts.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MilestoneNode>;

export default meta;

export const Complete: StoryObj<typeof meta> = {
  args: {
    title: "Security review",
    caption: "Feb 2",
    status: "complete",
  },
};

export const Current: StoryObj<typeof meta> = {
  args: {
    title: "Integration testing",
    caption: "Week of Mar 10",
    status: "current",
    deadlineLabel: "Due Mar 14",
    deadlineTone: "warning",
  },
};

export const Upcoming: StoryObj<typeof meta> = {
  args: {
    title: "GA announcement",
    caption: "Apr 18",
    status: "upcoming",
  },
};

export const AtRisk: StoryObj<typeof meta> = {
  args: {
    title: "Budget approval",
    caption: "Blocked on finance",
    status: "at-risk",
    deadlineLabel: "2d overdue",
    deadlineTone: "critical",
  },
};
