"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import {
  CheckIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@procertus-ui/ui";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Workspace = {
  id: string;
  name: string;
  logo: React.ReactNode;
  plan: string;
  memberCount?: number;
};

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  shortcut?: string;
};

export type ProjectItem = {
  title: string;
  url: string;
  color: string;
  isActive?: boolean;
};

export type CollapsibleNavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string; isActive?: boolean }[];
};

export type UserInfo = {
  name: string;
  email: string;
  avatar?: string;
};

export type UserMenuItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  highlight?: boolean;
};

export type NavGroup = {
  label: string;
  items: CollapsibleNavItem[];
  maxVisible?: number;
};

export type ManagementSidebarProps = React.ComponentProps<typeof Sidebar> & {
  workspaces?: Workspace[];
  activeWorkspaceId?: string;
  onWorkspaceChange?: (id: string) => void;
  /** Show the search input below the header. */
  showSearch?: boolean;
  /** Keep the primary nav items fixed above the scroll area. */
  stickyNav?: boolean;
  navItems: NavItem[];
  navGroups?: NavGroup[];
  projects?: ProjectItem[];
  projectsLabel?: string;
  onAddProject?: () => void;
  secondaryItems?: NavItem[];
  user?: UserInfo;
  userMenuItems?: UserMenuItem[];
  version?: string;
};

// ---------------------------------------------------------------------------
// WorkspaceSwitcher
// ---------------------------------------------------------------------------

function WorkspaceSwitcher({
  workspaces = [],
  activeWorkspaceId,
  onWorkspaceChange,
}: {
  workspaces: Workspace[];
  activeWorkspaceId?: string;
  onWorkspaceChange?: (id: string) => void;
}) {
  const { isMobile } = useSidebar();
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0];

  if (!activeWorkspace) return null;

  const isSingleWorkspace = workspaces.length <= 1;

  const header = (
    <SidebarMenuButton
      size="lg"
      className={
        isSingleWorkspace
          ? ""
          : "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      }
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground! *:text-inherit!">
        {activeWorkspace.logo}
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{activeWorkspace.name}</span>
        <span className="truncate text-xs text-muted-foreground">{activeWorkspace.plan}</span>
      </div>
      {!isSingleWorkspace && <ChevronsUpDownIcon className="ml-auto size-4" />}
    </SidebarMenuButton>
  );

  if (isSingleWorkspace) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>{header}</SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{header}</DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-sidebar text-sidebar-foreground"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={6}
          >
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                className="gap-2 p-2"
                onClick={() => onWorkspaceChange?.(workspace.id)}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground! *:text-inherit!">
                  {workspace.logo}
                </div>
                <div className="grid flex-1 text-sm leading-tight">
                  <span className="truncate font-medium">{workspace.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {workspace.plan}
                    {workspace.memberCount != null &&
                      ` · ${workspace.memberCount} member${workspace.memberCount !== 1 ? "s" : ""}`}
                  </span>
                </div>
                {workspace.id === activeWorkspaceId && <CheckIcon className="ml-auto size-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// ---------------------------------------------------------------------------
// NavMain
// ---------------------------------------------------------------------------

function NavSearch() {
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SidebarGroup className="pt-0.5! pb-1.5!">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="relative group-data-[collapsible=icon]:hidden">
              <SidebarInput ref={searchRef} placeholder="Search" />
              <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </div>
            <SidebarMenuButton
              tooltip="Search"
              className="hidden group-data-[collapsible=icon]:flex"
            >
              <SearchIcon />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function NavPrimary({ items, className }: { items: NavItem[]; className?: string }) {
  return (
    <SidebarGroup className={`py-0! ${className ?? ""}`}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                <a href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.shortcut && <SidebarMenuBadge>{item.shortcut}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ---------------------------------------------------------------------------
// NavShared
// ---------------------------------------------------------------------------

function NavCollapsible({
  items,
  label = "Navigation",
  maxVisible,
}: {
  items: CollapsibleNavItem[];
  label?: string;
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
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                  {item.icon && <item.icon />}
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
              <MoreHorizontalIcon className="text-sidebar-foreground/70" />
              <span>{expanded ? "Less" : "More"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// ---------------------------------------------------------------------------
// NavProjects
// ---------------------------------------------------------------------------

function NavProjects({
  items,
  label = "Projects",
  onAdd,
}: {
  items: ProjectItem[];
  label?: string;
  onAdd?: () => void;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.isActive}>
              <a href={item.url}>
                <span className={`size-2.5 shrink-0 rounded-full ${item.color}`} />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {onAdd && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70" onClick={onAdd}>
              <PlusIcon className="text-sidebar-foreground/70" />
              <span>Add New Project</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// ---------------------------------------------------------------------------
// NavSecondary
// ---------------------------------------------------------------------------

function NavSecondary({
  items,
  ...props
}: { items: NavItem[] } & React.ComponentProps<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  {item.icon && <item.icon />}
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

// ---------------------------------------------------------------------------
// NavUser
// ---------------------------------------------------------------------------

function NavUser({
  user,
  menuItems = [],
  version,
}: {
  user: UserInfo;
  menuItems?: UserMenuItem[];
  version?: string;
}) {
  const { isMobile } = useSidebar();

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
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
                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            {menuItems.map((item, index) => (
              <React.Fragment key={item.title}>
                <DropdownMenuItem
                  className={
                    item.highlight
                      ? "bg-emerald-50 text-emerald-600 focus:bg-emerald-100 focus:text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:focus:bg-emerald-950/50"
                      : undefined
                  }
                >
                  {item.highlight && (
                    <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
                  )}
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </DropdownMenuItem>
                {index === menuItems.length - 1 && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
            <DropdownMenuItem>
              <LogOutIcon />
              <span>Log out</span>
            </DropdownMenuItem>
            {version && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs text-muted-foreground">{version}</div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// ---------------------------------------------------------------------------
// ScrollFade
// ---------------------------------------------------------------------------

function ScrollFade({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = React.useState(false);
  const [canScrollDown, setCanScrollDown] = React.useState(false);

  const updateScroll = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateScroll();
    el.addEventListener("scroll", updateScroll, { passive: true });
    const observer = new ResizeObserver(updateScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      observer.disconnect();
    };
  }, [updateScroll]);

  const mask =
    canScrollUp && canScrollDown
      ? "linear-gradient(to bottom, transparent, black 24px, black calc(100% - 24px), transparent)"
      : canScrollUp
        ? "linear-gradient(to bottom, transparent, black 24px)"
        : canScrollDown
          ? "linear-gradient(to bottom, black calc(100% - 24px), transparent)"
          : "none";

  return (
    <SidebarContent ref={ref} style={{ maskImage: mask, WebkitMaskImage: mask }}>
      {children}
    </SidebarContent>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function ManagementSidebar({
  workspaces = [],
  activeWorkspaceId,
  onWorkspaceChange,
  showSearch = true,
  stickyNav = false,
  navItems,
  navGroups = [],
  projects = [],
  projectsLabel = "Projects",
  onAddProject,
  secondaryItems = [],
  user,
  userMenuItems = [],
  version,
  ...sidebarProps
}: ManagementSidebarProps) {
  return (
    <>
      <style>{`
        /* Mobile Sheet: no border, blurred overlay */
        [data-slot="sidebar"][data-mobile="true"] {
          border: none !important;
        }
        [data-slot="sidebar"][data-mobile="true"] + [data-slot="sheet-overlay"],
        [data-slot="sidebar"][data-mobile="true"] ~ [data-slot="sheet-overlay"],
        [data-slot="sheet-overlay"]:has(~ [data-slot="sidebar"][data-mobile="true"]) {
          background: rgba(0, 0, 0, 0.25) !important;
          backdrop-filter: blur(4px) !important;
          -webkit-backdrop-filter: blur(4px) !important;
        }

        /* Mobile touch targets (Sheet portal) */
        [data-slot="sidebar"][data-mobile="true"] [data-slot="sidebar-menu-button"],
        [data-slot="sidebar"][data-mobile="true"] [data-slot="sidebar-menu-sub-button"] {
          height: 44px !important;
          padding-top: 10px !important;
          padding-bottom: 10px !important;
        }
        [data-slot="sidebar"][data-mobile="true"] [data-slot="collapsible-trigger"] {
          height: 44px !important;
        }
        [data-slot="sidebar"][data-mobile="true"] [data-slot="sidebar-menu-sub-button"] {
          padding-right: 12px !important;
        }
        [data-slot="sidebar"][data-mobile="true"] [data-slot="sidebar-menu-sub"],
        [data-slot="sidebar"][data-mobile="true"] [data-slot="sidebar-menu"] {
          gap: 4px !important;
        }
        [data-slot="sidebar"][data-mobile="true"] [data-slot="sidebar-menu-sub"] {
          padding-right: 0 !important;
          margin-right: 0 !important;
        }
      `}</style>
      <Sidebar
        collapsible="offcanvas"
        className="border-none [&_[data-slot=sidebar-inner]]:p-2 [&_[data-slot=sidebar-group]]:p-1 [&_[data-slot=sidebar-header]]:p-1 [&_[data-slot=sidebar-footer]]:p-1 [&_[data-slot=sidebar-content]]:mt-0 [&_[data-slot=sidebar-content]]:gap-3 [&_[data-slot=sidebar-menu-sub]]:mr-0 [&_[data-slot=sidebar-menu-sub]]:pr-0 [&_[data-slot=sidebar-menu-sub]]:overflow-hidden [&_[data-slot=sidebar-menu-sub]]:py-1 [&_[data-slot=sidebar-menu-sub]]:border-l-0 [&_[data-slot=sidebar-menu-sub]]:relative [&_[data-slot=sidebar-menu-sub]]:before:absolute [&_[data-slot=sidebar-menu-sub]]:before:left-0 [&_[data-slot=sidebar-menu-sub]]:before:top-1 [&_[data-slot=sidebar-menu-sub]]:before:bottom-1 [&_[data-slot=sidebar-menu-sub]]:before:w-px [&_[data-slot=sidebar-menu-sub]]:before:bg-sidebar-border [&_[data-slot=sidebar-menu-sub]]:rounded-r-md [&_[data-slot=sidebar-menu]]:gap-1! [&_[data-slot=sidebar-menu-button]>span]:truncate [&_[data-slot=sidebar-menu-button]>a>span]:truncate max-lg:[&_[data-slot=sidebar-menu-button]:not([data-size=lg])]:!h-11 max-lg:[&_[data-slot=sidebar-menu-button]:not([data-size=lg])]:!py-2.5 max-lg:[&_[data-slot=collapsible-trigger]]:!h-11 max-lg:[&_[data-slot=sidebar-menu-sub-button]]:!h-11 max-lg:[&_[data-slot=sidebar-menu-sub-button]]:!py-2.5 max-lg:[&_[data-slot=sidebar-menu-sub-button]]:!pr-3  max-lg:[&_[data-slot=sidebar-menu-sub]]:!pr-0 max-lg:[&_[data-slot=sidebar-menu-sub]]:!mr-0 max-lg:[&_[data-slot=sidebar-menu-sub]]:!gap-1 max-lg:[&_[data-slot=sidebar-menu]]:!gap-1"
        {...sidebarProps}
      >
        <SidebarHeader>
          {workspaces.length > 0 ? (
            <WorkspaceSwitcher
              workspaces={workspaces}
              activeWorkspaceId={activeWorkspaceId}
              onWorkspaceChange={onWorkspaceChange}
            />
          ) : (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="data-[slot=sidebar-menu-button]:p-1.5!">
                  <span className="text-base font-semibold">PROCERTUS</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarHeader>

        {showSearch && <NavSearch />}

        {stickyNav && <NavPrimary items={navItems} className={showSearch ? "mb-5" : "mt-3 mb-5"} />}

        <ScrollFade>
          {!stickyNav && <NavPrimary items={navItems} className="mt-3 mb-5" />}

          {navGroups.map((group) => (
            <NavCollapsible
              key={group.label}
              items={group.items}
              label={group.label}
              maxVisible={group.maxVisible}
            />
          ))}

          {projects.length > 0 && (
            <NavProjects items={projects} label={projectsLabel} onAdd={onAddProject} />
          )}
        </ScrollFade>

        {secondaryItems.length > 0 && <NavSecondary items={secondaryItems} />}

        {user && (
          <SidebarFooter>
            <NavUser user={user} menuItems={userMenuItems} version={version} />
          </SidebarFooter>
        )}
      </Sidebar>
    </>
  );
}

export { ManagementSidebar };
