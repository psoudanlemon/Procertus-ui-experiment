import type { Meta, StoryObj } from "@storybook/react-vite";

import { RecurrenceSummary } from "./RecurrenceSummary";

const meta = {
  title: "Admin/Calendar & Scheduling/RecurrenceSummary",
  component: RecurrenceSummary,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Displays recurrence copy; formatting logic stays in the parent.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RecurrenceSummary>;

export default meta;

export const Default = {
  args: {
    title: "Repeats",
    summary: "Every 2 weeks on Tuesday and Thursday",
    detail: "Ends after 12 occurrences",
  },
} satisfies StoryObj<typeof meta>;

export const LongSummaryText = {
  args: {
    title: "Repeats",
    summary:
      "Custom: every 3 weeks on Monday, Wednesday, and Friday, except on company holidays and the week of the annual summit, with exceptions for daylight saving changes",
    detail:
      "Until further notice — the series may be paused automatically when the organizer is out of office for more than five consecutive business days.",
    emphasized: true,
  },
} satisfies StoryObj<typeof meta>;
