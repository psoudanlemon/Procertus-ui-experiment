import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuthLayout } from "./AuthLayout";
import { AccountDetailsForm } from "./AccountDetailsForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { LoginForm } from "./LoginForm";
import { SetPasswordForm } from "./SetPasswordForm";

const panel = {
  image: "/auth-carousel-1.png",
};

const meta = {
  title: "Management Tool/Authentication",
  component: AuthLayout,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { panel },
} satisfies Meta<typeof AuthLayout> as Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default login page — the first screen users see when navigating to the platform. */
export const Login: Story = {
  args: {
    title: "Welcome back",
    description: "Sign in to your Procertus account",
    children: (
      <LoginForm
        email="jane.doe@company.com"
        onForgotPassword={() => {}}
      />
    ),
  },
};

/** Invitation step 1 — account details (email, name, terms). */
export const AcceptInvitation: Story = {
  args: {
    title: "Create your account",
    description: "You've been invited to join Procertus",
    children: (
      <AccountDetailsForm
        invitedEmail="jane.doe@company.com"
        firstName="Jane"
        lastName="Doe"
        termsAccepted={true}
      />
    ),
  },
};

/** Invitation step 2 — choose a password. */
export const ChoosePassword: Story = {
  args: {
    title: "Choose a password",
    description: "Create a strong password for your account",
    children: (
      <SetPasswordForm
        submitLabel="Create account"
        newPassword="SecurePass123!"
        confirmPassword="SecurePass123!"
      />
    ),
  },
};

/** Forgot password — user requests a reset link via email. */
export const ForgotPassword: Story = {
  args: {
    title: "Forgot your password?",
    description: "We'll send you a link to reset it",
    children: (
      <ForgotPasswordForm
        email="jane.doe@company.com"
        onBackToLogin={() => {}}
      />
    ),
  },
};

/** Reset password — user clicks the reset link from their email. */
export const ResetPassword: Story = {
  args: {
    title: "Set new password",
    description: "Choose a strong password for your account",
    children: (
      <SetPasswordForm
        submitLabel="Reset password"
        newPassword="SecurePass123!"
        confirmPassword="SecurePass123!"
        onBack={() => {}}
      />
    ),
  },
};
