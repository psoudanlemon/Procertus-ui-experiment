import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton, SkeletonPrefillField } from "@/components/ui/skeleton";

/**
 * Use to show a placeholder while content is loading.
 */
const meta = {
  title: "components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof Skeleton>;

/**
 * The default form of the skeleton.
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex items-center space-x-4">
      <Skeleton {...args} className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton {...args} className="h-4 w-[250px]" />
        <Skeleton {...args} className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

type PrefillStory = StoryObj<typeof SkeletonPrefillField>;

const prefillMeta = {
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Single **form field** row for async prefill: dashed manual placeholder when the field is not being prefilled, or a skeleton bar that distinguishes loading (pulse) from resolved (static).",
      },
    },
  },
  args: {
    label: "Bedrijfsnaam",
    prefilled: true,
    resolved: false,
  },
  render: (args: React.ComponentProps<typeof SkeletonPrefillField>) => (
    <SkeletonPrefillField {...args} />
  ),
};

/**
 * Field is being prefilled and the lookup is still in flight: the bar pulses.
 */
export const PrefillFieldLoading: PrefillStory = {
  ...prefillMeta,
  name: "Prefill field, loading",
  args: {
    ...prefillMeta.args,
    prefilled: true,
    resolved: false,
  },
};

/**
 * Field is being prefilled and the value has resolved: the bar is static.
 */
export const PrefillFieldResolved: PrefillStory = {
  ...prefillMeta,
  name: "Prefill field, resolved",
  args: {
    ...prefillMeta.args,
    prefilled: true,
    resolved: true,
  },
};

/**
 * Field is not prefilled: a dashed affordance signals manual entry.
 */
export const PrefillFieldManual: PrefillStory = {
  ...prefillMeta,
  name: "Prefill field, not prefilled (manual)",
  args: {
    ...prefillMeta.args,
    prefilled: false,
    resolved: false,
  },
};

/**
 * Manual-entry state with a custom hint copy.
 */
export const PrefillFieldCustomManualHint: PrefillStory = {
  ...prefillMeta,
  name: "Prefill field, custom manual hint",
  args: {
    ...prefillMeta.args,
    prefilled: false,
    manualHint: "Enter manually in the next step",
  },
};
