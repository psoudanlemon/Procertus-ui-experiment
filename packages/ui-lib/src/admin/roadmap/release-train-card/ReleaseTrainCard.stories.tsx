import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";

import { ReleaseTrainCard } from "./ReleaseTrainCard";

const meta = {
  title: "Admin/Roadmap & Releases/ReleaseTrainCard",
  component: ReleaseTrainCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Single release train row for roadmap and release planning views.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ReleaseTrainCard>;

export default meta;

function CardWithMenu(
  props: Omit<ComponentProps<typeof ReleaseTrainCard>, "menuOpen" | "onMenuOpenChange">,
) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <ReleaseTrainCard
      {...props}
      menuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
      onViewDetails={() => undefined}
      onMoveWindow={() => undefined}
      onDuplicate={() => undefined}
      onRemove={() => undefined}
    />
  );
}

export const Default = {
  render: () => (
    <CardWithMenu
      trainCode="R25.1"
      title="Spring customer rollout"
      windowLabel="Apr 7 – Apr 18, 2026"
      phaseBadge="Freeze soon"
      status={{ label: "At risk", variant: "outline" }}
    />
  ),
} as unknown as StoryObj<typeof meta>;

export const Emphasis = {
  render: () => (
    <CardWithMenu
      intent="emphasis"
      selected
      trainCode="R24.12"
      title="Year-end compliance"
      windowLabel="Dec 2 – Dec 13, 2025"
      status={{ label: "Committed", variant: "default" }}
    />
  ),
} as unknown as StoryObj<typeof meta>;

export const Muted = {
  render: () => (
    <CardWithMenu
      intent="muted"
      trainCode="R26.0"
      title="Exploratory window (tentative)"
      windowLabel="TBD"
      phaseBadge="Draft"
    />
  ),
} as unknown as StoryObj<typeof meta>;
