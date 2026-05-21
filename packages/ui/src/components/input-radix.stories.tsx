import { expect, userEvent } from "storybook/test";
// Replace nextjs-vite with the name of your framework
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Muted } from "@/components/ui/typography";

/**
 * Displays a form input field or a component that looks like an input field.
 */
const meta = {
  title: "components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    className: "w-96",
    type: "email",
    placeholder: "Email",
    disabled: false,
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the input field.
 */
export const Default: Story = {};

/**
 * Use the `disabled` prop to make the input non-interactive and appears faded,
 * indicating that input is not currently accepted.
 */
export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * Use `state="valid"` to surface field-level validation success. A trailing
 * checkmark is rendered inside the input. The border stays neutral so the
 * indicator is informative without competing with focus or hover signals.
 */
export const Valid: Story = {
  args: { state: "valid", defaultValue: "matthias@procertus.be" },
};

/**
 * Use `state="invalid"` to surface field-level validation failure. The
 * destructive border (driven by `aria-invalid`) combines with a trailing
 * alert icon. Pair with a `FieldError` underneath for the actual message.
 */
export const Invalid: Story = {
  args: { state: "invalid", defaultValue: "not-an-email" },
};

/**
 * Use `state="checking"` while an async validation is in flight (e.g. a
 * BTW number being verified against an external service). The border
 * stays neutral so the field is not yet committed to a verdict; a
 * spinning loader replaces the trailing indicator.
 */
export const Checking: Story = {
  args: { state: "checking", defaultValue: "BE0123456789" },
};

/**
 * Use the `Label` component to includes a clear, descriptive label above or
 * alongside the input area to guide users.
 */
export const Labeled: Story = {
  render: (args) => (
    <div className="grid items-center gap-1.5">
      <Label htmlFor="email">{args.placeholder}</Label>
      <Input {...args} id="email" />
    </div>
  ),
};

/**
 * Use a text element below the input field to provide additional instructions
 * or information to users.
 */
export const HelperText: Story = {
  render: (args) => (
    <div className="grid items-center gap-1.5">
      <Label htmlFor="email-2">{args.placeholder}</Label>
      <Input {...args} id="email-2" />
      <Muted>Enter your email address.</Muted>
    </div>
  ),
};

/**
 * Use the `Button` component to indicate that the input field can be submitted
 * or used to trigger an action.
 */
export const Submit: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Input {...args} />
      <Button type="submit">Subscribe</Button>
    </div>
  ),
};

export const ShouldEnterText: Story = {
  name: "when user enters text, should see it in the input field",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    const input = await canvas.findByPlaceholderText(/email/i);
    const mockedInput = "mocked@shadcn.com";

    await step("focus and type into the input field", async () => {
      await userEvent.click(input);
      await userEvent.type(input, mockedInput);
    });

    expect(input).toHaveValue(mockedInput);
  },
};
