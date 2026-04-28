import type { Meta, StoryObj } from "@storybook/react-vite";

import { RequestPackageReview } from "./RequestPackageReview";

const meta = {
  title: "Certification Request/RequestPackageReview",
  component: RequestPackageReview,
  parameters: {
    layout: "padded",
    docs: { description: { component: "Read-only summary before submit; rows are pre-built by the parent (Task E not included)." } },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RequestPackageReview>;

export default meta;

export const BeforeSubmit = {
  render: () => (
    <RequestPackageReview
      title="Review your request package"
      description="Confirm the lines below, then continue to submission in the app."
      notice="Customer context and representative must be complete; at least one draft is required to submit (analysis)."
      requester={{
        context: {
          requesterName: "Alex Rivera",
          requesterEmail: "alex.rivera@example.com",
          organizationName: "Demo Corp BV",
          organizationDetails: (
            <p className="text-sm">BE 0123.456.789 · Industrielaan 1, 1000 Brussels</p>
          ),
        },
      }}
      rows={[
        { id: "1", label: "Certification / product 1", value: "Cement board — BENOR+CE (example)" },
        { id: "2", label: "Certification / product 2", value: "Metal composite — ATG (example)" },
        { id: "ctx", label: "Context", value: "Demo Corp BV — BE (example)" },
      ]}
    />
  ),
} as unknown as StoryObj<typeof meta>;

export const NoRows = {
  render: () => (
    <RequestPackageReview
      title="Review"
      rows={[]}
      description="If you see this in production, the parent should block navigation — story shows empty readout."
    />
  ),
} as unknown as StoryObj<typeof meta>;
