import type { Meta, StoryObj } from "@storybook/react-vite";

import { PublicRegistryFooter } from "./PublicRegistryFooter";

/**
 * Compact footer bar with company details — matching the existing
 * public-registry footer style with brand-colored background.
 */
const meta = {
  title: "Public Registry/Application Shell/Footer",
  component: PublicRegistryFooter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    companyDetails: [
      { label: "\u00A9 2026 PROCERTUS asbl/vzw" },
      { label: "TVA/BTW: BE 1000.472.054" },
    ],
    legalLinks: [
      { label: "Privacy policy", url: "#" },
      { label: "Contact", url: "#" },
    ],
  },
} satisfies Meta<typeof PublicRegistryFooter> as Meta<typeof PublicRegistryFooter>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Compact company info bar — matches the existing public-registry footer.
 */
export const Default: Story = {};
