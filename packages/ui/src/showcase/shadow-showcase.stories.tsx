import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppSidebar, type NavItem } from "@/components/app-sidebar";
import type { IconSvgElement } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Folder01Icon,
  AnalyticsUpIcon,
} from "@hugeicons/core-free-icons";

const wireframeNavItems: NavItem[] = [
  { title: "Dashboard", url: "#", icon: DashboardSquare01Icon as IconSvgElement, isActive: true },
  { title: "Projects", url: "#", icon: Folder01Icon as IconSvgElement },
  { title: "Analytics", url: "#", icon: AnalyticsUpIcon as IconSvgElement },
];
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Applied guidelines/Shadows",
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Shared wireframe pieces
// ---------------------------------------------------------------------------

function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

function WireframeCard({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl bg-card p-6 ring-1 ring-foreground/[0.04] ${className ?? ""}`}
    >
      {children ?? (
        <>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-28" />
          <Skeleton className="mt-1 h-3 w-32" />
        </>
      )}
    </div>
  );
}

function KpiValue({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold text-foreground">{value}</span>
      <Skeleton className="mt-1 h-3 w-24" />
    </>
  );
}

// ---------------------------------------------------------------------------
// Dashboard layout (shared across stories)
// ---------------------------------------------------------------------------

function DashboardLayout({
  sideCard,
}: {
  sideCard: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar navItems={wireframeNavItems} showSearch={false} />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* KPI row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <WireframeCard>
              <KpiValue label="Pass rate" value="94.2%" />
            </WireframeCard>

            <WireframeCard>
              <KpiValue label="Active learners" value="1,284" />
            </WireframeCard>

            <WireframeCard>
              <KpiValue label="Avg. completion time" value="4.2d" />
            </WireframeCard>

            <WireframeCard>
              <KpiValue label="Certifications issued" value="847" />
            </WireframeCard>
          </div>

          {/* Chart area */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <WireframeCard className="lg:col-span-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="mt-4 h-48 w-full rounded-lg" />
            </WireframeCard>

            {sideCard}
          </div>

          {/* Table area */}
          <WireframeCard>
            <Skeleton className="h-3 w-40" />
            <div className="mt-4 flex flex-col gap-3">
              <Skeleton className="h-8 w-full rounded" />
              <Skeleton className="h-8 w-full rounded" />
              <Skeleton className="h-8 w-full rounded" />
              <Skeleton className="h-8 w-full rounded" />
              <Skeleton className="h-8 w-full rounded" />
            </div>
          </WireframeCard>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// ---------------------------------------------------------------------------
// Story 01: Default (gradient shadow on standout card)
// ---------------------------------------------------------------------------

/**
 * A wireframe KPI dashboard inside the application shell. One card uses
 * the animated gradient shadow to demonstrate how a single standout
 * element draws attention without competing with the rest of the layout.
 */
export const HighlightedCard: Story = {
  render: () => (
    <DashboardLayout
      sideCard={
        <div className="glow-standout rounded-xl">
          <WireframeCard className="relative">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-4 h-48 w-full rounded-lg" />
          </WireframeCard>
        </div>
      }
    />
  ),
};

// ---------------------------------------------------------------------------
// Story 02: Gradient card (gradient bg + gradient shadow)
// ---------------------------------------------------------------------------

/**
 * Same dashboard layout, but the standout card combines a gradient
 * background with the animated gradient shadow.
 */
export const GradientCard: Story = {
  render: () => (
    <DashboardLayout
      sideCard={
        <div className="glow-standout rounded-xl">
          <div
            className="relative flex flex-col gap-3 rounded-xl p-6 ring-1 ring-white/10"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.477 0.102 227) 0%, oklch(0.803 0.073 173) 100%)",
            }}
          >
            <Skeleton className="h-3 w-32 opacity-30" />
            <Skeleton className="mt-4 h-48 w-full rounded-lg opacity-20" />
          </div>
        </div>
      }
    />
  ),
};

// ---------------------------------------------------------------------------
// Story 03: Default (neutral shadow on chart card)
// ---------------------------------------------------------------------------

/**
 * Same dashboard layout, but the chart card uses a neutral shadow
 * instead of the gradient glow. Shows the static, understated alternative.
 */
export const Default: Story = {
  render: () => (
    <DashboardLayout
      sideCard={
        <WireframeCard className="shadow-proc-md">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-4 h-48 w-full rounded-lg" />
        </WireframeCard>
      }
    />
  ),
};
