import type { Meta, StoryObj } from "@storybook/react-vite";

import { SetPasswordForm } from "./SetPasswordForm";

const meta = {
  title: "Custom components/Authentication/Forms/Set password",
  component: SetPasswordForm,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [(Story) => <div data-density="operational" className="w-sm"><Story /></div>],
  args: {
    onBack: () => {},
  },
} satisfies Meta<typeof SetPasswordForm> as Meta<typeof SetPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FilledIn: Story = {
  args: {
    newPassword: "SecurePass123!",
    confirmPassword: "SecurePass123!",
  },
};

/** Alert + field-level errors combined. */
export const WithError: Story = {
  args: {
    newPassword: "abc123",
    confirmPassword: "abc124",
    error: "Passwords are not matching. Please try again.",
    fieldErrors: {
      newPassword: "Password must be at least 8 characters",
      confirmPassword: "Passwords do not match",
    },
  },
};

export const Submitting: Story = {
  args: {
    newPassword: "SecurePass123!",
    confirmPassword: "SecurePass123!",
    isSubmitting: true,
  },
};
