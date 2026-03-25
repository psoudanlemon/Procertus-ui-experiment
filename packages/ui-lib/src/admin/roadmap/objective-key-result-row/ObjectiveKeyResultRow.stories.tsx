import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";

import { ObjectiveKeyResultRow } from "./ObjectiveKeyResultRow";

const meta = {
  title: "Admin/Roadmap & Releases/ObjectiveKeyResultRow",
  component: ObjectiveKeyResultRow,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Key result row with progress bar and status for roadmap / goals admin views.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ObjectiveKeyResultRow>;

export default meta;

function RowWithMenu(
  props: Omit<ComponentProps<typeof ObjectiveKeyResultRow>, "menuOpen" | "onMenuOpenChange">,
) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <ObjectiveKeyResultRow
      {...props}
      menuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
      onEdit={() => undefined}
      onAddCheckIn={() => undefined}
      onArchive={() => undefined}
    />
  );
}

export const Default = {
  render: () => (
    <RowWithMenu
      keyResultId="KR 1.2"
      title="Ship SSO to 100% of enterprise tenants"
      progressPercent={62}
      status={{ label: "On track", variant: "secondary" }}
    />
  ),
} as unknown as StoryObj<typeof meta>;

export const AtRisk = {
  render: () => (
    <RowWithMenu
      intent="danger"
      keyResultId="KR 2.1"
      title="Reduce P99 API latency below 120ms"
      progressPercent={28}
      status={{ label: "Behind", variant: "destructive" }}
    />
  ),
} as unknown as StoryObj<typeof meta>;

export const Complete = {
  render: () => (
    <RowWithMenu
      intent="muted"
      keyResultId="KR 3.0"
      title="Launch audit exports (GA)"
      progressPercent={100}
      status={{ label: "Done", variant: "outline" }}
    />
  ),
} as unknown as StoryObj<typeof meta>;
