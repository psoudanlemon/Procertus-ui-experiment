import type { Meta, StoryObj } from "@storybook/react-vite";

import { VerifyCodeForm } from "./VerifyCodeForm";

const meta = {
  title: "Management interface/Authentication/Forms/Verify code",
  component: VerifyCodeForm,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [(Story) => <div className="w-sm"><Story /></div>],
  args: {
    email: "jane.doe@company.com",
    onResendCode: () => {},
    onBackToLogin: () => {},
  },
} satisfies Meta<typeof VerifyCodeForm> as Meta<typeof VerifyCodeForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FilledIn: Story = {
  args: {
    code: "482917",
  },
};

/** General error: code is invalid or expired. */
export const WithError: Story = {
  args: {
    code: "999999",
    error: "Invalid verification code. Please try again.",
  },
};

export const Submitting: Story = {
  args: {
    code: "482917",
    isSubmitting: true,
  },
};
