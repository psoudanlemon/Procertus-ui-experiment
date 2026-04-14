import type { Meta, StoryObj } from "@storybook/react-vite";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Search01Icon } from "@hugeicons/core-free-icons";

import { Button, Input, Tooltip, TooltipContent, TooltipTrigger } from "@procertus-ui/ui";

import { PublicRegistryAppShell } from "./PublicRegistryAppShell";

const procertusLogoLarge = (
  <>
    <img
      src="/Procertus logo.svg"
      alt="PROCERTUS — Certification that builds trust"
      className="h-20 w-auto dark:hidden"
    />
    <img
      src="/Procertus logo.svg"
      alt="PROCERTUS — Certification that builds trust"
      className="hidden h-20 w-auto brightness-0 invert dark:block"
    />
  </>
);

const languages = [
  { code: "nl", label: "Nederlands", flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "fr", label: "Fran\u00E7ais", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "en", label: "English", flag: "\u{1F1EC}\u{1F1E7}" },
];

/**
 * The public-registry application shell for PROCERTUS — a search-first portal
 * for looking up certificates across prefab, metal, and steel sectors.
 *
 * The homepage follows a Google-like approach: minimal chrome, all focus
 * on the search bar. Categories and filters appear after results load.
 */
const meta = {
  title: "Public Registry/Application Shell",
  component: PublicRegistryAppShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 700 },
    },
  },
  args: {
    header: {
      navLinks: [
        { title: "Over", url: "#" },
        { title: "Contact", url: "#" },
      ],
      languages,
      activeLanguage: "nl",
    },
    footer: {
      companyDetails: [
        { label: "\u00A9 2026 PROCERTUS asbl/vzw" },
        { label: "TVA/BTW: BE 1000.472.054" },
      ],
      legalLinks: [
        { label: "Privacy policy", url: "#" },
        { label: "Contact", url: "#" },
      ],
    },
  },
} satisfies Meta<typeof PublicRegistryAppShell> as Meta<typeof PublicRegistryAppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The homepage — minimal header, centered logo + search, minimal footer.
 * Just like Google: type what you're looking for and go.
 */
/**
 * With FAB — floating action button for certificate requests.
 */
export const WithFab: Story = {
  render: (args) => (
    <PublicRegistryAppShell {...args}>
      <div className="flex min-h-[calc(100svh-theme(spacing.16)-53px)] flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-lg flex-col items-center gap-8 -mt-20">
          {procertusLogoLarge}
          <div className="relative w-full">
            <HugeiconsIcon icon={Search01Icon} className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Zoek op producent, certificaatnummer, product..."
              className="h-12 rounded-full border-border/50 bg-white pl-11 pr-4 text-base shadow-md dark:bg-card"
            />
          </div>
        </div>
      </div>
    </PublicRegistryAppShell>
  ),
};

/**
 * With inline + button in the search bar — the + opens the certificate
 * request flow. Tooltip on hover: "Certificaat aanvragen".
 * No FAB needed.
 */
export const Homepage: Story = {
  args: {
    hideFab: true,
  },
  render: (args) => (
    <PublicRegistryAppShell {...args}>
      <div className="flex min-h-[calc(100svh-theme(spacing.16)-53px)] flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-lg flex-col items-center gap-8 -mt-20">
          {procertusLogoLarge}
          <div className="relative w-full">
            <HugeiconsIcon icon={Search01Icon} className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Zoek op producent, certificaatnummer, product..."
              className="h-12 rounded-full border-border/50 bg-white pl-11 pr-14 text-base shadow-md dark:bg-card"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 rounded-full"
                  asChild
                >
                  <a href="#">
                    <HugeiconsIcon icon={PlusSignIcon} className="size-5" />
                    <span className="sr-only">Certificaat aanvragen</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Certificaat aanvragen</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </PublicRegistryAppShell>
  ),
};
