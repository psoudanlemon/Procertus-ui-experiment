import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

import { Button } from "@procertus-ui/ui";
import { ApprovalChainList } from "./ApprovalChainList";

const meta = {
  title: "Admin/Workflows & Approvals/ApprovalChainList",
  component: ApprovalChainList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Search and actions are controlled; pass filtered `members` from the parent.",
      },
      canvas: { layout: "padded" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ApprovalChainList>;

export default meta;

const allMembers = [
  {
    id: "a",
    name: "Jamie Chen",
    title: "Engineering manager",
    statusLabel: "Approved",
    statusVariant: "secondary" as const,
    avatarFallback: "JC",
  },
  {
    id: "b",
    name: "Sam Okonkwo",
    title: "Legal counsel",
    statusLabel: "Waiting",
    statusVariant: "outline" as const,
    avatarFallback: "SO",
  },
  {
    id: "c",
    name: "Rivera-Martinez de la Torre",
    title: "Security",
    statusLabel: "Escalated",
    statusVariant: "destructive" as const,
    avatarFallback: "RM",
  },
];

function ApprovalChainListDemo() {
  const [q, setQ] = useState("");
  const members = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return allMembers;
    return allMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(needle) || (m.title ?? "").toLowerCase().includes(needle),
    );
  }, [q]);

  return (
    <ApprovalChainList
      title="Approval chain"
      description="Ordered reviewers for this request."
      searchValue={q}
      onSearchChange={setQ}
      members={members}
      actions={
        <Button type="button" size="sm" variant="outline">
          Add approver
        </Button>
      }
    />
  );
}

export const Default = {
  render: () => <ApprovalChainListDemo />,
} as unknown as StoryObj<typeof meta>;

export const EdgeEmpty: StoryObj<typeof meta> = {
  name: "Edge / empty",
  args: {
    title: "Approval chain",
    description: "No approvers configured.",
    searchValue: "",
    onSearchChange: () => undefined,
    members: [],
    showSearch: false,
  },
};
