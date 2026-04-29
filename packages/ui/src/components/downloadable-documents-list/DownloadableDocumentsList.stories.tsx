import type { Meta, StoryObj } from "@storybook/react-vite";

import { ItemGroup } from "@/components/ui/item";

import {
  DownloadableDocumentListItem,
  DownloadableDocumentsList,
} from "./DownloadableDocumentsList";
import type { DownloadableDocumentListItemData } from "./DownloadableDocumentsList";

const meta = {
  title: "components/DownloadableDocumentsList",
  component: DownloadableDocumentsList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Presentational list for ruleset PDFs and uploaded documents. Pass `items` from the app or a hook.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DownloadableDocumentsList>;

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
] satisfies DownloadableDocumentListItemData[];

export const Default: StoryObj<typeof meta> = {
  args: {
    title: "Uploaded documents",
    description: "Documents shared with this request (mocked).",
    items: mockItems,
  },
};

export const WithDelete = {
  render: () => (
    <ItemGroup className="max-w-xl">
      {mockItems.map((item) => (
        <DownloadableDocumentListItem key={item.id} {...item} onDelete={() => {}} />
      ))}
    </ItemGroup>
  ),
} as unknown as StoryObj<typeof meta>;

export const SingleRow = {
  render: () => (
    <ItemGroup className="max-w-xl">
      <DownloadableDocumentListItem {...mockItems[0]} onDelete={() => {}} />
    </ItemGroup>
  ),
} as unknown as StoryObj<typeof meta>;
