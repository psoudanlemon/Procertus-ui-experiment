import type { Meta, StoryObj } from "@storybook/react-vite";

import { ReleaseTrainCard } from "../release-train-card/ReleaseTrainCard";
import { RoadmapSwimlane } from "./RoadmapSwimlane";
import { useState } from "react";

const meta = {
  title: "Admin/Roadmap & Releases/RoadmapSwimlane",
  component: RoadmapSwimlane,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Lane section for grouping release trains or initiatives on an admin roadmap.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RoadmapSwimlane>;

export default meta;

export const Default = {
  render: () => (
    <div className="mx-auto max-w-lg">
      <RoadmapSwimlane
        laneLabel="Platform & infrastructure"
        laneMeta="Shared services, reliability, and developer experience."
        badge="2 trains"
        accent="primary"
      >
        <p className="text-sm text-muted-foreground">
          Place release cards or placeholders inside the lane body.
        </p>
      </RoadmapSwimlane>
    </div>
  ),
} as unknown as StoryObj<typeof meta>;

function TrainMenuStub() {
  const [open, setOpen] = useState(false);
  return (
    <ReleaseTrainCard
      trainCode="R24.4"
      title="Platform hardening"
      windowLabel="Mar 17 – Mar 28, 2026"
      phaseBadge="Build"
      status={{ label: "On track", variant: "secondary" }}
      menuOpen={open}
      onMenuOpenChange={setOpen}
      onViewDetails={() => undefined}
      onMoveWindow={() => undefined}
    />
  );
}

export const WithMockTrains = {
  render: () => (
    <div className="mx-auto max-w-lg space-y-6">
      <RoadmapSwimlane laneLabel="Customer apps" badge="1 train" accent="default">
        <TrainMenuStub />
      </RoadmapSwimlane>
    </div>
  ),
} as unknown as StoryObj<typeof meta>;
