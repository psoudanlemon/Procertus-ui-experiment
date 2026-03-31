import * as React from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  GlobeIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Breadcrumb,
  cn,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
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
  Input,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SidebarTrigger,
  useSidebar,
} from "@procertus-ui/ui";

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
};

export type ManagementHeaderProps = {
  breadcrumbs?: BreadcrumbEntry[];
  showNavigation?: boolean;
  showSearch?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  user?: HeaderUserInfo;
  version?: string;
};

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

  // Scroll to selected index on mount
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
    <div className="relative mx-4" style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
      {/* Highlight band */}
      <div
        className="pointer-events-none absolute inset-x-0 rounded-lg bg-accent"
        style={{ top: pad * ITEM_HEIGHT, height: ITEM_HEIGHT }}
      />
      {/* Fade masks */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-popover to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-popover to-transparent" />
      {/* Scrollable area */}
      <div
        ref={scrollRef}
        className="relative z-10 size-full overflow-y-auto overscroll-contain"
        style={{
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
        }}
        onScroll={handleScroll}
      >
        {/* Top padding */}
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
        {/* Bottom padding */}
        <div style={{ height: pad * ITEM_HEIGHT }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ManagementHeader({
  breadcrumbs = [],
  showNavigation = true,
  showSearch = false,
  onBack,
  onForward,
  canGoBack = false,
  canGoForward = false,
  user,
  version,
}: ManagementHeaderProps) {
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
    <header data-slot="management-header" className="shrink-0 bg-sidebar px-2 pt-2 pb-3">
      <div className="flex h-[56px] items-center gap-1.5 lg:gap-3 px-3">
        <SidebarTrigger className="hidden md:inline-flex lg:min-h-0 lg:min-w-0 min-h-11 min-w-11 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden min-h-11 min-w-11 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => toggleSidebar()}
        >
          <MenuIcon />
          <span className="sr-only">Toggle Sidebar</span>
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
              <ArrowLeftIcon />
              <span className="sr-only">Go back</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!canGoForward}
              onClick={onForward}
              className="hidden lg:inline-flex hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <ArrowRightIcon />
              <span className="sr-only">Go forward</span>
            </Button>
          </>
        )}

        {/* Breadcrumbs — desktop: full trail */}
        {breadcrumbs.length > 0 && (
          <>
            {showNavigation && (
              <Separator
                orientation="vertical"
                className="mx-0.5 !h-5 !self-center hidden lg:block"
              />
            )}

            {/* Desktop: max 3 visible — first, middle (dropdown if collapsed), last */}
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
                            <BreadcrumbLink href={crumb.href ?? "#"}>{crumb.label}</BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <>
                    {/* First */}
                    <BreadcrumbItem>
                      <BreadcrumbLink href={breadcrumbs[0]?.href ?? "#"}>
                        {breadcrumbs[0]?.label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />

                    {/* Middle — dropdown with hidden crumbs */}
                    <BreadcrumbItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 text-sm">
                          {breadcrumbs[breadcrumbs.length - 2]?.label}
                          <ChevronDownIcon className="size-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {breadcrumbs.slice(1, -2).map((crumb, index) => (
                            <DropdownMenuItem key={`${crumb.label}-${index}`} asChild>
                              <a href={crumb.href ?? "#"}>{crumb.label}</a>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />

                    {/* Last */}
                    <BreadcrumbItem>
                      <BreadcrumbPage>{breadcrumbs[breadcrumbs.length - 1]?.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Mobile/Tablet: parent (with drawer) > current page */}
            <Breadcrumb className="lg:hidden ml-0.5 [&_[data-slot=breadcrumb-link]]:min-h-11 [&_[data-slot=breadcrumb-link]]:flex [&_[data-slot=breadcrumb-link]]:items-center [&_[data-slot=breadcrumb-page]]:min-h-11 [&_[data-slot=breadcrumb-page]]:flex [&_[data-slot=breadcrumb-page]]:items-center">
              <BreadcrumbList>
                {breadcrumbs.length > 1 && (
                  <>
                    <BreadcrumbItem>
                      {breadcrumbs.length > 2 ? (
                        <>
                          <button
                            type="button"
                            className="flex min-h-11 items-center gap-1 text-sm text-muted-foreground"
                            onClick={() => setBreadcrumbDrawerOpen(true)}
                          >
                            {breadcrumbs[breadcrumbs.length - 2]?.label}
                            <ChevronDownIcon className="size-3.5" />
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
                              {/* Scroll-wheel picker */}
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
                                      onSelect={(i) => setSelectedCrumbIndex(pickerCrumbs[i].originalIndex)}
                                    />
                                    <DrawerFooter>
                                      <Button asChild>
                                        <a href={breadcrumbs[selectedCrumbIndex]?.href ?? "#"}>
                                          Navigeer
                                        </a>
                                      </Button>
                                    </DrawerFooter>
                                  </>
                                );
                              })()}
                            </DrawerContent>
                          </Drawer>
                        </>
                      ) : (
                        <BreadcrumbLink href={breadcrumbs[0]?.href ?? "#"}>
                          {breadcrumbs[0]?.label}
                        </BreadcrumbLink>
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

        {/* Search — centered */}
        {showSearch && (
          <div className="mx-auto hidden w-full max-w-sm lg:block">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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

        {/* Right group */}
        {user && (
          <div className="ml-auto flex items-center">
            {/* Avatar trigger — shared between mobile sheet & desktop dropdown */}
            {isMobileOrTablet ? (
              <Sheet open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <Button
                  variant="ghost"
                  className="relative size-9 min-h-11 min-w-11 rounded-full p-0 lg:min-h-0 lg:min-w-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  onClick={() => setUserMenuOpen(true)}
                >
                  <Avatar className="size-8 after:border-0">
                    {user.avatar && <AvatarImage src={user.avatar} alt={user.name ?? user.email} />}
                    <AvatarFallback className="bg-background">{initials}</AvatarFallback>
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
                    {/* User info */}
                    <div className="flex items-center gap-3 px-4 py-4">
                      <Avatar className="size-9">
                        {user.avatar && (
                          <AvatarImage src={user.avatar} alt={user.name ?? user.email} />
                        )}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="grid text-sm leading-tight">
                        <span className="truncate font-medium">{user.email}</span>
                        {user.role && (
                          <span className="truncate text-xs text-sidebar-foreground/60">
                            {user.role}
                          </span>
                        )}
                      </div>
                    </div>
                    <Separator className="bg-sidebar-border" />

                    {/* Language */}
                    <div className="flex flex-col p-2">
                      <div className="px-2 py-1.5 text-xs font-medium text-sidebar-foreground/60">
                        Kies een taal
                      </div>
                      <button
                        type="button"
                        className="flex min-h-11 items-center justify-between rounded-md px-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <span>🇳🇱</span> Nederlands
                        </span>
                        <CheckIcon className="size-4 text-accent-foreground" />
                      </button>
                      <button
                        type="button"
                        className="mt-0.5 flex min-h-11 items-center rounded-md px-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <span>🇫🇷</span> Français
                        </span>
                      </button>
                    </div>

                    <Separator className="bg-sidebar-border" />

                    {/* Logout */}
                    <div className="flex flex-col gap-0.5 p-2">
                      <button
                        type="button"
                        className="flex min-h-11 items-center gap-2 rounded-md px-2 text-sm text-destructive hover:bg-destructive/10"
                      >
                        <LogOutIcon className="size-4 shrink-0" />
                        <span>Log out</span>
                      </button>
                    </div>

                    {/* Version */}
                    {version && (
                      <div className="mt-auto px-4 py-3 text-xs text-sidebar-foreground/60">
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
                      <AvatarFallback className="bg-background">{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
                  {/* User info */}
                  <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar className="size-9">
                      {user.avatar && (
                        <AvatarImage src={user.avatar} alt={user.name ?? user.email} />
                      )}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid text-sm leading-tight">
                      <span className="truncate font-medium">{user.email}</span>
                      {user.role && (
                        <span className="truncate text-xs text-muted-foreground">{user.role}</span>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />

                  {/* Language */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <GlobeIcon />
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

                  {/* Logout */}
                  <DropdownMenuItem variant="destructive" className="mt-0.5">
                    <LogOutIcon />
                    <span>Log out</span>
                  </DropdownMenuItem>

                  {/* Version */}
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

export { ManagementHeader };
