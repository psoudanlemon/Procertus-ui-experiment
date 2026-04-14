"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick01Icon,
  ArrowDown01Icon,
  GlobeIcon,
  Logout01Icon,
  Menu01Icon,
  Search01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  cn,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
} from "@procertus-ui/ui";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NavLink = {
  title: string;
  url: string;
  isActive?: boolean;
};

export type Language = {
  code: string;
  label: string;
  flag: string;
};

export type PublicRegistryUser = {
  name?: string;
  email: string;
  avatar?: string;
};

export type PublicRegistryHeaderProps = {
  /** App logo — render any React node (image, SVG, text). */
  logo?: React.ReactNode;
  /** Primary horizontal navigation links. */
  navLinks?: NavLink[];
  /** Show the search bar in the header. */
  showSearch?: boolean;
  /** Placeholder text for the search input. */
  searchPlaceholder?: string;
  /** Callback when search value changes. */
  onSearch?: (query: string) => void;
  /** Available languages for the language switcher. */
  languages?: Language[];
  /** Currently active language code. */
  activeLanguage?: string;
  /** Callback when language selection changes. */
  onLanguageChange?: (code: string) => void;
  /** Logged-in user — when absent the header shows login + CTA buttons. */
  user?: PublicRegistryUser;
  /** URL for the login page. */
  loginUrl?: string;
  /** Callback when login button is clicked (overrides loginUrl). */
  onLogin?: () => void;
  /** Callback when logout is clicked. */
  onLogout?: () => void;
  /** App version string shown in the user dropdown. */
  version?: string;
  /** Visual variant — "default" uses sidebar tokens, "transparent" uses background. */
  variant?: "default" | "transparent";
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(user: PublicRegistryUser): string {
  if (user.name) {
    const parts = user.name.split(" ");
    if (parts.length === 1 && Array.from(user.name).length <= 2) return user.name;
    return parts
      .map((n) => Array.from(n)[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function PublicRegistryHeader({
  logo,
  navLinks = [],
  showSearch = false,
  searchPlaceholder = "Zoek certificaten...",
  onSearch,
  languages = [],
  activeLanguage,
  onLanguageChange,
  user,
  loginUrl = "#",
  onLogin,
  onLogout,
  version,
  variant = "default",
}: PublicRegistryHeaderProps) {
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Cmd+K to focus search
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

  const activeLanguageObj = languages.find((l) => l.code === activeLanguage);
  const initials = user ? getInitials(user) : "";

  return (
    <header
      data-slot="public-registry-header"
      className={cn(
        "sticky top-0 z-20 w-full border-b",
        variant === "transparent"
          ? "border-border bg-background text-foreground"
          : "border-sidebar-border bg-sidebar text-sidebar-foreground",
      )}
    >
      <div className="flex h-16 items-center gap-element px-boundary">
        {/* Mobile hamburger — left side */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="sm:hidden min-h-11 min-w-11 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => setMobileMenuOpen(true)}
        >
          <HugeiconsIcon icon={Menu01Icon} />
          <span className="sr-only">Menu</span>
        </Button>

        {/* Logo */}
        {logo && (
          <a href="/" className="flex shrink-0 items-center gap-element">
            {logo}
          </a>
        )}

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-component sm:flex">
          {navLinks.map((link) => (
            <a
              key={link.title}
              href={link.url}
              className={cn(
                "rounded-md px-component py-element text-sm font-medium transition-colors",
                link.isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              {link.title}
            </a>
          ))}
        </nav>

        {/* Desktop search (optional, centered) */}
        {showSearch && (
          <div className="mx-auto hidden w-full max-w-md sm:block">
            <div className="relative">
              <HugeiconsIcon icon={Search01Icon} className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchRef}
                placeholder={searchPlaceholder}
                className="h-9 pl-9 pr-14 bg-background! border-sidebar-border"
                onChange={(e) => onSearch?.(e.target.value)}
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </div>
        )}

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-component">
          {/* Auth area */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative size-11 rounded-full p-0 lg:size-9 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 after:border-0">
                    {user.avatar && (
                      <AvatarImage src={user.avatar} alt={user.name ?? user.email} />
                    )}
                    <AvatarFallback className="bg-background">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
                <div className="flex items-center gap-component px-element py-element">
                  <Avatar className="size-9">
                    {user.avatar && (
                      <AvatarImage src={user.avatar} alt={user.name ?? user.email} />
                    )}
                    <AvatarFallback className="bg-background">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid text-sm leading-tight">
                    {user.name && (
                      <span className="truncate font-medium">{user.name}</span>
                    )}
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />

                {languages.length > 1 && (
                  <>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <HugeiconsIcon icon={GlobeIcon} />
                        <span>{activeLanguageObj?.label ?? languages[0]?.label}</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-auto">
                        {languages.map((lang) => (
                          <DropdownMenuCheckboxItem
                            key={lang.code}
                            checked={lang.code === (activeLanguage ?? languages[0]?.code)}
                            onClick={() => onLanguageChange?.(lang.code)}
                          >
                            <span className="mr-1">{lang.flag}</span> {lang.label}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem variant="destructive" onClick={onLogout}>
                  <HugeiconsIcon icon={Logout01Icon} />
                  <span>Uitloggen</span>
                </DropdownMenuItem>

                {version && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      {version}
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="min-h-11 lg:min-h-0"
              asChild
            >
              <a href={loginUrl} onClick={onLogin}>
                Inloggen
              </a>
            </Button>
          )}

          {/* Language switcher — desktop only */}
          {languages.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden gap-1 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:inline-flex"
                >
                  <span className="text-xs font-medium uppercase">
                    {activeLanguageObj?.code ?? languages[0]?.code}
                  </span>
                  <HugeiconsIcon icon={ArrowDown01Icon} className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto">
                {languages.map((lang) => (
                  <DropdownMenuCheckboxItem
                    key={lang.code}
                    checked={lang.code === (activeLanguage ?? languages[0]?.code)}
                    onClick={() => onLanguageChange?.(lang.code)}
                  >
                    <span className="mr-1.5">{lang.flag}</span>
                    {lang.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile sheet — nav links + language */}
      <style>{`
        [data-slot="public-registry-header"] [data-slot="sheet-overlay"] {
          background: rgb(0 0 0 / 0.10) !important;
          backdrop-filter: blur(1px) !important;
          -webkit-backdrop-filter: blur(1px) !important;
        }
      `}</style>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-72 border-none bg-sidebar p-0 text-sidebar-foreground"
          showCloseButton={false}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Navigatiemenu</SheetDescription>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-element py-element">
              <span className="text-sm font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="min-h-11 min-w-11 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HugeiconsIcon icon={Cancel01Icon} />
                <span className="sr-only">Sluiten</span>
              </Button>
            </div>
            <Separator className="bg-sidebar-border" />

            {/* Navigation links */}
            {navLinks.length > 0 && (
              <nav className="flex flex-col gap-0.5 p-element">
                {navLinks.map((link) => (
                  <a
                    key={link.title}
                    href={link.url}
                    className={cn(
                      "flex min-h-11 items-center rounded-md px-element text-sm font-medium transition-colors",
                      link.isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.title}
                  </a>
                ))}
              </nav>
            )}

            {/* Language selector */}
            {languages.length > 1 && (
              <>
                <Separator className="bg-sidebar-border" />
                <div className="flex flex-col p-element">
                  <div className="px-element py-1.5 text-xs font-medium text-sidebar-foreground/60">
                    Kies een taal
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={cn(
                        "flex min-h-11 items-center justify-between rounded-md px-element text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        lang.code === (activeLanguage ?? languages[0]?.code) &&
                          "font-medium",
                      )}
                      onClick={() => onLanguageChange?.(lang.code)}
                    >
                      <span className="flex items-center gap-micro">
                        <span>{lang.flag}</span> {lang.label}
                      </span>
                      {lang.code === (activeLanguage ?? languages[0]?.code) && (
                        <HugeiconsIcon icon={Tick01Icon} className="size-4 text-sidebar-accent-foreground" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export { PublicRegistryHeader };
