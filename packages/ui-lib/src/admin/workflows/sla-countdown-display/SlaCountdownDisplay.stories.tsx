import type { Meta, StoryObj } from "@storybook/react-vite";

import { SlaCountdownDisplay } from "./SlaCountdownDisplay";

const meta = {
  title: "Admin/Workflows & Approvals/SlaCountdownDisplay",
  component: SlaCountdownDisplay,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Minimal SLA readout; remaining text is supplied by the parent (no built-in timer).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SlaCountdownDisplay>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    label: "Time until breach",
    remainingLabel: "2h 14m",
    caption: "Due today at 17:00 local",
    tone: "neutral",
  },
};

export const EdgeCritical: StoryObj<typeof meta> = {
  name: "Edge / critical",
  args: {
    label: "SLA breached",
    remainingLabel: "Overdue 18m",
    tone: "critical",
    caption: "Escalate to on-call owner",
  },
};

export const EdgeMinimalCopy: StoryObj<typeof meta> = {
  name: "Edge / minimal copy",
  args: {
    label: "SLA",
    remainingLabel: "—",
    tone: "warning",
  },
};
