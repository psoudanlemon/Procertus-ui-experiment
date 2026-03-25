import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, Button } from "@procertus-ui/ui";

import { RecordSummaryStrip } from "./RecordSummaryStrip";

const meta = {
  title: "Admin/Shell & Density/RecordSummaryStrip",
  component: RecordSummaryStrip,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Dense read-only fields for the active record plus optional row actions.",
      },
      canvas: { layout: "padded" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RecordSummaryStrip>;

export default meta;

export const Default = {
  render: () => (
    <RecordSummaryStrip
      items={[
        { label: "PO number", value: "PO-2025-00412" },
        { label: "Vendor", value: "Contoso Supplies" },
        { label: "Status", value: <Badge variant="secondary">Awaiting approval</Badge> },
        { label: "Total", value: "$48,920.00" },
        { label: "Requested delivery", value: "Apr 12, 2025" },
      ]}
      actions={
        <>
          <Button type="button" size="sm" variant="outline">
            Copy link
          </Button>
          <Button type="button" size="sm">
            Submit
          </Button>
        </>
      }
    />
  ),
} as unknown as StoryObj<typeof meta>;

export const FieldsOnly = {
  render: () => (
    <RecordSummaryStrip
      items={[
        { label: "Employee ID", value: "E-44102" },
        { label: "Department", value: "Operations" },
        { label: "Manager", value: "Alex Rivera" },
      ]}
    />
  ),
} as unknown as StoryObj<typeof meta>;
