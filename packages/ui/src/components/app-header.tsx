"use client";

import * as React from "react";
import type { AppSidebarNavLinkComponent } from "@/components/app-sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Tick02Icon,
  ArrowDown01Icon,
  Building02Icon,
  CubeIcon,
  GlobeIcon,
  Logout01Icon,
  Menu01Icon,
  Search01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const TABLET_BREAKPOINT = 1024;

function useIsTabletOrBelow() {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    setMatches(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return matches;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BreadcrumbEntry = {
  label: string;
  href?: string;
};

export type HeaderUserInfo = {
  name?: string;
  email: string;
  role?: string;
  avatar?: string;
  /** Override the computed initials shown when no avatar image is present. */
  avatarFallback?: React.ReactNode;
  /** When set, a profile entry is shown in the user menu (uses `NavLink` when provided on the header). */
  profileHref?: string;
  profileLabel?: string;
  /** Active organization / tenant shown in the user menu. */
  company?: {
    name: string;
    description?: string;
    /** SPA link to the organization profile page. */
    organizationProfileHref?: string;
    organizationProfileLabel?: string;
    /** When more than one organization exists, show a switcher (e.g. radio group). */
    organizationSwitcher?: {
      organizations: { id: string; name: string }[];
      activeOrganizationId: string;
      onSelectOrganization: (organizationId: string) => void;
    };
  };
};

export type AppHeaderProps = {
  breadcrumbs?: BreadcrumbEntry[];
  showNavigation?: boolean;
  showSearch?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  user?: HeaderUserInfo;
  version?: string;
  /** When set, invoked from the user menu “Log out” action (desktop and mobile). */
  onSignOut?: () => void;
  /**
   * Client-side navigation for breadcrumb links (e.g. `Link` from `react-router-dom`).
   * When set, `href` values are passed as `to` on this component instead of using a full document navigation.
   */
  NavLink?: AppSidebarNavLinkComponent;
};

// ---------------------------------------------------------------------------
// Breadcrumb leaf (SPA vs `<a href>`)
// ---------------------------------------------------------------------------

function HeaderBreadcrumbLeaf({
  NavLink,
  href,
  children,
}: {
  NavLink?: AppSidebarNavLinkComponent;
  href: string;
  children: React.ReactNode;
}) {
  if (NavLink) {
    return (
      <BreadcrumbLink asChild>
        <NavLink to={href}>{children}</NavLink>
      </BreadcrumbLink>
    );
  }
  return <BreadcrumbLink href={href}>{children}</BreadcrumbLink>;
}

// ---------------------------------------------------------------------------
// Picker wheel
// ---------------------------------------------------------------------------

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 3;

function PickerWheel({
  items,
  selectedIndex,
  onSelect,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const isScrollingRef = React.useRef(false);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = selectedIndex * ITEM_HEIGHT;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    isScrollingRef.current = true;
    const index = Math.round(el.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    if (clamped !== selectedIndex) onSelect(clamped);
  };

  const scrollTo = (index: number) => {
    scrollRef.current?.scrollTo({ top: index * ITEM_HEIGHT, behavior: "smooth" });
  };

  const pad = Math.floor(VISIBLE_ITEMS / 2);

  return (
    <div className="relative mx-component" style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
      <div
        className="pointer-events-none absolute inset-x-0 rounded-lg bg-accent"
        style={{ top: pad * ITEM_HEIGHT, height: ITEM_HEIGHT }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-popover to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-popover to-transparent" />
      <div
        ref={scrollRef}
        className="relative z-10 size-full overflow-y-auto overscroll-contain"
        style={{
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
        }}
        onScroll={handleScroll}
      >
        <div style={{ height: pad * ITEM_HEIGHT }} />
        {items.map((label, index) => (
          <div
            key={`${label}-${index}`}
            className={cn(
              "flex items-center justify-center text-sm font-medium transition-colors",
              selectedIndex === index ? "text-accent-foreground" : "text-muted-foreground",
            )}
            style={{ height: ITEM_HEIGHT, scrollSnapAlign: "start" }}
            onClick={() => scrollTo(index)}
          >
            {label}
          </div>
        ))}
        <div style={{ height: pad * ITEM_HEIGHT }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function AppHeader({
  breadcrumbs = [],
  showNavigation = true,
  showSearch = false,
  onBack,
  onForward,
  canGoBack = false,
  canGoForward = false,
  user,
  version,
  onSignOut,
  NavLink,
}: AppHeaderProps) {
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!showSearch) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSearch]);
  const { toggleSidebar } = useSidebar();
  const isMobileOrTablet = useIsTabletOrBelow();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [breadcrumbDrawerOpen, setBreadcrumbDrawerOpen] = React.useState(false);
  const defaultCrumbIndex = Math.max(0, breadcrumbs.length - 2);
  const [selectedCrumbIndex, setSelectedCrumbIndex] = React.useState<number>(defaultCrumbIndex);

  const initials = user?.name
    ? user.name.split(" ").length === 1 && Array.from(user.name).length <= 2
      ? user.name
      : user.name
          .split(" ")
          .map((n) => Array.from(n)[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "");

  return (
    <header
      data-slot="app-header"
      className="shrink-0 bg-sidebar px-component pt-component pb-component"
    >
      <div className="flex h-[56px] items-center gap-micro lg:gap-component px-component">
        <SidebarTrigger className="hidden md:inline-flex lg:min-h-0 lg:min-w-0 min-h-11 min-w-11 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden min-h-11 min-w-11 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => toggleSidebar()}
        >
          <HugeiconsIcon icon={Menu01Icon} />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        {showNavigation && (
          <>
            <Separator
              orientation="vertical"
              className="mx-0.5 !h-5 !self-center hidden lg:block"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!canGoBack}
              onClick={onBack}
              className="hidden lg:inline-flex hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} />
              <span className="sr-only">Go back</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!canGoForward}
              onClick={onForward}
              className="hidden lg:inline-flex hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} />
              <span className="sr-only">Go forward</span>
            </Button>
          </>
        )}

        {breadcrumbs.length > 0 && (
          <>
            {showNavigation && (
              <Separator
                orientation="vertical"
                className="mx-0.5 !h-5 !self-center hidden lg:block"
              />
            )}

            <Breadcrumb className="hidden lg:flex">
              <BreadcrumbList>
                {breadcrumbs.length <= 3 ? (
                  breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                      <React.Fragment key={`${crumb.label}-${index}`}>
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                          ) : (
                            <HeaderBreadcrumbLeaf NavLink={NavLink} href={crumb.href ?? "#"}>
                              {crumb.label}
                            </HeaderBreadcrumbLeaf>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <>
                    <BreadcrumbItem>
                      <HeaderBreadcrumbLeaf NavLink={NavLink} href={breadcrumbs[0]?.href ?? "#"}>
                        {breadcrumbs[0]?.label}
                      </HeaderBreadcrumbLeaf>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-micro text-sm">
                          {breadcrumbs[breadcrumbs.length - 2]?.label}
                          <HugeiconsIcon icon={ArrowDown01Icon} className="size-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {breadcrumbs.slice(1, -2).map((crumb, index) =>
                            NavLink ? (
                              <DropdownMenuItem key={`${crumb.label}-${index}`} asChild>
                                <NavLink to={crumb.href ?? "#"}>{crumb.label}</NavLink>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem key={`${crumb.label}-${index}`} asChild>
                                <a href={crumb.href ?? "#"}>{crumb.label}</a>
                              </DropdownMenuItem>
                            ),
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                      <BreadcrumbPage>{breadcrumbs[breadcrumbs.length - 1]?.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>

            <Breadcrumb className="lg:hidden ml-0.5 [&_[data-slot=breadcrumb-link]]:min-h-11 [&_[data-slot=breadcrumb-link]]:flex [&_[data-slot=breadcrumb-link]]:items-center [&_[data-slot=breadcrumb-page]]:min-h-11 [&_[data-slot=breadcrumb-page]]:flex [&_[data-slot=breadcrumb-page]]:items-center">
              <BreadcrumbList>
                {breadcrumbs.length > 1 && (
                  <>
                    <BreadcrumbItem>
                      {breadcrumbs.length > 2 ? (
                        <>
                          <button
                            type="button"
                            className="flex min-h-11 items-center gap-micro text-sm text-muted-foreground"
                            onClick={() => setBreadcrumbDrawerOpen(true)}
                          >
                            {breadcrumbs[breadcrumbs.length - 2]?.label}
                            <HugeiconsIcon icon={ArrowDown01Icon} className="size-3.5" />
                          </button>
                          <Drawer
                            open={breadcrumbDrawerOpen}
                            onOpenChange={(open) => {
                              setBreadcrumbDrawerOpen(open);
                              if (!open) setSelectedCrumbIndex(defaultCrumbIndex);
                            }}
                          >
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>Kies een bestemming</DrawerTitle>
                              </DrawerHeader>
                              {(() => {
                                const pickerCrumbs = breadcrumbs
                                  .slice(0, -1)
                                  .map((c, i) => ({ label: c.label, href: c.href, originalIndex: i }))
                                  .sort((a, b) => a.label.localeCompare(b.label));
                                const sortedSelectedIndex = pickerCrumbs.findIndex(
                                  (c) => c.originalIndex === selectedCrumbIndex,
                                );
                                return (
                                  <>
                                    <PickerWheel
                                      items={pickerCrumbs.map((c) => c.label)}
                                      selectedIndex={sortedSelectedIndex}
                                      onSelect={(i) =>
                                        setSelectedCrumbIndex(pickerCrumbs[i].originalIndex)
                                      }
                                    />
                                    <DrawerFooter>
                                      <Button asChild>
                                        {NavLink ? (
                                          <NavLink
                                            to={breadcrumbs[selectedCrumbIndex]?.href ?? "#"}
                                            onClick={() => setBreadcrumbDrawerOpen(false)}
                                          >
                                            Navigeer
                                          </NavLink>
                                        ) : (
                                          <a href={breadcrumbs[selectedCrumbIndex]?.href ?? "#"}>
                                            Navigeer
                                          </a>
                                        )}
                                      </Button>
                                    </DrawerFooter>
                                  </>
                                );
                              })()}
                            </DrawerContent>
                          </Drawer>
                        </>
                      ) : (
                        <HeaderBreadcrumbLeaf NavLink={NavLink} href={breadcrumbs[0]?.href ?? "#"}>
                          {breadcrumbs[0]?.label}
                        </HeaderBreadcrumbLeaf>
                      )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbs[breadcrumbs.length - 1]?.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </>
        )}

        {showSearch && (
          <div className="mx-auto hidden w-full max-w-sm lg:block">
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                ref={searchRef}
                placeholder="Search"
                className="h-8 pl-8 pr-12 bg-background! border-sidebar-border"
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </div>
        )}

        {user && (
          <div className="ml-auto flex items-center">
            {isMobileOrTablet ? (
              <Sheet open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <Button
                  variant="ghost"
                  className="relative size-9 min-h-11 min-w-11 rounded-full p-0 lg:min-h-0 lg:min-w-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  onClick={() => setUserMenuOpen(true)}
                >
                  <Avatar className="size-8 after:border-0">
                    {user.avatar && <AvatarImage src={user.avatar} alt={user.name ?? user.email} />}
                    <AvatarFallback className="bg-background">
                      {user.avatarFallback ?? initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                <SheetContent
                  side="right"
                  showCloseButton={false}
                  className="w-72 bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Account</SheetTitle>
                    <SheetDescription>Account menu</SheetDescription>
                  </SheetHeader>
                  <div className="flex h-full flex-col">
                    <div className="flex items-center gap-component px-component py-component">
                      <Avatar className="size-9">
                        {user.avatar && (
                          <AvatarImage src={user.avatar} alt={user.name ?? user.email} />
                        )}
                        <AvatarFallback>{user.avatarFallback ?? initials}</AvatarFallback>
                      </Avatar>
                      <div className="grid min-w-0 flex-1 text-sm leading-tight">
                        <span className="truncate font-medium">{user.email}</span>
                        {user.role && (
                          <span className="truncate text-xs text-sidebar-foreground/60">
                            {user.role}
                          </span>
                        )}
                        {user.company && (
                          <div className="mt-2 border-t border-sidebar-border pt-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-sidebar-foreground/50">
                              Organisatie
                            </span>
                            <span className="block truncate font-medium text-sidebar-foreground">
                              {user.company.name}
                            </span>
                            {user.company.description ? (
                              <span className="block truncate text-xs text-sidebar-foreground/60">
                                {user.company.description}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator className="bg-sidebar-border" />

                    {user.profileHref ? (
                      <div className="px-component pb-1 pt-0">
                        {NavLink ? (
                          <NavLink
                            to={user.profileHref}
                            className="flex min-h-11 items-center gap-micro rounded-md px-component text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <HugeiconsIcon icon={UserIcon} className="size-4 shrink-0" />
                            <span>{user.profileLabel ?? "Mijn profiel"}</span>
                          </NavLink>
                        ) : (
                          <a
                            href={user.profileHref}
                            className="flex min-h-11 items-center gap-micro rounded-md px-component text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <HugeiconsIcon icon={UserIcon} className="size-4 shrink-0" />
                            <span>{user.profileLabel ?? "Mijn profiel"}</span>
                          </a>
                        )}
                      </div>
                    ) : null}

                    {user.company?.organizationProfileHref ? (
                      <div className="px-component pb-1 pt-0">
                        {NavLink ? (
                          <NavLink
                            to={user.company.organizationProfileHref}
                            className="flex min-h-11 items-center gap-micro rounded-md px-component text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <HugeiconsIcon icon={CubeIcon} className="size-4 shrink-0" />
                            <span>{user.company.organizationProfileLabel ?? "Organisatieprofiel"}</span>
                          </NavLink>
                        ) : (
                          <a
                            href={user.company.organizationProfileHref}
                            className="flex min-h-11 items-center gap-micro rounded-md px-component text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <HugeiconsIcon icon={CubeIcon} className="size-4 shrink-0" />
                            <span>{user.company.organizationProfileLabel ?? "Organisatieprofiel"}</span>
                          </a>
                        )}
                      </div>
                    ) : null}

                    {(() => {
                      const switcher = user.company?.organizationSwitcher;
                      if (!switcher || switcher.organizations.length <= 1) return null;
                      return (
                        <div className="px-component pb-2 pt-0">
                          <div className="px-component py-1.5 text-xs font-medium text-sidebar-foreground/60">
                            Wissel van organisatie
                          </div>
                          <div className="flex flex-col gap-0.5">
                            {switcher.organizations.map((o) => {
                              const active = o.id === switcher.activeOrganizationId;
                              return (
                                <button
                                  key={o.id}
                                  type="button"
                                  className="flex min-h-11 items-center justify-between rounded-md px-component text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                  onClick={() => {
                                    switcher.onSelectOrganization(o.id);
                                    setUserMenuOpen(false);
                                  }}
                                >
                                  <span className="truncate">{o.name}</span>
                                  {active ? (
                                    <HugeiconsIcon icon={Tick02Icon} className="size-4 shrink-0 text-accent-foreground" />
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {user.profileHref ||
                    user.company?.organizationProfileHref ||
                    (user.company?.organizationSwitcher &&
                      user.company.organizationSwitcher.organizations.length > 1) ? (
                      <Separator className="bg-sidebar-border" />
                    ) : null}

                    <div className="flex flex-col p-component">
                      <div className="px-component py-1.5 text-xs font-medium text-sidebar-foreground/60">
                        Kies een taal
                      </div>
                      <button
                        type="button"
                        className="flex min-h-11 items-center justify-between rounded-md px-component text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <span className="flex items-center gap-micro">
                          <span>🇳🇱</span> Nederlands
                        </span>
                        <HugeiconsIcon icon={Tick02Icon} className="size-4 text-accent-foreground" />
                      </button>
                      <button
                        type="button"
                        className="mt-0.5 flex min-h-11 items-center rounded-md px-component text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <span className="flex items-center gap-micro">
                          <span>🇫🇷</span> Français
                        </span>
                      </button>
                    </div>

                    <Separator className="bg-sidebar-border" />

                    <div className="flex flex-col gap-0.5 p-component">
                      <button
                        type="button"
                        className="flex min-h-11 items-center gap-micro rounded-md px-component text-sm text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          onSignOut?.();
                          setUserMenuOpen(false);
                        }}
                      >
                        <HugeiconsIcon icon={Logout01Icon} className="size-4 shrink-0" />
                        <span>Log out</span>
                      </button>
                    </div>

                    {version && (
                      <div className="mt-auto px-component py-component text-xs text-sidebar-foreground/60">
                        {version}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative size-9 min-h-11 min-w-11 rounded-full p-0 lg:min-h-0 lg:min-w-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-8 after:border-0">
                      {user.avatar && (
                        <AvatarImage src={user.avatar} alt={user.name ?? user.email} />
                      )}
                      <AvatarFallback className="bg-background">
                      {user.avatarFallback ?? initials}
                    </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
                  <div className="px-component py-component">
                    <div className="flex items-center gap-component">
                      <Avatar className="size-9">
                        {user.avatar && (
                          <AvatarImage src={user.avatar} alt={user.name ?? user.email} />
                        )}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="grid min-w-0 flex-1 text-sm leading-tight">
                        <span className="truncate font-medium">{user.email}</span>
                        {user.role && (
                          <span className="truncate text-xs text-muted-foreground">{user.role}</span>
                        )}
                      </div>
                    </div>
                    {user.company ? (
                      <div className="mt-3 border-t pt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Organisatie
                        </p>
                        <p className="truncate text-sm font-medium">{user.company.name}</p>
                        {user.company.description ? (
                          <p className="truncate text-xs text-muted-foreground">
                            {user.company.description}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <DropdownMenuSeparator />

                  {user.profileHref ? (
                    NavLink ? (
                      <DropdownMenuItem asChild>
                        <NavLink to={user.profileHref}>
                          <HugeiconsIcon icon={UserIcon} />
                          <span>{user.profileLabel ?? "Mijn profiel"}</span>
                        </NavLink>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild>
                        <a href={user.profileHref}>
                          <HugeiconsIcon icon={UserIcon} />
                          <span>{user.profileLabel ?? "Mijn profiel"}</span>
                        </a>
                      </DropdownMenuItem>
                    )
                  ) : null}

                  {user.company?.organizationProfileHref ? (
                    NavLink ? (
                      <DropdownMenuItem asChild>
                        <NavLink to={user.company.organizationProfileHref}>
                          <HugeiconsIcon icon={CubeIcon} />
                          <span>{user.company.organizationProfileLabel ?? "Organisatieprofiel"}</span>
                        </NavLink>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild>
                        <a href={user.company.organizationProfileHref}>
                          <HugeiconsIcon icon={CubeIcon} />
                          <span>{user.company.organizationProfileLabel ?? "Organisatieprofiel"}</span>
                        </a>
                      </DropdownMenuItem>
                    )
                  ) : null}

                  {(() => {
                    const switcher = user.company?.organizationSwitcher;
                    if (!switcher || switcher.organizations.length <= 1) return null;
                    return (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <HugeiconsIcon icon={Building02Icon} />
                          <span>Wissel van organisatie</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuRadioGroup
                            value={switcher.activeOrganizationId}
                            onValueChange={switcher.onSelectOrganization}
                          >
                            {switcher.organizations.map((o) => (
                              <DropdownMenuRadioItem key={o.id} value={o.id}>
                                {o.name}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    );
                  })()}

                  {user.profileHref ||
                  user.company?.organizationProfileHref ||
                  (user.company?.organizationSwitcher &&
                    user.company.organizationSwitcher.organizations.length > 1) ? (
                    <DropdownMenuSeparator />
                  ) : null}

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <HugeiconsIcon icon={GlobeIcon} />
                      <span>Nederlands</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value="nl">
                        <DropdownMenuRadioItem value="nl">
                          <span className="mr-1">🇳🇱</span> Nederlands
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="fr">
                          <span className="mr-1">🇫🇷</span> Français
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuItem
                    variant="destructive"
                    className="mt-0.5"
                    onClick={() => onSignOut?.()}
                  >
                    <HugeiconsIcon icon={Logout01Icon} />
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
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export { AppHeader };
