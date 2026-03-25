import type { Meta, StoryObj } from "@storybook/react-vite";

import { WorkflowStateBadge } from "./WorkflowStateBadge";

const meta = {
  title: "Admin/Workflows & Approvals/WorkflowStateBadge",
  component: WorkflowStateBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Preset workflow states mapped to Badge variants.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WorkflowStateBadge>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    preset: "in_review",
  },
};

export const EdgeCustomLabel: StoryObj<typeof meta> = {
  name: "Edge / custom label",
  args: {
    preset: "blocked",
    label: "Blocked — waiting on vendor",
  },
};

export const EdgeRejected: StoryObj<typeof meta> = {
  name: "Edge / rejected",
  args: {
    preset: "rejected",
  },
};
