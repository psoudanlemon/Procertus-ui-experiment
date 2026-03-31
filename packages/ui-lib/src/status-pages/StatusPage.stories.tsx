 import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ClockIcon,
  ShieldXIcon,
} from "lucide-react";

import { StatusPage } from "./StatusPage";

const meta = {
  title: "Management Tool/Status Pages/Logged Out",
  component: StatusPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StatusPage> as Meta<typeof StatusPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Invitation link has expired — user needs to request a new one from their admin. */
export const InvitationExpired: Story = {
  args: {
    icon: ClockIcon,
    heading: "Invitation expired",
    description:
      "This invitation link is no longer valid. Please contact your administrator to receive a new invitation.",
    actions: [
      {
        label: "Back to sign in",
        onClick: () => {},
        variant: "default",
        icon: ArrowLeftIcon,
      },
    ],
  },
};

/** Invitation link is invalid or has already been used. */
export const InvitationInvalid: Story = {
  args: {
    icon: ShieldXIcon,
    heading: "Invalid invitation",
    description:
      "This invitation link is not valid or has already been used. If you believe this is an error, please contact your administrator.",
    actions: [
      {
        label: "Back to sign in",
        onClick: () => {},
        variant: "default",
        icon: ArrowLeftIcon,
      },
    ],
  },
};

/** Generic unexpected error — redirects the user back to the homepage to escape the dead-end. */
export const SomethingWentWrong: Story = {
  args: {
    icon: AlertTriangleIcon,
    heading: "Something went wrong",
    description:
      "An unexpected error occurred. Please return to the homepage and try again.",
    actions: [
      {
        label: "Go to homepage",
        href: "/",
        variant: "default",
        icon: ArrowLeftIcon,
      },
    ],
  },
};
