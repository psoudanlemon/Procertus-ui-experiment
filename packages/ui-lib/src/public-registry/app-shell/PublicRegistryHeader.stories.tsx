import type { Meta, StoryObj } from "@storybook/react-vite";

import { PublicRegistryHeader } from "./PublicRegistryHeader";

const languages = [
  { code: "nl", label: "Nederlands", flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "fr", label: "Fran\u00E7ais", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "en", label: "English", flag: "\u{1F1EC}\u{1F1E7}" },
];

/**
 * Minimal public-registry header — just a thin utility bar.
 * No logo (that lives centered on the page itself, Google-style).
 * Language selector and auth pushed to the far right.
 */
const meta = {
  title: "Public Registry/Application Shell/Header",
  component: PublicRegistryHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    navLinks: [
      { title: "Over", url: "#" },
      { title: "Contact", url: "#" },
    ],
    languages,
    activeLanguage: "nl",
  },
} satisfies Meta<typeof PublicRegistryHeader> as Meta<typeof PublicRegistryHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Homepage header — no logo, just language selector and login/register
 * pushed to the right. Minimal cognitive load.
 */
export const Default: Story = {};
