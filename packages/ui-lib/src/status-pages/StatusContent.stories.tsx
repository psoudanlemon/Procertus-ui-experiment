import type { Meta, StoryObj } from "@storybook/react-vite";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Alert02Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import {
  Calendar01Icon,
  DollarCircleIcon,
  HelpCircleIcon,
  Home01Icon,
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

import {
  Button,
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from "@procertus-ui/ui";

import type { NavGroup, NavItem, Workspace } from "@procertus-ui/ui";

import logomark from "@procertus-ui/ui/assets/logomark.svg";

import { ManagementAppShell } from "@procertus-ui/ui";

// ---------------------------------------------------------------------------
// Shared app-shell mock data
// ---------------------------------------------------------------------------

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
  ] as Workspace[],
  activeWorkspaceId: "3",
  navItems: [
    { title: "Startpagina", url: "#", icon: Home01Icon as IconSvgElement },
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
          items: [
            { title: "Overview", url: "#" },
            { title: "Reports", url: "#" },
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
        { title: "Domain browser", url: "#", icon: Database01Icon as IconSvgElement },
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

const headerProps = {
  showNavigation: false,
  breadcrumbs: [{ label: "Startpagina", href: "#" }],
  canGoBack: true,
  canGoForward: false,
  user: {
    name: "🍋",
    email: "somone@lemon.be",
    role: "Platform administrator",
  },
  version: "Webapp: V10.00.00  Api: V10.00.00",
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Custom components/Status pages/Logged in",
  component: Empty,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div data-density="operational" className="contents">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Empty> as Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Generic unexpected error shown within the application shell for authenticated users. */
export const SomethingWentWrong: Story = {
  render: () => (
    <ManagementAppShell sidebar={sidebarProps} header={headerProps}>
      <div className="flex h-full items-center justify-center">
        <Empty className="w-[420px] border-none">
          <EmptyIcon>
            <HugeiconsIcon icon={Alert02Icon} />
          </EmptyIcon>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            An unexpected error occurred. Please return to the homepage and try
            again.
          </EmptyDescription>
          <EmptyActions>
            <Button asChild>
              <a href="/">
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                Homepage
              </a>
            </Button>
          </EmptyActions>
        </Empty>
      </div>
    </ManagementAppShell>
  ),
};
