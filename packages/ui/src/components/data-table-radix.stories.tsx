import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@/components/ui/data-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
  {
    id: "p4r8ds2k",
    amount: 150,
    status: "pending",
    email: "alex@example.com",
  },
  {
    id: "q9w2er3t",
    amount: 490,
    status: "processing",
    email: "sara@example.com",
  },
  {
    id: "z7x3cv1b",
    amount: 625,
    status: "success",
    email: "john@example.com",
  },
];

const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        success: "default",
        failed: "destructive",
        pending: "secondary",
        processing: "outline",
      };
      return <Badge variant={variantMap[status] ?? "outline"}>{status}</Badge>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" className="text-right" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];

/**
 * A data table built on top of @tanstack/react-table with sorting, filtering,
 * pagination, and row selection.
 */
const meta: Meta<typeof DataTable> = {
  title: "components/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic data table with sorting, selection, and pagination.
 */
export const Default: Story = {
  render: () => <DataTable columns={columns} data={data} />,
};

/**
 * Data table with no data.
 */
export const Empty: Story = {
  render: () => <DataTable columns={columns} data={[]} />,
};
