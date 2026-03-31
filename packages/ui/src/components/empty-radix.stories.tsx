import type { Meta, StoryObj } from "@storybook/react-vite";
import { InboxIcon, FileIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from "@/components/ui/empty";

/**
 * An empty state placeholder shown when there is no content to display.
 */
const meta: Meta<typeof Empty> = {
  title: "components/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default empty state with icon, title, description, and action.
 */
export const Default: Story = {
  render: () => (
    <Empty className="w-[420px]">
      <EmptyIcon>
        <InboxIcon />
      </EmptyIcon>
      <EmptyTitle>No messages</EmptyTitle>
      <EmptyDescription>
        You don't have any messages yet. Start a conversation to see them here.
      </EmptyDescription>
      <EmptyActions>
        <Button>Compose</Button>
      </EmptyActions>
    </Empty>
  ),
};

/**
 * Empty state without an action button.
 */
export const WithoutAction: Story = {
  render: () => (
    <Empty className="w-[420px]">
      <EmptyIcon>
        <FileIcon />
      </EmptyIcon>
      <EmptyTitle>No documents</EmptyTitle>
      <EmptyDescription>There are no documents in this folder.</EmptyDescription>
    </Empty>
  ),
};

/**
 * Empty state for search results.
 */
export const SearchResults: Story = {
  render: () => (
    <Empty className="w-[420px]">
      <EmptyIcon>
        <SearchIcon />
      </EmptyIcon>
      <EmptyTitle>No results found</EmptyTitle>
      <EmptyDescription>
        Try adjusting your search or filter to find what you're looking for.
      </EmptyDescription>
      <EmptyActions>
        <Button variant="outline">Clear filters</Button>
      </EmptyActions>
    </Empty>
  ),
};
