import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
  {
    value: "item-1",
    trigger: "How do I reset my password?",
    content:
      "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password. The link will expire in 24 hours.",
  },
  {
    value: "item-2",
    trigger: "Can I change my subscription plan?",
    content:
      "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.",
  },
  {
    value: "item-3",
    trigger: "What payment methods do you accept?",
    content:
      "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
  },
];

const bordersItems = [
  {
    value: "item-1",
    trigger: "How does billing work?",
    content:
      "We offer monthly and annual subscription plans. Billing is charged at the beginning of each cycle, and you can cancel anytime. All plans include automatic backups, 24/7 support, and unlimited team members.",
  },
  {
    value: "item-2",
    trigger: "Is my data secure?",
    content:
      "Yes, we use industry-standard encryption and security practices to protect your data. All data is encrypted at rest and in transit.",
  },
  {
    value: "item-3",
    trigger: "What integrations do you support?",
    content:
      "We support integrations with popular tools like Slack, GitHub, Jira, and more. You can also use our API to build custom integrations.",
  },
];

const cardItems = [
  {
    value: "item-1",
    trigger: "What subscription plans do you offer?",
    content:
      "We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise ($99/month). Each plan includes increasing storage limits, API access, priority support, and team collaboration features.",
  },
  {
    value: "item-2",
    trigger: "How does billing work?",
    content:
      "Billing is charged at the beginning of each cycle, and you can cancel anytime. All plans include automatic backups, 24/7 support, and unlimited team members.",
  },
  {
    value: "item-3",
    trigger: "How do I cancel my subscription?",
    content:
      "You can cancel your subscription at any time from your account settings. Your access will continue until the end of the current billing period.",
  },
];

/**
 * A vertically stacked set of interactive headings that each reveal a section
 * of content.
 */
const meta = {
  title: "components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    type: "single",
    collapsible: true,
    className: "w-lg",
  },
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <Accordion {...args}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the accordion with single item expansion.
 */
export const Default: Story = {};

/**
 * Use `type="multiple"` to allow multiple items to be open at once.
 */
export const Multiple: Story = {
  args: {
    type: "multiple",
    defaultValue: ["item-1", "item-2"],
  },
};

/**
 * Add `border` to the `Accordion` and `border-b last:border-b-0` to the
 * `AccordionItem` to add borders to the items.
 */
export const Borders: Story = {
  args: {
    defaultValue: "item-1",
    className: "max-w-lg rounded-lg border px-4",
  },
  render: (args) => (
    <Accordion {...args}>
      {bordersItems.map((item) => (
        <AccordionItem key={item.value} value={item.value} className="border-b last:border-b-0">
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/**
 * Wrap the `Accordion` in a `Card` component.
 */
export const InCard: Story = {
  args: {
    defaultValue: "item-1",
    className: "max-w-lg",
  },
  render: (args) => (
    <Card className="w-lg">
      <CardHeader>
        <CardTitle>Subscription & Billing</CardTitle>
        <CardDescription>
          Common questions about your account, plans, payments and cancellations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion {...args} className={undefined}>
          {cardItems.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  ),
};
