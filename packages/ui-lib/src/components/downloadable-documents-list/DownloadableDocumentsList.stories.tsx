import type { Meta, StoryObj } from "@storybook/react-vite";

import { ItemGroup } from "@procertus-ui/ui";

import {
  DownloadableDocumentListItem,
  DownloadableDocumentsList,
} from "./DownloadableDocumentsList";
import type { DownloadableDocumentListItemData } from "./DownloadableDocumentsList";

const meta = {
  title: "ui-lib/DownloadableDocumentsList",
  component: DownloadableDocumentsList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Presentational list for ruleset PDFs and guides. Pass `items` from the app or a hook.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DownloadableDocumentsList>;

export default meta;

const mockItems = [
  {
    id: "howto",
    title: "How to list downloadable documents,",
    description:
      "Internal pattern doc for designers and engineers — shown first in prototype lists.",
    formatHint: "PDF · 120 KB",
    href: "#howto-list-downloadable-documents",
  },
  {
    id: "ce-marking",
    title: "CE marking — consolidated requirements overview",
    description: "High-level mapping of directives referenced by the selected product stream.",
    formatHint: "PDF · 2.4 MB",
    href: "#ce-marking-overview",
  },
  {
    id: "attestation-template",
    title: "Attestation of conformity — applicant checklist",
    formatHint: "PDF · 890 KB",
    href: "#attestation-checklist",
  },
] satisfies DownloadableDocumentListItemData[];

export const Default: StoryObj<typeof meta> = {
  args: {
    title: "Ruleset documentation",
    description:
      "Documents that help you understand the rulesets for the certifications or attestations in this package (mocked).",
    items: mockItems,
  },
};

export const SingleRow = {
  render: () => (
    <ItemGroup className="max-w-xl rounded-lg border border-border/60 p-component">
      <DownloadableDocumentListItem {...mockItems[0]} />
    </ItemGroup>
  ),
} as unknown as StoryObj<typeof meta>;
