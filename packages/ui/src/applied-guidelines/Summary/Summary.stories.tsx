import type { Meta, StoryObj } from "@storybook/react-vite";

import { PrototypeSurfaceMarquee } from "./PrototypeSurfaceMarquee";
import { Summary } from "./Summary";
import { TokenSwatch } from "./TokenSwatch";

const meta = {
  title: "Applied guidelines/Summary",
  component: Summary,
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Single-page summary of the foundations: semantic colors, typography, elevation, and form primitives — a quick reference that ties the tokens together.",
      },
    },
  },
} satisfies Meta<typeof Summary>;

export default meta;

export const Gallery: StoryObj<typeof meta> = {
  name: "Full gallery",
  render: () => <Summary />,
};

export const WithHeaderSlot: StoryObj<typeof meta> = {
  name: "With header slot",
  render: () => (
    <Summary
      headerAddon={
        <PrototypeSurfaceMarquee className="max-w-5xl border-dashed" />
      }
    />
  ),
};

export const TokenSwatchOnly: StoryObj<typeof meta> = {
  name: "TokenSwatch (primitive)",
  render: () => (
    <div className="mx-auto grid max-w-lg gap-component p-region">
      <TokenSwatch label="primary" swatchClassName="bg-primary text-primary-foreground" hint="Main CTA" />
      <TokenSwatch label="muted" swatchClassName="bg-muted text-muted-foreground" hint="Secondary surfaces" />
    </div>
  ),
};

export const MarqueeOnly: StoryObj<typeof meta> = {
  name: "PrototypeSurfaceMarquee",
  render: () => <PrototypeSurfaceMarquee className="mx-auto max-w-3xl p-region" />,
};
