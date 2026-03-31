import type { Meta, StoryObj } from "@storybook/react-vite";

import { AccountDetailsForm } from "./AccountDetailsForm";

const meta = {
  title: "Management Tool/Authentication/Forms/Account Details",
  component: AccountDetailsForm,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [(Story) => <div className="w-sm"><Story /></div>],
  args: {
    invitedEmail: "jane.doe@company.com",
  },
} satisfies Meta<typeof AccountDetailsForm> as Meta<typeof AccountDetailsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FilledIn: Story = {
  args: {
    firstName: "Jane",
    lastName: "Doe",
    termsAccepted: true,
  },
};

/** User pressed Continue without filling in required fields. */
export const WithError: Story = {
  args: {
    error: "Please fill in all required fields.",
    fieldErrors: {
      firstName: "First name is required",
      lastName: "Last name is required",
    },
  },
};

export const Submitting: Story = {
  args: {
    firstName: "Jane",
    lastName: "Doe",
    termsAccepted: true,
    isSubmitting: true,
  },
};
