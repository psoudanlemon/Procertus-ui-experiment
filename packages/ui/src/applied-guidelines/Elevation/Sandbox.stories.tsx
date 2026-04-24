import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { toast, Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { H2 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, MoreVerticalIcon, Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Applied guidelines/Elevation",
  tags: ["!autodocs", "!docs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 700 },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// useIsMobile hook
// ---------------------------------------------------------------------------

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

// ---------------------------------------------------------------------------
// Nested sheet navigation (mobile substitute for nested dropdown)
// ---------------------------------------------------------------------------

function NavItem({ children, onClick, className }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  return (
    <button
      className={cn(
        "flex min-h-8 w-full items-center gap-component rounded-md px-component text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground max-sm:min-h-[44px]",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function NestedSheetNav({ onClose }: { onClose: () => void }) {
  const [moveToOpen, setMoveToOpen] = React.useState(false);
  const [teamOpen, setTeamOpen] = React.useState(false);

  return (
    <div className="flex h-full flex-col bg-sidebar p-boundary text-sidebar-foreground">
      {/* Action bar */}
      <div className="-mx-2 -mt-2 flex items-center gap-micro">
        <Button variant="ghost" size="icon-sm" className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground max-sm:size-11" onClick={onClose}>
          <HugeiconsIcon icon={ArrowRight01Icon} />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      {/* Content */}
      <div className="-mx-2 flex-1 overflow-y-auto pt-component">
        <nav className="flex flex-col gap-1">
          <NavItem onClick={onClose}>Edit</NavItem>
          <NavItem onClick={onClose}>Duplicate</NavItem>

          {/* Move to group */}
          <div className="mt-section flex h-8 shrink-0 items-center px-component text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/70">
            Move to
          </div>
          <NavItem onClick={onClose}>Workspace</NavItem>
          <NavItem onClick={onClose}>Archive</NavItem>

          {/* Team collapsible */}
          <button
            className="flex min-h-8 w-full items-center justify-between rounded-md px-component text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground max-sm:min-h-[44px]"
            onClick={() => setTeamOpen(!teamOpen)}
          >
            Team
            <HugeiconsIcon icon={ArrowRight01Icon} className={`size-4 transition-transform duration-200 ${teamOpen ? "rotate-90" : ""}`} />
          </button>
          {teamOpen && (
            <ul className="mx-3.5 flex flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
              <li>
                <button className="flex min-h-7 w-full items-center rounded-md px-component text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground max-sm:min-h-[44px]" onClick={onClose}>
                  Engineering
                </button>
              </li>
              <li>
                <button className="flex min-h-7 w-full items-center rounded-md px-component text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground max-sm:min-h-[44px]" onClick={onClose}>
                  Design
                </button>
              </li>
              <li>
                <button className="flex min-h-7 w-full items-center rounded-md px-component text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground max-sm:min-h-[44px]" onClick={onClose}>
                  Operations
                </button>
              </li>
            </ul>
          )}

          <div className="mt-section">
            <NavItem onClick={onClose} className="text-destructive-foreground hover:bg-destructive/10 hover:text-destructive-foreground">
              Delete
            </NavItem>
          </div>
        </nav>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scroll picker (iOS-style wheel picker for mobile selects)
// ---------------------------------------------------------------------------

const PICKER_ITEM_HEIGHT = 44;

function ScrollPicker({
  items,
  value,
  onValueChange,
}: {
  items: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = React.useState(() =>
    Math.max(0, items.findIndex((i) => i.value === value)),
  );

  const visibleCount = items.length >= 10 ? 5 : items.length >= 3 ? 3 : items.length;
  const containerHeight = visibleCount * PICKER_ITEM_HEIGHT;
  const padCount = Math.floor(visibleCount / 2);

  // Scroll to initial value on mount
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = items.findIndex((i) => i.value === value);
    if (idx >= 0) {
      el.scrollTop = idx * PICKER_ITEM_HEIGHT;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track scroll position to determine center item
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollTop / PICKER_ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      setCenterIndex(clamped);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  // Snap to nearest item and commit value on scroll end
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
    const onScrollEnd = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const idx = Math.round(el.scrollTop / PICKER_ITEM_HEIGHT);
        const clamped = Math.max(0, Math.min(items.length - 1, idx));
        el.scrollTo({ top: clamped * PICKER_ITEM_HEIGHT, behavior: "smooth" });
        onValueChange(items[clamped].value);
      }, 80);
    };
    el.addEventListener("scroll", onScrollEnd, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScrollEnd);
      clearTimeout(timeout);
    };
  }, [items, onValueChange]);

  return (
    <div className="relative" style={{ height: containerHeight }}>
      {/* Center highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 z-0 rounded-lg bg-accent"
        style={{
          top: padCount * PICKER_ITEM_HEIGHT,
          height: PICKER_ITEM_HEIGHT,
        }}
      />
      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="relative z-0 h-full snap-y snap-mandatory overflow-y-auto scrollbar-none"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {/* Top boundary */}
        {Array.from({ length: padCount }).map((_, i) => (
          <div key={`pad-top-${i}`} className="flex items-center justify-center text-sm text-muted-foreground/40" style={{ height: PICKER_ITEM_HEIGHT }}>
            {i === padCount - 1 ? "·" : ""}
          </div>
        ))}
        {items.map((item, i) => (
          <button
            key={item.value}
            className={cn(
              "flex w-full snap-center items-center justify-center text-sm transition-colors",
              i === centerIndex
                ? "font-medium text-accent-foreground"
                : "text-foreground",
            )}
            style={{ height: PICKER_ITEM_HEIGHT }}
            onClick={() => {
              scrollRef.current?.scrollTo({
                top: i * PICKER_ITEM_HEIGHT,
                behavior: "smooth",
              });
              onValueChange(item.value);
            }}
          >
            {item.label}
          </button>
        ))}
        {/* Bottom boundary */}
        {Array.from({ length: padCount }).map((_, i) => (
          <div key={`pad-bottom-${i}`} className="flex items-center justify-center text-sm text-muted-foreground/40" style={{ height: PICKER_ITEM_HEIGHT }}>
            {i === 0 ? "·" : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panel scroll fade (shows gradient when content is scrolled)
// ---------------------------------------------------------------------------

function PanelScrollFade() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current?.nextElementSibling as HTMLElement | null;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none relative z-10 -mb-8 h-8 bg-gradient-to-b from-popover to-transparent transition-opacity duration-200 ${scrolled ? "opacity-100" : "opacity-0"}`}
    />
  );
}

function PanelScrollFadeBottom() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current?.previousElementSibling as HTMLElement | null;
    if (!el) return;
    const onScroll = () => {
      setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none relative z-10 -mt-8 h-8 bg-gradient-to-t from-popover to-transparent transition-opacity duration-200 ${atBottom ? "opacity-0" : "opacity-100"}`}
    />
  );
}

// ---------------------------------------------------------------------------
// Sandbox component
// ---------------------------------------------------------------------------

function ElevationSandbox() {
  const isMobile = useIsMobile();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [panels, setPanels] = React.useState<number[]>([]);
  const [dismissing, setDismissing] = React.useState<Set<number>>(new Set());
  const panelCounter = React.useRef(0);
  const [tooltipSheetOpen, setTooltipSheetOpen] = React.useState(false);
  const [hoverCardSheetOpen, setHoverCardSheetOpen] = React.useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = React.useState(false);
  const [nestedSheetOpen, setNestedSheetOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectValue, setSelectValue] = React.useState("");
  const [selectSheetOpen, setSelectSheetOpen] = React.useState(false);
  const [comboboxValue, setComboboxValue] = React.useState("");
  const [comboboxSheetOpen, setComboboxSheetOpen] = React.useState(false);
  const [comboboxSearch, setComboboxSearch] = React.useState("");

  const addPanel = () => {
    if (visiblePanels.length >= 5) return;
    panelCounter.current += 1;
    setPanels((prev) => [...prev, panelCounter.current]);
  };

  const toggleSideSheet = () => {
    if (visiblePanels.length > 1) {
      // Close all except the first panel
      const toRemove = visiblePanels.slice(1);
      for (const id of toRemove) {
        removePanel(id);
      }
    } else if (visiblePanels.length === 1) {
      // Close the only panel
      removePanel(visiblePanels[0]);
    } else {
      // Open first panel
      addPanel();
    }
  };

  const removePanel = (id: number) => {
    setDismissing((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setPanels((prev) => prev.filter((p) => p !== id));
      setDismissing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  };

  const visiblePanels = panels.filter((id) => !dismissing.has(id));

  return (
    <TooltipProvider>
      <style>{`[data-slot="drawer-overlay"] { backdrop-filter: blur(1px) !important; -webkit-backdrop-filter: blur(1px) !important; }`}</style>
      <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 p-10">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <H2>Elevation sandbox</H2>
          <Muted>
            Trigger each elevation tier in isolation to inspect shadow, blur,
            and stacking behavior.
          </Muted>
        </div>

        {/* Control panel */}
        <Card>
          <CardHeader>
            <CardTitle>Control panel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-component [&_[data-slot=button]]:max-sm:min-h-[44px]">
              {/* Tooltip */}
              {isMobile ? (
                <>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setTooltipSheetOpen(true)}
                  >
                    Tooltip
                  </Button>
                  <Drawer open={tooltipSheetOpen} onOpenChange={setTooltipSheetOpen}>
                    <DrawerContent>
                      <DrawerHeader className="text-left!">
                        <DrawerTitle>Tooltip
                        </DrawerTitle>
                        <DrawerDescription>
                          Whisper layer: informational hints
                        </DrawerDescription>
                      </DrawerHeader>
                    </DrawerContent>
                  </Drawer>
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      Tooltip
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="shadow-proc-xs">
                    Whisper layer: informational hints
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Hover card */}
              {isMobile ? (
                <>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setHoverCardSheetOpen(true)}
                  >
                    Hover card
                  </Button>
                  <Drawer open={hoverCardSheetOpen} onOpenChange={setHoverCardSheetOpen}>
                    <DrawerContent>
                      <DrawerHeader className="text-left!">
                        <DrawerTitle>Preview
                        </DrawerTitle>
                        <DrawerDescription>
                          Hover cards show contextual information on pointer
                          hover without requiring a click.
                        </DrawerDescription>
                      </DrawerHeader>
                    </DrawerContent>
                  </Drawer>
                </>
              ) : (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      Hover card
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex flex-col gap-component">
                      <span className="font-medium">Preview</span>
                      <Muted>
                        Hover cards show contextual information on pointer
                        hover without requiring a click.
                      </Muted>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}

              {/* Dropdown */}
              {isMobile ? (
                <>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setDropdownOpen(true)}
                  >
                    Dropdown
                  </Button>
                  <Drawer
                    open={dropdownOpen}
                    onOpenChange={setDropdownOpen}
                  >
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Actions</DrawerTitle>
                        <DrawerDescription>
                          Choose an action to perform.
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="flex flex-col gap-2 p-4">
                        <Button
                          variant="outline"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Duplicate
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Delete
                        </Button>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </>
              ) : (
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      Dropdown
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-auto shadow-proc-md" align="center">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Dropdown with submenus */}
              {isMobile ? (
                <>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setNestedSheetOpen(true)}
                  >
                    Nested dropdown
                  </Button>
                  <DialogPrimitive.Root open={nestedSheetOpen} onOpenChange={setNestedSheetOpen} modal={false}>
                    <DialogPrimitive.Portal>
                      <DialogPrimitive.Content className="fixed inset-0 z-20 bg-sidebar text-sidebar-foreground data-open:animate-in data-open:slide-in-from-right-full data-open:duration-200 data-closed:animate-out data-closed:slide-out-to-right-full data-closed:duration-200">
                        <NestedSheetNav
                          onClose={() => setNestedSheetOpen(false)}
                        />
                      </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                  </DialogPrimitive.Root>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      Nested dropdown
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-auto shadow-proc-md" align="center">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Workspace</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Team</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem>Engineering</DropdownMenuItem>
                            <DropdownMenuItem>Design</DropdownMenuItem>
                            <DropdownMenuItem>Operations</DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Drawer (mobile only) */}
              {isMobile && (
                <>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setBottomSheetOpen(true)}
                  >
                    Drawer
                  </Button>
                  <Drawer open={bottomSheetOpen} onOpenChange={setBottomSheetOpen}>
                    <DrawerContent>
                      <DrawerHeader className="text-left!">
                        <DrawerTitle>Quick preview</DrawerTitle>
                        <DrawerDescription>
                          A lightweight overlay for confirming context without
                          leaving the current view.
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-section">
                        <Muted>
                          Drawers on mobile replace simple dropdown menus
                          and popovers. They slide up from the bottom edge and
                          can be dismissed by swiping down or tapping outside.
                        </Muted>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </>
              )}

              {/* Select */}
              {isMobile ? (
                <>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setSelectSheetOpen(true)}
                  >
                    Select
                  </Button>
                  <Drawer open={selectSheetOpen} onOpenChange={setSelectSheetOpen}>
                    <DrawerContent>
                      <div className="flex flex-col gap-section p-section pb-region">
                        <DrawerTitle className="text-center text-lg font-semibold">
                          Select a status
                        </DrawerTitle>
                        <ScrollPicker
                          items={[
                            { value: "draft", label: "Draft" },
                            { value: "in review", label: "In review" },
                            { value: "approved", label: "Approved" },
                            { value: "published", label: "Published" },
                          ]}
                          value={selectValue || "draft"}
                          onValueChange={setSelectValue}
                        />
                        <Button
                          className="min-h-[44px] w-full"
                          onClick={() => setSelectSheetOpen(false)}
                        >
                          Confirm
                        </Button>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </>
              ) : (
                <Popover open={selectSheetOpen} onOpenChange={setSelectSheetOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      Select
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col p-micro" align="center">
                    <div className="px-component py-micro text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Status</div>
                      {["Draft", "In review", "Approved", "Published"].map((item) => (
                        <button
                          key={item}
                          className={cn(
                            "flex items-center rounded-md px-component py-micro text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground",
                            selectValue === item.toLowerCase() && "bg-accent text-accent-foreground",
                          )}
                          onClick={() => {
                            setSelectValue(item.toLowerCase());
                            setSelectSheetOpen(false);
                          }}
                        >
                          {item}
                        </button>
                      ))}
                  </PopoverContent>
                </Popover>
              )}

              {/* Combobox */}
              {isMobile ? (
                <>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setComboboxSheetOpen(true)}
                  >
                    Combobox
                  </Button>
                  <DialogPrimitive.Root open={comboboxSheetOpen} onOpenChange={setComboboxSheetOpen} modal={false}>
                    <DialogPrimitive.Portal>
                      <DialogPrimitive.Content className="fixed inset-0 z-20 bg-sidebar text-sidebar-foreground data-open:animate-in data-open:slide-in-from-right-full data-open:duration-200 data-closed:animate-out data-closed:slide-out-to-right-full data-closed:duration-200">
                        <div className="flex h-full flex-col p-boundary">
                          <div className="-mx-2 -mt-2 flex items-center gap-micro">
                            <Button variant="ghost" size="icon-sm" className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground max-sm:size-11" onClick={() => setComboboxSheetOpen(false)}>
                              <HugeiconsIcon icon={ArrowRight01Icon} />
                              <span className="sr-only">Close</span>
                            </Button>
                          </div>
                          <div className="pt-component">
                            <div className="relative">
                              <HugeiconsIcon icon={Search01Icon} className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                placeholder="Search frameworks..."
                                className="h-8 pl-8 border-sidebar-border max-sm:h-11"
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="-mx-2 flex-1 overflow-y-auto pt-component">
                            <nav className="flex flex-col gap-1">
                              {["React", "Vue", "Angular", "Svelte", "Solid"].map((item) => (
                                <NavItem key={item} onClick={() => {
                                  setComboboxValue(item.toLowerCase());
                                  setComboboxSheetOpen(false);
                                }}>
                                  {item}
                                </NavItem>
                              ))}
                            </nav>
                          </div>
                        </div>
                      </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                  </DialogPrimitive.Root>
                </>
              ) : (
                <Popover open={comboboxSheetOpen} onOpenChange={(open) => { setComboboxSheetOpen(open); if (!open) setComboboxSearch(""); }}>
                  <PopoverTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      Combobox
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="center">
                    <div className="border-b p-micro">
                      <Input
                        placeholder="Search frameworks..."
                        className="h-8 border-0 shadow-none focus-visible:ring-0"
                        value={comboboxSearch}
                        onChange={(e) => setComboboxSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="flex flex-col p-micro">
                      {["React", "Vue", "Angular", "Svelte", "Solid"]
                        .filter((item) => item.toLowerCase().includes(comboboxSearch.toLowerCase()))
                        .map((item) => (
                          <button
                            key={item}
                            className={cn(
                              "flex items-center rounded-md px-component py-micro text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground",
                              comboboxValue === item.toLowerCase() && "bg-accent text-accent-foreground",
                            )}
                            onClick={() => {
                              setComboboxValue(item.toLowerCase());
                              setComboboxSheetOpen(false);
                              setComboboxSearch("");
                            }}
                          >
                            {item}
                          </button>
                        ))}
                      {["React", "Vue", "Angular", "Svelte", "Solid"]
                        .filter((item) => item.toLowerCase().includes(comboboxSearch.toLowerCase()))
                        .length === 0 && (
                        <p className="px-component py-micro text-sm text-muted-foreground">No results found.</p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* Sheet (stackable) */}
              <Button
                variant="secondary"
                className="w-full"
                onClick={toggleSideSheet}
              >
                Sheet
              </Button>

              {/* Command palette */}
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setCommandOpen(true)}
              >
                Command palette
              </Button>
              {isMobile ? (
                <DialogPrimitive.Root open={commandOpen} onOpenChange={setCommandOpen} modal={false}>
                  <DialogPrimitive.Portal>
                    <DialogPrimitive.Content className="fixed inset-0 z-20 bg-sidebar text-sidebar-foreground data-open:animate-in data-open:slide-in-from-right-full data-open:duration-200 data-closed:animate-out data-closed:slide-out-to-right-full data-closed:duration-200">
                      <div className="flex h-full flex-col p-boundary">
                        {/* Action bar */}
                        <div className="-mx-2 -mt-2 flex items-center gap-micro">
                          <Button variant="ghost" size="icon-sm" className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground max-sm:size-11" onClick={() => setCommandOpen(false)}>
                            <HugeiconsIcon icon={ArrowRight01Icon} />
                            <span className="sr-only">Close</span>
                          </Button>
                        </div>
                        {/* Search */}
                        <div className="pt-component">
                          <div className="relative">
                            <HugeiconsIcon icon={Search01Icon} className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Search commands..."
                              className="h-8 pl-8 border-sidebar-border max-sm:h-11"
                              autoFocus
                            />
                          </div>
                        </div>
                        {/* Navigation items */}
                        <div className="-mx-2 flex-1 overflow-y-auto pt-component">
                          <div className="flex h-8 shrink-0 items-center px-component text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/70">
                            Actions
                          </div>
                          <nav className="flex flex-col gap-1">
                            <NavItem onClick={() => setCommandOpen(false)}>Create new</NavItem>
                            <NavItem onClick={() => setCommandOpen(false)}>Import data</NavItem>
                            <NavItem onClick={() => setCommandOpen(false)}>Export report</NavItem>
                          </nav>
                        </div>
                      </div>
                    </DialogPrimitive.Content>
                  </DialogPrimitive.Portal>
                </DialogPrimitive.Root>
              ) : (
                <DialogPrimitive.Root open={commandOpen} onOpenChange={setCommandOpen}>
                  <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
                    <DialogPrimitive.Content className="fixed top-1/3 left-1/2 z-40 w-[calc(100%-var(--spacing-boundary)*2)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl bg-popover p-0 text-sm text-popover-foreground ring-1 ring-foreground/10 shadow-proc-lg outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
                      <Command>
                        <CommandInput placeholder="Type a command..." autoFocus />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Actions" className="**:[[cmdk-group-heading]]:text-[10px]!">
                            <CommandItem onSelect={() => setCommandOpen(false)}>
                              Create new
                            </CommandItem>
                            <CommandItem onSelect={() => setCommandOpen(false)}>
                              Import data
                            </CommandItem>
                            <CommandItem onSelect={() => setCommandOpen(false)}>
                              Export report
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DialogPrimitive.Content>
                  </DialogPrimitive.Portal>
                </DialogPrimitive.Root>
              )}

              {/* Modal */}
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setModalOpen(true)}
              >
                Modal
              </Button>
              {isMobile ? (
                <Drawer open={modalOpen} onOpenChange={setModalOpen}>
                  <DrawerContent>
                    <DrawerHeader className="text-left!">
                      <DrawerTitle>Confirm action</DrawerTitle>
                      <DrawerDescription>
                        This action cannot be undone. Are you sure?
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col gap-component p-section pt-0">
                      <Button
                        variant="destructive"
                        className="min-h-[44px]"
                        onClick={() => setModalOpen(false)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        className="min-h-[44px]"
                        onClick={() => setModalOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
                    <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-40 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-section rounded-xl bg-popover p-section text-sm text-popover-foreground shadow-proc-lg duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
                      <DialogHeader>
                        <DialogTitle>Confirm action</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. Are you sure?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="ghost"
                          onClick={() => setModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => setModalOpen(false)}
                        >
                          Confirm
                        </Button>
                      </DialogFooter>
                    </DialogPrimitive.Content>
                  </DialogPrimitive.Portal>
                </Dialog>
              )}

              {/* Toast */}
              <Button
                variant="secondary"
                className="w-full"
                onClick={() =>
                  toast("Certification exported", {
                    description:
                      "The report has been saved to your downloads.",
                  })
                }
              >
                Toast
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="ghost"
          className="self-center"
          onClick={() => {
            setPanels([]);
            setDismissing(new Set());
            setDropdownOpen(false);
            setTooltipSheetOpen(false);
            setHoverCardSheetOpen(false);
            setBottomSheetOpen(false);
            setNestedSheetOpen(false);
            setCommandOpen(false);
            setModalOpen(false);
            setSelectSheetOpen(false);
            setSelectValue("");
            setComboboxValue("");
            setComboboxSheetOpen(false);
            setComboboxSearch("");
          }}
        >
          Reset
        </Button>

        {/* Stacked floating panels: full-height, horizontal stack from right */}
        {panels.map((id) => {
          const isDismissing = dismissing.has(id);
          const stackIndex = visiblePanels.indexOf(id);
          const depth = stackIndex >= 0 ? visiblePanels.length - 1 - stackIndex : 0;
          const isMaxDepth = stackIndex === 4;

          return (
          <div
            key={id}
            className={`fixed z-20 flex transition-[top,bottom,right] duration-300 ease-out ${
              isMobile ? "inset-0 w-full" : "w-80"
            } ${
              isDismissing
                ? "animate-out slide-out-to-right-full duration-300 ease-out fill-mode-forwards"
                : "animate-in slide-in-from-right-full fade-in-0 duration-300 ease-out"
            }`}
            style={isMobile ? {
              zIndex: 20 + (stackIndex >= 0 ? stackIndex : 0),
            } : {
              top: 16 + depth * 8,
              bottom: 16 + depth * 8,
              right: depth * 12 + 16,
              zIndex: 20 + (stackIndex >= 0 ? stackIndex : 0),
            }}
          >
            <div className={`relative flex flex-1 flex-col overflow-hidden text-sm ${
              isMobile
                ? "bg-popover p-boundary text-popover-foreground"
                : "rounded-xl bg-popover p-section text-popover-foreground shadow-proc-md ring-1 ring-foreground/10"
            }`}>
              {/* Action bar */}
              <div className="-mx-2 -mt-2 flex items-center gap-micro">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="max-sm:size-11"
                      onClick={() => removePanel(id)}
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="shadow-proc-xs">Dismiss</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="ml-auto max-sm:size-11"
                    >
                      <HugeiconsIcon icon={MoreVerticalIcon} />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="shadow-proc-xs">More actions</TooltipContent>
                </Tooltip>
                {visiblePanels.length > 1 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="max-sm:size-11"
                        onClick={() => {
                          for (const p of [...panels]) {
                            removePanel(p);
                          }
                        }}
                      >
                        <HugeiconsIcon icon={Cancel01Icon} />
                        <span className="sr-only">Close all</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="shadow-proc-xs">Close all</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <PanelScrollFade />
              {/* Content */}
              <div className="flex-1 overflow-y-auto pt-component" data-slot="panel-scroll">
                <span className="font-medium">Details panel #{id}</span>
                <Muted className="mt-2">
                  Floating side panel, no backdrop. Panels stack
                  horizontally with independent dismiss.
                </Muted>
                <p className="mt-4 text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo.
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt. Neque porro quisquam est
                  qui dolorem ipsum quia dolor sit amet.
                </p>
                {isMaxDepth && (
                  <>
                    <p className="mt-3 text-sm text-muted-foreground">
                      At vero eos et accusamus et iusto odio dignissimos ducimus
                      qui blanditiis praesentium voluptatum deleniti atque
                      corrupti quos dolores et quas molestias excepturi sint
                      occaecati cupiditate non provident.
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Similique sunt in culpa qui officia deserunt mollitia animi,
                      id est laborum et dolorum fuga. Et harum quidem rerum
                      facilis est et expedita distinctio. Nam libero tempore, cum
                      soluta nobis est eligendi optio cumque nihil impedit quo
                      minus id quod maxime placeat facere possimus.
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Temporibus autem quibusdam et aut officiis debitis aut rerum
                      necessitatibus saepe eveniet ut et voluptates repudiandae
                      sint et molestiae non recusandae. Itaque earum rerum hic
                      tenetur a sapiente delectus, ut aut reiciendis voluptatibus
                      maiores alias consequatur aut perferendis doloribus
                      asperiores repellat.
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Quis autem vel eum iure reprehenderit qui in ea voluptate
                      velit esse quam nihil molestiae consequatur, vel illum qui
                      dolorem eum fugiat quo voluptas nulla pariatur. Ut enim ad
                      minima veniam, quis nostrum exercitationem ullam corporis
                      suscipit laboriosam nisi ut aliquid ex ea commodi
                      consequatur.
                    </p>
                  </>
                )}
                {!isMaxDepth && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-component max-sm:min-h-[44px]"
                    onClick={addPanel}
                  >
                    View details
                  </Button>
                )}
              </div>
              <PanelScrollFadeBottom />
            </div>
          </div>
          );
        })}

        <Toaster position={isMobile ? "bottom-center" : "bottom-right"} closeButton style={{ "--toast-close-button-start": "unset", "--toast-close-button-end": "0", "--toast-close-button-transform": "translate(50%, -50%)" } as React.CSSProperties} />
      </div>
      </div>
    </TooltipProvider>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

export const ComponentElevation: Story = {
  render: () => <ElevationSandbox />,
};
