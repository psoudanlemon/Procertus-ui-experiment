import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  CertificationRequestLifecycleDetailTimeline,
  CertificationRequestLifecycleTimeline,
  type CertificationRequestLifecycleStatus,
} from "./CertificationRequestLifecycleTimeline";

const dateLabels = {
  draft: "28 apr",
  submitted: "29 apr",
  "in-progress": "2 mei",
  approved: "12 mei",
  rejected: "8 mei",
  cancelled: "30 apr",
};

const meta = {
  title: "Certification Request/CertificationRequestLifecycleTimeline",
  component: CertificationRequestLifecycleTimeline,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Presentational lifecycle timeline for a certification request package. Terminal unhappy paths truncate future happy-path steps.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CertificationRequestLifecycleTimeline>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderStatus = (status: CertificationRequestLifecycleStatus) => (
  <div className="max-w-3xl rounded-xl border bg-card p-section">
    <CertificationRequestLifecycleTimeline status={status} dateLabels={dateLabels} />
  </div>
);

export const Draft: Story = {
  args: { status: "draft" },
  render: ({ status }) => renderStatus(status),
};

export const Submitted: Story = {
  args: { status: "submitted" },
  render: ({ status }) => renderStatus(status),
};

export const InProgress: Story = {
  args: { status: "in-progress" },
  render: ({ status }) => renderStatus(status),
};

export const Approved: Story = {
  args: { status: "approved" },
  render: ({ status }) => renderStatus(status),
};

export const Archived: Story = {
  args: { status: "archived" },
  render: ({ status }) => renderStatus(status),
};

export const Rejected: Story = {
  args: { status: "rejected" },
  render: ({ status }) => renderStatus(status),
};

export const Cancelled: Story = {
  args: { status: "cancelled" },
  render: ({ status }) => renderStatus(status),
};

export const DetailVertical: Story = {
  args: { status: "in-progress" },
  render: () => (
    <div className="max-w-xl rounded-xl border bg-card p-section">
      <CertificationRequestLifecycleDetailTimeline
        events={[
          {
            id: "created",
            title: "Aangemaakt",
            occurredAtLabel: "28 apr 2026, 09:12",
            actorLabel: "Aanvrager",
            description: "Het aanvraagpakket werd als concept aangemaakt.",
          },
          {
            id: "submitted",
            title: "Ingediend",
            occurredAtLabel: "28 apr 2026, 10:04",
            actorLabel: "Aanvrager",
            description: "Het pakket werd ingediend voor behandeling door Procertus.",
          },
          {
            id: "processing",
            title: "In behandeling",
            occurredAtLabel: "29 apr 2026, 14:30",
            actorLabel: "Procertus",
            description: "De inhoudelijke intake werd gestart.",
          },
        ]}
      />
    </div>
  ),
};
