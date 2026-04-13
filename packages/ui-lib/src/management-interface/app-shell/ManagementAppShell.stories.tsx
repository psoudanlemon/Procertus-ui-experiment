import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CalendarIcon,
  DollarSignIcon,
  HelpCircleIcon,
  MapIcon,
  ReceiptIcon,
  SettingsIcon,
  UsersIcon,
  BarChart3Icon,
  BookOpenIcon,
  BoxIcon,
  CodeIcon,
  DatabaseIcon,
  GitBranchIcon,
  ListTreeIcon,
  NetworkIcon,
  PaletteIcon,
  ZapIcon,
} from "lucide-react";

import { ManagementAppShell } from "./ManagementAppShell";

const sidebarProps = {
  workspaces: [
    {
      id: "3",
      name: "PROCERTUS",
      logo: (
        <img
          src="data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23F1F5F9'/%3E%3Cpath d='M17.4262 21.7754L13.9269 18.6647C12.8241 17.6857 12.7265 15.999 13.7055 14.8963L13.7858 14.8051L18.2489 18.7711L24.0796 12.109C25.0846 10.9607 26.8321 10.8435 27.9804 11.8485L28 11.8659L19.4406 21.6495C18.9218 22.2422 18.0188 22.3008 17.4283 21.7754H17.4262Z' fill='%2371D2C1'/%3E%3Cpath d='M14.5738 10.2246L18.0731 13.3353C19.1758 14.3143 19.2735 16.001 18.2945 17.1038L18.2142 17.1949L13.7511 13.2289L7.92041 19.891C6.91534 21.0394 5.16787 21.1566 4.01954 20.1515L4 20.1342L12.5593 10.3505C13.0781 9.75789 13.9812 9.69928 14.5716 10.2246H14.5738Z' fill='%23076293'/%3E%3C/svg%3E"
          alt="PROCERTUS"
          className="size-full rounded-sm"
        />
      ),
      plan: "Documentation portal",
    },
  ] as import("./ManagementSidebar").Workspace[],
  activeWorkspaceId: "3",
  navItems: [
    { title: "Roadmap", url: "#", icon: MapIcon },
    { title: "Budget", url: "#", icon: DollarSignIcon },
    { title: "Meetings", url: "#", icon: CalendarIcon },
    { title: "People", url: "#", icon: UsersIcon },
    { title: "Invoicing", url: "#", icon: ReceiptIcon },
  ] as import("./ManagementSidebar").NavItem[],
  navGroups: [
    {
      label: "Analysis",
      items: [
        {
          title: "Analysis",
          url: "#",
          icon: BarChart3Icon,
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
          icon: PaletteIcon,
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
        { title: "Domain Browser", url: "#", icon: DatabaseIcon, isActive: true },
        { title: "Architecture", url: "#", icon: NetworkIcon },
      ],
    },
    {
      label: "Coming Soon",
      maxVisible: 3,
      items: [
        { title: "User Stories", url: "#", icon: ListTreeIcon },
        { title: "Event Models", url: "#", icon: ZapIcon },
        { title: "Prototypes", url: "#", icon: BoxIcon },
        { title: "Context Maps", url: "#", icon: GitBranchIcon },
        { title: "DAL Playground", url: "#", icon: CodeIcon },
        { title: "API Docs", url: "#", icon: BookOpenIcon },
        { title: "Guides", url: "#", icon: BookOpenIcon },
      ],
    },
  ] as import("./ManagementSidebar").NavGroup[],
  secondaryItems: [
    { title: "Settings", url: "#", icon: SettingsIcon },
    { title: "Help", url: "#", icon: HelpCircleIcon },
  ] as import("./ManagementSidebar").NavItem[],
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
 * The complete management tool application shell — sidebar + header
 * wrapping the main content area.
 */
const meta = {
  title: "Management Interface/Application Shell",
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
 * Extranet — multi-tenant workspace selector enabled.
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
          plan: "Team Plan",
          memberCount: 4500,
        },
        {
          id: "2",
          name: "Sandra",
          logo: <span className="text-xs font-bold text-primary-foreground">S</span>,
          plan: "Personal Plan",
          memberCount: 1,
        },
        {
          id: "3",
          name: "PROCERTUS",
          logo: (
            <img
              src="data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23F1F5F9'/%3E%3Cpath d='M17.4262 21.7754L13.9269 18.6647C12.8241 17.6857 12.7265 15.999 13.7055 14.8963L13.7858 14.8051L18.2489 18.7711L24.0796 12.109C25.0846 10.9607 26.8321 10.8435 27.9804 11.8485L28 11.8659L19.4406 21.6495C18.9218 22.2422 18.0188 22.3008 17.4283 21.7754H17.4262Z' fill='%2371D2C1'/%3E%3Cpath d='M14.5738 10.2246L18.0731 13.3353C19.1758 14.3143 19.2735 16.001 18.2945 17.1038L18.2142 17.1949L13.7511 13.2289L7.92041 19.891C6.91534 21.0394 5.16787 21.1566 4.01954 20.1515L4 20.1342L12.5593 10.3505C13.0781 9.75789 13.9812 9.69928 14.5716 10.2246H14.5738Z' fill='%23076293'/%3E%3C/svg%3E"
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
          plan: "Team Plan",
          memberCount: 556,
        },
      ] as import("./ManagementSidebar").Workspace[],
      activeWorkspaceId: "3",
    },
  },
  render: (args) => (
    <ManagementAppShell {...args}>
      <div className="min-h-[200vh] rounded-xl border border-dashed" />
    </ManagementAppShell>
  ),
};
