import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DownloadableItem,
  DownloadableItemGrid,
  DownloadableItemList,
} from "./DownloadableItem";
import type { DownloadableItemData } from "./DownloadableItem";

const meta = {
  title: "components/DownloadableItem",
  component: DownloadableItem,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Presentational primitive for a downloadable document. Two layout variants — `row` (list) and `card` (tile) — plus matching layout helpers `DownloadableItemList` and `DownloadableItemGrid`. The consumer owns the section header (title / description).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DownloadableItem>;

export default meta;

const mockItems = [
  {
    id: "client-report-q2",
    title: "client_report_2025_q2.pdf",
    description: "Quarterly findings shared by the applicant for review.",
    date: "15/09/2025",
    formatHint: "39.2 MB",
    href: "#client-report-q2",
  },
  {
    id: "ce-marking",
    title: "ce_marking_overview.pdf",
    description: "Consolidated mapping of directives for the selected product stream.",
    date: "02/08/2025",
    formatHint: "2.4 MB",
    href: "#ce-marking-overview",
  },
  {
    id: "attestation-template",
    title: "attestation_checklist.pdf",
    description: "Applicant checklist used during conformity attestation.",
    date: "21/07/2025",
    formatHint: "890 KB",
    href: "#attestation-checklist",
  },
  {
    id: "ruleset-matrix",
    title: "ruleset_matrix.pdf",
    description: "Normenkader en regelpaden voor de geselecteerde certificeringen en attesten.",
    date: "08/07/2025",
    formatHint: "1.1 MB",
    href: "#ruleset-matrix",
  },
  {
    id: "submission-checklist",
    title: "submission_checklist.pdf",
    description: "Controlelijst afgestemd op de samenstelling van het pakket vóór indiening.",
    date: "30/06/2025",
    formatHint: "420 KB",
    href: "#submission-checklist",
  },
  {
    id: "ptv-overview",
    title: "ptv_overview.pdf",
    description: "Producttechnische fiche met specificaties en profieldelen voor BENOR.",
    date: "12/06/2025",
    formatHint: "3.7 MB",
    href: "#ptv-overview",
  },
] satisfies DownloadableItemData[];

export const Default = {
  render: () => (
    <div className="max-w-md">
      <DownloadableItem variant="card" {...mockItems[0]} />
    </div>
  ),
} as unknown as StoryObj<typeof meta>;

export const Grid = {
  render: () => <DownloadableItemGrid items={mockItems} />,
} as unknown as StoryObj<typeof meta>;

export const List = {
  render: () => (
    <div className="max-w-md">
      <DownloadableItemList items={mockItems} />
    </div>
  ),
} as unknown as StoryObj<typeof meta>;

export const WithDelete = {
  render: () => (
    <div className="max-w-md">
      <DownloadableItem variant="card" {...mockItems[0]} onDelete={() => {}} />
    </div>
  ),
} as unknown as StoryObj<typeof meta>;
