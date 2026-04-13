import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui";
import { toast, Toaster } from "@/components/ui/sonner";
import { H3 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Applied Guidelines/Elevation",
  tags: ["!autodocs"],
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
// Step definitions
// ---------------------------------------------------------------------------

const steps = [
  { label: "Initial" },
  { label: "L3 Dropdown" },
  { label: "L3 Side sheet" },
  { label: "L4 Command palette" },
  { label: "L6 Toast" },
] as const;

// ---------------------------------------------------------------------------
// Stacking sequence view
// ---------------------------------------------------------------------------

function StackingSequenceView() {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    if (step === 4) {
      toast.success("Export complete", {
        description: "Certification report has been saved.",
      });
    }
  }, [step]);

  return (
    <div className="flex min-h-[800px] flex-col bg-muted/40">
      {/* Control bar */}
      <div className="sticky top-0 z-[60] flex flex-col gap-2 border-b bg-background px-6 py-3">
        <div className="flex items-center gap-4">
          <H3>Stacking sequence</H3>
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <Button
                key={i}
                variant={step >= i ? "default" : "outline"}
                size="sm"
                onClick={() => setStep(i)}
              >
                Step {i}: {s.label}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => setStep(0)}>
            Reset
          </Button>
        </div>
        <Muted className="text-xs">
          Active layers:{" "}
          {step === 0
            ? "L1 (card only)"
            : `L1${step >= 1 ? " → L3 dropdown" : ""}${step >= 2 ? " → L3 sheet" : ""}${step >= 3 ? " → L4 command palette" : ""}${step >= 4 ? " → L6 toast" : ""}`}
        </Muted>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-proc-xs">
          <CardHeader>
            <CardTitle>Certification tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <DropdownMenu open={step >= 1 && step < 3} modal={false} onOpenChange={() => {}}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="shadow-proc-md" onCloseAutoFocus={(e) => e.preventDefault()}>
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </div>

      {/* Step 2: L3 Side sheet (no backdrop) */}
      <Sheet open={step >= 2} modal={false} onOpenChange={() => {}}>
        <SheetContent side="right" showCloseButton={false}>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              Audit details
              <Badge variant="outline" className="font-mono text-[10px]">
                L3
              </Badge>
            </SheetTitle>
            <SheetDescription>
              Full breakdown for the selected certification.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3 px-4">
            <Muted>Certification: ISO 27001 audit</Muted>
            <Muted>Owner: Sarah K.</Muted>
            <Muted>Start date: 2026-01-15</Muted>
            <Muted>Target completion: 2026-06-30</Muted>
            <Muted>Progress: 62% complete, 4 controls remaining.</Muted>
          </div>
        </SheetContent>
      </Sheet>

      {/* Step 3: L4 Command palette */}
      <DialogPrimitive.Root open={step >= 3} onOpenChange={() => {}} modal={false}>
        <DialogPrimitive.Portal>
          <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm pointer-events-none" style={{ display: step >= 3 ? undefined : "none" }} />
          <DialogPrimitive.Content onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()} className="fixed top-1/3 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl bg-popover p-0 text-sm text-popover-foreground ring-1 ring-foreground/10 shadow-proc-glow-standout outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <Command>
              <div className="flex items-center justify-between px-3 pt-2">
                <Badge variant="outline" className="font-mono text-[10px]">
                  L4
                </Badge>
              </div>
              <CommandInput placeholder="Search commands..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Actions">
                  <CommandItem>
                    Create new certification
                    <CommandShortcut>⌘N</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    Import audit data
                    <CommandShortcut>⌘I</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    Generate report
                    <CommandShortcut>⌘R</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <Toaster />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

export const StackingSequence: Story = {
  render: () => <StackingSequenceView />,
};
