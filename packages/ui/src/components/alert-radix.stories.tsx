import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertCircle } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/**
 * Displays a callout for user attention.
 */
const meta = {
  title: "components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["default", "destructive"],
      control: { type: "radio" },
    },
  },
  args: {
    variant: "default",
  },
  render: (args) => (
    <Alert {...args}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;
/**
 * The default form of the alert.
 */
export const Default: Story = {};

/**
 * Use the `destructive` alert to indicate a destructive action.
 */
export const Destructive: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  ),
  args: {
    variant: "destructive",
  },
};

/**
 * An alert with an action button positioned to the right.
 */
export const Action: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <AlertTitle>Dark mode is now available</AlertTitle>
      <AlertDescription>Enable it under your profile settings to get started.</AlertDescription>
      <AlertAction>
        <Button size="xs" variant="default">
          Enable
        </Button>
      </AlertAction>
    </Alert>
  ),
};
