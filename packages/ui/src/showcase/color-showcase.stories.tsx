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

import { ManagementAppShell } from "../../../ui-lib/src/management-interface/app-shell/ManagementAppShell";
import type {
  Workspace,
  NavItem,
  NavGroup,
} from "../../../ui-lib/src/management-interface/app-shell/ManagementSidebar";

/* ---------------------------------------------------------------------------
 * Sidebar & Header Configuration
 * ------------------------------------------------------------------------- */

const procertusLogo = (
  <img
    src="data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23F1F5F9'/%3E%3Cpath d='M17.4262 21.7754L13.9269 18.6647C12.8241 17.6857 12.7265 15.999 13.7055 14.8963L13.7858 14.8051L18.2489 18.7711L24.0796 12.109C25.0846 10.9607 26.8321 10.8435 27.9804 11.8485L28 11.8659L19.4406 21.6495C18.9218 22.2422 18.0188 22.3008 17.4283 21.7754H17.4262Z' fill='%2371D2C1'/%3E%3Cpath d='M14.5738 10.2246L18.0731 13.3353C19.1758 14.3143 19.2735 16.001 18.2945 17.1038L18.2142 17.1949L13.7511 13.2289L7.92041 19.891C6.91534 21.0394 5.16787 21.1566 4.01954 20.1515L4 20.1342L12.5593 10.3505C13.0781 9.75789 13.9812 9.69928 14.5716 10.2246H14.5738Z' fill='%23076293'/%3E%3C/svg%3E"
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
        { title: "Audit Schedule", url: "#", icon: DatabaseIcon },
        { title: "Non-conformities", url: "#", icon: AiNetworkIcon },
      ],
    },
    {
      label: "Coming Soon",
      maxVisible: 3,
      items: [
        { title: "User Stories", url: "#", icon: HierarchyFilesIcon },
        { title: "Event Models", url: "#", icon: FlashIcon },
        { title: "Prototypes", url: "#", icon: PackageIcon },
        { title: "Context Maps", url: "#", icon: GitBranchIcon },
        { title: "DAL Playground", url: "#", icon: CodeIcon },
        { title: "API Docs", url: "#", icon: BookOpen01Icon },
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
    role: "Lead Auditor",
  },
  version: "Webapp: V10.00.00  Api: V10.00.00",
};

/* ---------------------------------------------------------------------------
 * KPI Cards
 * ------------------------------------------------------------------------- */

const kpiCards = [
  {
    title: "Active Certificates",
    value: "1,284",
    change: "+12.5%",
    trending: "up" as const,
    description: "Issued in the last 6 months",
  },
  {
    title: "Pending Applications",
    value: "47",
    change: "-8%",
    trending: "down" as const,
    description: "Backlog reducing steadily",
  },
  {
    title: "Upcoming Audits",
    value: "23",
    change: "+4.5%",
    trending: "up" as const,
    description: "Scheduled next quarter",
  },
  {
    title: "Compliance Rate",
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
    statusLabel: "Under Review",
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
    statusLabel: "Under Review",
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
      <div className="mb-6 space-y-3">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="space-y-12">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title} className="gap-0 p-4 py-4">
              <CardHeader className="gap-3 px-0">
                <H4>{kpi.title}</H4>
                <div className="flex items-center gap-2">
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
              <CardContent className="px-0 pt-3">
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabbed Section */}
        <div>
          <Tabs defaultValue="recent" className="gap-0">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-6 w-52" />
              <TabsList>
                <TabsTrigger value="recent">Recent Certificates</TabsTrigger>
                <TabsTrigger value="expiring">
                  Expiring Soon
                  <Badge variant="warning" className="ml-2">
                    3
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending Review
                  <Badge variant="info" className="ml-2">
                    2
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recent">
              <Card>
                <CardContent className="px-4 py-0">
                  <Table className="[&_tr:last-child]:border-0">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organisation</TableHead>
                        <TableHead>Scheme</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Lead Auditor</TableHead>
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
          <Skeleton className="mb-4 h-6 w-36" />
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="gap-3 p-4 py-4">
              <CardHeader className="px-0">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-sys-success-100 dark:bg-sys-success-950">
                    <HugeiconsIcon icon={SecurityCheckIcon} className="size-5 text-sys-success-600 dark:text-sys-success-300" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </CardContent>
            </Card>

            <Card className="gap-3 p-4 py-4">
              <CardHeader className="px-0">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-sys-warning-100 dark:bg-sys-warning-950">
                    <HugeiconsIcon icon={Alert01Icon} className="size-5 text-sys-warning-600 dark:text-sys-warning-300" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CardContent>
            </Card>

            <Card className="gap-3 p-4 py-4">
              <CardHeader className="px-0">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-sys-info-100 dark:bg-sys-info-950">
                    <HugeiconsIcon icon={File02Icon} className="size-5 text-sys-info-600 dark:text-sys-info-300" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-2">
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
  title: "Applied Guidelines/Colors",
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
