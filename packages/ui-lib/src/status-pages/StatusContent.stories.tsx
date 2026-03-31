import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  DollarSignIcon,
  HelpCircleIcon,
  HomeIcon,
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

import {
  Button,
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from "@procertus-ui/ui";

import { ManagementAppShell } from "../management-tool/app-shell/ManagementAppShell";
import type {
  NavGroup,
  NavItem,
  Workspace,
} from "../management-tool/app-shell/ManagementSidebar";

// ---------------------------------------------------------------------------
// Shared app-shell mock data
// ---------------------------------------------------------------------------

const sidebarProps = {
  workspaces: [
    {
      id: "3",
      name: "Procertus",
      logo: (
        <img
          src="data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23F1F5F9'/%3E%3Cpath d='M17.4262 21.7754L13.9269 18.6647C12.8241 17.6857 12.7265 15.999 13.7055 14.8963L13.7858 14.8051L18.2489 18.7711L24.0796 12.109C25.0846 10.9607 26.8321 10.8435 27.9804 11.8485L28 11.8659L19.4406 21.6495C18.9218 22.2422 18.0188 22.3008 17.4283 21.7754H17.4262Z' fill='%2371D2C1'/%3E%3Cpath d='M14.5738 10.2246L18.0731 13.3353C19.1758 14.3143 19.2735 16.001 18.2945 17.1038L18.2142 17.1949L13.7511 13.2289L7.92041 19.891C6.91534 21.0394 5.16787 21.1566 4.01954 20.1515L4 20.1342L12.5593 10.3505C13.0781 9.75789 13.9812 9.69928 14.5716 10.2246H14.5738Z' fill='%23076293'/%3E%3C/svg%3E"
          alt="Procertus"
          className="size-full rounded-sm"
        />
      ),
      plan: "Documentation portal",
    },
  ] as Workspace[],
  activeWorkspaceId: "3",
  navItems: [
    { title: "Startpagina", url: "#", icon: HomeIcon },
    { title: "Roadmap", url: "#", icon: MapIcon },
    { title: "Budget", url: "#", icon: DollarSignIcon },
    { title: "Meetings", url: "#", icon: CalendarIcon },
    { title: "People", url: "#", icon: UsersIcon },
    { title: "Invoicing", url: "#", icon: ReceiptIcon },
  ] as NavItem[],
  navGroups: [
    {
      label: "Analysis",
      items: [
        {
          title: "Analysis",
          url: "#",
          icon: BarChart3Icon,
          items: [
            { title: "Overview", url: "#" },
            { title: "Reports", url: "#" },
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
        { title: "Domain Browser", url: "#", icon: DatabaseIcon },
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
  ] as NavGroup[],
  secondaryItems: [
    { title: "Settings", url: "#", icon: SettingsIcon },
    { title: "Help", url: "#", icon: HelpCircleIcon },
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
  title: "Management Tool/Status Pages/Logged In",
  component: Empty,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
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
            <AlertTriangleIcon />
          </EmptyIcon>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            An unexpected error occurred. Please return to the homepage and try
            again.
          </EmptyDescription>
          <EmptyActions>
            <Button asChild>
              <a href="/">
                <ArrowLeftIcon className="size-4" />
                Go to homepage
              </a>
            </Button>
          </EmptyActions>
        </Empty>
      </div>
    </ManagementAppShell>
  ),
};
