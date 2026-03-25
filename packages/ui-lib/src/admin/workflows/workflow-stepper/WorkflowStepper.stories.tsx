import type { Meta, StoryObj } from "@storybook/react-vite";

import { WorkflowStepper } from "./WorkflowStepper";

const meta = {
  title: "Admin/Workflows & Approvals/WorkflowStepper",
  component: WorkflowStepper,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Horizontal stepper; step appearance is driven only by `state` on each step.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WorkflowStepper>;

export default meta;

const defaultSteps = [
  { id: "1", label: "Intake", description: "Request captured", state: "completed" as const },
  { id: "2", label: "Review", description: "Policy check", state: "current" as const },
  { id: "3", label: "Approval", description: "Sign-off", state: "pending" as const },
  { id: "4", label: "Publish", state: "pending" as const },
];

export const Default: StoryObj<typeof meta> = {
  args: {
    steps: defaultSteps,
  },
};

export const EdgeErrorMidChain: StoryObj<typeof meta> = {
  name: "Edge / error on step",
  args: {
    steps: [
      { id: "1", label: "Intake", state: "completed" },
      { id: "2", label: "Review", state: "error", description: "Missing evidence" },
      { id: "3", label: "Approval", state: "pending" },
    ],
  },
};

export const EdgeSingleStep: StoryObj<typeof meta> = {
  name: "Edge / single step",
  args: {
    steps: [{ id: "only", label: "Only step", state: "current" }],
  },
};

export const EdgeAllComplete: StoryObj<typeof meta> = {
  name: "Edge / all completed",
  args: {
    steps: [
      { id: "1", label: "Intake", state: "completed" },
      { id: "2", label: "Review", state: "completed" },
      { id: "3", label: "Approval", state: "completed" },
    ],
  },
};
