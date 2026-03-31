import type { Meta, StoryObj } from "@storybook/react-vite";

import { ForgotPasswordForm } from "./ForgotPasswordForm";

const meta = {
  title: "Management Tool/Authentication/Forms/Forgot Password",
  component: ForgotPasswordForm,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [(Story) => <div className="w-sm"><Story /></div>],
  args: {
    onBackToLogin: () => {},
  },
} satisfies Meta<typeof ForgotPasswordForm> as Meta<typeof ForgotPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FilledIn: Story = {
  args: {
    email: "jane.doe@company.com",
  },
};

/** Alert + field-level error combined. */
export const WithError: Story = {
  args: {
    email: "jane.doe@",
    error: "We couldn't send a verification code.",
    fieldErrors: {
      email: "Please enter a valid email address",
    },
  },
};

export const Success: Story = {
  args: {
    email: "jane.doe@company.com",
    successMessage: "Check your email for a verification code. It may take a minute to arrive.",
  },
};

export const Submitting: Story = {
  args: {
    email: "jane.doe@company.com",
    isSubmitting: true,
  },
};
