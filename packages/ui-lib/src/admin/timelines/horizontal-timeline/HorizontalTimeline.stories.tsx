import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  HorizontalTimeline,
  type HorizontalTimelineSegment,
  type HorizontalTimelineTick,
} from "./HorizontalTimeline";

const MOCK_SEGMENTS: HorizontalTimelineSegment[] = [
  { start: 0, end: 22, intent: "muted", label: "Discovery" },
  { start: 22, end: 48, intent: "primary", label: "Build" },
  { start: 48, end: 72, intent: "success", label: "Stabilize" },
  { start: 72, end: 88, intent: "warning", label: "Cutover buffer" },
  { start: 88, end: 100, intent: "muted", label: "Hypercare" },
];

const MOCK_TICKS: HorizontalTimelineTick[] = [
  { at: 0, label: "W1" },
  { at: 25, label: "W5" },
  { at: 50, label: "W9" },
  { at: 75, label: "W13" },
  { at: 100, label: "W16" },
];

const meta = {
  title: "Admin/Timelines & Planning/HorizontalTimeline",
  component: HorizontalTimeline,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Segment geometry uses 0–100% along the track. Pass `segments` and optional `ticks` — no date math in the component.",
      },
      canvas: { layout: "padded" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HorizontalTimeline>;

export default meta;

export const WithCard: StoryObj<typeof meta> = {
  args: {
    title: "Program phases",
    description: "Relative widths only; labels appear as native tooltips on segments.",
    segments: MOCK_SEGMENTS,
    ticks: MOCK_TICKS,
  },
};

export const BareTrack: StoryObj<typeof meta> = {
  args: {
    segments: [
      { start: 10, end: 35, intent: "primary" },
      { start: 40, end: 90, intent: "success", label: "Focus" },
    ],
    ticks: [
      { at: 10, label: "A" },
      { at: 90, label: "B" },
    ],
  },
};
