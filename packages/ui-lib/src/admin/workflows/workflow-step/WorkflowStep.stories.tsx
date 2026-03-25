import type { Meta, StoryObj } from "@storybook/react-vite";

import { WorkflowStep } from "./WorkflowStep";

const meta = {
  title: "Admin/Workflows & Approvals/WorkflowStep",
  component: WorkflowStep,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Single step row for lists or side panels; visual state matches the stepper semantics.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WorkflowStep>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    stepNumber: 2,
    label: "Legal review",
    description: "Contract terms and liability caps.",
    state: "current",
  },
};

export const EdgeError: StoryObj<typeof meta> = {
  name: "Edge / error",
  args: {
    stepNumber: 3,
    label: "Security sign-off",
    description: "Scan failed — upload a revised package.",
    state: "error",
  },
};

export const EdgePending: StoryObj<typeof meta> = {
  name: "Edge / pending",
  args: {
    stepNumber: 4,
    label: "Final publish",
    state: "pending",
  },
};
