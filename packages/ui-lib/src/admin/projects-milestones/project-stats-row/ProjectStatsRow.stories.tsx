import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ProjectStatItem } from "./ProjectStatsRow";
import { ProjectStatsRow } from "./ProjectStatsRow";

const meta = {
  title: "Admin/Projects & Milestones/ProjectStatsRow",
  component: ProjectStatsRow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Responsive grid of KPI tiles for a project overview.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectStatsRow>;

export default meta;

const mockStats: ProjectStatItem[] = [
  { id: "milestones", label: "Milestones done", value: "7 / 12", hint: "Next: UAT entry" },
  { id: "tasks", label: "Open tasks", value: "23", hint: "8 unassigned" },
  { id: "blockers", label: "Blockers", value: "2", hint: "Vendor API limits" },
  { id: "days", label: "Days to deadline", value: "41", hint: "Apr 18 launch" },
];

export const Default: StoryObj<typeof meta> = {
  args: {
    title: "Project health",
    description: "Mock snapshot for Storybook; wire real metrics in the app shell.",
    stats: mockStats,
  },
};

export const Dense: StoryObj<typeof meta> = {
  args: {
    stats: [
      { id: "1", label: "Velocity", value: "34 pts" },
      { id: "2", label: "Scope change", value: "+12%" },
      { id: "3", label: "Budget burn", value: "62%" },
      { id: "4", label: "RAG", value: "Amber" },
      { id: "5", label: "Dependencies", value: "5 ext." },
      { id: "6", label: "Risks", value: "3 open" },
    ],
  },
};
