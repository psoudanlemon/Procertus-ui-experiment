import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "@procertus-ui/ui";
import { MeetingCard } from "../meeting-card/MeetingCard";
import { MeetingList } from "./MeetingList";

const meta = {
  title: "Admin/Calendar & Scheduling/MeetingList",
  component: MeetingList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Card panel with search and slot for stacked rows or tables.",
      },
      canvas: { layout: "padded" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MeetingList>;

export default meta;

function Row(props: { title: string; subtitle: string; fallback: string }) {
  const [open, setOpen] = useState(false);
  return (
    <MeetingCard
      title={props.title}
      subtitle={props.subtitle}
      meetingTypeLabel="Internal"
      status={{ label: "Confirmed", variant: "outline" }}
      avatarFallback={props.fallback}
      menuOpen={open}
      onMenuOpenChange={setOpen}
      onEdit={() => undefined}
    />
  );
}

function MeetingListDemo() {
  const [q, setQ] = useState("");
  return (
    <MeetingList
      title="Upcoming meetings"
      description="Filtered by your calendar scope."
      searchValue={q}
      onSearchChange={setQ}
      actions={
        <Button type="button" size="sm">
          New meeting
        </Button>
      }
    >
      <div className="flex flex-col gap-2 px-6">
        <Row title="Design critique" subtitle="Today 15:00–15:45 · Zoom" fallback="DC" />
        <Row title="Hiring panel" subtitle="Tomorrow 09:30–10:30 · Conf A" fallback="HP" />
      </div>
    </MeetingList>
  );
}

export const Default = {
  render: () => <MeetingListDemo />,
} as unknown as StoryObj<typeof meta>;

export const EmptyState = {
  render: () => {
    const [q, setQ] = useState("");
    return (
      <MeetingList
        title="Meetings"
        description="No meetings match the current filters."
        searchValue={q}
        onSearchChange={setQ}
        showSearch
      >
        <div className="px-6 py-10 text-center text-sm text-muted-foreground">
          Nothing scheduled — create a meeting or adjust search.
        </div>
      </MeetingList>
    );
  },
} as unknown as StoryObj<typeof meta>;
