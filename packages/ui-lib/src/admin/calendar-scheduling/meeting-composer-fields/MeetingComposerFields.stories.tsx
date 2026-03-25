import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { MeetingComposerFields } from "./MeetingComposerFields";

const meta = {
  title: "Admin/Calendar & Scheduling/MeetingComposerFields",
  component: MeetingComposerFields,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Controlled meeting form shell; wire to RHF/Zod in the parent.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MeetingComposerFields>;

export default meta;

export const Default = {
  render: () => {
    const [title, setTitle] = useState("Weekly sync");
    const [location, setLocation] = useState("Zoom");
    const [start, setStart] = useState("2026-03-25T10:00");
    const [end, setEnd] = useState("2026-03-25T10:30");
    const [allDay, setAllDay] = useState(false);
    const [notes, setNotes] = useState("Agenda TBD.");
    return (
      <MeetingComposerFields
        title="New meeting"
        description="Fields are fully controlled via props."
        titleFieldId="m-title"
        titleLabel="Title"
        titleValue={title}
        onTitleChange={setTitle}
        locationFieldId="m-loc"
        locationLabel="Location"
        locationValue={location}
        onLocationChange={setLocation}
        startFieldId="m-start"
        startLabel="Start"
        startValue={start}
        onStartChange={setStart}
        endFieldId="m-end"
        endLabel="End"
        endValue={end}
        onEndChange={setEnd}
        allDayId="m-allday"
        allDayLabel="All day"
        allDay={allDay}
        onAllDayChange={setAllDay}
        notesFieldId="m-notes"
        notesLabel="Notes"
        notesValue={notes}
        onNotesChange={setNotes}
        cancelLabel="Cancel"
        onCancel={() => undefined}
        onSubmit={() => undefined}
      />
    );
  },
} satisfies StoryObj<typeof meta>;

export const TitleErrorAndLongNotes = {
  render: () => {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [start, setStart] = useState("2026-04-01T09:00");
    const [end, setEnd] = useState("2026-04-01T18:00");
    const [allDay, setAllDay] = useState(true);
    const [notes, setNotes] = useState(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(12),
    );
    return (
      <div className="w-[min(100%,28rem)]">
        <MeetingComposerFields
          title="Edit meeting"
          titleFieldId="e-title"
          titleLabel="Title"
          titleValue={title}
          onTitleChange={setTitle}
          titleError="Title is required."
          locationFieldId="e-loc"
          locationLabel="Location"
          locationValue={location}
          onLocationChange={setLocation}
          startFieldId="e-start"
          startLabel="Start"
          startValue={start}
          onStartChange={setStart}
          endFieldId="e-end"
          endLabel="End"
          endValue={end}
          onEndChange={setEnd}
          allDayId="e-allday"
          allDayLabel="All day"
          allDay={allDay}
          onAllDayChange={setAllDay}
          notesFieldId="e-notes"
          notesLabel="Notes"
          notesValue={notes}
          onNotesChange={setNotes}
          notesPlaceholder="Optional context for attendees"
          onSubmit={() => undefined}
        />
      </div>
    );
  },
} satisfies StoryObj<typeof meta>;
