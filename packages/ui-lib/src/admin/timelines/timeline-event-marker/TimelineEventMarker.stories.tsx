import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { TimelineEventMarker } from "./TimelineEventMarker";

const meta = {
  title: "Admin/Timelines & Planning/TimelineEventMarker",
  component: TimelineEventMarker,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Overlay marker for a 0–100% axis. Stack multiple markers in one relative container so they share the same track.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TimelineEventMarker>;

export default meta;

function MockTrack({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-2xl rounded-lg border border-border bg-card p-6">
      <p className="mb-4 text-sm text-muted-foreground">
        Muted bar is mock chrome only; markers use prop geometry.
      </p>
      <div className="relative h-12 w-full">
        {children}
        <div className="absolute right-0 bottom-0 left-0 h-3 rounded-full bg-muted" />
      </div>
    </div>
  );
}

export const Dot = {
  render: () => (
    <MockTrack>
      <TimelineEventMarker
        className="absolute inset-0"
        position={33}
        variant="dot"
        label="Sprint review"
      />
    </MockTrack>
  ),
} as unknown as StoryObj<typeof meta>;

export const Diamond = {
  render: () => (
    <MockTrack>
      <TimelineEventMarker
        className="absolute inset-0"
        position={62}
        variant="diamond"
        label="Dependency"
        emphasized
      />
    </MockTrack>
  ),
} as unknown as StoryObj<typeof meta>;

export const Flag = {
  render: () => (
    <MockTrack>
      <TimelineEventMarker
        className="absolute inset-0"
        position={88}
        variant="flag"
        label="Go-live"
      />
    </MockTrack>
  ),
} as unknown as StoryObj<typeof meta>;

export const MultipleOnSameTrack = {
  render: () => (
    <MockTrack>
      <TimelineEventMarker className="absolute inset-0" position={18} variant="dot" label="Start" />
      <TimelineEventMarker
        className="absolute inset-0"
        position={55}
        variant="diamond"
        label="Risk"
      />
      <TimelineEventMarker className="absolute inset-0" position={92} variant="flag" label="End" />
    </MockTrack>
  ),
} as unknown as StoryObj<typeof meta>;
