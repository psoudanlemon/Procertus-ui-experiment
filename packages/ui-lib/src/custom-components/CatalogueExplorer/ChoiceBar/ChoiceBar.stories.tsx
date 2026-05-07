import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ChoiceBar, type ChoiceBarItem } from "./ChoiceBar";

const meta = {
  title: "custom-components/CatalogueExplorer/ChoiceBar",
  component: ChoiceBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Horizontal single-select pill bar of `SelectChoiceCard`s (minimal appearance) inside a `FadingScrollList`. Per-item `variant` lets callers tier the options — `elevated` for primary, `faded` for siblings, `ghost` for a trailing overflow option.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChoiceBar>;

export default meta;

const ITEMS: readonly ChoiceBarItem[] = [
  { value: "benor", label: "BENOR-certificatie", variant: "elevated" },
  { value: "ce", label: "CE-markering", variant: "elevated" },
  { value: "ssd", label: "SSD", variant: "elevated" },
  { value: "innovatie-attest", label: "Innovatie-attest", variant: "faded" },
  { value: "procertus-attest", label: "PROCERTUS-attest", variant: "faded" },
  { value: "partijkeuring", label: "Partijkeuring", variant: "faded" },
  { value: "overige", label: "Overige", variant: "ghost" },
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
