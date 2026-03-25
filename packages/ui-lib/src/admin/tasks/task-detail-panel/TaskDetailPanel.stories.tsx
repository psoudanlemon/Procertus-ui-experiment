import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@procertus-ui/ui";
import { TaskDetailPanel } from "./TaskDetailPanel";

const meta = {
  title: "Admin/Tasks & Work Items/TaskDetailPanel",
  component: TaskDetailPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Shell for task detail: titled header, labeled filter field, actions, and main content.",
      },
      canvas: { layout: "padded" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TaskDetailPanel>;

export default meta;

function TaskDetailPanelDefaultDemo() {
  const [q, setQ] = useState("");
  return (
    <TaskDetailPanel
      title="Sprint backlog"
      description="Mock tasks for layout review — wire real data in the app shell."
      searchLabel="Filter tasks"
      searchPlaceholder="Search by title…"
      searchValue={q}
      onSearchChange={setQ}
      actions={
        <Button type="button" size="sm">
          New task
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Review access logs</TableCell>
            <TableCell>Jamie</TableCell>
            <TableCell>In progress</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Update vendor list</TableCell>
            <TableCell>Unassigned</TableCell>
            <TableCell>Queued</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TaskDetailPanel>
  );
}

export const Default = {
  render: () => <TaskDetailPanelDefaultDemo />,
} as unknown as StoryObj<typeof meta>;

function TaskDetailPanelNoSearchDemo() {
  const [q, setQ] = useState("");
  return (
    <TaskDetailPanel
      title="Read-only summary"
      description="Toolbar hidden — only actions when `showSearch` is false."
      showSearch={false}
      searchValue={q}
      onSearchChange={setQ}
      actions={
        <Button type="button" size="sm" variant="outline">
          Export
        </Button>
      }
    >
      <p className="px-6 text-sm text-muted-foreground">
        No rows match the current view (empty state mock).
      </p>
    </TaskDetailPanel>
  );
}

/** Filter row omitted; content can be an empty state or static summary. */
export const WithoutSearch = {
  render: () => <TaskDetailPanelNoSearchDemo />,
} as unknown as StoryObj<typeof meta>;
