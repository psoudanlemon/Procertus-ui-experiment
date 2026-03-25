import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { SavedViewChips } from "./SavedViewChips";

const meta = {
  title: "Admin/Shell & Density/SavedViewChips",
  component: SavedViewChips,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Selectable saved views as compact buttons; selection is controlled from the parent.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SavedViewChips>;

export default meta;

const MOCK_VIEWS = [
  { id: "all", label: "All open" },
  { id: "mine", label: "Assigned to me" },
  { id: "overdue", label: "Overdue" },
  { id: "q1", label: "Q1 renewals" },
];

function SavedViewChipsDemo() {
  const [selected, setSelected] = useState<string | null>("mine");
  return (
    <SavedViewChips
      label="Saved views"
      views={MOCK_VIEWS}
      selectedId={selected}
      onSelect={setSelected}
      onSaveView={() => undefined}
    />
  );
}

export const Default = {
  render: () => <SavedViewChipsDemo />,
} as unknown as StoryObj<typeof meta>;
