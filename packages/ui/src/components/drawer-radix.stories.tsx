import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { expect, fn, userEvent, within } from "storybook/test";

/**
 * A drawer component for React.
 */
const meta = {
  title: "components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  args: {
    onOpenChange: fn(),
    onClose: fn(),
    onAnimationEnd: fn(),
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left!">
          <DrawerTitle>Quick preview</DrawerTitle>
          <DrawerDescription>
            A lightweight overlay for confirming context without leaving the current view.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-section text-sm text-muted-foreground">
          Drawers on mobile replace simple dropdown menus and popovers. They slide up from the
          bottom edge and can be dismissed by swiping down or tapping outside.
        </div>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the drawer with left-aligned text content.
 */
export const Default: Story = {};

/**
 * Drawer with action buttons.
 */
export const Actions: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose className="rounded bg-primary px-4 py-2 text-primary-foreground">
            Submit
          </DrawerClose>
          <DrawerClose className="hover:underline">Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const ShouldOpenCloseWithSubmit: Story = {
  name: "when clicking Submit button, should close the drawer",
  tags: ["!dev", "!autodocs"],
  render: Actions.render,
  play: async ({ args, canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open the drawer", async () => {
      await userEvent.click(await canvasBody.findByRole("button", { name: /open/i }));
      await expect(args.onOpenChange).toHaveBeenCalled();

      const dialog = await canvasBody.findByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("data-state", "open");
    });

    await step("Close the drawer", async () => {
      await userEvent.click(await canvasBody.findByRole("button", { name: /submit/i }), {
        delay: 100,
      });
      await expect(args.onClose).toHaveBeenCalled();
      expect(await canvasBody.findByRole("dialog")).toHaveAttribute("data-state", "closed");
    });
  },
};

export const ShouldOpenCloseWithCancel: Story = {
  name: "when clicking Cancel button, should close the drawer",
  tags: ["!dev", "!autodocs"],
  render: Actions.render,
  play: async ({ args, canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open the drawer", async () => {
      await userEvent.click(await canvasBody.findByRole("button", { name: /open/i }));
      await expect(args.onOpenChange).toHaveBeenCalled();

      const dialog = await canvasBody.findByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("data-state", "open");
    });

    await step("Close the drawer", async () => {
      await userEvent.click(await canvasBody.findByRole("button", { name: /cancel/i }), {
        delay: 100,
      });
      await expect(args.onClose).toHaveBeenCalled();
      expect(await canvasBody.findByRole("dialog")).toHaveAttribute("data-state", "closed");
    });
  },
};

// ---------------------------------------------------------------------------
// Scroll picker
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

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = items.findIndex((i) => i.value === value);
    if (idx >= 0) {
      el.scrollTop = idx * PICKER_ITEM_HEIGHT;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollTop / PICKER_ITEM_HEIGHT);
      setCenterIndex(Math.max(0, Math.min(items.length - 1, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

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
    return () => { el.removeEventListener("scroll", onScrollEnd); clearTimeout(timeout); };
  }, [items, onValueChange]);

  return (
    <div className="relative" style={{ height: containerHeight }}>
      <div
        className="pointer-events-none absolute inset-x-0 z-0 rounded-lg bg-accent"
        style={{ top: padCount * PICKER_ITEM_HEIGHT, height: PICKER_ITEM_HEIGHT }}
      />
      <div
        ref={scrollRef}
        className="relative z-0 h-full snap-y snap-mandatory overflow-y-auto scrollbar-none"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {Array.from({ length: padCount }).map((_, i) => (
          <div key={`pad-top-${i}`} className="flex items-center justify-center text-sm text-muted-foreground/40" style={{ height: PICKER_ITEM_HEIGHT }}>
            {i === padCount - 1 ? "—" : ""}
          </div>
        ))}
        {items.map((item, i) => (
          <button
            key={item.value}
            className={cn(
              "flex w-full snap-center items-center justify-center text-sm transition-colors",
              i === centerIndex ? "font-medium text-accent-foreground" : "text-foreground",
            )}
            style={{ height: PICKER_ITEM_HEIGHT }}
            onClick={() => {
              scrollRef.current?.scrollTo({ top: i * PICKER_ITEM_HEIGHT, behavior: "smooth" });
              onValueChange(item.value);
            }}
          >
            {item.label}
          </button>
        ))}
        {Array.from({ length: padCount }).map((_, i) => (
          <div key={`pad-bottom-${i}`} className="flex items-center justify-center text-sm text-muted-foreground/40" style={{ height: PICKER_ITEM_HEIGHT }}>
            {i === 0 ? "—" : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Select story
// ---------------------------------------------------------------------------

function SelectRender() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("draft");

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>Open</DrawerTrigger>
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
            value={value}
            onValueChange={setValue}
          />
          <Button className="min-h-[44px] w-full" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/**
 * Drawer with a scroll picker for selecting from a list of options.
 * The center item is highlighted. Scroll or tap to change selection,
 * then confirm.
 */
export const Select: Story = {
  tags: ["!autodocs"],
  render: () => <SelectRender />,
};
