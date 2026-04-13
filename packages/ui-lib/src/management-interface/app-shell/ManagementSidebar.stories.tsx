import type { Meta, StoryObj } from "@storybook/react-vite";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Calendar01Icon,
  DollarCircleIcon,
  HelpCircleIcon,
  Home01Icon,
  MapsIcon,
  Invoice01Icon,
  Setting06Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { ManagementSidebar, type NavItem, type Workspace } from "./ManagementSidebar";

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const workspaces: Workspace[] = [
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
];

const navItems: NavItem[] = [
  { title: "Startpagina", url: "#", icon: Home01Icon as IconSvgElement },
  { title: "Roadmap", url: "#", icon: MapsIcon as IconSvgElement },
  { title: "Budget", url: "#", icon: DollarCircleIcon as IconSvgElement },
  { title: "Meetings", url: "#", icon: Calendar01Icon as IconSvgElement },
  { title: "People", url: "#", icon: UserGroupIcon as IconSvgElement },
  { title: "Invoicing", url: "#", icon: Invoice01Icon as IconSvgElement },
];

import {
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

const navGroups: import("./ManagementSidebar").NavGroup[] = [
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
      { title: "Domain Browser", url: "#", icon: Database01Icon as IconSvgElement, isActive: true },
      { title: "Architecture", url: "#", icon: HierarchySquare02Icon as IconSvgElement },
    ],
  },
  {
    label: "Coming Soon",
    maxVisible: 3,
    items: [
      { title: "User Stories", url: "#", icon: Task01Icon as IconSvgElement },
      { title: "Event Models", url: "#", icon: FlashIcon as IconSvgElement },
      { title: "Prototypes", url: "#", icon: CubeIcon as IconSvgElement },
      { title: "Context Maps", url: "#", icon: GitBranchIcon as IconSvgElement },
      { title: "DAL Playground", url: "#", icon: CodeIcon as IconSvgElement },
      { title: "API Docs", url: "#", icon: BookOpen01Icon as IconSvgElement },
      { title: "Guides", url: "#", icon: BookOpen01Icon as IconSvgElement },
    ],
  },
];

const secondaryItems: NavItem[] = [
  { title: "Settings", url: "#", icon: Setting06Icon as IconSvgElement },
  { title: "Help", url: "#", icon: HelpCircleIcon as IconSvgElement },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

/**
 * The management platform sidebar provides primary navigation, workspace
 * switching, project organization, and user account management. It composes
 * the base `Sidebar` primitives with sections for search, navigation,
 * shared items, projects, and a user dropdown footer.
 */
const meta = {
  title: "Management Interface/Application Shell/Sidebar",
  component: ManagementSidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
    },
  },
  args: {
    workspaces,
    activeWorkspaceId: "3",
    navItems,
    navGroups,
    secondaryItems,
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
        <div className="flex h-svh flex-1 flex-col bg-sidebar">
          <div className="flex h-12 items-center px-3 pt-3">
            <SidebarTrigger />
          </div>
          <main className="mt-1 ml-3 mr-4 min-h-0 flex-1 overflow-y-auto rounded-t-xl bg-background p-6">
            <div className="min-h-[50vh] rounded-xl border border-dashed" />
          </main>
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof ManagementSidebar> as Meta<typeof ManagementSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Single tenant — no search, sticky nav, workspace header acts as home link.
 */
export const Default: Story = {
  args: {
    showSearch: false,
    stickyNav: false,
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
    ],
    activeWorkspaceId: "3",
    navItems: [
      { title: "Roadmap", url: "#", icon: MapsIcon as IconSvgElement },
      { title: "Budget", url: "#", icon: DollarCircleIcon as IconSvgElement },
      { title: "Meetings", url: "#", icon: Calendar01Icon as IconSvgElement },
      { title: "People", url: "#", icon: UserGroupIcon as IconSvgElement },
      { title: "Invoicing", url: "#", icon: Invoice01Icon as IconSvgElement },
    ],
  },
};

/**
 * Multi-tenant with sticky nav — workspace switcher dropdown active.
 */
export const MultiTenant: Story = {
  args: {
    showSearch: false,
  },
};

