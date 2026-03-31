"use client";

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Combobox } from "@/components/ui/combobox";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

/**
 * A searchable select component that combines a Command input with a Popover.
 */
const meta: Meta<typeof Combobox> = {
  title: "components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default combobox with a list of frameworks.
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
        emptyMessage="No framework found."
      />
    );
  },
};

/**
 * Combobox with a pre-selected value.
 */
export const WithValue: Story = {
  render: () => {
    const [value, setValue] = React.useState("next.js");
    return (
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
      />
    );
  },
};

/**
 * Disabled combobox.
 */
export const Disabled: Story = {
  args: {
    options: frameworks,
    disabled: true,
    placeholder: "Select framework...",
  },
};
