import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  SheetActionBar,
  SheetBody,
  SheetScrollFade,
  SheetScrollFadeBottom,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { Dialog as DialogPrimitive } from "radix-ui";
import { toast, Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Muted } from "@/components/ui/typography";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, MoreVerticalIcon, Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Applied Guidelines/Elevation",
  tags: ["!autodocs", "!docs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 800 },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Mobile nav item
// ---------------------------------------------------------------------------

function NavItem({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      className="flex min-h-8 w-full items-center gap-element rounded-md px-element text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground max-sm:min-h-[44px]"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Floating panel (reused for stacking sheets)
// ---------------------------------------------------------------------------

function FloatingPanel({
  id,
  depth,
  stackIndex,
  isMobile,
  isDismissing,
  onDismiss,
  onDismissAll,
  onOpenCommand,
  total,
}: {
  id: number;
  depth: number;
  stackIndex: number;
  isMobile: boolean;
  isDismissing: boolean;
  onDismiss: () => void;
  onDismissAll: () => void;
  onOpenCommand: () => void;
  total: number;
}) {
  return (
    <div
      className={cn(
        "fixed z-50 flex transition-[top,bottom,right] duration-300 ease-out",
        isMobile ? "inset-0 w-full" : "w-80",
        isDismissing
          ? "animate-out slide-out-to-right-full duration-300 ease-out fill-mode-forwards"
          : "animate-in slide-in-from-right-full fade-in-0 duration-300 ease-out",
      )}
      style={
        isMobile
          ? { zIndex: 50 + stackIndex }
          : {
              top: 16 + depth * 8,
              bottom: 16 + depth * 8,
              right: depth * 12 + 16,
              zIndex: 50 + stackIndex,
            }
      }
    >
      <div
        className={cn(
          "relative flex flex-1 flex-col overflow-hidden text-sm",
          isMobile
            ? "bg-popover p-boundary text-popover-foreground"
            : "rounded-xl bg-popover p-section text-popover-foreground shadow-proc-md ring-1 ring-foreground/10",
        )}
      >
        <SheetActionBar>
          {isMobile ? (
            <>
              <Button variant="ghost" size="icon-sm" className="max-sm:size-11" onClick={onDismiss}>
                <HugeiconsIcon icon={ArrowRight01Icon} />
                <span className="sr-only">Dismiss</span>
              </Button>
              <Button variant="ghost" size="icon-sm" className="ml-auto max-sm:size-11">
                <HugeiconsIcon icon={MoreVerticalIcon} />
                <span className="sr-only">More actions</span>
              </Button>
              {total > 1 && (
                <Button variant="ghost" size="icon-sm" className="max-sm:size-11" onClick={onDismissAll}>
                  <HugeiconsIcon icon={Cancel01Icon} />
                  <span className="sr-only">Close all</span>
                </Button>
              )}
            </>
          ) : (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={onDismiss}>
                    <HugeiconsIcon icon={ArrowRight01Icon} />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="z-[60]">Dismiss</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="ml-auto">
                    <HugeiconsIcon icon={MoreVerticalIcon} />
                    <span className="sr-only">More actions</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="z-[60]">More actions</TooltipContent>
              </Tooltip>
              {total > 1 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm" onClick={onDismissAll}>
                      <HugeiconsIcon icon={Cancel01Icon} />
                      <span className="sr-only">Close all</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="z-[60]">Close all</TooltipContent>
                </Tooltip>
              )}
            </>
          )}
        </SheetActionBar>
        <SheetScrollFade />
        <SheetBody>
          <span className="font-medium">Details panel #{id}</span>
          <Muted className="mt-2">Full breakdown for the selected certification.</Muted>
          <div className="mt-4 flex flex-col gap-3">
            <Muted>Certification: ISO 27001 audit</Muted>
            <Muted>Owner: Sarah K.</Muted>
            <Muted>Start date: 2026-01-15</Muted>
            <Muted>Target completion: 2026-06-30</Muted>
            <Muted>Progress: 62% complete, 4 controls remaining.</Muted>
          </div>
          {/* Search bar that opens command palette */}
          <button
            className="mt-element flex w-full items-center gap-2 rounded-md border px-element py-micro text-sm text-muted-foreground hover:border-foreground/20"
            onClick={onOpenCommand}
          >
            <HugeiconsIcon icon={Search01Icon} className="size-4" />
            Search commands...
          </button>
        </SheetBody>
        <SheetScrollFadeBottom />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stacking sequence view
// ---------------------------------------------------------------------------

function StackingSequenceView() {
  const isMobile = useIsMobile();

  // Panels
  const [panels, setPanels] = React.useState<number[]>([]);
  const [dismissing, setDismissing] = React.useState<Set<number>>(new Set());
  const panelCounter = React.useRef(0);
  const visiblePanels = panels.filter((id) => !dismissing.has(id));

  // Command palette
  const [commandOpen, setCommandOpen] = React.useState(false);

  const addPanel = () => {
    panelCounter.current += 1;
    setPanels((prev) => [...prev, panelCounter.current]);
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

  const removeAll = () => {
    for (const p of [...panels]) removePanel(p);
  };

  return (
    <TooltipProvider delayDuration={300}>
    <div className="flex min-h-screen flex-col bg-background">
      {/* L1: Card */}
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Certification tracker</CardTitle>
          </CardHeader>
          <CardContent>
            {/* L3: Dropdown → Drawer on mobile */}
            {isMobile ? (
              <>
                <Button variant="outline" className="w-full" onClick={() => addPanel()}>
                  Actions
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onSelect={() => addPanel()}>Open sheet</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mobile: Dropdown as Drawer */}
      {/* On mobile the "Actions" button directly opens a sheet, matching the drawer → sheet pattern */}

      {/* L3: Stacking sheets */}
      {panels.map((id, i) => {
        const stackIndex = i;
        const depth = panels.length - 1 - i;
        return (
          <FloatingPanel
            key={id}
            id={id}
            depth={depth}
            stackIndex={stackIndex}
            isMobile={isMobile}
            isDismissing={dismissing.has(id)}
            onDismiss={() => removePanel(id)}
            onDismissAll={removeAll}
            onOpenCommand={() => setCommandOpen(true)}
            total={visiblePanels.length}
          />
        );
      })}

      {/* L4: Command palette */}
      {isMobile ? (
        <DialogPrimitive.Root open={commandOpen} onOpenChange={setCommandOpen} modal={false}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Content className="fixed inset-0 z-[60] bg-sidebar text-sidebar-foreground data-open:animate-in data-open:slide-in-from-right-full data-open:duration-200 data-closed:animate-out data-closed:slide-out-to-right-full data-closed:duration-200">
              <div className="flex h-full flex-col p-boundary">
                <div className="-mx-2 -mt-2 flex items-center gap-micro">
                  <Button variant="ghost" size="icon-sm" className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground max-sm:size-11" onClick={() => setCommandOpen(false)}>
                    <HugeiconsIcon icon={ArrowRight01Icon} />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                <div className="pt-element">
                  <div className="relative">
                    <HugeiconsIcon icon={Search01Icon} className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search commands..." className="h-8 pl-8 border-sidebar-border max-sm:h-11" autoFocus />
                  </div>
                </div>
                <div className="-mx-2 flex-1 overflow-y-auto pt-element">
                  <div className="flex h-8 shrink-0 items-center px-element text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/70">Actions</div>
                  <nav className="flex flex-col gap-1">
                    <NavItem onClick={() => { toast.success("Export complete", { description: "Certification report has been saved." }); }}>
                      Export report
                    </NavItem>
                    <NavItem onClick={() => { setCommandOpen(false); removeAll(); setPanels([]); }}>
                      Reset view
                    </NavItem>
                  </nav>
                </div>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      ) : (
        <DialogPrimitive.Root open={commandOpen} onOpenChange={setCommandOpen}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/10 backdrop-blur-[1px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
            <DialogPrimitive.Content className="fixed top-1/3 left-1/2 z-[60] w-[calc(100%-var(--spacing-boundary)*2)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl bg-popover p-0 text-sm text-popover-foreground ring-1 ring-foreground/10 shadow-proc-lg outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
              <Command>
                <CommandInput placeholder="Search commands..." autoFocus />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Actions">
                    <CommandItem onSelect={() => {
                      toast.success("Export complete", { description: "Certification report has been saved." });
                    }}>
                      Export report
                    </CommandItem>
                    <CommandItem onSelect={() => { setCommandOpen(false); removeAll(); setPanels([]); }}>
                      Reset view
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}

      {/* L6: Toast */}
      <Toaster position={isMobile ? "bottom-center" : "bottom-right"} closeButton style={{ "--toast-close-button-start": "unset", "--toast-close-button-end": "0", "--toast-close-button-transform": "translate(50%, -50%)" } as React.CSSProperties} />
    </div>
    </TooltipProvider>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

export const StackingSequence: Story = {
  render: () => <StackingSequenceView />,
};

// ---------------------------------------------------------------------------
// Alert dialog prototype
// ---------------------------------------------------------------------------

function AlertDialogPrototypeView() {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const toastsTriggered = React.useRef(false);

  React.useEffect(() => {
    if (!open) {
      toastsTriggered.current = false;
      return;
    }
    const timer1 = setTimeout(() => {
      if (!toastsTriggered.current) {
        toastsTriggered.current = true;
        toast("Backup started", {
          description: "Your data is being backed up automatically.",
        });
      }
    }, 2000);
    const timer2 = setTimeout(() => {
      toast.success("Sync complete", {
        description: "All changes have been saved to the server.",
      });
    }, 3000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [open]);

  return (
    <TooltipProvider delayDuration={300}>
    <div className="flex min-h-screen items-center justify-center bg-background">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button>Delete certification</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this certification?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the certification and all associated{" "}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help underline decoration-dotted underline-offset-2">
                    audit records
                  </span>
                </TooltipTrigger>
                <TooltipContent className="z-[60]">
                  Includes all evidence, findings, and compliance reports linked to this certification.
                </TooltipContent>
              </Tooltip>
              {" "}from your account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => setOpen(false)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster position={isMobile ? "bottom-center" : "bottom-right"} closeButton style={{ "--toast-close-button-start": "unset", "--toast-close-button-end": "0", "--toast-close-button-transform": "translate(50%, -50%)" } as React.CSSProperties} />
    </div>
    </TooltipProvider>
  );
}

export const AlertDialogPrototype: Story = {
  render: () => <AlertDialogPrototypeView />,
};
