import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { expect, userEvent, within } from "storybook/test";

/**
 * Displays a menu to the user — such as a set of actions or functions —
 * triggered by a button.
 */
const meta = {
  title: "components/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  argTypes: {},
  args: {},
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-md border border-dashed bg-background text-sm text-muted-foreground">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-32">
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the context menu.
 */
export const Default: Story = {};

/**
 * A context menu with shortcuts.
 */
export const WithShortcuts: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-md border border-dashed bg-background text-sm text-muted-foreground">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-32">
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * A context menu with a submenu.
 */
export const WithSubmenu: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-md border border-dashed bg-background text-sm text-muted-foreground">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-32">
        <ContextMenuItem>
          New tab
          <ContextMenuShortcut>⌘N</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              Save page as...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Create shortcut...</ContextMenuItem>
            <ContextMenuItem>Name window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * A context menu with checkboxes.
 */
export const WithCheckboxes: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-md border border-dashed bg-background text-sm text-muted-foreground">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuCheckboxItem checked>
          Show comments
          <ContextMenuShortcut>⌘⇧C</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show preview</ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * A context menu with a radio group.
 */
export const WithRadioGroup: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-md border border-dashed bg-background text-sm text-muted-foreground">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuRadioGroup value="light">
          <ContextMenuLabel>Theme</ContextMenuLabel>
          <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
          <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const ShouldOpenClose: Story = {
  name: "when right-clicking the trigger area, the menu appears and can be interacted with",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, canvas, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    step("Right-click on the trigger area", async () => {
      await userEvent.pointer({
        keys: "[MouseRight>]",
        target: await canvas.findByText(/click here/i),
        coords: {
          x: canvasElement.clientWidth / 2,
          y: canvasElement.clientHeight / 2,
        },
      });
    });
    expect(await canvasBody.findByRole("menu")).toBeInTheDocument();
    const items = await canvasBody.findAllByRole("menuitem");
    expect(items).toHaveLength(4);

    step("Click the first menu item", async () => {
      await userEvent.click(items[0], { delay: 100 });
    });
  },
};
