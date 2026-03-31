import type { Meta, StoryObj } from "@storybook/react-vite";

import { LoginForm } from "./LoginForm";

const meta = {
  title: "Management Tool/Authentication/Forms/Login",
  component: LoginForm,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [(Story) => <div className="w-sm"><Story /></div>],
  args: {
    onForgotPassword: () => {},
  },
} satisfies Meta<typeof LoginForm> as Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FilledIn: Story = {
  args: {
    email: "jane.doe@company.com",
    password: "SecurePass123!",
  },
};

/** General error — no specific field is at fault (e.g. wrong credentials). */
export const WithError: Story = {
  args: {
    email: "jane.doe@company.com",
    password: "wrongpassword",
    error: "Invalid email or password. Please try again.",
  },
};

export const Submitting: Story = {
  args: {
    email: "jane.doe@company.com",
    password: "SecurePass123!",
    isSubmitting: true,
  },
};
