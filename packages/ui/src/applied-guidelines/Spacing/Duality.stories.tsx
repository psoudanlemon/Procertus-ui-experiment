import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  AnalyticsUpIcon,
  ArrowExpand01Icon,
  ArrowShrink01Icon,
  ArrowUpRight01Icon,
  Calendar01Icon,
  CheckmarkCircle02Icon,
  Database01Icon,
  Download01Icon,
  FilterIcon,
  HelpCircleIcon,
  HierarchySquare02Icon,
  Home01Icon,
  Invoice01Icon,
  MoreHorizontalIcon,
  Notification03Icon,
  PaintBoardIcon,
  SecurityCheckIcon,
  Setting06Icon,
  Task01Icon,
  UserGroupIcon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";

import {
  AppSidebar,
  type NavGroup,
  type NavItem,
  type Workspace,
} from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * Spacing token primitives
 * ---------------------------------------------------------------------------
 *
 * `Box` and `Group` are thin wrappers that apply a semantic spacing token AND,
 * when the spacing grid overlay is active, render a translucent highlight
 * filling the padding/gap area plus a label showing the token name and its
 * resolved value. Toggle the density toolbar to watch the resolved values
 * change in place.
 * ------------------------------------------------------------------------- */

type SpacingToken =
  | "micro"
  | "component"
  | "section"
  | "region"
  | "boundary";

const GridContext = React.createContext<{
  show: boolean;
  toggle: () => void;
}>({ show: true, toggle: () => {} });

type Density = "operational" | "spacious";
const DensityContext = React.createContext<{
  density: Density;
  toggle: () => void;
}>({ density: "operational", toggle: () => {} });

function useTokenValue(token: SpacingToken) {
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    const read = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue(`--spacing-${token}`)
        .trim();
      if (!raw) {
        setValue("");
        return;
      }
      if (raw.endsWith("rem")) {
        const px = Math.round(parseFloat(raw) * 16);
        setValue(`${px}px`);
      } else if (raw.endsWith("px")) {
        setValue(raw);
      } else {
        setValue(raw);
      }
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-density", "class", "data-theme"],
    });
    return () => observer.disconnect();
  }, [token]);

  return value;
}

function TokenTag({
  token,
  className,
}: {
  token: SpacingToken;
  className?: string;
}) {
  const value = useTokenValue(token);
  return (
    <span
      className={cn(
        "pointer-events-none z-20 inline-flex items-center gap-1 rounded-sm bg-primary px-1 py-px font-mono text-[9px] font-medium leading-none text-primary-foreground shadow-sm",
        className,
      )}
    >
      <span>{token}</span>
      <span className="opacity-70">·</span>
      <span className="tabular-nums">{value}</span>
    </span>
  );
}

const PADDING_CLASS: Record<SpacingToken, string> = {
  micro: "p-micro",
  component: "p-component",
  section: "p-section",
  region: "p-region",
  boundary: "p-boundary",
};

const GAP_CLASS: Record<SpacingToken, string> = {
  micro: "gap-micro",
  component: "gap-component",
  section: "gap-section",
  region: "gap-region",
  boundary: "gap-boundary",
};

function Box({
  p,
  className,
  children,
  as: Tag = "div",
  showcase = false,
}: {
  p: SpacingToken;
  className?: string;
  children?: React.ReactNode;
  as?: "div" | "section" | "header" | "footer" | "aside" | "main";
  /** Highlight this instance with the spacing overlay and token label. */
  showcase?: boolean;
}) {
  const { show: showGrid } = React.useContext(GridContext);
  const active = showGrid && showcase;
  const sideStyle = (axis: "h" | "w") => ({
    [axis === "h" ? "height" : "width"]: `var(--spacing-${p})`,
  });
  return (
    <Tag
      className={cn(
        "relative",
        PADDING_CLASS[p],
        active &&
          "outline outline-1 outline-dashed outline-primary/50 outline-offset-0",
        className,
      )}
    >
      {active && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
          >
            <div
              className="absolute left-0 right-0 top-0 bg-primary/15"
              style={sideStyle("h")}
            />
            <div
              className="absolute bottom-0 left-0 right-0 bg-primary/15"
              style={sideStyle("h")}
            />
            <div
              className="absolute bottom-0 left-0 top-0 bg-primary/15"
              style={sideStyle("w")}
            />
            <div
              className="absolute bottom-0 right-0 top-0 bg-primary/15"
              style={sideStyle("w")}
            />
          </div>
          <TokenTag
            token={p}
            className="absolute left-1 top-1 z-20"
          />
        </>
      )}
      <div className={cn(active && "relative z-10", "h-full")}>
        {children}
      </div>
    </Tag>
  );
}

function Gap({
  token,
  axis = "vertical",
  showcase = false,
}: {
  token: SpacingToken;
  axis?: "vertical" | "horizontal";
  showcase?: boolean;
}) {
  const { show: showGrid } = React.useContext(GridContext);
  const active = showGrid && showcase;
  const dimension = axis === "vertical" ? "height" : "width";
  return (
    <div
      aria-hidden
      className={cn(
        "relative shrink-0",
        active &&
          "bg-primary/15 outline outline-1 outline-dashed outline-primary/40",
      )}
      style={{ [dimension]: `var(--spacing-${token})` }}
    >
      {active && (
        <TokenTag
          token={token}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </div>
  );
}

function Group({
  gap,
  className,
  children,
  showcase = false,
}: {
  gap: SpacingToken;
  className?: string;
  children?: React.ReactNode;
  /** Highlight this instance with the gap label. */
  showcase?: boolean;
}) {
  const { show: showGrid } = React.useContext(GridContext);
  const active = showGrid && showcase;
  return (
    <div
      className={cn(
        "relative",
        GAP_CLASS[gap],
        active && "outline outline-1 outline-dashed outline-primary/40",
        className,
      )}
    >
      {active && (
        <TokenTag
          token={gap}
          className="absolute right-1 top-1 z-20"
        />
      )}
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Wireframe primitives
 * ------------------------------------------------------------------------- */

function Bar({ className }: { className?: string }) {
  return <Skeleton className={cn("h-2 rounded-sm", className)} />;
}

function Line({ className }: { className?: string }) {
  return <Skeleton className={cn("h-3 rounded-sm", className)} />;
}

function Block({ className }: { className?: string }) {
  return <Skeleton className={cn("rounded-md", className)} />;
}

/* ---------------------------------------------------------------------------
 * Wireframe operations dashboard
 * ------------------------------------------------------------------------- */

function OpsDashboard() {
  return (
    <Box
      p="boundary"
      as="main"
      showcase
      className="min-h-full w-full bg-background"
    >
      <div className="flex flex-col">
        {/* Page header */}
        <Group gap="component" className="flex items-start justify-between">
          <Group gap="micro" showcase className="flex flex-col">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={SecurityCheckIcon}
                className="size-4 text-primary"
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Operations / Compliance overview
              </span>
            </div>
            <h1 className="text-heading-xl font-semibold tracking-tight text-foreground">
              Certification operations
            </h1>
            <p className="text-sm text-muted-foreground">
              Live status across active audits, expiring certificates, and
              standards in review.
            </p>
          </Group>

          <Group gap="component" showcase className="flex items-center">
            <Button variant="outline" size="sm">
              <HugeiconsIcon icon={Calendar01Icon} className="size-4" />
              Last 30 days
            </Button>
            <Button variant="outline" size="sm">
              <HugeiconsIcon icon={Download01Icon} className="size-4" />
              Export
            </Button>
            <Button size="sm">
              <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" />
              New audit
            </Button>
          </Group>
        </Group>

        <Gap token="region" showcase />

        {/* Stat row */}
        <Group
          gap="component"
          showcase
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard label="Active certificates" valueWidth="w-20" trend="+12" />
          <StatCard label="Audits in progress" valueWidth="w-16" trend="+3" />
          <StatCard label="Expiring this month" valueWidth="w-14" trend="-2" tone="warning" />
          <StatCard label="Open findings" valueWidth="w-12" trend="+5" tone="danger" />
        </Group>

        <Gap token="region" />

        {/* Main content grid */}
        <Group
          gap="component"
          className="grid grid-cols-1 lg:grid-cols-3"
        >
          {/* Audit pipeline panel */}
          <Box
            p="section"
            showcase
            className="rounded-xl border border-border bg-card lg:col-span-2"
          >
            <Group gap="section" showcase className="flex flex-col">
              <Group gap="component" className="flex items-center justify-between">
                <Group gap="micro" className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    Audit pipeline
                  </span>
                  <Line className="w-44" />
                </Group>
                <Group gap="micro" className="flex items-center">
                  <Button variant="ghost" size="icon" className="size-7">
                    <HugeiconsIcon icon={FilterIcon} className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7">
                    <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" />
                  </Button>
                </Group>
              </Group>

              <Separator />

              {/* Chart area */}
              <Block className="h-40 w-full" />

              <Separator />

              {/* Pipeline rows */}
              <Group gap="component" className="flex flex-col">
                {pipelineRows.map((row, index) => (
                  <Box
                    key={row.id}
                    p="component"
                    showcase={index === 0}
                    className="rounded-md border border-border/60 bg-background"
                  >
                    <Group
                      gap="component"
                      className="flex items-center"
                    >
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          className="size-4 text-primary"
                        />
                      </div>
                      <Group
                        gap="micro"
                        className="flex flex-1 flex-col"
                      >
                        <Line className={row.titleWidth} />
                        <Bar className={row.metaWidth} />
                      </Group>
                      <Badge variant={row.tone} className="shrink-0">
                        {row.status}
                      </Badge>
                    </Group>
                  </Box>
                ))}
              </Group>
            </Group>
          </Box>

          {/* Side panel */}
          <Box p="section" className="rounded-xl border border-border bg-card">
            <Group gap="section" className="flex flex-col">
              <Group gap="micro" className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  Expiring soon
                </span>
                <Line className="w-32" />
              </Group>

              <Separator />

              <Group gap="component" className="flex flex-col">
                {expiringRows.map((row) => (
                  <Group
                    key={row.id}
                    gap="micro"
                    className="flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <Line className={row.titleWidth} />
                      <Bar className="w-10" />
                    </div>
                    <Bar className={row.metaWidth} />
                  </Group>
                ))}
              </Group>

              <Separator />

              <Button variant="outline" size="sm" className="w-full">
                View all
              </Button>
            </Group>
          </Box>
        </Group>

        <Gap token="region" />

        {/* Activity feed */}
        <Box p="section" className="rounded-xl border border-border bg-card">
          <Group gap="section" className="flex flex-col">
            <Group gap="component" className="flex items-center justify-between">
              <Group gap="micro" className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  Recent activity
                </span>
                <Line className="w-56" />
              </Group>
              <Button variant="ghost" size="sm">
                <HugeiconsIcon icon={Notification03Icon} className="size-4" />
                Subscribe
              </Button>
            </Group>

            <Separator />

            <Group gap="component" className="flex flex-col">
              {activityRows.map((row) => (
                <Group
                  key={row.id}
                  gap="component"
                    className="flex items-center"
                >
                  <div className="size-2 shrink-0 rounded-full bg-primary" />
                  <Line className={row.lineWidth} />
                  <Bar className="ml-auto w-16 shrink-0" />
                </Group>
              ))}
            </Group>
          </Group>
        </Box>
      </div>
    </Box>
  );
}

function StatCard({
  label,
  valueWidth,
  trend,
  tone = "default",
}: {
  label: string;
  valueWidth: string;
  trend: string;
  tone?: "default" | "warning" | "danger";
}) {
  const trendTone =
    tone === "danger"
      ? "text-destructive"
      : tone === "warning"
        ? "text-warning"
        : "text-success";
  return (
    <Box p="section" className="rounded-xl border border-border bg-card">
      <Group gap="component" className="flex flex-col">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <Skeleton className={cn("h-7 rounded-sm", valueWidth)} />
        <span className={cn("text-xs font-medium", trendTone)}>
          {trend} vs last period
        </span>
      </Group>
    </Box>
  );
}

const pipelineRows = [
  {
    id: 1,
    titleWidth: "w-48",
    metaWidth: "w-32",
    status: "In review",
    tone: "secondary" as const,
  },
  {
    id: 2,
    titleWidth: "w-56",
    metaWidth: "w-28",
    status: "Approved",
    tone: "success" as const,
  },
  {
    id: 3,
    titleWidth: "w-44",
    metaWidth: "w-36",
    status: "Action needed",
    tone: "destructive" as const,
  },
  {
    id: 4,
    titleWidth: "w-52",
    metaWidth: "w-24",
    status: "Scheduled",
    tone: "outline" as const,
  },
];

const expiringRows = [
  { id: 1, titleWidth: "w-32", metaWidth: "w-20" },
  { id: 2, titleWidth: "w-28", metaWidth: "w-24" },
  { id: 3, titleWidth: "w-36", metaWidth: "w-16" },
  { id: 4, titleWidth: "w-24", metaWidth: "w-20" },
];

const activityRows = [
  { id: 1, lineWidth: "w-72" },
  { id: 2, lineWidth: "w-80" },
  { id: 3, lineWidth: "w-64" },
  { id: 4, lineWidth: "w-72" },
];

/* ---------------------------------------------------------------------------
 * Application shell
 * ------------------------------------------------------------------------- */

const shellWorkspaces: Workspace[] = [
  {
    id: "procertus",
    name: "PROCERTUS",
    logo: (
      <img
        src="/logomark.svg"
        alt="PROCERTUS"
        className="size-full rounded-sm"
      />
    ),
    plan: "Operations console",
  },
];

const shellNavItems: NavItem[] = [
  { title: "Overview", url: "#", icon: Home01Icon as IconSvgElement, isActive: true },
  { title: "Audits", url: "#", icon: Task01Icon as IconSvgElement },
  { title: "Certificates", url: "#", icon: Invoice01Icon as IconSvgElement },
  { title: "Calendar", url: "#", icon: Calendar01Icon as IconSvgElement },
  { title: "People", url: "#", icon: UserGroupIcon as IconSvgElement },
];

const shellNavGroups: NavGroup[] = [
  {
    label: "Insights",
    items: [
      {
        title: "Analysis",
        url: "#",
        icon: AnalyticsUpIcon as IconSvgElement,
        items: [
          { title: "Overview", url: "#" },
          { title: "Reports", url: "#" },
          { title: "Trends", url: "#" },
        ],
      },
      {
        title: "Standards",
        url: "#",
        icon: PaintBoardIcon as IconSvgElement,
        items: [
          { title: "Catalog", url: "#" },
          { title: "Mappings", url: "#" },
        ],
      },
    ],
  },
  {
    label: "Records",
    items: [
      {
        title: "Domain browser",
        url: "#",
        icon: Database01Icon as IconSvgElement,
      },
      {
        title: "Architecture",
        url: "#",
        icon: HierarchySquare02Icon as IconSvgElement,
      },
    ],
  },
];

const shellSecondary: NavItem[] = [
  { title: "Settings", url: "#", icon: Setting06Icon as IconSvgElement },
  { title: "Help", url: "#", icon: HelpCircleIcon as IconSvgElement },
];

function GridProvider({
  initial,
  children,
}: {
  initial: boolean;
  children: React.ReactNode;
}) {
  const [show, setShow] = React.useState(initial);

  React.useEffect(() => {
    setShow(initial);
  }, [initial]);

  const toggle = React.useCallback(() => setShow((s) => !s), []);
  const value = React.useMemo(() => ({ show, toggle }), [show, toggle]);

  return (
    <GridContext.Provider value={value}>{children}</GridContext.Provider>
  );
}

function GridToggleButton() {
  const { show, toggle } = React.useContext(GridContext);
  return (
    <Button variant="outline" size="sm" onClick={toggle}>
      <HugeiconsIcon
        icon={show ? ViewOffIcon : ViewIcon}
        className="size-4"
      />
      {show ? "Hide labels" : "Show labels"}
    </Button>
  );
}

function DensityProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensity] = React.useState<Density>(() => {
    if (typeof document === "undefined") return "operational";
    const current = document.documentElement.dataset.density;
    return current === "spacious" ? "spacious" : "operational";
  });

  React.useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  const toggle = React.useCallback(
    () =>
      setDensity((d) => (d === "operational" ? "spacious" : "operational")),
    [],
  );

  const value = React.useMemo(() => ({ density, toggle }), [density, toggle]);

  return (
    <DensityContext.Provider value={value}>{children}</DensityContext.Provider>
  );
}

function DensityToggleButton() {
  const { density, toggle } = React.useContext(DensityContext);
  const isSpacious = density === "spacious";
  return (
    <Button variant="outline" size="sm" onClick={toggle}>
      <HugeiconsIcon
        icon={isSpacious ? ArrowShrink01Icon : ArrowExpand01Icon}
        className="size-4"
      />
      {isSpacious ? "Operational" : "Spacious"}
    </Button>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const { density } = React.useContext(DensityContext);
  return (
    <SidebarProvider>
      <div data-density={density} className="contents">
        <AppSidebar
          workspaces={shellWorkspaces}
          activeWorkspaceId="procertus"
          navItems={shellNavItems}
          navGroups={shellNavGroups}
          secondaryItems={shellSecondary}
          showSearch={false}
          stickyNav={false}
        />
        <div className="flex h-svh flex-1 flex-col bg-sidebar">
          <div className="flex h-12 shrink-0 items-center gap-2 px-3 pt-3">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-2">
              <GridToggleButton />
              <DensityToggleButton />
            </div>
          </div>
          <main className="ml-3 mr-4 mt-1 min-h-0 flex-1 overflow-y-auto rounded-t-xl bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* ---------------------------------------------------------------------------
 * Story
 * ------------------------------------------------------------------------- */

type StoryArgs = { showGrid: boolean };

const meta: Meta<StoryArgs> = {
  title: "Applied guidelines/Spacing",
  tags: ["!autodocs", "!docs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 900 },
    },
  },
  argTypes: {
    showGrid: { control: "boolean", name: "Spacing grid" },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

/**
 * **Spacing in context: a wireframe operations dashboard**
 *
 * A representative management screen built entirely from semantic spacing
 * tokens. Toggle **Spacing grid** to highlight every padding and gap, with
 * the live token name and resolved value rendered inline. Switch the
 * **Density** toolbar between operational and spacious to watch the same
 * tokens reflow as the underlying CSS variables change.
 */
export const Duality: Story = {
  args: { showGrid: true },
  render: ({ showGrid }) => (
    <GridProvider initial={showGrid}>
      <DensityProvider>
        <AppShell>
          <OpsDashboard />
        </AppShell>
      </DensityProvider>
    </GridProvider>
  ),
};
