import type { Meta, StoryObj } from "@storybook/react-vite";

import { ResourceLoadStrip, type ResourceLoadRow } from "./ResourceLoadStrip";

const MOCK_ROWS: ResourceLoadRow[] = [
  {
    resourceLabel: "API pool",
    segments: [
      { start: 0, end: 30, level: "low", label: "Idle" },
      { start: 30, end: 65, level: "medium", label: "Steady" },
      { start: 65, end: 92, level: "high", label: "Peak" },
      { start: 92, end: 100, level: "critical", label: "Saturation" },
    ],
  },
  {
    resourceLabel: "Workers",
    segments: [
      { start: 0, end: 45, level: "low" },
      { start: 45, end: 80, level: "medium" },
      { start: 80, end: 100, level: "high" },
    ],
  },
  {
    resourceLabel: "Storage I/O",
    segments: [
      { start: 0, end: 20, level: "medium" },
      { start: 20, end: 55, level: "low" },
      { start: 55, end: 100, level: "high", label: "Batch" },
    ],
  },
];

const meta = {
  title: "Admin/Timelines & Planning/ResourceLoadStrip",
  component: ResourceLoadStrip,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Each row is one resource; `segments` use 0–100% with a `level` for color.",
      },
      canvas: { layout: "padded" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ResourceLoadStrip>;

export default meta;

export const TeamLoad: StoryObj<typeof meta> = {
  args: {
    title: "Capacity view",
    description: "Mock week slice — percentages are arbitrary units, not dates.",
    rows: MOCK_ROWS,
  },
};

export const SingleRow: StoryObj<typeof meta> = {
  args: {
    rows: [
      {
        resourceLabel: "Compute",
        segments: [
          { start: 0, end: 25, level: "low" },
          { start: 25, end: 70, level: "medium" },
          { start: 70, end: 100, level: "critical" },
        ],
      },
    ],
  },
};
