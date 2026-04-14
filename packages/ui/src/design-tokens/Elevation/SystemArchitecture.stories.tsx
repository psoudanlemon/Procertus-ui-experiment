import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/components/ui/badge";
import { H2, H3 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "design tokens/Elevation",
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Tier data (source of truth from sandbox)
// ---------------------------------------------------------------------------

const tiers = [
  {
    tier: "L0",
    name: "Surface",
    zIndex: 0,
    token: "shadow-none",
    spec: "none",
    backdrop: "None",
    components: ["Page background", "Layout containers", "Card", "Sidebar", "Button"],
  },
  {
    tier: "L1",
    name: "Standout",
    zIndex: 1,
    token: "shadow-proc-xs",
    spec: "0 1px 2px rgb(0 0 0 / 0.06)",
    backdrop: "None",
    components: ["Raised card", "Focused/promoted elements"],
  },
  {
    tier: "L2",
    name: "Whisper",
    zIndex: 10,
    token: "shadow-proc-sm",
    spec: "0 2px 8px rgb(0 0 0 / 0.08)",
    backdrop: "None",
    components: ["Tooltip", "Hover card"],
  },
  {
    tier: "L3",
    name: "Overlay",
    zIndex: 20,
    token: "shadow-proc-md",
    spec: "0 8px 24px rgb(0 0 0 / 0.12)",
    backdrop: "None",
    components: ["Dropdown", "Popover", "Sheet", "Select", "Combobox"],
  },
  {
    tier: "L4",
    name: "Takeover",
    zIndex: 40,
    token: "shadow-proc-lg",
    spec: "0 16px 48px rgb(0 0 0 / 0.16)",
    backdrop: "bg-black/10 backdrop-blur-[1px]",
    components: ["Modal dialog", "Alert dialog", "Command palette"],
  },
  {
    tier: "L5",
    name: "System",
    zIndex: 50,
    token: "shadow-proc-lg",
    spec: "0 16px 48px rgb(0 0 0 / 0.16)",
    backdrop: "None",
    components: ["Toast"],
  },
] as const;

// ---------------------------------------------------------------------------
// Responsive mapping data (derived from sandbox)
// ---------------------------------------------------------------------------

type ComplexityRule = "linear" | "depth" | "system";

const mappings: {
  desktop: string;
  mobile: string;
  tier: string;
  complexity: ComplexityRule;
  rule: string;
}[] = [
  {
    desktop: "Tooltip",
    mobile: "Drawer (tap-triggered)",
    tier: "L2",
    complexity: "linear",
    rule: "No hover on touch; convert to tap-triggered drawer",
  },
  {
    desktop: "Hover card",
    mobile: "Drawer (tap-triggered)",
    tier: "L2",
    complexity: "linear",
    rule: "No hover on touch; convert to tap-triggered drawer",
  },
  {
    desktop: "Dropdown menu",
    mobile: "Drawer",
    tier: "L3",
    complexity: "linear",
    rule: "Flat list of actions; drawer with 44px touch targets",
  },
  {
    desktop: "Nested dropdown",
    mobile: "Full-page sheet",
    tier: "L3",
    complexity: "depth",
    rule: "Nested/hierarchical content; full-page with back navigation",
  },
  {
    desktop: "Select (popover)",
    mobile: "Drawer (scroll picker)",
    tier: "L3",
    complexity: "linear",
    rule: "Flat list of options; scroll picker with confirm",
  },
  {
    desktop: "Combobox (popover + search)",
    mobile: "Full-page sheet",
    tier: "L3",
    complexity: "depth",
    rule: "Searchable content; full-page with search input",
  },
  {
    desktop: "Sheet (floating panel)",
    mobile: "Full-page sheet",
    tier: "L3",
    complexity: "depth",
    rule: "Rich content; full-page with action bar",
  },
  {
    desktop: "Command palette",
    mobile: "Full-page sheet",
    tier: "L5",
    complexity: "depth",
    rule: "Searchable overlay; full-page with search input",
  },
  {
    desktop: "Modal / Alert dialog",
    mobile: "Drawer",
    tier: "L5",
    complexity: "linear",
    rule: "Confirmation/action; drawer with thumb-zone priority",
  },
  {
    desktop: "Toast",
    mobile: "Toast (centered)",
    tier: "L6",
    complexity: "system",
    rule: "System-level notification; position shifts to bottom-center",
  },
];

// ---------------------------------------------------------------------------
// View 01: Isometric strata
// ---------------------------------------------------------------------------

function IsometricStrataView() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 p-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <H2>Elevation strata (L0-L5)</H2>
        <Muted className="max-w-prose">
          Elevation controls which UI elements appear above others on screen.
          It uses z-index stacking, shadow depth, and optional backdrop blur to
          create a visual hierarchy of layers, from the page surface up through
          overlays, modals, and system notifications.
        </Muted>
      </div>

      {/* Detail table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Tier
              </th>
              <th className="pb-3 pr-6 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Name
              </th>
              <th className="pb-3 pr-6 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Z-index
              </th>
              <th className="pb-3 pr-6 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Components
              </th>
              <th className="pb-3 pr-6 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Shadow
              </th>
              <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Backdrop
              </th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((t) => (
              <tr key={t.tier} className="border-b border-border">
                <td className="py-3 pr-6 font-medium text-foreground">
                  {t.tier}
                </td>
                <td className="py-3 pr-6 text-foreground">{t.name}</td>
                <td className="py-3 pr-6 font-mono text-xs text-muted-foreground">
                  {t.zIndex}
                </td>
                <td className="py-3 pr-6 text-muted-foreground">
                  {t.components.join(", ")}
                </td>
                <td className="py-3 pr-6">
                  <Badge variant="secondary">{t.token}</Badge>
                </td>
                <td className="py-3 text-muted-foreground">
                  {t.backdrop === "None" ? (
                    <span className="text-muted-foreground/40">None</span>
                  ) : (
                    <code className="text-xs">blur(1px)</code>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Reference table for the 6-tier elevation system with shadow tokens,
 * z-index mapping, backdrop rules, and component assignments.
 */
export const IsometricStrata: Story = {
  render: () => <IsometricStrataView />,
};

// ---------------------------------------------------------------------------
// View 02: Mobile mapping table
// ---------------------------------------------------------------------------

function ComplexityBadge({ type }: { type: ComplexityRule }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-[10px]",
        type === "linear" && "bg-brand-accent-100 text-brand-accent-700",
        type === "depth" && "bg-brand-primary-100 text-brand-primary-700",
        type === "system" && "bg-muted text-muted-foreground",
      )}
    >
      {type === "linear" ? "Linear" : type === "depth" ? "Depth" : "System"}
    </Badge>
  );
}

function MobileMappingView() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 p-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <H2>Mobile mapping table</H2>
        <Muted className="max-w-prose">
          How each desktop overlay component should be substituted on mobile
          touch devices, and the complexity rule that determines which mobile
          pattern to use.
        </Muted>
      </div>

      {/* Rules summary */}
      <div className="flex flex-col gap-6">
        <H3>Transformation rules</H3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 pr-6 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Desktop pattern
                </th>
                <th className="pb-3 pr-6 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Mobile substitute
                </th>
                <th className="pb-3 pr-6 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Complexity
                </th>
                <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Rule
                </th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((m) => (
                <tr key={m.desktop} className="border-b border-border">
                  <td className="py-3 pr-6 text-foreground">{m.desktop}</td>
                  <td className="py-3 pr-6 text-foreground">{m.mobile}</td>
                  <td className="py-3 pr-6">
                    <ComplexityBadge type={m.complexity} />
                  </td>
                  <td className="py-3 text-muted-foreground">{m.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ComplexityBadge type="linear" />
            <span className="text-xs text-muted-foreground">Flat lists, simple actions</span>
          </div>
          <div className="flex items-center gap-2">
            <ComplexityBadge type="depth" />
            <span className="text-xs text-muted-foreground">Nested, searchable, rich content</span>
          </div>
          <div className="flex items-center gap-2">
            <ComplexityBadge type="system" />
            <span className="text-xs text-muted-foreground">System-level, unchanged</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Side-by-side desktop-to-mobile component mapping with complexity
 * classification (Linear vs. Depth) and transformation rules.
 */
export const MobileMapping: Story = {
  render: () => <MobileMappingView />,
};
