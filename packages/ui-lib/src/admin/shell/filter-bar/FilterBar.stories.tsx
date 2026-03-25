import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@procertus-ui/ui";

import { FilterBar } from "./FilterBar";

const meta = {
  title: "Admin/Shell & Density/FilterBar",
  component: FilterBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Search, optional filter slot, actions, and a table or list body.",
      },
      canvas: { layout: "padded" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FilterBar>;

export default meta;

function FilterBarDemo() {
  const [q, setQ] = useState("");
  return (
    <FilterBar
      title="Vendors"
      description="Filter the vendor directory; state is mocked in the story."
      searchValue={q}
      onSearchChange={setQ}
      filters={
        <>
          <Button type="button" size="sm" variant="outline">
            Status
          </Button>
          <Button type="button" size="sm" variant="outline">
            Region
          </Button>
        </>
      }
      actions={
        <Button type="button" size="sm">
          Add vendor
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Contoso Supplies</TableCell>
            <TableCell>V-901</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Fabricam Parts</TableCell>
            <TableCell>V-902</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </FilterBar>
  );
}

export const Default = {
  render: () => <FilterBarDemo />,
} as unknown as StoryObj<typeof meta>;
