import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  MapsIcon,
  DollarCircleIcon,
  Calendar01Icon,
  UserGroupIcon,
  Invoice01Icon,
  AnalyticsUpIcon,
  PaintBoardIcon,
  Database01Icon,
  HierarchySquare02Icon,
  Task01Icon,
  FlashIcon,
  CubeIcon,
  GitBranchIcon,
  CodeIcon,
  BookOpen01Icon,
  Setting06Icon,
  HelpCircleIcon,
  Search01Icon,
  Logout01Icon,
  MoreHorizontalIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import {
  Avatar,
  AvatarFallback,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarNavIcon,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui";
import { iconStroke } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NavItem = {
  title: string;
  url: string;
  icon: IconSvgElement;
  isActive?: boolean;
};

type CollapsibleNavItem = {
  title: string;
  url: string;
  icon: IconSvgElement;
  isActive?: boolean;
  items?: { title: string; url: string; isActive?: boolean }[];
};

type NavGroup = {
  label: string;
  items: CollapsibleNavItem[];
  maxVisible?: number;
};

// ---------------------------------------------------------------------------
// Navigation data
// ---------------------------------------------------------------------------

const navItems: NavItem[] = [
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
      { title: "Domain Browser", url: "#", icon: Database01Icon as IconSvgElement },
      { title: "Architecture", url: "#", icon: HierarchySquare02Icon as IconSvgElement },
    ],
  },
  {
    label: "Coming soon",
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
// Sidebar sub-components
// ---------------------------------------------------------------------------

function WorkspaceHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="data-[slot=sidebar-menu-button]:p-1.5!">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground! *:text-inherit!">
            <img
              src="data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23F1F5F9'/%3E%3Cpath d='M17.4262 21.7754L13.9269 18.6647C12.8241 17.6857 12.7265 15.999 13.7055 14.8963L13.7858 14.8051L18.2489 18.7711L24.0796 12.109C25.0846 10.9607 26.8321 10.8435 27.9804 11.8485L28 11.8659L19.4406 21.6495C18.9218 22.2422 18.0188 22.3008 17.4283 21.7754H17.4262Z' fill='%2371D2C1'/%3E%3Cpath d='M14.5738 10.2246L18.0731 13.3353C19.1758 14.3143 19.2735 16.001 18.2945 17.1038L18.2142 17.1949L13.7511 13.2289L7.92041 19.891C6.91534 21.0394 5.16787 21.1566 4.01954 20.1515L4 20.1342L12.5593 10.3505C13.0781 9.75789 13.9812 9.69928 14.5716 10.2246H14.5738Z' fill='%23076293'/%3E%3C/svg%3E"
              alt="PROCERTUS"
              className="size-full rounded-sm"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">PROCERTUS</span>
            <span className="truncate text-xs text-muted-foreground">Documentation portal</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function NavPrimary({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup className="py-0!">
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                <a href={item.url}>
                  <SidebarNavIcon icon={item.icon} />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function NavCollapsible({
  items,
  label,
  maxVisible,
}: {
  items: CollapsibleNavItem[];
  label: string;
  maxVisible?: number;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const visibleItems = maxVisible && !expanded ? items.slice(0, maxVisible) : items;
  const hasMore = maxVisible != null && items.length > maxVisible;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) =>
          item.items?.length ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                    <SidebarNavIcon icon={item.icon} />
                    <span>{item.title}</span>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon as IconSvgElement}
                      size={14}
                      strokeWidth={iconStroke(14)}
                      className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                <a href={item.url}>
                  <SidebarNavIcon icon={item.icon} />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
        {hasMore && (
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-sidebar-foreground/70"
              onClick={() => setExpanded(!expanded)}
            >
              <HugeiconsIcon
                icon={MoreHorizontalIcon as IconSvgElement}
                size={16}
                strokeWidth={iconStroke(16)}
                className="text-sidebar-foreground/70"
              />
              <span>{expanded ? "Less" : "More"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavSecondary({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <SidebarNavIcon icon={item.icon} />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function NavUser() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">MP</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Matthias</span>
                <span className="truncate text-xs text-muted-foreground">admin@procertus.be</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-sidebar text-sidebar-foreground"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">MP</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Matthias</span>
                <span className="truncate text-xs text-muted-foreground">admin@procertus.be</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <HugeiconsIcon icon={Logout01Icon as IconSvgElement} size={16} strokeWidth={iconStroke(16)} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// ---------------------------------------------------------------------------
// Shell layout
// ---------------------------------------------------------------------------

function Header() {
  return (
    <header className="shrink-0 bg-sidebar px-element pt-element pb-element">
      <div className="flex h-[56px] items-center gap-element px-element">
        <SidebarTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        <Separator orientation="vertical" className="mx-0.5 !h-5 !self-center" />
        <Button
          variant="ghost"
          size="icon-sm"
          disabled
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon as IconSvgElement} size={16} strokeWidth={iconStroke(16)} />
          <span className="sr-only">Go back</span>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <HugeiconsIcon icon={ArrowRight01Icon as IconSvgElement} size={16} strokeWidth={iconStroke(16)} />
          <span className="sr-only">Go forward</span>
        </Button>
        <Separator orientation="vertical" className="mx-0.5 !h-5 !self-center" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Reports</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

function ManagementShellLayout() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="offcanvas"
        className="border-none [&_[data-slot=sidebar-inner]]:p-2 [&_[data-slot=sidebar-group]]:p-1 [&_[data-slot=sidebar-header]]:p-1 [&_[data-slot=sidebar-footer]]:p-1 [&_[data-slot=sidebar-content]]:mt-0 [&_[data-slot=sidebar-content]]:gap-3 [&_[data-slot=sidebar-menu-sub]]:mr-0 [&_[data-slot=sidebar-menu-sub]]:pr-0 [&_[data-slot=sidebar-menu-sub]]:overflow-hidden [&_[data-slot=sidebar-menu-sub]]:py-1 [&_[data-slot=sidebar-menu-sub]]:border-l-0 [&_[data-slot=sidebar-menu-sub]]:relative [&_[data-slot=sidebar-menu-sub]]:before:absolute [&_[data-slot=sidebar-menu-sub]]:before:left-0 [&_[data-slot=sidebar-menu-sub]]:before:top-1 [&_[data-slot=sidebar-menu-sub]]:before:bottom-1 [&_[data-slot=sidebar-menu-sub]]:before:w-px [&_[data-slot=sidebar-menu-sub]]:before:bg-sidebar-border [&_[data-slot=sidebar-menu-sub]]:rounded-r-md [&_[data-slot=sidebar-menu]]:gap-1!"
      >
        <SidebarHeader>
          <WorkspaceHeader />
        </SidebarHeader>
        <SidebarContent>
          <NavPrimary items={navItems} />
          {navGroups.map((group) => (
            <NavCollapsible
              key={group.label}
              items={group.items}
              label={group.label}
              maxVisible={group.maxVisible}
            />
          ))}
        </SidebarContent>
        <NavSecondary items={secondaryItems} />
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      <div className="flex min-h-svh flex-1 flex-col bg-sidebar">
        <div className="sticky top-0 z-20 bg-sidebar">
          <Header />
          <div
            className="pointer-events-none mx-component -mb-8 h-8 bg-gradient-to-b from-sidebar to-transparent transition-opacity duration-200"
            style={{ opacity: scrolled ? 1 : 0 }}
          />
        </div>
        <div className="mx-component flex flex-1 flex-col pb-component">
          <main className="flex-1 rounded-xl bg-background p-element">
            <div className="min-h-[200vh] rounded-xl border border-dashed" />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

const meta = {
  title: "Applied Guidelines/Iconography",
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 600 },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Management shell with stroke navigation icons. Primary-700 icons on a neutral
 * background at rest, shifting to Primary-700 text on an Accent-100 background
 * on hover and active states.
 */
export const ManagementShell: Story = {
  render: () => <ManagementShellLayout />,
};
