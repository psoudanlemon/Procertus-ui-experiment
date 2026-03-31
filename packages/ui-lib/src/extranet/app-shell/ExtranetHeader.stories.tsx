import type { Meta, StoryObj } from "@storybook/react-vite";

import { ExtranetHeader } from "./ExtranetHeader";

const languages = [
  { code: "nl", label: "Nederlands", flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "fr", label: "Fran\u00E7ais", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "en", label: "English", flag: "\u{1F1EC}\u{1F1E7}" },
];

/**
 * Minimal extranet header — just a thin utility bar.
 * No logo (that lives centered on the page itself, Google-style).
 * Language selector and auth pushed to the far right.
 */
const meta = {
  title: "Extranet/Application Shell/Header",
  component: ExtranetHeader,
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
} satisfies Meta<typeof ExtranetHeader> as Meta<typeof ExtranetHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Homepage header — no logo, just language selector and login/register
 * pushed to the right. Minimal cognitive load.
 */
export const Default: Story = {};
