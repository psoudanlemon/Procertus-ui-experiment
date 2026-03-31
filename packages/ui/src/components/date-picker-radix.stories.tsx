"use client";

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";

/**
 * A date picker component built on top of Calendar and Popover.
 */
const meta: Meta<typeof DatePicker> = {
  title: "components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A single date picker.
 */
export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();
    return <DatePicker value={date} onChange={setDate} />;
  },
};

/**
 * Date picker with a pre-selected date.
 */
export const WithValue: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return <DatePicker value={date} onChange={setDate} />;
  },
};

/**
 * Disabled date picker.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Pick a date",
  },
};

/**
 * A date range picker allowing selection of a start and end date.
 */
export const Range: Story = {
  render: () => {
    const [range, setRange] = React.useState<
      { from: Date | undefined; to?: Date | undefined } | undefined
    >();
    return <DateRangePicker value={range} onChange={setRange} />;
  },
};
