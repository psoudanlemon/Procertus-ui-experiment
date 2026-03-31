import type { Meta, StoryObj } from "@storybook/react-vite";

import { ExtranetFooter } from "./ExtranetFooter";

/**
 * Compact footer bar with company details — matching the existing
 * extranet footer style with brand-colored background.
 */
const meta = {
  title: "Extranet/Application Shell/Footer",
  component: ExtranetFooter,
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
} satisfies Meta<typeof ExtranetFooter> as Meta<typeof ExtranetFooter>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Compact company info bar — matches the existing extranet footer.
 */
export const Default: Story = {};
