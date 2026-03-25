import type { Meta, StoryObj } from "@storybook/react-vite";

import { TimelineLegend, type TimelineLegendItem } from "./TimelineLegend";

const MOCK_ITEMS: TimelineLegendItem[] = [
  { id: "p", label: "In progress", swatchClassName: "bg-primary" },
  { id: "d", label: "Done", swatchClassName: "bg-chart-2" },
  { id: "b", label: "Blocked", swatchClassName: "bg-destructive" },
  { id: "w", label: "Waiting", swatchClassName: "bg-muted-foreground/40" },
];

const meta = {
  title: "Admin/Timelines & Planning/TimelineLegend",
  component: TimelineLegend,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Swatch list driven by `items` — pass Tailwind classes for chip colors.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TimelineLegend>;

export default meta;

export const Horizontal: StoryObj<typeof meta> = {
  args: {
    legendTitle: "Status",
    orientation: "horizontal",
    items: MOCK_ITEMS,
  },
};

export const Vertical: StoryObj<typeof meta> = {
  args: {
    legendTitle: "Lanes",
    orientation: "vertical",
    items: [
      { label: "Engineering", swatchClassName: "bg-chart-1" },
      { label: "Design", swatchClassName: "bg-chart-3" },
      { label: "Ops", swatchClassName: "bg-chart-4" },
    ],
  },
};
