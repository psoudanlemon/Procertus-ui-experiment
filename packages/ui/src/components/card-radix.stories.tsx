import type { Meta, StoryObj } from "@storybook/react-vite";
import { HugeiconsIcon } from "@hugeicons/react";
import { NotificationBubbleIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Muted, P, Small } from "@/components/ui/typography";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

/**
 * Displays a card with header, content, and footer.
 */
const meta = {
  title: "components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    className: "w-96",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the card.
 */
export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {notifications.map((notification, index) => (
          <div key={index} className="flex items-center gap-4">
            <HugeiconsIcon icon={NotificationBubbleIcon} className="size-6" />
            <div>
              <P>{notification.title}</P>
              <Muted>{notification.description}</Muted>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="link">Close</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Use the `CardAction` component to add interactive elements in the header.
 */
export const ActionHeader: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Team settings</CardTitle>
        <CardDescription>Manage your team preferences</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <P>Configure team members, permissions, and notifications.</P>
      </CardContent>
      <CardFooter>
        <Button variant="ghost">Cancel</Button>
        <Button className="ml-auto">Save changes</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * A minimal card with only content, no header or footer.
 */
export const MinimalCard: Story = {
  render: (args) => (
    <Card {...args}>
      <CardContent>
        <Small>
          This is a minimal card with only content. Perfect for displaying simple information
          without the need for a header or footer.
        </Small>
      </CardContent>
    </Card>
  ),
};

/**
 * A card with only a header section, no content or footer.
 */
export const HeaderOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Quick stats</CardTitle>
        <CardDescription>Your account summary at a glance. Click for details.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

const styleVariants = ["default", "outlined", "subtle", "muted", "elevated", "faded"] as const;

/**
 * The full set of chrome variants — same shape, different emphasis.
 * `default` and `outlined` are the workhorses; `subtle` and `muted` quiet the surface;
 * `elevated` adds a soft branded halo for quietly-promoted choices; `faded` uses a
 * dashed border and lowered opacity to mark de-emphasized but valid options.
 */
export const Variants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid w-full max-w-md gap-section">
      <div>
        <P className="font-semibold">Style variants</P>
        <Muted>
          default · outlined · subtle · muted · elevated · faded — same chrome, different emphasis.
        </Muted>
      </div>
      <div className="grid gap-component">
        {styleVariants.map((variant) => (
          <Card key={variant} variant={variant}>
            <CardHeader>
              <CardTitle>{`${variant[0]!.toUpperCase()}${variant.slice(1)} variant`}</CardTitle>
              <CardDescription>Optional description that scales with the variant.</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  ),
};

/**
 * The same variant set rendered as interactive cards. The whole card is a focusable
 * click target (`asChild` + `interactive`) with per-variant hover treatment.
 */
export const InteractiveVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid w-full max-w-md gap-section">
      <div>
        <P className="font-semibold">Interactive variants</P>
        <Muted>
          Same variants with `interactive` enabled. Hover and focus states layer per variant.
        </Muted>
      </div>
      <div className="grid gap-component">
        {styleVariants.map((variant) => (
          <Card key={variant} asChild interactive variant={variant}>
            <button type="button">
              <CardHeader>
                <CardTitle>{`${variant[0]!.toUpperCase()}${variant.slice(1)} variant`}</CardTitle>
                <CardDescription>Hover or tab to see the variant-specific state.</CardDescription>
              </CardHeader>
            </button>
          </Card>
        ))}
      </div>
    </div>
  ),
};
