import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/components/ui/badge";

/**
 * Displays a badge or a component that looks like a badge.
 */
const meta = {
  title: "components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "success", "warning", "info", "destructive", "outline", "ghost", "link"],
    },
    children: {
      control: "text",
      description: "Badge content",
    },
  },
  args: {
    variant: "default",
    children: "Badge",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the badge.
 */
export const Default: Story = {};

/**
 * Use the `secondary` badge to call for less urgent information, blending
 * into the interface while still signaling minor updates or statuses.
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

/**
 * Use the `success` badge to confirm completed actions, active states,
 * or approved statuses.
 */
export const Success: Story = {
  args: {
    variant: "success",
    children: "Active",
  },
};

/**
 * Use the `warning` badge to signal items that need attention before
 * they become problems, such as approaching deadlines or expiring records.
 */
export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Expiring",
  },
};

/**
 * Use the `info` badge for neutral feedback like in-progress states,
 * reviews, or additional context without urgency.
 */
export const Info: Story = {
  args: {
    variant: "info",
    children: "Under Review",
  },
};

/**
 * Use the `destructive` badge to indicate errors, alerts, or the need for
 * immediate attention.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Revoked",
  },
};

/**
 * Use the `outline` badge for overlaying without obscuring interface details,
 * emphasizing clarity and subtlety.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

/**
 * Use the `ghost` badge for minimal visual weight, appearing on hover
 * to keep the interface clean.
 */
export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

/**
 * Use the `link` badge to represent a clickable, text-styled badge
 * that underlines on hover.
 */
export const Link: Story = {
  args: {
    variant: "link",
  },
};
