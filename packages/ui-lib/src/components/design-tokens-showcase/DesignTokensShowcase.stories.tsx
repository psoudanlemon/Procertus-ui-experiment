import type { Meta, StoryObj } from "@storybook/react-vite";

import { DesignTokensShowcase } from "./DesignTokensShowcase";
import { PrototypeSurfaceMarquee } from "./PrototypeSurfaceMarquee";
import { TokenSwatch } from "./TokenSwatch";

const meta = {
  title: "ui-lib/DesignTokensShowcase",
  component: DesignTokensShowcase,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Prototype gallery for semantic tokens, typography, elevation, and form primitives from @procertus-ui/ui — composed for extranet / onboarding shells.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DesignTokensShowcase>;

export default meta;

export const Gallery: StoryObj<typeof meta> = {
  name: "Full gallery",
  render: () => <DesignTokensShowcase />,
};

export const WithHeaderSlot: StoryObj<typeof meta> = {
  name: "With header slot",
  render: () => (
    <DesignTokensShowcase
      headerAddon={
        <PrototypeSurfaceMarquee className="max-w-5xl border-dashed" />
      }
    />
  ),
};

export const TokenSwatchOnly: StoryObj<typeof meta> = {
  name: "TokenSwatch (primitive)",
  render: () => (
    <div className="mx-auto grid max-w-lg gap-4 p-8">
      <TokenSwatch label="primary" swatchClassName="bg-primary text-primary-foreground" hint="Main CTA" />
      <TokenSwatch label="muted" swatchClassName="bg-muted text-muted-foreground" hint="Secondary surfaces" />
    </div>
  ),
};

export const MarqueeOnly: StoryObj<typeof meta> = {
  name: "PrototypeSurfaceMarquee",
  render: () => <PrototypeSurfaceMarquee className="mx-auto max-w-3xl p-8" />,
};
