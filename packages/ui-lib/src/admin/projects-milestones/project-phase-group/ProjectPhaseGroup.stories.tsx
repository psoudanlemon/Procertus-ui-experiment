import type { Meta, StoryObj } from "@storybook/react-vite";

import { MilestoneTimeline } from "../milestone-timeline/MilestoneTimeline";
import type { MilestoneTimelineSegment } from "../types";
import { ProjectPhaseGroup } from "./ProjectPhaseGroup";

const meta = {
  title: "Admin/Projects & Milestones/ProjectPhaseGroup",
  component: ProjectPhaseGroup,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Groups nested content (e.g. a milestone rail) under a phase label.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectPhaseGroup>;

export default meta;

const discoverySegments: MilestoneTimelineSegment[] = [
  { id: "d1", title: "Stakeholder interviews", caption: "Done", status: "complete" },
  { id: "d2", title: "Journey maps", caption: "In review", status: "current" },
  { id: "d3", title: "Readout", caption: "Scheduled", status: "upcoming" },
];

export const WithTimeline: StoryObj<typeof meta> = {
  render: () => (
    <ProjectPhaseGroup
      label="Phase 1"
      title="Discovery"
      description="Research and alignment before build commitments."
    >
      <MilestoneTimeline segments={discoverySegments} />
    </ProjectPhaseGroup>
  ),
};

export const HeaderOnly: StoryObj<typeof meta> = {
  args: {
    label: "Phase 3",
    title: "Rollout",
    description: "Training, comms, and hypercare window after launch.",
  },
};
