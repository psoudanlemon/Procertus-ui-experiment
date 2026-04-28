import type { Meta, StoryObj } from "@storybook/react-vite";
import type { IconSvgElement } from "@hugeicons/react";
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
  Home01Icon,
  Invoice01Icon,
  MapsIcon,
  PaintBoardIcon,
  Setting06Icon,
  Task01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import { AppSidebar, type NavGroup, type NavItem, type Workspace } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const workspaces: Workspace[] = [
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
        src="/logomark.svg"
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
  {
    id: "5",
    name: "Linear",
    logo: <span className="text-xs font-bold text-primary-foreground">L</span>,
    plan: "Business plan",
    memberCount: 220,
  },
  {
    id: "6",
    name: "Notion",
    logo: <span className="text-xs font-bold text-primary-foreground">N</span>,
    plan: "Enterprise plan",
    memberCount: 1820,
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

const navGroups: NavGroup[] = [
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
];

const secondaryItems: NavItem[] = [
  { title: "Settings", url: "#", icon: Setting06Icon as IconSvgElement },
  { title: "Help", url: "#", icon: HelpCircleIcon as IconSvgElement },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

/**
 * The application sidebar provides primary navigation, workspace switching,
 * project organization, and user account management. It composes the base
 * `Sidebar` primitives with sections for search, navigation, shared items,
 * projects, and a user dropdown footer.
 */
const meta = {
  title: "components/Sidebar",
  component: AppSidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 700 },
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
        <div data-density="operational" className="contents">
          <Story />
          <div className="flex h-svh flex-1 flex-col bg-sidebar">
            <div className="flex h-12 items-center px-3 pt-3">
              <SidebarTrigger />
            </div>
            <main className="mt-1 ml-3 mr-4 min-h-0 flex-1 overflow-y-auto rounded-t-xl bg-background p-6">
              <div className="min-h-[50vh] rounded-xl border border-dashed" />
            </main>
          </div>
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof AppSidebar> as Meta<typeof AppSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Single tenant: no search, sticky nav, workspace header acts as home link.
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
            src="/logomark.svg"
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
 * Multi-tenant with sticky nav: workspace switcher dropdown active.
 */
export const MultiTenant: Story = {
  args: {
    showSearch: false,
  },
};
