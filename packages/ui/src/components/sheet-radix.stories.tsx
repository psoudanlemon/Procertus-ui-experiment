import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import {
  Sheet,
  SheetActionBar,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetScrollFade,
  SheetScrollFadeBottom,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  MoreVerticalIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { expect, userEvent, within } from "storybook/test";

/**
 * Extends the Dialog component to display content that complements the main
 * content of the screen.
 */
const meta: Meta<typeof SheetContent> = {
  title: "components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  argTypes: {
    side: {
      options: ["top", "bottom", "left", "right"],
      control: {
        type: "radio",
      },
    },
  },
  args: {
    side: "right",
  },
  render: (args) => (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent {...args}>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose className="hover:underline">Cancel</SheetClose>
          <SheetClose className="rounded bg-primary px-4 py-2 text-primary-foreground">
            Submit
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SheetContent>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the sheet.
 */
export const Default: Story = {};

export const ShouldOpenCloseWithSubmit: Story = {
  name: "when clicking Submit button, should close the sheet",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("open the sheet", async () => {
      await userEvent.click(await canvasBody.findByRole("button", { name: /open/i }));
      const sheet = await canvasBody.findByRole("dialog");
      expect(sheet).toBeInTheDocument();
      expect(sheet).toHaveAttribute("data-state", "open");
    });

    await step("close the sheet", async () => {
      await userEvent.click(await canvasBody.findByRole("button", { name: /submit/i }));
      expect(await canvasBody.findByRole("dialog")).toHaveAttribute("data-state", "closed");
    });
  },
};

export const ShouldOpenCloseWithCancel: Story = {
  name: "when clicking Cancel button, should close the sheet",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("open the sheet", async () => {
      await userEvent.click(await canvasBody.findByRole("button", { name: /open/i }));
      const sheet = await canvasBody.findByRole("dialog");
      expect(sheet).toBeInTheDocument();
      expect(sheet).toHaveAttribute("data-state", "open");
    });

    await step("close the sheet", async () => {
      await userEvent.click(await canvasBody.findByRole("button", { name: /cancel/i }));
      expect(await canvasBody.findByRole("dialog")).toHaveAttribute("data-state", "closed");
    });
  },
};

export const ShouldOpenCloseWithClose: Story = {
  name: "when clicking Close icon, should close the sheet",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("open the sheet", async () => {
      await userEvent.click(await canvasBody.findByRole("button", { name: /open/i }));
      const sheet = await canvasBody.findByRole("dialog");
      expect(sheet).toBeInTheDocument();
      expect(sheet).toHaveAttribute("data-state", "open");
    });

    await step("close the sheet", async () => {
      await userEvent.click(await canvasBody.findByRole("button", { name: /close/i }));
      expect(await canvasBody.findByRole("dialog")).toHaveAttribute("data-state", "closed");
    });
  },
};

// ---------------------------------------------------------------------------
// Action bar
// ---------------------------------------------------------------------------

function ActionBarRender() {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipProvider delayDuration={300}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent showCloseButton={false} onOpenAutoFocus={(e) => e.preventDefault()}>
          <SheetActionBar>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)}>
                  <HugeiconsIcon icon={ArrowRight01Icon} />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Dismiss</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="ml-auto">
                  <HugeiconsIcon icon={MoreVerticalIcon} />
                  <span className="sr-only">More actions</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>More actions</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)}>
                  <HugeiconsIcon icon={Cancel01Icon} />
                  <span className="sr-only">Close</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
          </SheetActionBar>
          <SheetScrollFade />
          <SheetBody>
            <span className="font-medium">Audit details</span>
            <p className="mt-2 text-sm text-muted-foreground">Full breakdown for the selected certification.</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <p>Certification: ISO 27001 audit</p>
              <p>Owner: Sarah K.</p>
              <p>Start date: 2026-01-15</p>
              <p>Target completion: 2026-06-30</p>
              <p>Progress: 62% complete, 4 controls remaining.</p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p className="mt-3 text-sm text-muted-foreground">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p className="mt-3 text-sm text-muted-foreground">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            <p className="mt-3 text-sm text-muted-foreground">Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            <p className="mt-3 text-sm text-muted-foreground">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
            <p className="mt-3 text-sm text-muted-foreground">Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>
            <p className="mt-3 text-sm text-muted-foreground">Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</p>
            <p className="mt-3 text-sm text-muted-foreground">Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>
          </SheetBody>
          <SheetScrollFadeBottom />
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}

/**
 * Sheet with action bar replacing the close button. Uses SheetActionBar,
 * SheetScrollFade, and SheetBody. Scroll the content to see the fades.
 */
export const ActionBar: Story = {
  tags: ["!autodocs"],
  render: () => <ActionBarRender />,
};

// ---------------------------------------------------------------------------
// Stacking
// ---------------------------------------------------------------------------

function useIsMobileLocal() {
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

function StackingPanel({
  id,
  depth,
  stackIndex,
  isMobile,
  isDismissing,
  onDismiss,
  onDismissAll,
  onViewDetails,
  showViewDetails,
  total,
}: {
  id: number;
  depth: number;
  stackIndex: number;
  isMobile: boolean;
  isDismissing: boolean;
  onDismiss: () => void;
  onDismissAll: () => void;
  onViewDetails: () => void;
  showViewDetails: boolean;
  total: number;
}) {
  return (
    <div
      className={`fixed z-50 flex transition-[top,bottom,right] duration-300 ease-out ${
        isMobile ? "inset-0 w-full" : "w-80"
      } ${
        isDismissing
          ? "animate-out slide-out-to-right-full duration-300 ease-out fill-mode-forwards"
          : "animate-in slide-in-from-right-full fade-in-0 duration-300 ease-out"
      }`}
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
        className={`relative flex flex-1 flex-col overflow-hidden text-sm ${
          isMobile
            ? "bg-popover p-boundary text-popover-foreground"
            : "rounded-xl bg-popover p-section text-popover-foreground shadow-proc-md ring-1 ring-foreground/10"
        }`}
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
          <p className="mt-2 text-sm text-muted-foreground">Floating side panel, no backdrop. Panels stack horizontally with independent dismiss.</p>
          <p className="mt-4 text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p className="mt-3 text-sm text-muted-foreground">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          {showViewDetails && (
            <Button variant="secondary" size="sm" className="mt-element" onClick={onViewDetails}>
              View details
            </Button>
          )}
        </SheetBody>
        <SheetScrollFadeBottom />
      </div>
    </div>
  );
}

function StackingRender() {
  const isMobile = useIsMobileLocal();
  const [panels, setPanels] = React.useState<number[]>([]);
  const [dismissing, setDismissing] = React.useState<Set<number>>(new Set());
  const panelCounter = React.useRef(0);
  const visiblePanels = panels.filter((id) => !dismissing.has(id));

  const addPanel = () => {
    if (visiblePanels.length >= 5) return;
    panelCounter.current += 1;
    setPanels((prev) => [...prev, panelCounter.current]);
  };

  const removePanel = (id: number) => {
    setDismissing((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setPanels((prev) => prev.filter((p) => p !== id));
      setDismissing((prev) => { const next = new Set(prev); next.delete(id); return next; });
    }, 300);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <button className="cursor-default" onClick={addPanel}>Open</button>
        {panels.map((id, i) => {
          const totalVisible = visiblePanels.length;
          const stackIndex = i;
          const depth = panels.length - 1 - i;
          return (
            <StackingPanel
              key={id} id={id} depth={depth}
              stackIndex={stackIndex}
              isMobile={isMobile} isDismissing={dismissing.has(id)}
              onDismiss={() => removePanel(id)}
              onDismissAll={() => { for (const p of [...panels]) removePanel(p); }}
              onViewDetails={addPanel}
              showViewDetails={visiblePanels.length < 5}
              total={visiblePanels.length}
            />
          );
        })}
      </div>
    </TooltipProvider>
  );
}

/**
 * Stacking panels that open from inside each other via "View details".
 * Up to 5 panels deep with horizontal offset stacking.
 */
export const Stacking: Story = {
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => <StackingRender />,
};
