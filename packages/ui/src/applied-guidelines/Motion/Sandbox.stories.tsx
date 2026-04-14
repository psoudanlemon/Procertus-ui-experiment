import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
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
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { H2 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Applied Guidelines/Motion",
  tags: ["!autodocs", "!docs"],
  parameters: {
    layout: "centered",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 900 },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <H2 className="m-0 text-base">{title}</H2>
      <Muted className="m-0 mt-1 text-sm">{subtitle}</Muted>
      <div className="mt-6 flex flex-wrap items-start gap-6">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trigger card
// ---------------------------------------------------------------------------

function TriggerCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sandbox story
// ---------------------------------------------------------------------------

export const Sandbox: Story = {
  name: "Sandbox",
  render: function SandboxStory() {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);
    const [sheetOpen, setSheetOpen] = React.useState(false);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [accordionValue, setAccordionValue] = React.useState<string>("");
    const [collapsibleOpen, setCollapsibleOpen] = React.useState(false);

    return (
      <TooltipProvider delayDuration={200}>
        <div className="flex w-[780px] max-w-full flex-col gap-12 p-10">
          {/* Header */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-primary-500 m-0 mb-2">
              Motion sandbox
            </p>
            <h1
              className="font-sans font-bold text-foreground m-0 mb-2"
              style={{ fontSize: "1.5rem", lineHeight: 1.2 }}
            >
              Trigger animations
            </h1>
            <Muted className="m-0 max-w-[560px]">
              Interact with each component to see its animation in real time.
              Every animation uses ease-out easing, paired with its duration
              tier.
            </Muted>
          </div>

          {/* ── Fade + scale ────────────────────────────────────── */}
          <Section
            title="Fade + scale"
            subtitle="Floating layers. Instant tier (100ms)."
          >
            {/* Dialog */}
            <TriggerCard label="Dialog">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogPrimitive.Trigger asChild>
                  <Button variant="secondary" size="sm">
                    Open
                  </Button>
                </DialogPrimitive.Trigger>
                <DialogPrimitive.Portal>
                  <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[1px] duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
                  <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-popover p-section shadow-proc-md duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
                    <DialogHeader>
                      <DialogTitle>Dialog</DialogTitle>
                      <DialogDescription>
                        Fade + scale at 100ms with ease-out.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
              </Dialog>
            </TriggerCard>

            {/* Alert dialog */}
            <TriggerCard label="Alert dialog">
              <AlertDialog
                open={alertDialogOpen}
                onOpenChange={setAlertDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Open
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Alert dialog</AlertDialogTitle>
                    <AlertDialogDescription>
                      Fade + scale at 100ms with ease-out.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TriggerCard>

            {/* Popover */}
            <TriggerCard label="Popover">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Open
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <p className="text-sm text-muted-foreground m-0">
                    Fade + scale + slide at 100ms.
                  </p>
                </PopoverContent>
              </Popover>
            </TriggerCard>

            {/* Tooltip */}
            <TriggerCard label="Tooltip">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Hover me
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tooltip at 100ms</TooltipContent>
              </Tooltip>
            </TriggerCard>

            {/* Dropdown */}
            <TriggerCard label="Dropdown">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Open
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TriggerCard>

            {/* Context menu */}
            <TriggerCard label="Context menu">
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Right-click
                  </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Cut</ContextMenuItem>
                  <ContextMenuItem>Copy</ContextMenuItem>
                  <ContextMenuItem>Paste</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </TriggerCard>

            {/* Select */}
            <TriggerCard label="Select">
              <Select>
                <SelectTrigger className="w-28 h-8 text-sm">
                  <SelectValue placeholder="Pick" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Option A</SelectItem>
                  <SelectItem value="b">Option B</SelectItem>
                  <SelectItem value="c">Option C</SelectItem>
                </SelectContent>
              </Select>
            </TriggerCard>

            {/* Hover card */}
            <TriggerCard label="Hover card">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Hover me
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-48">
                  <p className="text-sm text-muted-foreground m-0">
                    Hover card at 100ms.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </TriggerCard>
          </Section>

          {/* ── Slide ───────────────────────────────────────────── */}
          <Section
            title="Slide"
            subtitle="Lateral content. Quick tier (200ms)."
          >
            {/* Sheet right */}
            <TriggerCard label="Sheet (right)">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSheetOpen(true)}
                >
                  Open
                </Button>
                <SheetContent side="right" showCloseButton>
                  <SheetHeader>
                    <SheetTitle>Sheet</SheetTitle>
                    <SheetDescription>
                      Fade + slide at 200ms with ease-out.
                    </SheetDescription>
                  </SheetHeader>
                  <SheetBody>
                    <Skeleton className="h-32 w-full rounded-lg" />
                  </SheetBody>
                </SheetContent>
              </Sheet>
            </TriggerCard>

            {/* Drawer */}
            <TriggerCard label="Drawer">
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Open
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Drawer</DrawerTitle>
                    <DrawerDescription>
                      Slide from bottom at 200ms.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <Skeleton className="h-24 w-full rounded-lg" />
                  </div>
                </DrawerContent>
              </Drawer>
            </TriggerCard>
          </Section>

          {/* ── Expand / collapse ────────────────────────────────── */}
          <Section
            title="Expand / collapse"
            subtitle="Content reveal. Quick tier (200ms)."
          >
            {/* Accordion */}
            <div className="w-full max-w-sm">
              <span className="text-xs font-medium text-foreground block mb-2">
                Accordion
              </span>
              <Accordion
                type="single"
                collapsible
                value={accordionValue}
                onValueChange={setAccordionValue}
                className="rounded-xl border border-border"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-4">
                    Section one
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <p className="text-sm text-muted-foreground m-0">
                      Height animation at 200ms with ease-out.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="px-4">
                    Section two
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <p className="text-sm text-muted-foreground m-0">
                      Content smoothly expands into view.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Collapsible */}
            <div className="w-full max-w-sm">
              <Collapsible
                open={collapsibleOpen}
                onOpenChange={setCollapsibleOpen}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-foreground">
                    Collapsible
                  </span>
                  <CollapsibleTrigger asChild>
                    <Button variant="secondary" size="sm">
                      {collapsibleOpen ? "Collapse" : "Expand"}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground m-0">
                      Height animation at 200ms with ease-out.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </Section>

          {/* ── Continuous loop ──────────────────────────────────── */}
          <Section
            title="Continuous loop"
            subtitle="Ambient state. Always running."
          >
            <TriggerCard label="Spinner">
              <div className="flex size-16 items-center justify-center rounded-xl border border-border bg-card">
                <Spinner size="default" />
              </div>
            </TriggerCard>

            <TriggerCard label="Skeleton">
              <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </TriggerCard>

            <TriggerCard label="Glow-spin">
              <div className="isolate">
                <div className="glow-standout rounded-xl">
                  <div className="flex size-16 items-center justify-center rounded-xl bg-card ring-1 ring-foreground/10">
                    <span className="text-xs font-semibold text-foreground">
                      KPI
                    </span>
                  </div>
                </div>
              </div>
            </TriggerCard>
          </Section>
        </div>
      </TooltipProvider>
    );
  },
};
