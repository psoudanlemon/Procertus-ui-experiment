import type { IconSvgElement } from "@hugeicons/core-free-icons";
import { Home01Icon, Search01Icon, Setting06Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconButton } from "./IconButton";

const icon =
  (source: IconSvgElement) =>
  ({ className }: { className?: string }) => (
    <HugeiconsIcon icon={source} className={className} />
  );

const meta = {
  title: "sewdn/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    "aria-label": "Settings",
    icon: icon(Setting06Icon as IconSvgElement),
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton aria-label="Home" icon={icon(Home01Icon as IconSvgElement)} />
      <IconButton aria-label="Search" icon={icon(Search01Icon as IconSvgElement)} variant="outline" />
      <IconButton aria-label="Settings" icon={icon(Setting06Icon as IconSvgElement)} variant="secondary" />
    </div>
  ),
};

export const Inverted: Story = {
  render: () => (
    <div className="rounded-xl bg-primary p-4">
      <IconButton
        aria-label="Search"
        icon={icon(Search01Icon as IconSvgElement)}
        invertColors
      />
    </div>
  ),
};
