import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuditMetadataFooter } from "./AuditMetadataFooter";

const meta = {
  title: "Admin/Shell & Density/AuditMetadataFooter",
  component: AuditMetadataFooter,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Muted footer row for created/updated metadata (strings only; mock data in stories).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AuditMetadataFooter>;

export default meta;

export const Default = {
  render: () => (
    <div className="max-w-2xl rounded-md border">
      <div className="p-4 text-sm">Form or panel body placeholder.</div>
      <AuditMetadataFooter
        parts={[
          { label: "Created", value: "Mar 3, 2025 · 09:14 UTC" },
          { label: "Created by", value: "Jordan Lee" },
          { label: "Last updated", value: "Mar 20, 2025 · 16:02 UTC" },
          { label: "Updated by", value: "Samira Khan" },
        ]}
      />
    </div>
  ),
} as unknown as StoryObj<typeof meta>;
