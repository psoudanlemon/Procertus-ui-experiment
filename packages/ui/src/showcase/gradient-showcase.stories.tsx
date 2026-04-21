import type { Meta, StoryObj } from "@storybook/react-vite";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import {
  AiNetworkIcon,
  BarChartIcon,
  BookOpen01Icon,
  ColorPickerIcon,
  DatabaseIcon,
  HelpCircleIcon,
  MapsIcon,
  PackageIcon,
  SecurityCheckIcon,
  Settings01Icon,
  SparklesIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Muted } from "@/components/ui/typography";

import { ManagementAppShell } from "../../../ui-lib/src/management-interface/app-shell/ManagementAppShell";
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
    { title: "Dashboard", url: "#", icon: BarChartIcon, isActive: true },
    { title: "Analytics", url: "#", icon: MapsIcon },
    { title: "Projects", url: "#", icon: PackageIcon },
    { title: "Team", url: "#", icon: UserMultipleIcon },
    { title: "Reports", url: "#", icon: BookOpen01Icon },
  ] as NavItem[],
  navGroups: [
    {
      label: "Registry",
      items: [
        {
          title: "Certificates",
          url: "#",
          icon: SecurityCheckIcon,
          items: [
            { title: "Overview", url: "#" },
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
    { label: "Home", href: "#" },
    { label: "IAM", href: "#" },
    { label: "Users" },
  ],
  canGoBack: true,
  canGoForward: false,
  user: {
    name: "Matthias",
    email: "matthias@procertus.be",
    role: "Platform administrator",
  },
};

/* ---------------------------------------------------------------------------
 * Gradient cycling card
 * ------------------------------------------------------------------------- */

const gradientTokens = [
  "--gradient-primary",
  "--gradient-accent",
  "--gradient-neutral",
  "--gradient-blend",
];

function GradientDots({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {gradientTokens.map((t, i) => (
        <button
          key={t}
          type="button"
          onClick={() => onSelect(i)}
          className={`size-3 rounded-full border border-muted-foreground/50 transition-all duration-500 ${
            i === active
              ? "scale-125 bg-primary border-primary"
              : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
          }`}
          aria-label={t}
        />
      ))}
    </div>
  );
}

function CyclingGradientCard({
  active,
}: {
  active: number;
}) {
  const token = gradientTokens[active];

  return (
    <Card className="relative overflow-hidden border-0">
      {/* All gradient layers stacked, only the active one is visible */}
      {gradientTokens.map((t, i) => (
        <div
          key={t}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `var(${t})`,
            opacity: i === active ? 1 : 0,
          }}
        />
      ))}

      {/* Content */}
      <CardHeader className="relative z-10">
        <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-neutral-900/10 dark:bg-white/20">
          <HugeiconsIcon
            icon={SparklesIcon}
            className="size-5 text-neutral-900 dark:text-white"
          />
        </div>
        <CardTitle className="text-neutral-900 dark:text-white">
          IAM Insights AI
        </CardTitle>
        <CardDescription className="text-neutral-800/80 dark:text-white/70">
          "3 roles have excessive unused permissions. Recommend downgrading
          access for security optimization."
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <Button
          variant="outline"
          className="border-neutral-900/30 bg-neutral-900/10 text-neutral-900 hover:bg-neutral-900/20 dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        >
          Run Optimization
        </Button>
        <Muted className="mt-3 text-xs text-neutral-900/50 dark:text-white/50">
          {token}
        </Muted>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------------------
 * Dashboard content
 * ------------------------------------------------------------------------- */

function SkeletonCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-2 w-3/4" />
      </CardContent>
    </Card>
  );
}

function SkeletonTable() {
  return (
    <Card className="h-full">
      <CardContent className="space-y-4 p-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-px w-full" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2.5 w-40" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % gradientTokens.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top bar skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid min-w-0 gap-6 md:grid-cols-[1fr_2fr]">
        <SkeletonCard />
        <SkeletonTable />
      </div>

      {/* Bottom row */}
      <div
        className="gap-6"
        style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr" }}
      >
        <SkeletonCard className="h-full" />
        <GradientDots active={active} onSelect={setActive} />
        <CyclingGradientCard active={active} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Story
 * ------------------------------------------------------------------------- */

function GradientShowcase() {
  return (
    <ManagementAppShell sidebar={sidebarProps} header={headerProps}>
      <DashboardContent />
    </ManagementAppShell>
  );
}

const meta: Meta = {
  title: "Applied guidelines/Gradients",
  component: GradientShowcase,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof GradientShowcase>;

export const Default: Story = {};
