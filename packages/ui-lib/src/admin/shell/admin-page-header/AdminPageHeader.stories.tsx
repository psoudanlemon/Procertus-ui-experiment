import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@procertus-ui/ui";

import { AdminPageHeader } from "./AdminPageHeader";

const meta = {
  title: "Admin/Shell & Density/AdminPageHeader",
  component: AdminPageHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Page title band with optional breadcrumb, badge, actions, and a slot for tabs or tools.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AdminPageHeader>;

export default meta;

function AdminPageHeaderDemo() {
  const [tab, setTab] = useState("details");
  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        breadcrumb={
          <span>
            Accounts <span className="text-border">/</span> AC-10492
          </span>
        }
        badge="Enterprise"
        title="Northwind Trading Ltd."
        description="Billing profile, contracts, and contacts for this customer."
        secondaryLabel="Archive"
        primaryLabel="Edit account"
        onSecondary={() => undefined}
        onPrimary={() => undefined}
      >
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-2 text-sm text-muted-foreground">
            Tab content is mock-only in Storybook.
          </TabsContent>
          <TabsContent value="activity" className="pt-2 text-sm text-muted-foreground">
            Activity timeline would render here.
          </TabsContent>
          <TabsContent value="documents" className="pt-2 text-sm text-muted-foreground">
            Document list would render here.
          </TabsContent>
        </Tabs>
      </AdminPageHeader>
    </div>
  );
}

export const Default = {
  render: () => <AdminPageHeaderDemo />,
} as unknown as StoryObj<typeof meta>;

export const TitleOnly = {
  render: () => (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Purchase orders" description="Open and closed POs for this site." />
    </div>
  ),
} as unknown as StoryObj<typeof meta>;
