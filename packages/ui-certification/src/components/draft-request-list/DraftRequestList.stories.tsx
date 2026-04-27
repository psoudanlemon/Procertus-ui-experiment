import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CertificationBadgeRow } from "../certification-badge-row/CertificationBadgeRow";
import { DraftRequestList, type DraftRequestItem } from "./DraftRequestList";

const meta = {
  title: "Certification Request/DraftRequestList",
  component: DraftRequestList,
  parameters: {
    layout: "padded",
    docs: { description: { component: "Drafts with edit/remove; empty state. Callbacks are props-only (no router)." } },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DraftRequestList>;

export default meta;

const withBadges: DraftRequestItem = {
  id: "1",
  title: "Cement board — HPL stream",
  subtitle: "From drilldown: cluster → type",
  details: (
    <CertificationBadgeRow
      items={[
        { id: "ce", shortLabel: "CE", presentation: "chip", text: "2+" },
        { id: "benor", shortLabel: "BENOR", presentation: "not-offered", text: "—" },
      ]}
    />
  ),
};

function ListStory() {
  const [drafts, setDrafts] = useState<DraftRequestItem[]>([
    withBadges,
    { id: "2", title: "Second draft (no badges)", subtitle: "Fixture" },
  ]);
  const [last, setLast] = useState("");
  return (
    <div className="space-y-2">
      <DraftRequestList
        title="Draft requests"
        description="Edit opens an editor in the app; remove drops the draft in session."
        drafts={drafts}
        onEdit={(id) => setLast(`Edit ${id}`)}
        onRemove={(id) => setDrafts((d) => d.filter((x) => x.id !== id))}
      />
      {last ? (
        <p className="text-sm text-muted-foreground" role="status">
          {last}
        </p>
      ) : null}
    </div>
  );
}

export const WithDrafts = { render: () => <ListStory /> } as unknown as StoryObj<typeof meta>;

export const Empty = {
  render: () => (
    <DraftRequestList
      title="No drafts"
      description="This story shows the empty well."
      drafts={[]}
      onEdit={() => undefined}
      onRemove={() => undefined}
    />
  ),
} as unknown as StoryObj<typeof meta>;
