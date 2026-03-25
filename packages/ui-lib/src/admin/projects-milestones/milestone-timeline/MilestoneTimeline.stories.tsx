import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@procertus-ui/ui";

import type { MilestoneTimelineSegment } from "../types";
import { MilestoneTimeline } from "./MilestoneTimeline";

const meta = {
  title: "Admin/Projects & Milestones/MilestoneTimeline",
  component: MilestoneTimeline,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Horizontal milestone rail driven by a segments prop (not a Gantt chart).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MilestoneTimeline>;

export default meta;

const mockSegments: MilestoneTimelineSegment[] = [
  {
    id: "kickoff",
    title: "Kickoff",
    caption: "Jan 6",
    status: "complete",
  },
  {
    id: "design",
    title: "Design sign-off",
    caption: "Jan 27",
    status: "complete",
    deadlineLabel: "Met",
    deadlineTone: "muted",
  },
  {
    id: "build",
    title: "Build",
    caption: "In progress",
    status: "current",
    deadlineLabel: "Due Mar 15",
    deadlineTone: "warning",
  },
  {
    id: "uat",
    title: "UAT",
    caption: "Mar 24–Apr 4",
    status: "upcoming",
  },
  {
    id: "launch",
    title: "Launch",
    caption: "Apr 18",
    status: "upcoming",
    deadlineLabel: "Hard date",
    deadlineTone: "critical",
  },
];

export const Default: StoryObj<typeof meta> = {
  args: {
    title: "Delivery milestones",
    description: "Ordered segments; scroll horizontally on narrow viewports.",
    segments: mockSegments,
    actions: (
      <Button type="button" size="sm" variant="outline">
        Add milestone
      </Button>
    ),
  },
};

const atRiskSegments: MilestoneTimelineSegment[] = [
  { id: "a", title: "Scope", caption: "Done", status: "complete" },
  {
    id: "b",
    title: "Vendor SOW",
    caption: "Waiting legal",
    status: "at-risk",
    deadlineLabel: "Overdue",
    deadlineTone: "critical",
  },
  { id: "c", title: "Implementation", caption: "TBD", status: "upcoming" },
];

export const AtRiskMiddle: StoryObj<typeof meta> = {
  args: {
    title: "Procurement track",
    segments: atRiskSegments,
  },
};
