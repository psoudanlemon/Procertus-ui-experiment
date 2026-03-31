"use client";

import * as React from "react";
import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CalendarPlusIcon,
  ChevronDownIcon,
  ClockIcon,
  ListFilterIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  SearchIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

/**
 * Groups related buttons together as a single visual unit. Use when buttons
 * perform related actions. For toggling state, use `ToggleGroup` instead.
 */
const meta = {
  title: "components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
  },
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Archive</Button>
      <Button variant="outline">Report</Button>
      <Button variant="outline">Snooze</Button>
    </ButtonGroup>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default horizontal button group with outline buttons.
 */
export const Default: Story = {};

/**
 * Use `orientation="vertical"` to stack buttons vertically.
 */
export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
};

/**
 * Buttons with `size="sm"` for compact interfaces.
 */
export const Small: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="sm">
        Archive
      </Button>
      <Button variant="outline" size="sm">
        Report
      </Button>
      <Button variant="outline" size="sm">
        Snooze
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Buttons with `size="lg"` for greater visibility.
 */
export const Large: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="lg">
        Archive
      </Button>
      <Button variant="outline" size="lg">
        Report
      </Button>
      <Button variant="outline" size="lg">
        Snooze
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Nest `ButtonGroup` components inside a parent to create visually
 * separated clusters with automatic gap spacing.
 */
export const Nested: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Go Back">
          <ArrowLeftIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Snooze</Button>
        <Button variant="outline" size="icon" aria-label="More Options">
          <MoreHorizontalIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
};

/**
 * Use `ButtonGroupSeparator` between buttons to add a visual divider.
 * Recommended for non-outline variants that lack visible borders.
 */
export const Separator: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Save</Button>
      <ButtonGroupSeparator />
      <Button size="icon" aria-label="More Options">
        <ChevronDownIcon />
      </Button>
    </ButtonGroup>
  ),
};

/**
 * A split button combining a primary action with a dropdown trigger,
 * separated by a `ButtonGroupSeparator`.
 */
export const SplitButton: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Save Draft</Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" aria-label="More Save Options">
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>Save and Publish</DropdownMenuItem>
            <DropdownMenuItem>Save as Template</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  ),
};

/**
 * Use `ButtonGroupText` to display a static label alongside buttons.
 */
export const TextLabel: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupText>Status</ButtonGroupText>
      <Button variant="outline">Active</Button>
      <Button variant="outline">Inactive</Button>
    </ButtonGroup>
  ),
};

/**
 * Place an `Input` inside the group alongside buttons.
 */
export const InputGroup: Story = {
  render: (args) => (
    <ButtonGroup {...args} className="w-80">
      <Button variant="outline" size="icon" aria-label="Search">
        <SearchIcon />
      </Button>
      <Input placeholder="Search certifications..." />
    </ButtonGroup>
  ),
};

/**
 * The full demo combining nested groups, icons, and a dropdown menu
 * with submenus — a realistic toolbar pattern for the management platform.
 */
export const Toolbar: Story = {
  render: function ToolbarStory(args) {
    const [label, setLabel] = React.useState("personal");

    return (
      <ButtonGroup {...args}>
        <ButtonGroup className="hidden sm:flex">
          <Button variant="outline" size="icon" aria-label="Go Back">
            <ArrowLeftIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Archive</Button>
          <Button variant="outline">Report</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Snooze</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More Options">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <MailCheckIcon />
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArchiveIcon />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <ClockIcon />
                  Snooze
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CalendarPlusIcon />
                  Add to Calendar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ListFilterIcon />
                  Add to List
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <TagIcon />
                    Label As...
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={label} onValueChange={setLabel}>
                      <DropdownMenuRadioItem value="personal">Personal</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="work">Work</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="other">Other</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon />
                  Trash
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </ButtonGroup>
    );
  },
};

export const ShouldOpenDropdown: Story = {
  name: "when clicking the dropdown trigger, should open the menu",
  tags: ["!dev", "!autodocs"],
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Save Draft</Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" aria-label="More Save Options">
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>Save and Publish</DropdownMenuItem>
            <DropdownMenuItem>Save as Template</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  ),
  play: async ({ canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);

    await step("Click the dropdown trigger", async () => {
      await userEvent.click(await body.findByRole("button", { name: /more save options/i }));
      expect(await body.findByRole("menu")).toBeInTheDocument();
    });

    await step("Verify menu items are visible", async () => {
      const items = await body.findAllByRole("menuitem");
      expect(items).toHaveLength(2);
    });
  },
};
