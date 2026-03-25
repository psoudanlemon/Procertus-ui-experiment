import type { Meta, StoryObj } from "@storybook/react-vite";

import { PlanningWindowBar, type PlanningWindowSegment } from "./PlanningWindowBar";

const MOCK_BACKGROUND: PlanningWindowSegment[] = [
  { start: 0, end: 12, intent: "primary", label: "Change freeze" },
  { start: 78, end: 100, intent: "primary", label: "Holiday blackout" },
];

const MOCK_WINDOWS: PlanningWindowSegment[] = [
  { start: 18, end: 38, intent: "default", label: "Window A — API" },
  { start: 42, end: 58, intent: "success", label: "Window B — UI" },
  { start: 62, end: 74, intent: "default", label: "Window C — data" },
];

const meta = {
  title: "Admin/Timelines & Planning/PlanningWindowBar",
  component: PlanningWindowBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "`backgroundSegments` paint under dashed `windows`. All positions are 0–100%.",
      },
      canvas: { layout: "padded" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PlanningWindowBar>;

export default meta;

export const WithBlackouts: StoryObj<typeof meta> = {
  args: {
    title: "Allowed deployment windows",
    description: "Red-tinted bands are blackout; dashed regions are approved slots.",
    backgroundSegments: MOCK_BACKGROUND,
    windows: MOCK_WINDOWS,
  },
};

export const WindowsOnly: StoryObj<typeof meta> = {
  args: {
    windows: [
      { start: 5, end: 30, intent: "default", label: "Q1 plan" },
      { start: 35, end: 95, intent: "success", label: "Execution" },
    ],
  },
};
