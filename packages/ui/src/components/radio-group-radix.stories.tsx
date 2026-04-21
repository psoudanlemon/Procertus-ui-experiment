import * as React from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "@/components/ui/label";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/**
 * A set of checkable buttons—known as radio buttons—where no more than one of
 * the buttons can be checked at a time.
 */
const meta = {
  title: "components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default radio group with labels.
 */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </Field>
    </RadioGroup>
  ),
};

/**
 * Radio group items with a description using the `Field` component.
 */
export const WithDescription: Story = {
  render: () => (
    <RadioGroup defaultValue="default" className="gap-4">
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id="desc-r1" />
        <FieldContent>
          <FieldTitle>
            <Label htmlFor="desc-r1">Default</Label>
          </FieldTitle>
          <FieldDescription>Standard spacing for most interfaces.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" id="desc-r2" />
        <FieldContent>
          <FieldTitle>
            <Label htmlFor="desc-r2">Comfortable</Label>
          </FieldTitle>
          <FieldDescription>More space between elements for a relaxed feel.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id="desc-r3" />
        <FieldContent>
          <FieldTitle>
            <Label htmlFor="desc-r3">Compact</Label>
          </FieldTitle>
          <FieldDescription>Minimal spacing for dense layouts.</FieldDescription>
        </FieldContent>
      </Field>
    </RadioGroup>
  ),
};

/**
 * Use `FieldLabel` to wrap the entire `Field` for a clickable card-style selection.
 */
export const ChoiceCard: Story = {
  render: () => (
    <RadioGroup defaultValue="pro" className="gap-4">
      <FieldLabel>
        <Field orientation="horizontal">
          <RadioGroupItem value="plus" id="card-r1" />
          <FieldContent>
            <FieldTitle>
              <Label htmlFor="card-r1">Plus</Label>
            </FieldTitle>
            <FieldDescription>For individuals and small teams.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel>
        <Field orientation="horizontal">
          <RadioGroupItem value="pro" id="card-r2" />
          <FieldContent>
            <FieldTitle>
              <Label htmlFor="card-r2">Pro</Label>
            </FieldTitle>
            <FieldDescription>For growing businesses.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel>
        <Field orientation="horizontal">
          <RadioGroupItem value="enterprise" id="card-r3" />
          <FieldContent>
            <FieldTitle>
              <Label htmlFor="card-r3">Enterprise</Label>
            </FieldTitle>
            <FieldDescription>For large teams and enterprises.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </RadioGroup>
  ),
};

/**
 * Use `FieldSet` and `FieldLegend` to group radio items with a label and description.
 */
export const Fieldset: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Subscription plan</FieldLegend>
      <FieldDescription>Choose a plan. Save more with yearly or lifetime.</FieldDescription>
      <RadioGroup defaultValue="monthly" className="gap-4">
        <FieldLabel>
          <Field orientation="horizontal">
            <RadioGroupItem value="monthly" id="fs-r1" />
            <FieldContent>
              <FieldTitle>
                <Label htmlFor="fs-r1">Monthly</Label>
              </FieldTitle>
              <FieldDescription>$9.99/month</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldLabel>
          <Field orientation="horizontal">
            <RadioGroupItem value="yearly" id="fs-r2" />
            <FieldContent>
              <FieldTitle>
                <Label htmlFor="fs-r2">Yearly</Label>
              </FieldTitle>
              <FieldDescription>$99.99/year</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldLabel>
          <Field orientation="horizontal">
            <RadioGroupItem value="lifetime" id="fs-r3" />
            <FieldContent>
              <FieldTitle>
                <Label htmlFor="fs-r3">Lifetime</Label>
              </FieldTitle>
              <FieldDescription>$299.99</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </RadioGroup>
    </FieldSet>
  ),
};

/**
 * Use the `disabled` prop on `RadioGroupItem` to disable individual items.
 */
export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id="dis-r1" disabled />
        <Label htmlFor="dis-r1">Default</Label>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" id="dis-r2" />
        <Label htmlFor="dis-r2">Comfortable</Label>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id="dis-r3" />
        <Label htmlFor="dis-r3">Compact</Label>
      </Field>
    </RadioGroup>
  ),
};

/**
 * Use `aria-invalid` on `RadioGroupItem` and `data-invalid` on `Field` to show validation errors.
 * Selecting a value clears the error state.
 */
export const Invalid: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("");
    const isInvalid = !value;

    return (
      <FieldSet>
        <FieldLegend>Notification preferences</FieldLegend>
        <FieldDescription>Choose how you want to be notified.</FieldDescription>
        <RadioGroup className="gap-4" value={value} onValueChange={setValue}>
          <FieldLabel className={isInvalid ? "border-destructive" : undefined}>
            <Field orientation="horizontal" data-invalid={isInvalid || undefined}>
              <RadioGroupItem value="email" id="inv-r1" aria-invalid={isInvalid || undefined} />
              <FieldContent>
                <FieldTitle>
                  <Label htmlFor="inv-r1">Email</Label>
                </FieldTitle>
                <FieldDescription>Get notified via email.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <FieldLabel className={isInvalid ? "border-destructive" : undefined}>
            <Field orientation="horizontal" data-invalid={isInvalid || undefined}>
              <RadioGroupItem value="sms" id="inv-r2" aria-invalid={isInvalid || undefined} />
              <FieldContent>
                <FieldTitle>
                  <Label htmlFor="inv-r2">SMS</Label>
                </FieldTitle>
                <FieldDescription>Get notified via text message.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        </RadioGroup>
        {isInvalid && <FieldError>Please select a notification preference.</FieldError>}
      </FieldSet>
    );
  },
};

export const ShouldToggleRadio: Story = {
  name: "when clicking on a radio button, it should toggle its state",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    const radios = await canvas.findAllByRole("radio");
    expect(radios).toHaveLength(3);

    await step("click the default radio button", async () => {
      await userEvent.click(radios[0]);
      await waitFor(() => expect(radios[0]).toBeChecked());
      await waitFor(() => expect(radios[1]).not.toBeChecked());
    });

    await step("click the comfortable radio button", async () => {
      await userEvent.click(radios[1]);
      await waitFor(() => expect(radios[1]).toBeChecked());
      await waitFor(() => expect(radios[0]).not.toBeChecked());
    });
  },
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id="test-r1" />
        <Label htmlFor="test-r1">Default</Label>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" id="test-r2" />
        <Label htmlFor="test-r2">Comfortable</Label>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id="test-r3" />
        <Label htmlFor="test-r3">Compact</Label>
      </Field>
    </RadioGroup>
  ),
};
