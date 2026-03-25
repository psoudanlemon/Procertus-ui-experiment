import type { Meta, StoryObj } from "@storybook/react-vite"
import type { CSSProperties } from "react"
import type { z } from "zod"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable, schema } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import dashboardData from "@/app/dashboard/data.json"

const dashboardSidebarStyle = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as CSSProperties

function DashboardShowcase() {
  const data = dashboardData as z.infer<typeof schema>[]
  return (
    <SidebarProvider style={dashboardSidebarStyle}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

const meta: Meta = {
  title: "theme/showcase/Dashboard",
  component: DashboardShowcase,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Shadcn [dashboard-01](https://ui.shadcn.com/blocks) block — sidebar, KPI cards, area chart, and data table. Mirrors the Tweakcn “Dashboard” preview.",
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof DashboardShowcase>

export const Default: Story = {
  render: () => <DashboardShowcase />,
}
