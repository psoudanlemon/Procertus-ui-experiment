import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  CertificationRequestCard,
  type CertificationRequestCardProps,
} from "./CertificationRequestCard";

const meta = {
  title: "Certification Request/CertificationRequestCard",
  component: CertificationRequestCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Presentational request overview card. Apps pass display-ready labels and handle routing or panel opening via `onOpen`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CertificationRequestCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const draftRequest: CertificationRequestCardProps = {
  requestId: "request-20260428091200",
  status: "draft",
  statusLabel: "Concept",
  lifecycleDateLabels: {
    draft: "28 apr",
  },
  inquiries: [
    {
      id: "inquiry-benor",
      label: "BENOR-certificatie",
      shortLabel: "BENOR",
      productLabel: "Prefab betonwand",
      productPath: "Beton > Prefab elementen > Wandpanelen",
      value: "BENOR",
    },
    {
      id: "inquiry-ce",
      label: "CE-markering",
      shortLabel: "CE",
      productLabel: "Prefab betonwand",
      value: "CE 2+",
    },
  ],
};

const submittedRequest: CertificationRequestCardProps = {
  requestId: "request-20260425133000",
  status: "in-progress",
  statusLabel: "In behandeling",
  statusVariant: "secondary",
  lifecycleDateLabels: {
    draft: "25 apr",
    submitted: "25 apr",
    "in-progress": "26 apr",
  },
  inquiries: [
    {
      id: "inquiry-masonry-ce",
      label: "CE-markering",
      shortLabel: "CE",
      productLabel: "Dragend metselwerk",
      value: "CE 2+",
    },
  ],
};

function InteractiveCardStory(props: CertificationRequestCardProps) {
  const [lastOpened, setLastOpened] = useState("");

  return (
    <div className="grid max-w-5xl gap-3 sm:grid-cols-2">
      <CertificationRequestCard
        {...props}
        onOpen={(requestId) => setLastOpened(`Opened ${requestId}`)}
      />
      <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
        <p role="status">{lastOpened || "Click or keyboard-open the card to trigger onOpen."}</p>
      </div>
    </div>
  );
}

export const Draft: Story = {
  args: draftRequest,
  render: (args) => <InteractiveCardStory {...args} />,
};

export const Submitted: Story = {
  args: submittedRequest,
  render: (args) => <InteractiveCardStory {...args} />,
};

export const WithoutProductOrValue: Story = {
  args: {
    requestId: "draft-context-003",
    status: "draft",
    statusLabel: "Concept",
    lifecycleDateLabels: {
      draft: "28 apr",
    },
    inquiries: [
      {
        id: "inquiry-context",
        label: "Innovatie-attest",
        shortLabel: "Innovatie",
        context: "Technisch attest voor een innovatieve toepassing.",
      },
    ],
  },
  render: (args) => <InteractiveCardStory {...args} />,
};

export const Rejected: Story = {
  args: {
    ...submittedRequest,
    requestId: "request-20260419090000",
    status: "rejected",
    statusLabel: "Geweigerd",
    lifecycleDateLabels: {
      draft: "19 apr",
      submitted: "19 apr",
      "in-progress": "20 apr",
    },
  },
  render: (args) => <InteractiveCardStory {...args} />,
};

export const Cancelled: Story = {
  args: {
    ...draftRequest,
    requestId: "request-20260421083000",
    status: "cancelled",
    statusLabel: "Geannuleerd",
    lifecycleDateLabels: {
      draft: "21 apr",
      submitted: "21 apr",
    },
  },
  render: (args) => <InteractiveCardStory {...args} />,
};

export const StaticPreview: Story = {
  args: draftRequest,
};
