import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

/**
 * An input where the user selects a value from within a given range.
 */
const meta = {
  title: "components/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    defaultValue: [33],
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-72">
      <Slider {...args} />
    </div>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the slider.
 */
export const Default: Story = {};

/**
 * Use `value` and `onValueChange` to control the slider. This example shows
 * a range slider with two thumbs and a live readout of the current values.
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState([0.3, 0.7]);
    return (
      <div className="grid w-72 gap-3">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="slider-controlled">Temperature</Label>
          <span className="text-sm text-muted-foreground">{value.join(", ")}</span>
        </div>
        <Slider
          id="slider-controlled"
          value={value}
          onValueChange={setValue}
          min={0}
          max={1}
          step={0.1}
        />
      </div>
    );
  },
};

/**
 * Use the `inverted` prop to have the slider fill from right to left.
 */
export const Inverted: Story = {
  args: {
    inverted: true,
  },
};

/**
 * Use the `orientation` prop set to `"vertical"` for a vertical slider.
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-6">
      <Slider defaultValue={[50]} max={100} step={1} orientation="vertical" className="h-40" />
      <Slider defaultValue={[25]} max={100} step={1} orientation="vertical" className="h-40" />
    </div>
  ),
};

/**
 * Use the `disabled` prop to disable the slider.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
