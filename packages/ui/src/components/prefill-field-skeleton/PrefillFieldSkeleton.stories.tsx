import type { Meta, StoryObj } from "@storybook/react-vite";

import { PrefillFieldSkeleton } from "./PrefillFieldSkeleton";

const meta = {
  title: "components/PrefillFieldSkeleton",
  component: PrefillFieldSkeleton,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Single **form field** row for async prefill: dashed manual placeholder when the field is not being prefilled, or a skeleton bar that distinguishes loading (pulse) from resolved (static).",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    label: "Bedrijfsnaam",
    prefilled: true,
    resolved: false,
  },
} satisfies Meta<typeof PrefillFieldSkeleton>;

export default meta;

export const LoadingPrefill: StoryObj<typeof meta> = {
  name: "Prefilled, loading",
  args: {
    prefilled: true,
    resolved: false,
  },
};

export const ResolvedPrefill: StoryObj<typeof meta> = {
  name: "Prefilled, resolved",
  args: {
    prefilled: true,
    resolved: true,
  },
};

export const ManualOnly: StoryObj<typeof meta> = {
  name: "Not prefilled (manual)",
  args: {
    prefilled: false,
    resolved: false,
  },
};

export const CustomManualHint: StoryObj<typeof meta> = {
  name: "Custom manual hint",
  args: {
    prefilled: false,
    manualHint: "Enter manually in the next step",
  },
};
