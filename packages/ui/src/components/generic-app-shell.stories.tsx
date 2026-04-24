import type { Meta, StoryObj } from "@storybook/react-vite";
import type { IconSvgElement } from "@hugeicons/react";
import {
  AnalyticsUpIcon,
  BookOpen01Icon,
  Calendar01Icon,
  Database01Icon,
  FlashIcon,
  Home01Icon,
  MapsIcon,
  PaintBoardIcon,
  Setting06Icon,
  Task01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import {
  GenericAppHeader,
  GenericAppShell,
  type GenericAppSidebarProps,
  type GenericNavGroup,
  type GenericNavItem,
} from "@/components/generic-app-shell";
import { Muted } from "@/components/ui/typography";

// ---------------------------------------------------------------------------
// Navigation preset A — catalog-style (nested groups + maxVisible)
// ---------------------------------------------------------------------------

const primaryCatalog: GenericNavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "#",
    icon: Home01Icon as IconSvgElement,
  },
  {
    id: "maps",
    label: "Maps",
    href: "#",
    icon: MapsIcon as IconSvgElement,
  },
  {
    id: "calendar",
    label: "Calendar",
    href: "#",
    icon: Calendar01Icon as IconSvgElement,
  },
];

const groupsCatalog: GenericNavGroup[] = [
  {
    id: "analysis",
    label: "Analysis",
    items: [
      {
        id: "analysis-root",
        label: "Analysis",
        href: "#",
        icon: AnalyticsUpIcon as IconSvgElement,
        children: [
          { id: "overview", label: "Overview", href: "#" },
          { id: "reports", label: "Reports", href: "#", isActive: true },
          { id: "trends", label: "Trends", href: "#" },
        ],
      },
      {
        id: "design",
        label: "Design",
        href: "#",
        icon: PaintBoardIcon as IconSvgElement,
        children: [
          { id: "components", label: "Components", href: "#" },
          { id: "tokens", label: "Tokens", href: "#" },
        ],
      },
    ],
  },
  {
    id: "backlog",
    label: "Backlog",
    maxVisible: 2,
    items: [
      { id: "us-1", label: "Item A", href: "#", icon: Task01Icon as IconSvgElement },
      { id: "us-2", label: "Item B", href: "#", icon: FlashIcon as IconSvgElement },
      { id: "us-3", label: "Item C", href: "#", icon: BookOpen01Icon as IconSvgElement },
      { id: "us-4", label: "Item D", href: "#", icon: Database01Icon as IconSvgElement },
    ],
  },
];

const secondaryCatalog: GenericNavItem[] = [
  { id: "settings", label: "Settings", href: "#", icon: Setting06Icon as IconSvgElement },
];

const sidebarCatalog: GenericAppSidebarProps = {
  sidebarAriaLabel: "Catalog preview",
  sidebarHeader: (
    <div className="rounded-md border border-dashed border-sidebar-border px-component py-micro text-xs text-muted-foreground">
      Header slot — tree A
    </div>
  ),
  showSearch: true,
  searchPlaceholder: "Filter…",
  primaryNavItems: primaryCatalog,
  navGroups: groupsCatalog,
  secondaryNavItems: secondaryCatalog,
};

// ---------------------------------------------------------------------------
// Navigation preset B — operations hub (callbacks + flat groups)
// ---------------------------------------------------------------------------

const primaryOps: GenericNavItem[] = [
  {
    id: "dash",
    label: "Dashboard",
    onSelect: () => {},
    icon: Home01Icon as IconSvgElement,
    isActive: true,
  },
  {
    id: "people",
    label: "People",
    href: "#",
    icon: UserGroupIcon as IconSvgElement,
  },
];

const groupsOps: GenericNavGroup[] = [
  {
    id: "work",
    label: "Work",
    items: [
      { id: "triage", label: "Triage queue", href: "#" },
      { id: "batch", label: "Batch actions", href: "#", isActive: true },
    ],
  },
];

const secondaryOps: GenericNavItem[] = [
  { id: "prefs", label: "Preferences", onSelect: () => {}, icon: Setting06Icon as IconSvgElement },
];

const sidebarOps: GenericAppSidebarProps = {
  sidebarAriaLabel: "Operations preview",
  sidebarHeader: (
    <div className="rounded-md border border-dashed border-sidebar-border px-component py-micro text-xs text-muted-foreground">
      Header slot — tree B
    </div>
  ),
  showSearch: false,
  stickyPrimaryNav: true,
  primaryNavItems: primaryOps,
  navGroups: groupsOps,
  secondaryNavItems: secondaryOps,
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Application shell/Generic app shell",
  component: GenericAppShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Data-driven shell: `GenericAppShell` composes `GenericAppSidebar` (navigation model + slots) and an optional header. " +
          "No React Router — use `href` and/or `onSelect`. Compare the two stories for different navigation trees.",
      },
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 640 },
    },
  },
} satisfies Meta<typeof GenericAppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NavigationTreeCatalog: Story = {
  name: "Navigation tree — catalog",
  render: () => (
    <GenericAppShell
      sidebarProps={sidebarCatalog}
      header={
        <GenericAppHeader
          center={<Muted className="text-sm">Generic header — catalog data</Muted>}
        />
      }
    >
      <div className="min-h-[120vh] space-y-component">
        <p className="text-sm text-muted-foreground">
          Resize to a narrow viewport to exercise the drawer. Main landmark for page title stays in app
          content.
        </p>
        <div className="rounded-xl border border-dashed p-boundary" />
      </div>
    </GenericAppShell>
  ),
};

export const NavigationTreeOperations: Story = {
  name: "Navigation tree — operations",
  render: () => (
    <GenericAppShell
      sidebarProps={sidebarOps}
      header={
        <GenericAppHeader
          center={<Muted className="text-sm">Generic header — operations data</Muted>}
        />
      }
    >
      <div className="min-h-[120vh] space-y-component">
        <p className="text-sm text-muted-foreground">
          Sticky primary nav is on; several items use <code className="text-xs">onSelect</code> instead of{" "}
          <code className="text-xs">href</code>.
        </p>
        <div className="rounded-xl border border-dashed p-boundary" />
      </div>
    </GenericAppShell>
  ),
};
