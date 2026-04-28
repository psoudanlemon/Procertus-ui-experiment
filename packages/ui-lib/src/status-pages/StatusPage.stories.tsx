 import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Alert02Icon,
  ArrowLeft01Icon,
  Clock01Icon,
  SecurityBlockIcon,
} from "@hugeicons/core-free-icons";

import { StatusPage } from "./StatusPage";

const meta = {
  title: "Custom components/Status pages/Logged out",
  component: StatusPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 700 },
    },
  },
  decorators: [
    (Story) => (
      <div data-density="operational" className="contents">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusPage> as Meta<typeof StatusPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Invitation link has expired: user needs to request a new one from their admin. */
export const InvitationExpired: Story = {
  args: {
    icon: Clock01Icon,
    heading: "Invitation expired",
    description:
      "This invitation link is no longer valid. Please contact your administrator to receive a new invitation.",
    actions: [
      {
        label: "Sign in",
        onClick: () => {},
        variant: "default",
        icon: ArrowLeft01Icon,
      },
    ],
  },
};

/** Invitation link is invalid or has already been used. */
export const InvitationInvalid: Story = {
  args: {
    icon: SecurityBlockIcon,
    heading: "Invalid invitation",
    description:
      "This invitation link is not valid or has already been used. If you believe this is an error, please contact your administrator.",
    actions: [
      {
        label: "Sign in",
        onClick: () => {},
        variant: "default",
        icon: ArrowLeft01Icon,
      },
    ],
  },
};

/** Generic unexpected error: redirects the user back to the homepage to escape the dead end. */
export const SomethingWentWrong: Story = {
  args: {
    icon: Alert02Icon,
    heading: "Something went wrong",
    description:
      "An unexpected error occurred. Please return to the homepage and try again.",
    actions: [
      {
        label: "Homepage",
        href: "/",
        variant: "default",
        icon: ArrowLeft01Icon,
      },
    ],
  },
};
