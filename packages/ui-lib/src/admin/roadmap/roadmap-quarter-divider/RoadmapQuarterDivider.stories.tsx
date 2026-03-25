import type { Meta, StoryObj } from "@storybook/react-vite";

import { RoadmapQuarterDivider } from "./RoadmapQuarterDivider";

const meta = {
  title: "Admin/Roadmap & Releases/RoadmapQuarterDivider",
  component: RoadmapQuarterDivider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Horizontal quarter marker between roadmap sections.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RoadmapQuarterDivider>;

export default meta;

export const Default = {
  render: () => <RoadmapQuarterDivider quarterLabel="Q2 2026" hint="FY26 planning horizon" />,
} as unknown as StoryObj<typeof meta>;

export const LabelOnly = {
  render: () => <RoadmapQuarterDivider quarterLabel="Q1 2026" />,
} as unknown as StoryObj<typeof meta>;
