import type { Meta, StoryObj } from "@storybook/react-vite";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ComponentType, useLayoutEffect } from "react";
import {
  AnalyticsUpIcon,
  BookOpen01Icon,
  Calendar01Icon,
  CodeIcon,
  CubeIcon,
  Database01Icon,
  DollarCircleIcon,
  FlashIcon,
  GitBranchIcon,
  HelpCircleIcon,
  HierarchySquare02Icon,
  Invoice01Icon,
  MapsIcon,
  PaintBoardIcon,
  PlusSignIcon,
  Search01Icon,
  Setting06Icon,
  Task01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import type { NavGroup, NavItem, Workspace } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { AppShell } from "./app-shell";
import { ManagementAppShell } from "./management-app-shell";
import { PublicRegistryAppShell } from "./public-registry-app-shell";

const meta = {
  title: "components/Application shell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 700 },
    },
  },
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// Public registry — Default
// ---------------------------------------------------------------------------

/**
 * Mirrors `PublicAppShell` in the production app: sets `data-public-layout` on
 * `<html>` so the shared `globals.css` height/overflow lock is released and the
 * iframe scrolls at the document level, matching how guest pages behave in app.
 */
const PublicLayoutDecorator = (Story: ComponentType) => {
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);
  return <Story />;
};

const publicRegistryHeader = {
  logo: <img src="/Procertus logo.svg" alt="Procertus" className="h-8 w-auto" />,
  languages: [
    { code: "nl", label: "Nederlands", flag: "\u{1F1F3}\u{1F1F1}" },
    { code: "fr", label: "Français", flag: "\u{1F1EB}\u{1F1F7}" },
    { code: "en", label: "English", flag: "\u{1F1EC}\u{1F1E7}" },
  ],
  activeLanguage: "nl",
};

const publicRegistryFooter = {
  companyDetails: [
    { label: "© 2026 PROCERTUS asbl/vzw" },
    { label: "TVA/BTW: BE 1000.472.054" },
  ],
  legalLinks: [
    { label: "Privacy policy", url: "#" },
    { label: "Contact", url: "#" },
  ],
};

const procertusLogoLarge = (
  <>
    <img
      src="/Procertus logo.svg"
      alt="PROCERTUS, certification that builds trust"
      className="h-20 w-auto dark:hidden"
    />
    <img
      src="/Procertus logo.svg"
      alt="PROCERTUS, certification that builds trust"
      className="hidden h-20 w-auto brightness-0 invert dark:block"
    />
  </>
);

/**
 * Public registry homepage: search-first portal with marketing chrome.
 */
export const Default: Story = {
  decorators: [PublicLayoutDecorator],
  render: () => (
    <PublicRegistryAppShell header={publicRegistryHeader} footer={publicRegistryFooter} hideFab>
      <div className="flex min-h-[calc(100svh-theme(spacing.16)-53px)] flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-sm flex-col items-center gap-3 -mt-20">
          {procertusLogoLarge}
          <div className="relative w-full">
            <HugeiconsIcon
              icon={Search01Icon}
              className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            />
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

/**
 * Tall content scrolls under the chrome: the public header scrolls away naturally
 * with the document, while the footer pins to the viewport bottom. A scroll-to-fade
 * overlay above the footer fades in while there is more content below.
 */
export const ScrollableContent: Story = {
  name: "Scrollable content",
  decorators: [PublicLayoutDecorator],
  render: () => (
    <PublicRegistryAppShell header={publicRegistryHeader} footer={publicRegistryFooter} hideFab>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-8">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground"
          >
            Sectie {i + 1} — voorbeeldcontent zodat de pagina langer is dan de viewport en
            je het scrollgedrag kunt waarnemen. De header verdwijnt naar boven, de footer
            blijft plakken en de fade verschijnt zolang er nog inhoud onder de footer staat.
          </div>
        ))}
      </div>
    </PublicRegistryAppShell>
  ),
};

// ---------------------------------------------------------------------------
// Management — Authenticated
// ---------------------------------------------------------------------------

const managementSidebarProps = {
  workspaces: [
    {
      id: "3",
      name: "PROCERTUS",
      logo: <img src="/logomark.svg" alt="PROCERTUS" className="size-full rounded-sm" />,
      plan: "Documentation portal",
    },
  ] as Workspace[],
  activeWorkspaceId: "3",
  navItems: [
    { title: "Roadmap", url: "#", icon: MapsIcon as IconSvgElement },
    { title: "Budget", url: "#", icon: DollarCircleIcon as IconSvgElement },
    { title: "Meetings", url: "#", icon: Calendar01Icon as IconSvgElement },
    { title: "People", url: "#", icon: UserGroupIcon as IconSvgElement },
    { title: "Invoicing", url: "#", icon: Invoice01Icon as IconSvgElement },
  ] as NavItem[],
  navGroups: [
    {
      label: "Analysis",
      items: [
        {
          title: "Analysis",
          url: "#",
          icon: AnalyticsUpIcon as IconSvgElement,
          isActive: true,
          items: [
            { title: "Overview", url: "#" },
            { title: "Reports", url: "#", isActive: true },
            { title: "Trends", url: "#" },
          ],
        },
        {
          title: "Design",
          url: "#",
          icon: PaintBoardIcon as IconSvgElement,
          items: [
            { title: "Components", url: "#" },
            { title: "Tokens", url: "#" },
            { title: "Guidelines", url: "#" },
          ],
        },
      ],
    },
    {
      label: "Documentation",
      items: [
        { title: "Domain browser", url: "#", icon: Database01Icon as IconSvgElement, isActive: true },
        { title: "Architecture", url: "#", icon: HierarchySquare02Icon as IconSvgElement },
      ],
    },
    {
      label: "Coming soon",
      maxVisible: 3,
      items: [
        { title: "User stories", url: "#", icon: Task01Icon as IconSvgElement },
        { title: "Event models", url: "#", icon: FlashIcon as IconSvgElement },
        { title: "Prototypes", url: "#", icon: CubeIcon as IconSvgElement },
        { title: "Context maps", url: "#", icon: GitBranchIcon as IconSvgElement },
        { title: "DAL playground", url: "#", icon: CodeIcon as IconSvgElement },
        { title: "API docs", url: "#", icon: BookOpen01Icon as IconSvgElement },
        { title: "Guides", url: "#", icon: BookOpen01Icon as IconSvgElement },
      ],
    },
  ] as NavGroup[],
  secondaryItems: [
    { title: "Settings", url: "#", icon: Setting06Icon as IconSvgElement },
    { title: "Help", url: "#", icon: HelpCircleIcon as IconSvgElement },
  ] as NavItem[],
  showSearch: false,
};

const managementHeaderProps = {
  showNavigation: false,
  breadcrumbs: [
    { label: "Dashboard", href: "#" },
    { label: "Projects", href: "#" },
    { label: "PROCERTUS", href: "#" },
    { label: "Reports" },
  ],
  canGoBack: true,
  canGoForward: false,
  user: {
    name: "\u{1F34B}",
    email: "somone@lemon.be",
    role: "Platform administrator",
  },
  version: "Webapp: V10.00.00  Api: V10.00.00",
};

/**
 * Authenticated management interface: sidebar with workspaces + nav groups,
 * scroll-aware header with breadcrumbs, rounded content card.
 */
export const Authenticated: Story = {
  render: () => (
    <div className="h-svh">
      <ManagementAppShell
        sidebar={managementSidebarProps}
        header={managementHeaderProps}
        footer={publicRegistryFooter}
      >
        <div className="min-h-[200vh] rounded-xl border border-dashed" />
      </ManagementAppShell>
    </div>
  ),
};
