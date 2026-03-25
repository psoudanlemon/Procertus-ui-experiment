import type { Meta, StoryObj } from "@storybook/react-vite";

import { WorkflowCommentThread } from "./WorkflowCommentThread";

const meta = {
  title: "Admin/Workflows & Approvals/WorkflowCommentThread",
  component: WorkflowCommentThread,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Read-only comment bubbles; `variant` toggles incoming vs outgoing alignment.",
      },
      canvas: { layout: "padded" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WorkflowCommentThread>;

export default meta;

const sampleComments = [
  {
    id: "1",
    authorName: "Alex Kim",
    timestampLabel: "Today · 09:12",
    body: "Can we get the revised scope doc before legal signs?",
    variant: "incoming" as const,
    avatarFallback: "AK",
  },
  {
    id: "2",
    authorName: "You",
    timestampLabel: "Today · 09:40",
    body: "Uploaded v3 to the request — link is in the attachments panel.",
    variant: "outgoing" as const,
    avatarFallback: "YO",
  },
  {
    id: "3",
    authorName: "Jordan Lee",
    timestampLabel: "Today · 10:02",
    body: "Thanks. One more thing: please confirm the data residency region for the pilot tenant.\n\nWe need EU-only for this customer.",
    variant: "incoming" as const,
    avatarFallback: "JL",
  },
];

export const Default: StoryObj<typeof meta> = {
  args: {
    title: "Discussion",
    description: "Comments on this workflow run.",
    comments: sampleComments,
  },
};

export const EdgeEmpty: StoryObj<typeof meta> = {
  name: "Edge / empty",
  args: {
    title: "Discussion",
    comments: [],
    emptyLabel: "No one has commented yet.",
  },
};

export const EdgeLongBody: StoryObj<typeof meta> = {
  name: "Edge / long message",
  args: {
    title: "Discussion",
    comments: [
      {
        id: "long",
        authorName: "Pat Ng",
        timestampLabel: "Mon · 14:22",
        body: "Posting the full checklist so we do not lose context:\n\n1. Verify SSO metadata\n2. Confirm SCIM group mapping\n3. Run dry-run export\n4. Attach audit log sample\n\nLet me know if any step is blocked on your side.",
        variant: "incoming",
        avatarFallback: "PN",
      },
    ],
  },
};
