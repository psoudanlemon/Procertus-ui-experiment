import type { Meta, StoryObj } from "@storybook/react-vite";

import { CertificationBadgeRow, type CertificationBadgeItem } from "./CertificationBadgeRow";

const allKinds: CertificationBadgeItem[] = [
  { id: "ce", shortLabel: "CE", presentation: "chip", text: "1+" },
  { id: "benor", shortLabel: "BENOR", presentation: "chip", text: "1+" },
  { id: "atg", shortLabel: "ATG", presentation: "muted", text: "N/A" },
  {
    id: "ssd",
    shortLabel: "SSD / innovation",
    presentation: "not-offered",
    text: "— (not by us on this type)",
  },
  {
    id: "proc",
    shortLabel: "PROC",
    presentation: "not-offered",
    text: "Empty cell; symbol: / = not certifiable (story)",
  },
];

const meta = {
  title: "Request Management/CertificationBadgeRow",
  component: CertificationBadgeRow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Chips and muted / not-offered lines are **driven by parent** — reimplement spreadsheet semantics in Task B, pass normalized cells here (procertus-categorization patterns).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CertificationBadgeRow>;

export default meta;

export const Mixed = {
  render: () => (
    <div className="max-w-2xl">
      <CertificationBadgeRow
        leading="Certification row (example)"
        items={allKinds}
      />
    </div>
  ),
} as unknown as StoryObj<typeof meta>;

export const Empty = {
  render: () => (
    <CertificationBadgeRow items={[]} emptyMessage="No certification data provided for this row (story)" />
  ),
} as unknown as StoryObj<typeof meta>;
