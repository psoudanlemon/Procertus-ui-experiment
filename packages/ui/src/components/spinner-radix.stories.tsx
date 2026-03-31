import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

/**
 * A loading spinner indicator with configurable sizes.
 */
const meta: Meta<typeof Spinner> = {
  title: "components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
  },
  args: {
    size: "default",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default spinner.
 */
export const Default: Story = {};

/**
 * Small size variant.
 */
export const Small: Story = {
  args: {
    size: "sm",
  },
};

/**
 * Large size variant.
 */
export const Large: Story = {
  args: {
    size: "lg",
  },
};

/**
 * All sizes side by side for comparison.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="default" />
      <Spinner size="lg" />
    </div>
  ),
};

/**
 * Spinner used inline with a button.
 */
export const WithButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner size="sm" />
      Loading...
    </Button>
  ),
};
