import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Badge } from "@procertus-ui/ui";
import { AvailabilityGrid } from "./AvailabilityGrid";

const columns = ["9:00", "9:30", "10:00", "10:30", "11:00"];

const sampleRows = [
  {
    id: "1",
    label: "Alex Rivera",
    cells: ["free", "busy", "busy", "tentative", "free"] as const,
  },
  {
    id: "2",
    label: "Jamie Chen",
    cells: ["tentative", "free", "free", "free", "outOfOffice"] as const,
  },
  {
    id: "3",
    label: "Sam Okonkwo",
    cells: ["busy", "busy", "busy", "busy", "busy"] as const,
  },
];

const meta = {
  title: "Admin/Calendar & Scheduling/AvailabilityGrid",
  component: AvailabilityGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Participant × time-slot matrix with tonal cells.",
      },
      canvas: { layout: "padded" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AvailabilityGrid>;

export default meta;

export const Default = {
  render: () => {
    const [q, setQ] = useState("");
    return (
      <AvailabilityGrid
        title="Team availability"
        description="Tuesday — all times local."
        columnLabels={columns}
        rows={sampleRows}
        searchValue={q}
        onSearchChange={setQ}
        footer={
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Free</Badge>
            <Badge variant="outline">Busy</Badge>
            <Badge variant="outline">Tentative</Badge>
            <Badge variant="outline">Out of office</Badge>
          </div>
        }
      />
    );
  },
} satisfies StoryObj<typeof meta>;

export const ManyColumnsOverflow = {
  render: () => {
    const [q, setQ] = useState("");
    const manyCols = Array.from(
      { length: 16 },
      (_, i) => `${8 + Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
    );
    const wideRows = [
      {
        id: "a",
        label: "Participant with a very long display name for overflow testing",
        cells: manyCols.map((_, i) =>
          i % 3 === 0 ? "free" : i % 3 === 1 ? "busy" : "tentative",
        ) as ("free" | "busy" | "tentative")[],
      },
    ];
    return (
      <AvailabilityGrid
        title="Dense day view"
        columnLabels={manyCols}
        rows={wideRows}
        searchValue={q}
        onSearchChange={setQ}
        showSearch={false}
      />
    );
  },
} satisfies StoryObj<typeof meta>;
