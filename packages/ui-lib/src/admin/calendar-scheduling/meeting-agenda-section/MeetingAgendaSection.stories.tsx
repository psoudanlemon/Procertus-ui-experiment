import type { Meta, StoryObj } from "@storybook/react-vite";

import { MeetingAgendaSection } from "./MeetingAgendaSection";

const meta = {
  title: "Admin/Calendar & Scheduling/MeetingAgendaSection",
  component: MeetingAgendaSection,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Agenda block with optional topics list in children.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MeetingAgendaSection>;

export default meta;

export const Default = {
  args: {
    badge: "45 min",
    title: "Agenda",
    description: "Review goals, blockers, and next steps.",
    primaryLabel: "Save agenda",
    secondaryLabel: "Add topic",
    children: (
      <ol className="list-decimal space-y-2 pl-5 text-sm">
        <li>Check-in (5 min)</li>
        <li>Sprint goals (15 min)</li>
        <li>Risks & dependencies (15 min)</li>
        <li>Wrap-up (10 min)</li>
      </ol>
    ),
  },
  render: (args) => (
    <MeetingAgendaSection {...args} onPrimary={() => undefined} onSecondary={() => undefined} />
  ),
} satisfies StoryObj<typeof meta>;

export const LongTopicTitles = {
  args: {
    title: "Agenda",
    primaryLabel: "Done",
    children: (
      <ul className="space-y-3 text-sm">
        <li className="rounded-md border border-border bg-muted/30 p-3">
          Discuss cross-team API versioning strategy and backward compatibility guarantees for the
          upcoming platform release with extended Q&A from solution architects.
        </li>
        <li className="rounded-md border border-border bg-muted/30 p-3">
          Finalize rollout checklist for calendar integrations including edge cases for daylight
          saving transitions and recurring exceptions.
        </li>
      </ul>
    ),
  },
  render: (args) => <MeetingAgendaSection {...args} onPrimary={() => undefined} />,
} satisfies StoryObj<typeof meta>;
