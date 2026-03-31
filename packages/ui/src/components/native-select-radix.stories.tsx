import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectGroup, NativeSelectOption } from "@/components/ui/native-select";

/**
 * A native HTML select element styled to match the design system.
 * Use when native mobile behavior or accessibility is preferred over the custom Select.
 */
const meta: Meta<typeof NativeSelect> = {
  title: "components/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  args: {
    disabled: false,
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default native select with options.
 */
export const Default: Story = {
  render: (args) => (
    <div className="grid w-[280px] gap-1.5">
      <Label htmlFor="framework">Framework</Label>
      <NativeSelect id="framework" {...args}>
        <NativeSelectOption value="">Select a framework</NativeSelectOption>
        <NativeSelectOption value="next">Next.js</NativeSelectOption>
        <NativeSelectOption value="remix">Remix</NativeSelectOption>
        <NativeSelectOption value="astro">Astro</NativeSelectOption>
        <NativeSelectOption value="nuxt">Nuxt</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};

/**
 * Disabled state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <div className="grid w-[280px] gap-1.5">
      <Label htmlFor="disabled-select">Framework</Label>
      <NativeSelect id="disabled-select" {...args}>
        <NativeSelectOption value="">Select a framework</NativeSelectOption>
        <NativeSelectOption value="next">Next.js</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};

/**
 * With option groups.
 */
export const WithGroups: Story = {
  render: (args) => (
    <div className="grid w-[280px] gap-1.5">
      <Label htmlFor="grouped-select">Technology</Label>
      <NativeSelect id="grouped-select" {...args}>
        <NativeSelectOption value="">Select a technology</NativeSelectOption>
        <NativeSelectGroup label="Frontend">
          <NativeSelectOption value="react">React</NativeSelectOption>
          <NativeSelectOption value="vue">Vue</NativeSelectOption>
          <NativeSelectOption value="svelte">Svelte</NativeSelectOption>
        </NativeSelectGroup>
        <NativeSelectGroup label="Backend">
          <NativeSelectOption value="node">Node.js</NativeSelectOption>
          <NativeSelectOption value="deno">Deno</NativeSelectOption>
          <NativeSelectOption value="bun">Bun</NativeSelectOption>
        </NativeSelectGroup>
      </NativeSelect>
    </div>
  ),
};
