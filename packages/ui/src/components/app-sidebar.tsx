"use client";

import * as React from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Cancel01Icon,
  ChevronDoubleCloseIcon,
  Logout01Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FadingScrollList } from "@/components/ui/fading-scroll-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
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
} from "@/components/ui/sidebar";
import { SidebarNavIcon } from "@/components/ui/sidebar-nav-icon";
import { cn, iconStroke } from "@/lib/utils";

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
  icon?: IconSvgElement;
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
  icon?: IconSvgElement;
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
  icon?: IconSvgElement;
  highlight?: boolean;
};

export type NavGroup = {
  label: string;
  items: CollapsibleNavItem[];
  maxVisible?: number;
};

/** Props for an SPA nav link (e.g. `react-router-dom` `Link` uses `to`). */
export type AppSidebarNavLinkProps = {
  to: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export type AppSidebarNavLinkComponent = React.ComponentType<
  AppSidebarNavLinkProps & React.RefAttributes<HTMLAnchorElement>
>;

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
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
  /**
   * Client-side navigation for `navItems` / groups / secondary / projects links.
   * Pass e.g. `Link` from `react-router-dom` to avoid full page reloads on in-app routes.
   */
  NavLink?: AppSidebarNavLinkComponent;
};

// ---------------------------------------------------------------------------
// Nav link (SPA vs full document navigation)
// ---------------------------------------------------------------------------

function SidebarNavLink({
  NavLink,
  to,
  className,
  children,
  onClick,
}: {
  NavLink?: AppSidebarNavLinkComponent;
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  if (NavLink) {
    return (
      <NavLink to={to} className={className} onClick={onClick}>
        {children}
      </NavLink>
    );
  }
  return (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// MobileCloseButton
// ---------------------------------------------------------------------------

function MobileCloseButton() {
  const { isMobile, setOpenMobile } = useSidebar();
  if (!isMobile) return null;
  return (
    <button
      type="button"
      aria-label="Close menu"
      onClick={() => setOpenMobile(false)}
      className="flex size-9 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <HugeiconsIcon icon={Cancel01Icon as IconSvgElement} size={20} strokeWidth={iconStroke(20)} />
    </button>
  );
}

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
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-sidebar p-micro text-sidebar-foreground *:text-inherit!">
        {activeWorkspace.logo}
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate text-xs font-semibold text-primary">{activeWorkspace.name}</span>
        <span className="truncate text-xs text-muted-foreground">{activeWorkspace.plan}</span>
      </div>
      {!isSingleWorkspace && (
        <HugeiconsIcon
          icon={ChevronDoubleCloseIcon as IconSvgElement}
          size={16}
          strokeWidth={iconStroke(16)}
          className="ml-auto rotate-90"
        />
      )}
    </SidebarMenuButton>
  );

  if (isSingleWorkspace) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>{header}</SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const renderWorkspaceRow = (workspace: Workspace) => (
    <>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border bg-sidebar p-micro text-sidebar-foreground *:text-inherit!">
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
    </>
  );

  if (isMobile) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Drawer>
            <DrawerTrigger asChild>{header}</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Switch workspace</DrawerTitle>
                <DrawerDescription>
                  Choose the workspace you want to navigate.
                </DrawerDescription>
              </DrawerHeader>
              <FadingScrollList
                maxHeight="calc(4.5 * (36px + var(--spacing-component) * 2) + 4 * var(--spacing-micro))"
                fadeColor="from-popover"
                className="gap-micro p-component pb-component"
              >
                {workspaces.map((workspace) => {
                  const isActive = workspace.id === activeWorkspaceId;
                  return (
                    <button
                      key={workspace.id}
                      type="button"
                      onClick={() => onWorkspaceChange?.(workspace.id)}
                      className={cn(
                        "flex w-full items-center gap-component rounded-md p-component text-left transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                      )}
                    >
                      {renderWorkspaceRow(workspace)}
                    </button>
                  );
                })}
              </FadingScrollList>
            </DrawerContent>
          </Drawer>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{header}</DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 border border-border bg-sidebar p-0 text-sidebar-foreground ring-0"
            side="right"
            align="start"
            sideOffset={6}
          >
            <FadingScrollList
              maxHeight="calc(4.5 * (36px + var(--spacing-component) * 2) + 4 * var(--spacing-micro))"
              fadeColor="from-sidebar"
              className="gap-micro p-micro"
            >
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  className={cn(
                    "gap-component p-component focus:bg-sidebar-accent focus:text-sidebar-accent-foreground",
                    workspace.id === activeWorkspaceId &&
                      "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                  onClick={() => onWorkspaceChange?.(workspace.id)}
                >
                  {renderWorkspaceRow(workspace)}
                </DropdownMenuItem>
              ))}
            </FadingScrollList>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// ---------------------------------------------------------------------------
// NavSearch
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
              <HugeiconsIcon
                icon={Search01Icon as IconSvgElement}
                size={16}
                strokeWidth={iconStroke(16)}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ---------------------------------------------------------------------------
// NavPrimary
// ---------------------------------------------------------------------------

function NavPrimary({
  items,
  className,
  NavLink,
}: {
  items: NavItem[];
  className?: string;
  NavLink?: AppSidebarNavLinkComponent;
}) {
  return (
    <SidebarGroup className={`py-0! ${className ?? ""}`}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                <SidebarNavLink NavLink={NavLink} to={item.url}>
                  {item.icon && <SidebarNavIcon icon={item.icon} />}
                  <span>{item.title}</span>
                </SidebarNavLink>
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
// NavCollapsible
// ---------------------------------------------------------------------------

function NavCollapsible({
  items,
  label = "Navigation",
  maxVisible,
  NavLink,
}: {
  items: CollapsibleNavItem[];
  label?: string;
  maxVisible?: number;
  NavLink?: AppSidebarNavLinkComponent;
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
                    {item.icon && <SidebarNavIcon icon={item.icon} />}
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
                          <SidebarNavLink NavLink={NavLink} to={subItem.url}>
                            <span>{subItem.title}</span>
                          </SidebarNavLink>
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
                <SidebarNavLink NavLink={NavLink} to={item.url}>
                  {item.icon && <SidebarNavIcon icon={item.icon} />}
                  <span>{item.title}</span>
                </SidebarNavLink>
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

// ---------------------------------------------------------------------------
// NavProjects
// ---------------------------------------------------------------------------

function NavProjects({
  items,
  label = "Projects",
  onAdd,
  NavLink,
}: {
  items: ProjectItem[];
  label?: string;
  onAdd?: () => void;
  NavLink?: AppSidebarNavLinkComponent;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.isActive}>
              <SidebarNavLink NavLink={NavLink} to={item.url}>
                <span className={`size-2.5 shrink-0 rounded-full ${item.color}`} />
                <span>{item.title}</span>
              </SidebarNavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {onAdd && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70" onClick={onAdd}>
              <HugeiconsIcon
                icon={PlusSignIcon as IconSvgElement}
                size={16}
                strokeWidth={iconStroke(16)}
                className="text-sidebar-foreground/70"
              />
              <span>Add new project</span>
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
  NavLink,
  ...props
}: { items: NavItem[]; NavLink?: AppSidebarNavLinkComponent } & React.ComponentProps<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <SidebarNavLink NavLink={NavLink} to={item.url}>
                  {item.icon && <SidebarNavIcon icon={item.icon} />}
                  <span>{item.title}</span>
                </SidebarNavLink>
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
              <HugeiconsIcon
                icon={ChevronDoubleCloseIcon as IconSvgElement}
                size={16}
                strokeWidth={iconStroke(16)}
                className="ml-auto rotate-90"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-sidebar text-sidebar-foreground"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="flex items-center gap-micro px-micro py-1.5 text-left text-sm">
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
                      ? "bg-success text-success-foreground focus:bg-success focus:text-success-foreground"
                      : undefined
                  }
                >
                  {item.highlight && (
                    <span className="size-2 shrink-0 rounded-full bg-[var(--sys-success-500)]" />
                  )}
                  {item.icon && <SidebarNavIcon icon={item.icon} />}
                  <span>{item.title}</span>
                </DropdownMenuItem>
                {index === menuItems.length - 1 && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={Logout01Icon as IconSvgElement}
                size={16}
                strokeWidth={iconStroke(16)}
              />
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

function AppSidebar({
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
  NavLink,
  ...sidebarProps
}: AppSidebarProps) {
  return (
    <>
      <style>{`
        /* App-level: tint the sheet overlay behind the mobile sidebar so the
           background page is muted but still visible. */
        [data-slot="sidebar"][data-mobile="true"] + [data-slot="sheet-overlay"],
        [data-slot="sidebar"][data-mobile="true"] ~ [data-slot="sheet-overlay"],
        [data-slot="sheet-overlay"]:has(~ [data-slot="sidebar"][data-mobile="true"]) {
          background: rgb(0 0 0 / 0.10) !important;
          backdrop-filter: blur(1px) !important;
          -webkit-backdrop-filter: blur(1px) !important;
        }
      `}</style>
      <Sidebar
        collapsible="offcanvas"
        className="border-none [&_[data-slot=sidebar-inner]]:p-component [&_[data-slot=sidebar-group]]:p-micro [&_[data-slot=sidebar-header]]:p-micro [&_[data-slot=sidebar-footer]]:p-micro [&_[data-slot=sidebar-content]]:mt-0 [&_[data-slot=sidebar-content]]:gap-component [&_[data-slot=sidebar-menu-sub]]:mr-0 [&_[data-slot=sidebar-menu-sub]]:pr-0 [&_[data-slot=sidebar-menu-sub]]:overflow-hidden [&_[data-slot=sidebar-menu-sub]]:py-1 [&_[data-slot=sidebar-menu-sub]]:border-l-0 [&_[data-slot=sidebar-menu-sub]]:relative [&_[data-slot=sidebar-menu-sub]]:before:absolute [&_[data-slot=sidebar-menu-sub]]:before:left-0 [&_[data-slot=sidebar-menu-sub]]:before:top-1 [&_[data-slot=sidebar-menu-sub]]:before:bottom-1 [&_[data-slot=sidebar-menu-sub]]:before:w-px [&_[data-slot=sidebar-menu-sub]]:before:bg-sidebar-border [&_[data-slot=sidebar-menu-sub]]:rounded-r-md [&_[data-slot=sidebar-menu]]:gap-1! [&_[data-slot=sidebar-menu-button]>span]:truncate [&_[data-slot=sidebar-menu-button]>a>span]:truncate max-lg:[&_[data-slot=sidebar-menu-sub-button]]:!pr-3 max-lg:[&_[data-slot=sidebar-menu-sub]]:!pr-0 max-lg:[&_[data-slot=sidebar-menu-sub]]:!mr-0 max-lg:[&_[data-slot=sidebar-menu-sub]]:!gap-1 max-lg:[&_[data-slot=sidebar-menu]]:!gap-1"
        {...sidebarProps}
      >
        <SidebarHeader>
          <div className="flex items-start gap-component">
            <div className="flex-1 min-w-0">
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
            </div>
            <MobileCloseButton />
          </div>
        </SidebarHeader>

        {showSearch && <NavSearch />}

        {stickyNav && (
          <NavPrimary
            NavLink={NavLink}
            items={navItems}
            className={showSearch ? "mb-section" : "mt-micro mb-section"}
          />
        )}

        <ScrollFade>
          {!stickyNav && <NavPrimary NavLink={NavLink} items={navItems} className="mt-micro mb-section" />}

          {navGroups.map((group) => (
            <NavCollapsible
              key={group.label}
              NavLink={NavLink}
              items={group.items}
              label={group.label}
              maxVisible={group.maxVisible}
            />
          ))}

          {projects.length > 0 && (
            <NavProjects NavLink={NavLink} items={projects} label={projectsLabel} onAdd={onAddProject} />
          )}
        </ScrollFade>

        {secondaryItems.length > 0 && <NavSecondary NavLink={NavLink} items={secondaryItems} />}

        {user && (
          <SidebarFooter>
            <NavUser user={user} menuItems={userMenuItems} version={version} />
          </SidebarFooter>
        )}
      </Sidebar>
    </>
  );
}

export { AppSidebar };
