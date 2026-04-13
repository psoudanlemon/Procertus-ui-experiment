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
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { toast, Toaster } from "@/components/ui/sonner";
import { H2 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";
import { ArrowRightIcon, EllipsisVerticalIcon, MaximizeIcon } from "lucide-react";

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
// Sandbox component
// ---------------------------------------------------------------------------

function ElevationSandbox() {
  const isMobile = useIsMobile();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [panels, setPanels] = React.useState<number[]>([]);
  const [dismissing, setDismissing] = React.useState<Set<number>>(new Set());
  const panelCounter = React.useRef(0);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  const addPanel = () => {
    if (visiblePanels.length >= 5) return;
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

  const visiblePanels = panels.filter((id) => !dismissing.has(id));

  return (
    <TooltipProvider>
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
            <div className="grid grid-cols-3 gap-4">
              {/* Tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Tooltip
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="shadow-proc-xs">
                  Whisper layer: informational hints
                </TooltipContent>
              </Tooltip>

              {/* Dropdown */}
              {isMobile ? (
                <>
                  <Button
                    variant="outline"
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
                    <Button variant="outline" className="w-full">
                      Dropdown
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="shadow-proc-md">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Side sheet (stackable) */}
              <Button
                variant="outline"
                className="w-full"
                onClick={addPanel}
              >
                Side sheet
              </Button>

              {/* Command palette */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCommandOpen(true)}
              >
                Command palette
              </Button>
              <DialogPrimitive.Root open={commandOpen} onOpenChange={setCommandOpen}>
                <DialogPrimitive.Portal>
                  <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[1px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
                  <DialogPrimitive.Content className="fixed top-1/3 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl bg-popover p-0 text-sm text-popover-foreground ring-1 ring-foreground/10 shadow-proc-lg outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
                    <Command>
                      <CommandInput placeholder="Type a command..." />
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

              {/* Modal */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setModalOpen(true)}
              >
                Modal
              </Button>
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogPrimitive.Portal>
                  <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[1px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
                  <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-section rounded-xl bg-popover p-section text-sm text-popover-foreground ring-1 ring-foreground/10 shadow-proc-lg duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
                    <DialogHeader>
                      <DialogTitle>Confirm action</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. Are you sure?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
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

              {/* Toast */}
              <Button
                variant="outline"
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

        {/* Stacked floating panels: full-height, horizontal stack from right */}
        {panels.map((id) => {
          const isDismissing = dismissing.has(id);
          const stackIndex = visiblePanels.indexOf(id);
          const depth = stackIndex >= 0 ? visiblePanels.length - 1 - stackIndex : 0;
          const isMaxDepth = stackIndex === 4;

          return (
          <div
            key={id}
            className={`fixed z-50 flex w-80 transition-[top,bottom,right,opacity,transform] duration-300 ease-out ${
              isDismissing
                ? "animate-out slide-out-to-right-full fade-out-0 fill-mode-forwards"
                : "animate-in slide-in-from-right-full fade-in-0"
            }`}
            style={{
              top: 16 + depth * 8,
              bottom: 16 + depth * 8,
              right: depth * 12 + 16,
              zIndex: 50 + (stackIndex >= 0 ? stackIndex : 0),
            }}
          >
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl bg-popover p-section text-sm text-popover-foreground shadow-proc-md ring-1 ring-foreground/10">
              {/* Action bar */}
              <div className="-mx-2 -mt-2 flex items-center gap-micro">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => window.open("#", "_blank")}
                >
                  <MaximizeIcon />
                  <span className="sr-only">Expand to full page</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removePanel(id)}
                >
                  <ArrowRightIcon />
                  <span className="sr-only">Dismiss</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="ml-auto"
                >
                  <EllipsisVerticalIcon />
                  <span className="sr-only">More actions</span>
                </Button>
              </div>
              {/* Content */}
              <div className="flex-1 overflow-y-auto pt-element">
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
              </div>
            </div>
          </div>
          );
        })}

        <Toaster />
      </div>
    </TooltipProvider>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

export const Sandbox: Story = {
  render: () => <ElevationSandbox />,
};
