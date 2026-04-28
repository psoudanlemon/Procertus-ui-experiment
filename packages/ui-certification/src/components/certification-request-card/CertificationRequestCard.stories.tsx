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
  requestId: "draft-product-certification-001",
  title: "BENOR voor prefab betonwand",
  subtitle: "Beton > Prefab elementen > Wandpanelen",
  statusLabel: "Concept",
  approvalStatusLabel: "Nog niet ingediend",
  typeLabel: "Productcertificatie",
  productLabel: "Prefab betonwand",
  valueLabel: "BENOR",
};

const submittedRequest: CertificationRequestCardProps = {
  requestId: "submitted-product-certification-018",
  title: "CE-markering voor dragend metselwerk",
  subtitle: "Metselwerk > Dragende elementen",
  statusLabel: "Ingediend",
  statusVariant: "secondary",
  approvalStatusLabel: "In behandeling",
  typeLabel: "Productcertificatie",
  productLabel: "Dragend metselwerk",
  valueLabel: "CE 2+",
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
    title: "Contextaanvraag voor innovatief attest",
    subtitle: "Contextaanvraag",
    statusLabel: "Concept",
    approvalStatusLabel: "Nog aan te vullen",
    typeLabel: "Innovatie-attest",
    productLabel: "Niet-productgebonden",
  },
  render: (args) => <InteractiveCardStory {...args} />,
};

export const StaticPreview: Story = {
  args: draftRequest,
};
