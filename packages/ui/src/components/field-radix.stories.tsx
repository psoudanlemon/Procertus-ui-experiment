import * as React from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/**
 * Composable form field wrapper that handles label, description, error, and
 * layout for any form control.
 */
const meta = {
  title: "components/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A payment method form demonstrating the full Field compound component API
 * with nested fieldsets, descriptions, separators, and multiple control types.
 */
export const Default: Story = {
  render: () => (
    <form>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Payment Method</FieldLegend>
          <FieldDescription>All transactions are secure and encrypted</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="card-name">Name on Card</FieldLabel>
              <Input id="card-name" placeholder="Evil Rabbit" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="card-number">Card Number</FieldLabel>
              <Input id="card-number" placeholder="1234 5678 9012 3456" required />
              <FieldDescription>Enter your 16-digit card number</FieldDescription>
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel htmlFor="exp-month">Month</FieldLabel>
                <Select defaultValue="">
                  <SelectTrigger id="exp-month">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const val = String(i + 1).padStart(2, "0");
                      return (
                        <SelectItem key={val} value={val}>
                          {val}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="exp-year">Year</FieldLabel>
                <Select defaultValue="">
                  <SelectTrigger id="exp-year">
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2025, 2026, 2027, 2028, 2029].map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="cvv">CVV</FieldLabel>
                <Input id="cvv" placeholder="123" required />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Billing Address</FieldLegend>
          <FieldDescription>
            The billing address associated with your payment method
          </FieldDescription>
          <FieldGroup>
            <Field orientation="horizontal">
              <Checkbox id="same-as-shipping" defaultChecked />
              <FieldLabel htmlFor="same-as-shipping" className="font-normal">
                Same as shipping address
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="comments">Comments</FieldLabel>
              <Textarea
                id="comments"
                placeholder="Add any additional comments"
                className="resize-none"
              />
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Button type="submit">Submit</Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Field>
      </FieldGroup>
    </form>
  ),
};

/**
 * A basic field with label, input, and description text.
 */
export const InputField: Story = {
  render: () => (
    <FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input id="username" type="text" placeholder="Max Leiter" />
          <FieldDescription>Choose a unique username for your account.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <FieldDescription>Must be at least 8 characters long.</FieldDescription>
          <Input id="password" type="password" placeholder="••••••••" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

/**
 * A field wrapping a textarea control with description.
 */
export const TextareaField: Story = {
  render: () => (
    <FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
          <Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
          <FieldDescription>Share your thoughts about our service.</FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

/**
 * A field wrapping a select dropdown with description.
 */
export const SelectField: Story = {
  render: () => (
    <Field>
      <FieldLabel>Department</FieldLabel>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="support">Customer Support</SelectItem>
          <SelectItem value="hr">Human Resources</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="operations">Operations</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>Select your department or area of work.</FieldDescription>
    </Field>
  ),
};

/**
 * A slider field with a dynamic description showing the current value.
 */
export const SliderField: Story = {
  render: function Render() {
    const [value, setValue] = React.useState([200, 800]);

    return (
      <Field>
        <FieldTitle>Price Range</FieldTitle>
        <FieldDescription>
          Set your budget range ($
          <span className="font-medium tabular-nums">{value[0]}</span> -{" "}
          <span className="font-medium tabular-nums">{value[1]}</span>).
        </FieldDescription>
        <Slider
          value={value}
          onValueChange={setValue}
          max={1000}
          min={0}
          step={10}
          className="mt-2 w-full"
          aria-label="Price Range"
        />
      </Field>
    );
  },
};

/**
 * A fieldset with legend, descriptions, and a grid layout for address fields.
 */
export const Fieldset: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Address Information</FieldLegend>
      <FieldDescription>We need your address to deliver your order.</FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="street">Street Address</FieldLabel>
          <Input id="street" type="text" placeholder="123 Main St" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input id="city" type="text" placeholder="New York" />
          </Field>
          <Field>
            <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
            <Input id="zip" type="text" placeholder="90502" />
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  ),
};

/**
 * Checkbox groups with separators inside a FieldGroup.
 */
export const CheckboxGroup: Story = {
  render: () => (
    <FieldGroup>
      <FieldSet>
        <FieldLabel>Responses</FieldLabel>
        <FieldDescription>
          Get notified when ChatGPT responds to requests that take time, like research or image
          generation.
        </FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          <Field orientation="horizontal">
            <Checkbox id="push" defaultChecked disabled />
            <FieldLabel htmlFor="push" className="font-normal">
              Push notifications
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSeparator />
      <FieldSet>
        <FieldLabel>Tasks</FieldLabel>
        <FieldDescription>
          Get notified when tasks you&apos;ve created have updates.{" "}
        </FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          <Field orientation="horizontal">
            <Checkbox id="push-tasks" />
            <FieldLabel htmlFor="push-tasks" className="font-normal">
              Push notifications
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="email-tasks" />
            <FieldLabel htmlFor="email-tasks" className="font-normal">
              Email notifications
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  ),
};

/**
 * A horizontal switch field with a content block for label and description.
 */
export const SwitchField: Story = {
  render: () => (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel htmlFor="2fa">Multi-factor authentication</FieldLabel>
        <FieldDescription>
          Enable multi-factor authentication. If you do not have a two-factor device, you can use a
          one-time code sent to your email.
        </FieldDescription>
      </FieldContent>
      <Switch id="2fa" />
    </Field>
  ),
};

/**
 * Responsive orientation that switches from vertical to horizontal layout
 * based on the container width.
 */
export const ResponsiveLayout: Story = {
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <form>
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldDescription>Fill in your profile information.</FieldDescription>
        <FieldSeparator />
        <FieldGroup>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldDescription>Provide your full name for identification</FieldDescription>
            </FieldContent>
            <Input id="name" placeholder="Evil Rabbit" required />
          </Field>
          <FieldSeparator />
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="message">Message</FieldLabel>
              <FieldDescription>
                You can write your message here. Keep it short, preferably under 100 characters.
              </FieldDescription>
            </FieldContent>
            <Textarea
              id="message"
              placeholder="Hello, world!"
              required
              className="min-h-[100px] resize-none sm:min-w-[300px]"
            />
          </Field>
          <FieldSeparator />
          <Field orientation="responsive">
            <Button type="submit">Submit</Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  ),
};

/**
 * Fields in an invalid state showing error messages via `FieldError`.
 */
export const WithError: Story = {
  render: () => (
    <FieldGroup>
      <Field data-invalid="true">
        <FieldLabel htmlFor="email-err">Email</FieldLabel>
        <Input id="email-err" type="email" defaultValue="not-an-email" aria-invalid="true" />
        <FieldError>Please enter a valid email address.</FieldError>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="name-err">Name</FieldLabel>
        <Input id="name-err" aria-invalid="true" />
        <FieldError
          errors={[
            { message: "Name is required." },
            { message: "Name must be at least 2 characters." },
          ]}
        />
      </Field>
    </FieldGroup>
  ),
};

/**
 * Disabled fields cascade opacity to labels via `data-disabled`.
 */
export const Disabled: Story = {
  render: () => (
    <FieldGroup>
      <Field data-disabled="true">
        <FieldLabel htmlFor="disabled-input">Username</FieldLabel>
        <Input id="disabled-input" placeholder="evil-rabbit" disabled />
        <FieldDescription>This field cannot be edited.</FieldDescription>
      </Field>
      <Field orientation="horizontal" data-disabled="true">
        <Checkbox id="disabled-check" disabled />
        <FieldLabel htmlFor="disabled-check" className="font-normal">
          Accept terms and conditions
        </FieldLabel>
      </Field>
    </FieldGroup>
  ),
};
