import type { Meta, StoryObj } from "@storybook/react-vite";

import { Footer } from "@/components/footer";

const meta = {
  title: "components/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 360 },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

const procertusLogo = (
  <img src="/Procertus logo.svg" alt="Procertus" className="h-8 w-auto" />
);

/**
 * Slim bottom-bar variant: just company details + legal links, no expanded
 * link columns. This is what the public registry's Default story renders.
 */
export const Default: Story = {
  args: {
    companyDetails: [
      { label: "© 2026 PROCERTUS asbl/vzw" },
      { label: "TVA/BTW: BE 1000.472.054" },
    ],
    legalLinks: [
      { label: "Privacy policy", url: "#" },
      { label: "Contact", url: "#" },
    ],
  },
};

/**
 * Transparent variant — drops the sidebar tokens for the page background, so
 * the footer blends into a content-first surface.
 */
export const Transparent: Story = {
  args: {
    ...Default.args,
    variant: "transparent",
  },
};

/**
 * Expanded footer with logo, tagline, and grouped link columns above the
 * compact company info bar.
 */
export const Expanded: Story = {
  args: {
    logo: procertusLogo,
    tagline:
      "PROCERTUS is het officiële Belgische register voor productcertificering, beheerd door en voor de sector.",
    linkGroups: [
      {
        title: "Register",
        links: [
          { label: "Zoek certificaat", url: "#" },
          { label: "Certificaat aanvragen", url: "#" },
          { label: "Producenten", url: "#" },
        ],
      },
      {
        title: "Over",
        links: [
          { label: "Onze missie", url: "#" },
          { label: "Bestuur", url: "#" },
          { label: "Pers", url: "#" },
        ],
      },
      {
        title: "Hulp",
        links: [
          { label: "Veelgestelde vragen", url: "#" },
          { label: "Contact", url: "#" },
          { label: "Status", url: "#" },
        ],
      },
    ],
    companyDetails: [
      { label: "© 2026 PROCERTUS asbl/vzw" },
      { label: "TVA/BTW: BE 1000.472.054" },
    ],
    legalLinks: [
      { label: "Privacy policy", url: "#" },
      { label: "Cookies", url: "#" },
      { label: "Algemene voorwaarden", url: "#" },
    ],
  },
};
