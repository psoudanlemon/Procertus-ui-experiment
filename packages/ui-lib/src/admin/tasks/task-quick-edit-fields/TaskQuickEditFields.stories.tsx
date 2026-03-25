import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

import type { TaskStatusOption } from "./TaskQuickEditFields";
import { TaskQuickEditFields } from "./TaskQuickEditFields";

const statusOptions: TaskStatusOption[] = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

const meta = {
  title: "Admin/Tasks & Work Items/TaskQuickEditFields",
  component: TaskQuickEditFields,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Controlled task title, description, and optional status — labels and ids for accessibility.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TaskQuickEditFields>;

export default meta;

function TaskQuickEditFieldsDefaultDemo() {
  const [title, setTitle] = useState("Quarterly access review");
  const [body, setBody] = useState("Confirm least-privilege for all admin roles.");
  const [status, setStatus] = useState("in_progress");
  const [titleTouched, setTitleTouched] = useState(false);
  const titleError = useMemo(
    () => (titleTouched && title.trim() === "" ? "Title is required" : undefined),
    [title, titleTouched],
  );
  return (
    <TaskQuickEditFields
      title="Quick edit"
      description="Mock values only — connect to your form library in the app."
      taskTitleLabel="Task title"
      taskTitleId="task-quick-title"
      taskTitleName="title"
      taskTitleValue={title}
      onTaskTitleChange={setTitle}
      onTaskTitleBlur={() => setTitleTouched(true)}
      taskTitlePlaceholder="Short, actionable title"
      taskTitleError={titleError}
      taskTitleHelperText={titleError ? undefined : "Shown in lists and notifications."}
      taskDescriptionLabel="Description"
      taskDescriptionId="task-quick-description"
      taskDescriptionName="description"
      taskDescriptionValue={body}
      onTaskDescriptionChange={setBody}
      taskDescriptionPlaceholder="Context, links, acceptance criteria…"
      taskDescriptionHelperText="Optional but helps reviewers."
      statusLabel="Status"
      statusId="task-quick-status"
      statusValue={status}
      onStatusChange={setStatus}
      statusOptions={statusOptions}
      cancelLabel="Cancel"
      onCancel={() => undefined}
      onSubmit={() => undefined}
    />
  );
}

export const Default = {
  render: () => <TaskQuickEditFieldsDefaultDemo />,
} as unknown as StoryObj<typeof meta>;

function TaskQuickEditFieldsErrorsDemo() {
  const [title, setTitle] = useState("   ");
  const [body, setBody] = useState("");
  return (
    <TaskQuickEditFields
      title="Validation edge"
      description='Both fields show errors — check screen reader announcements (role="alert").'
      taskTitleLabel="Task title"
      taskTitleId="task-quick-title-err"
      taskTitleName="title"
      taskTitleValue={title}
      onTaskTitleChange={setTitle}
      taskTitleError="Title cannot be blank"
      taskDescriptionLabel="Description"
      taskDescriptionId="task-quick-description-err"
      taskDescriptionName="description"
      taskDescriptionValue={body}
      onTaskDescriptionChange={setBody}
      taskDescriptionError="Add at least one sentence for audit context."
      submitLabel="Save"
      onSubmit={() => undefined}
    />
  );
}

/** Simultaneous field errors for title and description. */
export const BothFieldsInvalid = {
  render: () => <TaskQuickEditFieldsErrorsDemo />,
} as unknown as StoryObj<typeof meta>;
