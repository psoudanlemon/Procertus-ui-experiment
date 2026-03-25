import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { MeetingCard } from "./MeetingCard";

const meta = {
  title: "Admin/Calendar & Scheduling/MeetingCard",
  component: MeetingCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Single meeting row for agenda or inbox-style lists.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MeetingCard>;

export default meta;

function MeetingCardDemo() {
  const demoStatus = { label: "Confirmed", variant: "default" as const };
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <MeetingCard
      title="Sprint planning"
      subtitle="Tue 10:00–11:00 · Conf Room B"
      meetingTypeLabel="Team"
      status={demoStatus}
      avatarFallback="AR"
      menuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
      onEdit={() => undefined}
      onCopyInvite={() => undefined}
      onDuplicate={() => undefined}
      onCancel={() => undefined}
    />
  );
}

export const Default = {
  render: () => <MeetingCardDemo />,
} as unknown as StoryObj<typeof meta>;

export const LongTextAndOverflow = {
  render: () => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
      <div className="w-[min(100%,22rem)]">
        <MeetingCard
          title="Quarterly business review with extended stakeholders and regional leads — agenda TBD"
          subtitle="Wed 14:00–15:30 · Very Long Conference Room Name / Building 7 / Floor 12 / Hybrid Zoom bridge"
          meetingTypeLabel="External"
          status={{ label: "Tentative", variant: "secondary" }}
          avatarFallback="QZ"
          menuOpen={menuOpen}
          onMenuOpenChange={setMenuOpen}
          onEdit={() => undefined}
          onCopyInvite={() => undefined}
        />
      </div>
    );
  },
} as unknown as StoryObj<typeof meta>;
