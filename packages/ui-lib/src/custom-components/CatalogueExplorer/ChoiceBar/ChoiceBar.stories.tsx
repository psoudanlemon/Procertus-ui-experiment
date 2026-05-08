import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ChoiceBar, type ChoiceBarItem } from "./ChoiceBar";

const meta = {
  title: "custom-components/Catalogue/ChoiceBar",
  component: ChoiceBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Horizontal single-select pill bar of `ChoiceCard`s (minimal appearance, fully rounded) inside a `FadingScrollList`, with prev/next icon buttons that step linearly through enabled items. Per-item `variant` is supported for tiering, but the bar reads cleanest when all chips share one variant.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChoiceBar>;

export default meta;

const ITEMS: readonly ChoiceBarItem[] = [
  { value: "all", label: "Alle certificaten" },
  { value: "benor", label: "BENOR-certificatie" },
  { value: "ce", label: "CE-markering" },
  { value: "ssd", label: "SSD" },
  { value: "innovatie-attest", label: "Innovatie-attest" },
  { value: "procertus-attest", label: "PROCERTUS-attest" },
  { value: "partijkeuring", label: "Partijkeuring" },
];

function DefaultStory() {
  const [value, setValue] = useState("benor");
  return (
    <ChoiceBar
      items={ITEMS}
      value={value}
      onValueChange={setValue}
      aria-label="Kies een certificaat"
    />
  );
}

export const Default = {
  render: () => <DefaultStory />,
} as unknown as StoryObj<typeof meta>;
