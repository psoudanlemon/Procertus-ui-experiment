import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ProductMultiSelect } from "./ProductMultiSelect";

const sampleOptions = [
  { id: "a", label: "HPL cladding", description: "Type A" },
  { id: "b", label: "Cement board", description: "Type B" },
  { id: "c", label: "Metal composite", description: "Type C — can co-exist (story)" },
];

const meta = {
  title: "Request Management/ProductMultiSelect",
  component: ProductMultiSelect,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Check several applicable product types; the parent turns each `id` into a **draft** line (certification request flow).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProductMultiSelect>;

export default meta;

function StateStory() {
  const [ids, setIds] = useState<string[]>(["a"]);
  return (
    <div className="max-w-lg space-y-2">
      <ProductMultiSelect
        legend="Applicable product types"
        description="Select all that apply; each will become one draft in the list."
        options={sampleOptions}
        selectedIds={ids}
        onChange={setIds}
      />
      <p className="text-sm text-muted-foreground" role="status">
        selectedIds: {ids.length ? ids.join(", ") : "(none)"}
      </p>
    </div>
  );
}

export const Default = { render: () => <StateStory /> } as unknown as StoryObj<typeof meta>;

export const Empty = {
  render: () => (
    <div className="max-w-md">
      <ProductMultiSelect
        legend="No options (story)"
        options={[]}
        selectedIds={[]}
        onChange={() => undefined}
        emptyMessage="The drilldown did not return products — adjust filters in the app."
      />
    </div>
  ),
} as unknown as StoryObj<typeof meta>;
