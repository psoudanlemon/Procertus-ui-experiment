import type { Meta, StoryObj } from "@storybook/react-vite";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  Calendar01Icon,
  Dollar01Icon,
  HelpCircleIcon,
  MapsIcon,
  Invoice01Icon,
  Settings01Icon,
  UserMultipleIcon,
  BarChartIcon,
  BookOpen01Icon,
  PackageIcon,
  CodeIcon,
  DatabaseIcon,
  GitBranchIcon,
  HierarchyFilesIcon,
  AiNetworkIcon,
  ColorPickerIcon,
  FlashIcon,
  SecurityCheckIcon,
  Alert01Icon,
  File02Icon,
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { H3, H4 } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Muted } from "@/components/ui/typography";

import { ManagementAppShell } from "@/components/app-shell";
import type { Workspace, NavItem, NavGroup } from "@/components/app-sidebar";

/* ---------------------------------------------------------------------------
 * Sidebar & Header Configuration
 * ------------------------------------------------------------------------- */

const procertusLogo = (
  <img
    src="/logomark.svg"
    alt="PROCERTUS"
    className="size-full rounded-sm"
  />
);

const sidebarProps = {
  workspaces: [
    {
      id: "1",
      name: "PROCERTUS",
      logo: procertusLogo,
      plan: "Certification platform",
    },
  ] as Workspace[],
  activeWorkspaceId: "1",
  navItems: [
    { title: "Roadmap", url: "#", icon: MapsIcon },
    { title: "Budget", url: "#", icon: Dollar01Icon },
    { title: "Meetings", url: "#", icon: Calendar01Icon },
    { title: "People", url: "#", icon: UserMultipleIcon },
    { title: "Invoicing", url: "#", icon: Invoice01Icon },
  ] as NavItem[],
  navGroups: [
    {
      label: "Registry",
      items: [
        {
          title: "Certificates",
          url: "#",
          icon: BarChartIcon,
          isActive: true,
          items: [
            { title: "Overview", url: "#", isActive: true },
            { title: "Pending", url: "#" },
            { title: "Expiring", url: "#" },
          ],
        },
        {
          title: "Standards",
          url: "#",
          icon: ColorPickerIcon,
          items: [
            { title: "ISO 9001", url: "#" },
            { title: "ISO 14001", url: "#" },
            { title: "ISO 45001", url: "#" },
          ],
        },
      ],
    },
    {
      label: "Compliance",
      items: [
        { title: "Audit schedule", url: "#", icon: DatabaseIcon },
        { title: "Non-conformities", url: "#", icon: AiNetworkIcon },
      ],
    },
    {
      label: "Coming soon",
      maxVisible: 3,
      items: [
        { title: "User stories", url: "#", icon: HierarchyFilesIcon },
        { title: "Event models", url: "#", icon: FlashIcon },
        { title: "Prototypes", url: "#", icon: PackageIcon },
        { title: "Context maps", url: "#", icon: GitBranchIcon },
        { title: "DAL playground", url: "#", icon: CodeIcon },
        { title: "API docs", url: "#", icon: BookOpen01Icon },
        { title: "Guides", url: "#", icon: BookOpen01Icon },
      ],
    },
  ] as NavGroup[],
  secondaryItems: [
    { title: "Settings", url: "#", icon: Settings01Icon },
    { title: "Help", url: "#", icon: HelpCircleIcon },
  ] as NavItem[],
  showSearch: false,
};

const headerProps = {
  showNavigation: false,
  breadcrumbs: [
    { label: "Dashboard", href: "#" },
    { label: "Registry", href: "#" },
    { label: "Certificates", href: "#" },
    { label: "Overview" },
  ],
  canGoBack: true,
  canGoForward: false,
  user: {
    name: "K. Vandenberghe",
    email: "k.vandenberghe@procertus.be",
    role: "Lead auditor",
  },
  version: "Webapp: V10.00.00  Api: V10.00.00",
};

/* ---------------------------------------------------------------------------
 * KPI Cards
 * ------------------------------------------------------------------------- */

const kpiCards = [
  {
    title: "Active certificates",
    value: "1,284",
    change: "+12.5%",
    trending: "up" as const,
    description: "Issued in the last 6 months",
  },
  {
    title: "Pending applications",
    value: "47",
    change: "-8%",
    trending: "down" as const,
    description: "Backlog reducing steadily",
  },
  {
    title: "Upcoming audits",
    value: "23",
    change: "+4.5%",
    trending: "up" as const,
    description: "Scheduled next quarter",
  },
  {
    title: "Compliance rate",
    value: "97.2%",
    change: "+1.3%",
    trending: "up" as const,
    description: "Above target threshold",
  },
];

/* ---------------------------------------------------------------------------
 * Recent Certificates Table Data
 * ------------------------------------------------------------------------- */

const recentCertificates = [
  {
    name: "Van Hoeck Engineering BVBA",
    scheme: "ISO 9001:2015",
    status: "success" as const,
    statusLabel: "Active",
    issueDate: "03 Apr 2026",
    expiry: "02 Apr 2029",
    auditor: "K. Vandenberghe",
  },
  {
    name: "Certus Maritime Services NV",
    scheme: "ISO 14001:2015",
    status: "info" as const,
    statusLabel: "Under review",
    issueDate: "Awaiting review",
    expiry: "--",
    auditor: "L. De Smedt",
  },
  {
    name: "Antwerp Precision Metals SA",
    scheme: "ISO 45001:2018",
    status: "warning" as const,
    statusLabel: "Expiring",
    issueDate: "18 Feb 2024",
    expiry: "17 Feb 2027",
    auditor: "M. Peeters",
  },
  {
    name: "Brussels Quality Assurance BV",
    scheme: "ISO 27001:2022",
    status: "destructive" as const,
    statusLabel: "Revoked",
    issueDate: "--",
    expiry: "--",
    auditor: "J. Claes",
  },
  {
    name: "Ghent Structural Testing BVBA",
    scheme: "EN 1090-1+A1",
    status: "success" as const,
    statusLabel: "Active",
    issueDate: "12 Mar 2025",
    expiry: "11 Mar 2028",
    auditor: "K. Vandenberghe",
  },
  {
    name: "Liege Compliance Partners SA",
    scheme: "ISO 3834-2",
    status: "info" as const,
    statusLabel: "Under review",
    issueDate: "Awaiting review",
    expiry: "--",
    auditor: "L. De Smedt",
  },
];

/* ---------------------------------------------------------------------------
 * Page Content
 * ------------------------------------------------------------------------- */

function ColorShowcasePage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-region space-y-component">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="space-y-region">
        {/* KPI Cards */}
        <div className="grid gap-section md:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title} className="gap-0 p-section">
              <CardHeader className="gap-component px-0">
                <H4>{kpi.title}</H4>
                <div className="flex items-center gap-component">
                  <span className="text-[32px] font-semibold leading-none tabular-nums">
                    {kpi.value}
                  </span>
                  <span
                    className={`inline-flex items-center text-sm font-medium ${
                      kpi.trending === "up"
                        ? "text-sys-success-600"
                        : "text-sys-destructive-600"
                    }`}
                  >
                    {kpi.trending === "up" ? (
                      <HugeiconsIcon icon={ArrowUpRight01Icon} className="mr-0.5 size-4" />
                    ) : (
                      <HugeiconsIcon icon={ArrowDownRight01Icon} className="mr-0.5 size-4" />
                    )}
                    {kpi.change}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="px-0 pt-component">
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabbed Section */}
        <div>
          <Tabs defaultValue="recent" className="gap-0">
            <div className="mb-section flex items-center justify-between">
              <Skeleton className="h-6 w-52" />
              <TabsList>
                <TabsTrigger value="recent">Recent certificates</TabsTrigger>
                <TabsTrigger value="expiring">
                  Expiring soon
                  <Badge variant="warning" className="ml-2">
                    3
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending review
                  <Badge variant="info" className="ml-2">
                    2
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recent">
              <Card>
                <CardContent className="px-section py-0">
                  <Table className="[&_tr:last-child]:border-0">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organisation</TableHead>
                        <TableHead>Scheme</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Issue date</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Lead auditor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentCertificates.map((cert) => (
                        <TableRow key={cert.name}>
                          <TableCell>
                            <Skeleton className="h-3.5 w-44" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-3 w-28" />
                          </TableCell>
                          <TableCell>
                            <Badge variant={cert.status}>
                              {cert.statusLabel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-3 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-3 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-3 w-32" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expiring">
              <Card>
                <CardContent>
                  <Muted>
                    3 certificates expiring within the next 90 days.
                  </Muted>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card>
                <CardContent>
                  <Muted>
                    2 applications awaiting initial review.
                  </Muted>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Summary Cards */}
        <div>
          <Skeleton className="mb-section h-6 w-36" />
          <div className="grid gap-section md:grid-cols-3">
            <Card className="gap-component p-section">
              <CardHeader className="px-0">
                <div className="flex items-center gap-component">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-sys-success-100 dark:bg-sys-success-950">
                    <HugeiconsIcon icon={SecurityCheckIcon} className="size-5 text-sys-success-600 dark:text-sys-success-300" />
                  </div>
                  <div className="flex-1 space-y-micro">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-micro">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </CardContent>
            </Card>

            <Card className="gap-component p-section">
              <CardHeader className="px-0">
                <div className="flex items-center gap-component">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-sys-warning-100 dark:bg-sys-warning-950">
                    <HugeiconsIcon icon={Alert01Icon} className="size-5 text-sys-warning-600 dark:text-sys-warning-300" />
                  </div>
                  <div className="flex-1 space-y-micro">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-micro">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CardContent>
            </Card>

            <Card className="gap-component p-section">
              <CardHeader className="px-0">
                <div className="flex items-center gap-component">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-sys-info-100 dark:bg-sys-info-950">
                    <HugeiconsIcon icon={File02Icon} className="size-5 text-sys-info-600 dark:text-sys-info-300" />
                  </div>
                  <div className="flex-1 space-y-micro">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-micro">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Story Configuration
 * ------------------------------------------------------------------------- */

const meta: Meta = {
  title: "Applied guidelines/Colors",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Default: StoryObj = {
  name: "Default",
  render: () => (
    <ManagementAppShell sidebar={sidebarProps} header={headerProps}>
      <ColorShowcasePage />
    </ManagementAppShell>
  ),
};
