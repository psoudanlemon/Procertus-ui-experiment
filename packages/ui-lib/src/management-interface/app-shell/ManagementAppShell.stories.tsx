import type { Meta, StoryObj } from "@storybook/react-vite";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Calendar01Icon,
  DollarCircleIcon,
  HelpCircleIcon,
  MapsIcon,
  Invoice01Icon,
  Setting06Icon,
  UserGroupIcon,
  AnalyticsUpIcon,
  BookOpen01Icon,
  CubeIcon,
  CodeIcon,
  Database01Icon,
  GitBranchIcon,
  Task01Icon,
  HierarchySquare02Icon,
  PaintBoardIcon,
  FlashIcon,
} from "@hugeicons/core-free-icons";

import logomark from "@procertus-ui/ui/assets/logomark.svg";

import { ManagementAppShell } from "./ManagementAppShell";

const sidebarProps = {
  workspaces: [
    {
      id: "3",
      name: "PROCERTUS",
      logo: (
        <img
          src={logomark}
          alt="PROCERTUS"
          className="size-full rounded-sm"
        />
      ),
      plan: "Documentation portal",
    },
  ] as import("@procertus-ui/ui").Workspace[],
  activeWorkspaceId: "3",
  navItems: [
    { title: "Roadmap", url: "#", icon: MapsIcon as IconSvgElement },
    { title: "Budget", url: "#", icon: DollarCircleIcon as IconSvgElement },
    { title: "Meetings", url: "#", icon: Calendar01Icon as IconSvgElement },
    { title: "People", url: "#", icon: UserGroupIcon as IconSvgElement },
    { title: "Invoicing", url: "#", icon: Invoice01Icon as IconSvgElement },
  ] as import("@procertus-ui/ui").NavItem[],
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
  ] as import("@procertus-ui/ui").NavGroup[],
  secondaryItems: [
    { title: "Settings", url: "#", icon: Setting06Icon as IconSvgElement },
    { title: "Help", url: "#", icon: HelpCircleIcon as IconSvgElement },
  ] as import("@procertus-ui/ui").NavItem[],
};

const headerProps = {
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
    name: "🍋",
    email: "somone@lemon.be",
    role: "Platform administrator",
  },
  version: "Webapp: V10.00.00  Api: V10.00.00",
};

/**
 * The complete management tool application shell: sidebar and header
 * wrapping the main content area.
 */
const meta = {
  title: "Management interface/Application shell",
  component: ManagementAppShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 600 },
    },
  },
  args: {
    sidebar: { ...sidebarProps, showSearch: false },
    header: headerProps,
  },
  decorators: [
    (Story) => (
      <div data-density="operational" className="contents">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ManagementAppShell> as Meta<typeof ManagementAppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Complete app shell with sidebar, header, and content area.
 */
export const DocumentationPortal: Story = {
  render: (args) => (
    <ManagementAppShell {...args}>
      <div className="min-h-[200vh] rounded-xl border border-dashed" />
    </ManagementAppShell>
  ),
};

/**
 * Operational platform app shell.
 */
export const OperationalPlatform: Story = {
  render: (args) => (
    <ManagementAppShell {...args}>
      <div className="min-h-[200vh] rounded-xl border border-dashed" />
    </ManagementAppShell>
  ),
};

/**
 * Extranet: multi-tenant workspace selector enabled.
 */
export const Extranet: Story = {
  args: {
    sidebar: {
      ...sidebarProps,
      showSearch: false,
      workspaces: [
        {
          id: "1",
          name: "Mercedes",
          logo: <span className="text-xs font-bold text-primary-foreground">M</span>,
          plan: "Team plan",
          memberCount: 4500,
        },
        {
          id: "2",
          name: "Sandra",
          logo: <span className="text-xs font-bold text-primary-foreground">S</span>,
          plan: "Personal plan",
          memberCount: 1,
        },
        {
          id: "3",
          name: "PROCERTUS",
          logo: (
            <img
              src={logomark}
              alt="PROCERTUS"
              className="size-full rounded-sm"
            />
          ),
          plan: "Documentation portal",
          memberCount: 40,
        },
        {
          id: "4",
          name: "Figma",
          logo: <span className="text-xs font-bold text-primary-foreground">F</span>,
          plan: "Team plan",
          memberCount: 556,
        },
      ] as import("@procertus-ui/ui").Workspace[],
      activeWorkspaceId: "3",
    },
  },
  render: (args) => (
    <ManagementAppShell {...args}>
      <div className="min-h-[200vh] rounded-xl border border-dashed" />
    </ManagementAppShell>
  ),
};
