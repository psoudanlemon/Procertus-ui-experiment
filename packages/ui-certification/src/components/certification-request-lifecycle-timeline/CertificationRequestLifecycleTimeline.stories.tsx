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
  render: () => renderStatus("draft"),
};

export const Submitted: Story = {
  render: () => renderStatus("submitted"),
};

export const InProgress: Story = {
  render: () => renderStatus("in-progress"),
};

export const Approved: Story = {
  render: () => renderStatus("approved"),
};

export const Archived: Story = {
  render: () => renderStatus("archived"),
};

export const Rejected: Story = {
  render: () => renderStatus("rejected"),
};

export const Cancelled: Story = {
  render: () => renderStatus("cancelled"),
};

export const DetailVertical: Story = {
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
