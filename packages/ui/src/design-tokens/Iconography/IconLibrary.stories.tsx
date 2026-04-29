import type { Meta, StoryObj } from "@storybook/react-vite";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  // Navigation & wayfinding
  Home01Icon,
  DashboardSquare01Icon,
  CompassIcon,
  GlobeIcon,
  Menu01Icon,
  Search01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ExpandIcon,
  CollapseIcon,
  // People & identity
  UserGroupIcon,
  Shield01Icon,
  LockIcon,
  EyeIcon,
  KeyIcon,
  Award01Icon,
  // Content & data
  File01Icon,
  Folder01Icon,
  Database01Icon,
  Layers01Icon,
  TableIcon,
  GridIcon,
  BarChartIcon,
  PieChartIcon,
  ChartIcon,
  // Actions
  PencilEdit01Icon,
  PlusSignIcon,
  MinusSignIcon,
  Cancel01Icon,
  Tick02Icon,
  Copy01Icon,
  Download01Icon,
  Upload01Icon,
  FilterIcon,
  RefreshIcon,
  Delete01Icon,
  Share01Icon,
  // Communication & feedback
  Mail01Icon,
  Notification01Icon,
  AlertCircleIcon,
  InformationCircleIcon,
  HelpCircleIcon,
  CheckmarkCircle02Icon,
  StarIcon,
  Flag01Icon,
  // Objects & system
  Setting06Icon,
  Calendar01Icon,
  Clock01Icon,
  Link01Icon,
  Tag01Icon,
  Bookmark01Icon,
  PrinterIcon,
  CloudIcon,
  Building01Icon,
  CodeIcon,
} from "@hugeicons/core-free-icons";

import { H1, H3 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";
import { iconStroke } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ICON_SIZE = 24;
const STROKE_WEIGHT = iconStroke(ICON_SIZE);

// ---------------------------------------------------------------------------
// Types & data
// ---------------------------------------------------------------------------

type IconEntry = { name: string; icon: IconSvgElement };

type IconCategory = {
  label: string;
  description: string;
  icons: IconEntry[];
};

const cast = (icon: unknown) => icon as IconSvgElement;

const categories: IconCategory[] = [
  {
    label: "Navigation and wayfinding",
    description: "Orientation, routing, and spatial movement.",
    icons: [
      { name: "Home", icon: cast(Home01Icon) },
      { name: "Dashboard", icon: cast(DashboardSquare01Icon) },
      { name: "Compass", icon: cast(CompassIcon) },
      { name: "Globe", icon: cast(GlobeIcon) },
      { name: "Menu", icon: cast(Menu01Icon) },
      { name: "Search", icon: cast(Search01Icon) },
      { name: "Left", icon: cast(ArrowLeft01Icon) },
      { name: "Right", icon: cast(ArrowRight01Icon) },
      { name: "Up", icon: cast(ArrowUp01Icon) },
      { name: "Down", icon: cast(ArrowDown01Icon) },
      { name: "Expand", icon: cast(ExpandIcon) },
      { name: "Collapse", icon: cast(CollapseIcon) },
    ],
  },
  {
    label: "People and identity",
    description: "Users, roles, permissions, and credentials.",
    icons: [
      { name: "Users", icon: cast(UserGroupIcon) },
      { name: "Shield", icon: cast(Shield01Icon) },
      { name: "Lock", icon: cast(LockIcon) },
      { name: "View", icon: cast(EyeIcon) },
      { name: "Key", icon: cast(KeyIcon) },
      { name: "Award", icon: cast(Award01Icon) },
    ],
  },
  {
    label: "Content and data",
    description: "Files, storage, structure, and visualization.",
    icons: [
      { name: "File", icon: cast(File01Icon) },
      { name: "Folder", icon: cast(Folder01Icon) },
      { name: "Database", icon: cast(Database01Icon) },
      { name: "Layers", icon: cast(Layers01Icon) },
      { name: "Table", icon: cast(TableIcon) },
      { name: "Grid", icon: cast(GridIcon) },
      { name: "Bar chart", icon: cast(BarChartIcon) },
      { name: "Pie chart", icon: cast(PieChartIcon) },
      { name: "Chart", icon: cast(ChartIcon) },
    ],
  },
  {
    label: "Actions",
    description: "Create, modify, transfer, and remove.",
    icons: [
      { name: "Edit", icon: cast(PencilEdit01Icon) },
      { name: "Add", icon: cast(PlusSignIcon) },
      { name: "Remove", icon: cast(MinusSignIcon) },
      { name: "Close", icon: cast(Cancel01Icon) },
      { name: "Confirm", icon: cast(Tick02Icon) },
      { name: "Copy", icon: cast(Copy01Icon) },
      { name: "Download", icon: cast(Download01Icon) },
      { name: "Upload", icon: cast(Upload01Icon) },
      { name: "Filter", icon: cast(FilterIcon) },
      { name: "Refresh", icon: cast(RefreshIcon) },
      { name: "Delete", icon: cast(Delete01Icon) },
      { name: "Share", icon: cast(Share01Icon) },
    ],
  },
  {
    label: "Communication and feedback",
    description: "Messaging, alerts, and status indicators.",
    icons: [
      { name: "Mail", icon: cast(Mail01Icon) },
      { name: "Notification", icon: cast(Notification01Icon) },
      { name: "Alert", icon: cast(AlertCircleIcon) },
      { name: "Info", icon: cast(InformationCircleIcon) },
      { name: "Help", icon: cast(HelpCircleIcon) },
      { name: "Success", icon: cast(CheckmarkCircle02Icon) },
      { name: "Star", icon: cast(StarIcon) },
      { name: "Flag", icon: cast(Flag01Icon) },
    ],
  },
  {
    label: "Objects and system",
    description: "Tools, scheduling, and infrastructure.",
    icons: [
      { name: "Settings", icon: cast(Setting06Icon) },
      { name: "Calendar", icon: cast(Calendar01Icon) },
      { name: "Clock", icon: cast(Clock01Icon) },
      { name: "Link", icon: cast(Link01Icon) },
      { name: "Tag", icon: cast(Tag01Icon) },
      { name: "Bookmark", icon: cast(Bookmark01Icon) },
      { name: "Print", icon: cast(PrinterIcon) },
      { name: "Cloud", icon: cast(CloudIcon) },
      { name: "Building", icon: cast(Building01Icon) },
      { name: "Code", icon: cast(CodeIcon) },
    ],
  },
];

// ---------------------------------------------------------------------------
// Grid component
// ---------------------------------------------------------------------------

function IconGrid({
  icons,
  colorClass,
}: {
  icons: IconEntry[];
  colorClass: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
      {icons.map((entry) => (
        <div
          key={entry.name}
          className="flex flex-col items-center gap-2.5 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/40"
        >
          <div className={colorClass}>
            <HugeiconsIcon
              icon={entry.icon}
              size={ICON_SIZE}
              strokeWidth={STROKE_WEIGHT}
            />
          </div>
          <span className="text-[11px] text-muted-foreground">
            {entry.name}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story layout
// ---------------------------------------------------------------------------

function SymbolLibraryView() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 p-10">
      <div className="flex flex-col gap-2">
        <H1>The symbol library</H1>
        <Muted className="max-w-prose">
          A preview of the Hugeicons Stroke library at {STROKE_WEIGHT}px stroke
          weight. Icons are grouped by general function, not by specific usage,
          so this page stays accurate as the product evolves.
        </Muted>
      </div>

      {/* Navigational section in brand color */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <H3>{categories[0].label}</H3>
          <Muted>
            {categories[0].description} Rendered in brand-primary-700 to
            demonstrate navigational intent.
          </Muted>
        </div>
        <IconGrid
          icons={categories[0].icons}
          colorClass="text-[var(--brand-primary-700)] dark:text-[var(--brand-accent-300)]"
        />
      </section>

      {/* Remaining categories in system foreground */}
      {categories.slice(1).map((category) => (
        <section key={category.label} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <H3>{category.label}</H3>
            <Muted>{category.description}</Muted>
          </div>
          <IconGrid icons={category.icons} colorClass="text-foreground" />
        </section>
      ))}

      <footer className="flex items-center gap-6 border-t pt-6 text-xs text-muted-foreground [&>span]:text-muted-foreground">
        <span>Library: Hugeicons</span>
        <span>Variant: Stroke</span>
        <span>Weight: {STROKE_WEIGHT}px</span>
        <span>Size: {ICON_SIZE}px</span>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

const meta = {
  title: "design tokens/Iconography",
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A representative preview of the Hugeicons Stroke library at 1.33px stroke
 * weight, organized by general function. The first category renders in
 * brand-primary-700 to demonstrate navigational intent; all others use the
 * standard system foreground.
 */
export const SymbolLibrary: Story = {
  render: () => <SymbolLibraryView />,
};

// ---------------------------------------------------------------------------
// Proportional scaling story
// ---------------------------------------------------------------------------

const BASE_SIZE = 16;
const BASE_STROKE = 1.33;

const scaleSizes = [14, 16, 20, 24, 32, 40, 48, 56];

const sampleIcons: { icon: IconSvgElement; name: string }[] = [
  { icon: Home01Icon as IconSvgElement, name: "Home" },
];

function ProportionalScaleView() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 p-10">
      <div className="flex flex-col gap-2">
        <H1>Proportional scaling</H1>
        <Muted>
          The base stroke weight of {BASE_STROKE}px is calibrated for {BASE_SIZE}px
          icons. As icons grow, the stroke weight scales along a square-root curve
          to maintain the same perceived density. Linear scaling makes large icons
          feel too heavy, so this curve produces a gentler, more natural progression.
        </Muted>
      </div>

      {/* Scale table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Size</th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Stroke</th>
              {sampleIcons.map((entry) => (
                <th key={entry.name} className="pb-3 text-center text-xs font-medium text-muted-foreground">
                  {entry.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scaleSizes.map((size) => {
              const stroke = iconStroke(size);
              const isBase = size === BASE_SIZE;
              return (
                <tr
                  key={size}
                  className={`border-b border-border ${isBase ? "bg-brand-primary-50 dark:bg-brand-primary-950" : ""}`}
                >
                  <td className="py-4 pr-6 text-sm font-medium tabular-nums text-foreground">
                    {size}px
                    {isBase && (
                      <span className="ml-2 rounded-full bg-brand-primary-100 px-2 py-0.5 text-[10px] font-semibold text-brand-primary-700 dark:bg-brand-primary-900 dark:text-brand-primary-300">
                        base
                      </span>
                    )}
                  </td>
                  <td className="py-4 pr-6 text-sm tabular-nums text-muted-foreground">
                    {stroke}px
                  </td>
                  {sampleIcons.map((entry) => (
                    <td key={entry.name} className="py-4">
                      <div className="flex items-center justify-center">
                        <HugeiconsIcon
                          icon={entry.icon}
                          size={size}
                          strokeWidth={stroke}
                          className="text-foreground"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center gap-6 text-xs text-muted-foreground">
        <span>Curve: square root</span>
        <span>Formula: {BASE_STROKE} x sqrt(size / {BASE_SIZE})</span>
        <span>Base: {BASE_SIZE}px / {BASE_STROKE}px</span>
      </footer>
    </div>
  );
}

/**
 * Demonstrates how stroke weight scales proportionally with icon size
 * to maintain consistent visual density across the interface.
 */
export const ProportionalScale: Story = {
  render: () => <ProportionalScaleView />,
};
