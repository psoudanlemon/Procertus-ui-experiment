import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldTitle } from "@/components/ui/field";
import { H4 } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Muted } from "@/components/ui/typography";
import { expect, userEvent, within } from "storybook/test";

/**
 * Displays rich content in a portal, triggered by a button.
 */
const meta = {
  title: "components/Popover",
  component: Popover,
  tags: ["autodocs"],
  argTypes: {},

  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="ghost">Open</Button>
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the popover.
 */
export const Default: Story = {};

/**
 * A popover containing a small form with dimension fields, demonstrating
 * how to combine Field, FieldTitle, and Input inside popover content.
 */
export const DimensionsForm: Story = {
  render: (args) => (
    <Popover defaultOpen {...args}>
      <PopoverTrigger asChild>
        <Button variant="ghost">Open</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="mb-4">
          <H4>Dimensions</H4>
          <Muted>Set the dimensions for the layer.</Muted>
        </div>
        <FieldGroup>
          <Field orientation="horizontal" className="gap-5">
            <FieldTitle className="w-28 shrink-0">Width</FieldTitle>
            <Input placeholder="Placeholder" />
          </Field>
          <Field orientation="horizontal" className="gap-5">
            <FieldTitle className="w-28 shrink-0">Max. width</FieldTitle>
            <Input placeholder="Placeholder" />
          </Field>
          <Field orientation="horizontal" className="gap-5">
            <FieldTitle className="w-28 shrink-0">Height</FieldTitle>
            <Input placeholder="Placeholder" />
          </Field>
          <Field orientation="horizontal" className="gap-5">
            <FieldTitle className="w-28 shrink-0">Max. height</FieldTitle>
            <Input placeholder="Placeholder" />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  ),
};

export const ShouldOpenClose: Story = {
  name: "when clicking the trigger, should open and close the popover",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("click the trigger to open the popover", async () => {
      await userEvent.click(await canvasBody.findByRole("button", { name: /open/i }));
      expect(await canvasBody.findByRole("dialog")).toBeInTheDocument();
    });

    await step("click the trigger to close the popover", async () => {
      await userEvent.click(await canvasBody.findByRole("button", { name: /open/i }));
      expect(await canvasBody.findByRole("dialog")).toHaveAttribute("data-state", "closed");
    });
  },
};
