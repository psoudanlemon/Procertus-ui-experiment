import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import type { AdminTableDensity } from "./DensityToggle";
import { DensityToggle } from "./DensityToggle";

const meta = {
  title: "Admin/Shell & Density/DensityToggle",
  component: DensityToggle,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Single-choice density control for tables and dense lists (controlled).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DensityToggle>;

export default meta;

function DensityToggleDemo() {
  const [density, setDensity] = useState<AdminTableDensity>("comfortable");
  return (
    <DensityToggle
      title="Table density"
      description="Applies to this screen’s data grid only (mock selection)."
      value={density}
      onValueChange={setDensity}
    />
  );
}

export const Default = {
  render: () => <DensityToggleDemo />,
} as unknown as StoryObj<typeof meta>;
