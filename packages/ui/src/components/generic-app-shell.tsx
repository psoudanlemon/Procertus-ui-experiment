"use client";

import * as React from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Cancel01Icon,
  Menu01Icon,
  MoreHorizontalIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarNavIcon } from "@/components/ui/sidebar-nav-icon";
import { Button } from "@/components/ui/button";
import { cn, iconStroke } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Navigation model (consumer-driven; no product copy in defaults)
// ---------------------------------------------------------------------------

export type GenericNavItem = {
  id: string;
  label: string;
  href?: string;
  onSelect?: () => void;
  isActive?: boolean;
  icon?: IconSvgElement;
  shortcut?: string;
  /** When set, renders as a collapsible group with sub-links. */
  children?: GenericNavItem[];
};

export type GenericNavGroup = {
  id: string;
  label: string;
  items: GenericNavItem[];
  maxVisible?: number;
};

// ---------------------------------------------------------------------------
// Mobile close (sheet)
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
// Search (optional)
// ---------------------------------------------------------------------------

function GenericSidebarSearch({
  placeholder,
  tooltip,
}: {
  placeholder: string;
  tooltip: string;
}) {
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
              <SidebarInput ref={searchRef} placeholder={placeholder} />
              <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </div>
            <SidebarMenuButton tooltip={tooltip} className="hidden group-data-[collapsible=icon]:flex">
              <HugeiconsIcon icon={Search01Icon as IconSvgElement} size={16} strokeWidth={iconStroke(16)} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ---------------------------------------------------------------------------
// Rows
// ---------------------------------------------------------------------------

function GenericNavLeafPrimary({ item }: { item: GenericNavItem }) {
  const badge = item.shortcut ? <SidebarMenuBadge>{item.shortcut}</SidebarMenuBadge> : null;

  if (item.href) {
    return (
      <>
        <SidebarMenuButton asChild tooltip={item.label} isActive={item.isActive}>
          <a href={item.href} onClick={() => item.onSelect?.()}>
            {item.icon ? <SidebarNavIcon icon={item.icon} /> : null}
            <span>{item.label}</span>
          </a>
        </SidebarMenuButton>
        {badge}
      </>
    );
  }

  return (
    <>
      <SidebarMenuButton
        type="button"
        tooltip={item.label}
        isActive={item.isActive}
        onClick={() => item.onSelect?.()}
      >
        {item.icon ? <SidebarNavIcon icon={item.icon} /> : null}
        <span>{item.label}</span>
      </SidebarMenuButton>
      {badge}
    </>
  );
}

function GenericNavSubLeaf({ item }: { item: GenericNavItem }) {
  if (item.href) {
    return (
      <SidebarMenuSubButton asChild isActive={item.isActive}>
        <a href={item.href} onClick={() => item.onSelect?.()}>
          <span>{item.label}</span>
        </a>
      </SidebarMenuSubButton>
    );
  }

  return (
    <SidebarMenuSubButton asChild isActive={item.isActive}>
      <button type="button" onClick={() => item.onSelect?.()}>
        <span>{item.label}</span>
      </button>
    </SidebarMenuSubButton>
  );
}

function GenericNavPrimary({
  items,
  className,
}: {
  items: GenericNavItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <SidebarGroup className={cn("py-0!", className)}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <GenericNavLeafPrimary item={item} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function GenericNavGroupSection({
  group,
  moreLabel,
  lessLabel,
}: {
  group: GenericNavGroup;
  moreLabel: string;
  lessLabel: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const visibleItems =
    group.maxVisible && !expanded ? group.items.slice(0, group.maxVisible) : group.items;
  const hasMore = group.maxVisible != null && group.items.length > group.maxVisible;

  const subtreeActive = (item: GenericNavItem): boolean =>
    Boolean(item.isActive) || Boolean(item.children?.some(subtreeActive));

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) =>
          item.children?.length ? (
            <Collapsible
              key={item.id}
              asChild
              defaultOpen={subtreeActive(item)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton type="button" tooltip={item.label} isActive={item.isActive}>
                    {item.icon ? <SidebarNavIcon icon={item.icon} /> : null}
                    <span>{item.label}</span>
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
                    {item.children.map((child) => (
                      <SidebarMenuSubItem key={child.id}>
                        <GenericNavSubLeaf item={child} />
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.id}>
              <GenericNavLeafPrimary item={item} />
            </SidebarMenuItem>
          ),
        )}
        {hasMore ? (
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              className="text-sidebar-foreground/70"
              onClick={() => setExpanded(!expanded)}
            >
              <HugeiconsIcon
                icon={MoreHorizontalIcon as IconSvgElement}
                size={16}
                strokeWidth={iconStroke(16)}
                className="text-sidebar-foreground/70"
              />
              <span>{expanded ? lessLabel : moreLabel}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : null}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function GenericNavSecondary({
  items,
  ...props
}: { items: GenericNavItem[] } & React.ComponentProps<typeof SidebarGroup>) {
  if (items.length === 0) return null;

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <GenericNavLeafPrimary item={item} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

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

const GENERIC_SIDEBAR_LAYOUT_CLASS =
  "border-none [&_[data-slot=sidebar-inner]]:p-component [&_[data-slot=sidebar-group]]:p-micro [&_[data-slot=sidebar-header]]:p-micro [&_[data-slot=sidebar-footer]]:p-micro [&_[data-slot=sidebar-content]]:mt-0 [&_[data-slot=sidebar-content]]:gap-component [&_[data-slot=sidebar-menu-sub]]:mr-0 [&_[data-slot=sidebar-menu-sub]]:pr-0 [&_[data-slot=sidebar-menu-sub]]:overflow-hidden [&_[data-slot=sidebar-menu-sub]]:py-1 [&_[data-slot=sidebar-menu-sub]]:border-l-0 [&_[data-slot=sidebar-menu-sub]]:relative [&_[data-slot=sidebar-menu-sub]]:before:absolute [&_[data-slot=sidebar-menu-sub]]:before:left-0 [&_[data-slot=sidebar-menu-sub]]:before:top-1 [&_[data-slot=sidebar-menu-sub]]:before:bottom-1 [&_[data-slot=sidebar-menu-sub]]:before:w-px [&_[data-slot=sidebar-menu-sub]]:before:bg-sidebar-border [&_[data-slot=sidebar-menu-sub]]:rounded-r-md [&_[data-slot=sidebar-menu]]:gap-1! [&_[data-slot=sidebar-menu-button]>span]:truncate [&_[data-slot=sidebar-menu-button]>a>span]:truncate max-lg:[&_[data-slot=sidebar-menu-sub-button]]:!pr-3 max-lg:[&_[data-slot=sidebar-menu-sub]]:!pr-0 max-lg:[&_[data-slot=sidebar-menu-sub]]:!mr-0 max-lg:[&_[data-slot=sidebar-menu-sub]]:!gap-1 max-lg:[&_[data-slot=sidebar-menu]]:!gap-1";

export type GenericAppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  /** Top of the sidebar (brand, workspace switcher, etc.). */
  sidebarHeader?: React.ReactNode;
  /** Bottom region (e.g. user menu). */
  sidebarFooter?: React.ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchTooltip?: string;
  stickyPrimaryNav?: boolean;
  primaryNavItems?: GenericNavItem[];
  navGroups?: GenericNavGroup[];
  secondaryNavItems?: GenericNavItem[];
  /** Labels for the “show all” control when `maxVisible` is set on a group. */
  moreLabel?: string;
  lessLabel?: string;
  /** Passed to the root `Sidebar` as `aria-label` (landmark for assistive tech). */
  sidebarAriaLabel?: string;
};

function GenericAppSidebar({
  sidebarHeader,
  sidebarFooter,
  showSearch = false,
  searchPlaceholder = "",
  searchTooltip = "Search",
  stickyPrimaryNav = false,
  primaryNavItems = [],
  navGroups = [],
  secondaryNavItems = [],
  moreLabel = "More",
  lessLabel = "Less",
  sidebarAriaLabel,
  ...sidebarProps
}: GenericAppSidebarProps) {
  return (
    <>
      <style>{`
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
        aria-label={sidebarAriaLabel}
        className={GENERIC_SIDEBAR_LAYOUT_CLASS}
        {...sidebarProps}
      >
        <SidebarHeader>
          <div className="flex items-start gap-component">
            <div className="min-w-0 flex-1">{sidebarHeader}</div>
            <MobileCloseButton />
          </div>
        </SidebarHeader>

        {showSearch ? (
          <GenericSidebarSearch placeholder={searchPlaceholder} tooltip={searchTooltip} />
        ) : null}

        {stickyPrimaryNav ? (
          <GenericNavPrimary
            items={primaryNavItems}
            className={showSearch ? "mb-section" : "mt-micro mb-section"}
          />
        ) : null}

        <ScrollFade>
          {!stickyPrimaryNav ? (
            <GenericNavPrimary items={primaryNavItems} className="mt-micro mb-section" />
          ) : null}

          {navGroups.map((group) => (
            <GenericNavGroupSection
              key={group.id}
              group={group}
              moreLabel={moreLabel}
              lessLabel={lessLabel}
            />
          ))}
        </ScrollFade>

        {secondaryNavItems.length > 0 ? <GenericNavSecondary items={secondaryNavItems} /> : null}

        {sidebarFooter ? <SidebarFooter>{sidebarFooter}</SidebarFooter> : null}
      </Sidebar>
    </>
  );
}

// ---------------------------------------------------------------------------
// Header (slots only — no breadcrumbs or user chrome)
// ---------------------------------------------------------------------------

export type GenericAppHeaderProps = {
  lead?: React.ReactNode;
  center?: React.ReactNode;
  trail?: React.ReactNode;
  className?: string;
};

function GenericAppHeader({ lead, center, trail, className }: GenericAppHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <header
      data-slot="generic-app-header"
      className={cn(
        "shrink-0 bg-sidebar px-component pt-component pb-component",
        className,
      )}
    >
      <div className="flex h-[56px] items-center gap-micro px-component lg:gap-component">
        <SidebarTrigger className="hidden min-h-11 min-w-11 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:inline-flex lg:min-h-0 lg:min-w-0" />
        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          className="min-h-11 min-w-11 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
          onClick={() => toggleSidebar()}
        >
          <HugeiconsIcon icon={Menu01Icon} />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        {lead}
        <div className="min-w-0 flex-1">{center}</div>
        {trail}
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

export type GenericAppShellProps = {
  sidebarProps: GenericAppSidebarProps;
  header?: React.ReactNode;
  children: React.ReactNode;
};

function GenericAppShell({ sidebarProps, header, children }: GenericAppShellProps) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (!header) return;
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [header]);

  return (
    <SidebarProvider>
      <GenericAppSidebar {...sidebarProps} />
      <div className="flex min-h-svh flex-1 flex-col bg-sidebar">
        {header ? (
          <div className="sticky top-0 z-20 bg-sidebar">
            {header}
            <div
              className="pointer-events-none mx-section -mb-8 h-8 bg-linear-to-b from-sidebar to-transparent transition-opacity duration-200"
              style={{ opacity: scrolled ? 1 : 0 }}
            />
          </div>
        ) : null}
        <div className="mx-section flex flex-1 flex-col pb-section">
          <main className="flex-1 rounded-xl bg-background p-boundary">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export { GenericAppShell, GenericAppSidebar, GenericAppHeader };
