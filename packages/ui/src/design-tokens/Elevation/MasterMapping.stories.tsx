import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/components/ui/badge";
import { H2, H3 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";

// ---------------------------------------------------------------------------
// Elevation tier data
// ---------------------------------------------------------------------------

const tiers = [
  {
    tier: "L0",
    name: "Ground",
    zIndex: 0,
    shadowClass: "shadow-none",
    shadowType: "—",
    backdrop: false,
  },
  {
    tier: "L1",
    name: "Surface",
    zIndex: 1,
    shadowClass: "shadow-proc-xs",
    shadowType: "Neutral",
    backdrop: false,
  },
  {
    tier: "L2",
    name: "Whisper",
    zIndex: 10,
    shadowClass: "shadow-proc-sm",
    shadowType: "Neutral (softest layered shadow)",
    backdrop: false,
  },
  {
    tier: "L3",
    name: "Overlay",
    zIndex: 20,
    shadowClass: "shadow-proc-md",
    shadowType: "Neutral",
    backdrop: false,
  },
  {
    tier: "L4",
    name: "Standout",
    zIndex: 30,
    shadowClass: "shadow-proc-glow-standout",
    shadowType: "Primary glow (brand-primary-700)",
    backdrop: false,
  },
  {
    tier: "L5",
    name: "Takeover",
    zIndex: 40,
    shadowClass: "shadow-proc-lg",
    shadowType: "Neutral",
    backdrop: true,
  },
  {
    tier: "L6",
    name: "System",
    zIndex: 50,
    shadowClass: "shadow-proc-glow-system",
    shadowType: "Accent glow (brand-accent-300) + sharp neutral",
    backdrop: false,
  },
] as const;

// ---------------------------------------------------------------------------
// Responsive translation data
// ---------------------------------------------------------------------------

const responsiveRules = [
  {
    desktop: "Tooltip (L2)",
    mobile: "Long-press label",
    rule: "Touch targets need 44px minimum",
  },
  {
    desktop: "Dropdown menu (L3)",
    mobile: "Bottom sheet",
    rule: "Flat list? Use bottom sheet",
  },
  {
    desktop: "Popover (L3)",
    mobile: "Bottom sheet",
    rule: "Flat list? Use bottom sheet",
  },
  {
    desktop: "Side sheet (L3)",
    mobile: "Full-page sheet",
    rule: "Nested/searchable? Full page",
  },
  {
    desktop: "Command palette (L4)",
    mobile: "Full-page sheet",
    rule: "Nested/searchable? Full page",
  },
  {
    desktop: "Modal dialog (L5)",
    mobile: "Full-page (swap instance)",
    rule: "Alert/modal? Full page",
  },
  {
    desktop: "Toast (L6)",
    mobile: "Toast (no change)",
    rule: "System-level persists",
  },
];

// ---------------------------------------------------------------------------
// 01. L0–L6 strata table
// ---------------------------------------------------------------------------

function StrataSection() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <H2>L0–L6 strata</H2>
        <Muted className="max-w-prose">
          Seven elevation tiers from ground level to system-critical overlays.
          Each tier maps to a z-index range, shadow token, and optional backdrop
          treatment.
        </Muted>
      </div>

      {/* Visual cards */}
      <div className="flex flex-wrap items-end gap-6">
        {tiers.map((t) => {
          let extraClasses = "";
          if (t.tier === "L4") extraClasses = " ring-2 ring-brand-primary-700/30";
          if (t.tier === "L6") extraClasses = " ring-2 ring-brand-accent-300/40";

          return (
            <div
              key={t.tier}
              className="flex flex-col items-center gap-3"
            >
              <div
                className={`relative flex size-[150px] flex-col items-center justify-center rounded-xl bg-card ring-1 ring-foreground/10 ${t.shadowClass}${extraClasses}`}
              >
                {t.tier === "L5" && (
                  <div className="absolute inset-0 rounded-xl bg-black/5 backdrop-blur-sm" />
                )}
                <span className="relative z-10 text-sm font-semibold text-foreground">
                  {t.tier}
                </span>
                <span className="relative z-10 mt-1 text-xs text-muted-foreground">
                  {t.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 pr-6 text-left text-xs font-medium text-muted-foreground">
                Tier
              </th>
              <th className="pb-2 pr-6 text-left text-xs font-medium text-muted-foreground">
                Name
              </th>
              <th className="pb-2 pr-6 text-left text-xs font-medium text-muted-foreground">
                Z-index
              </th>
              <th className="pb-2 pr-6 text-left text-xs font-medium text-muted-foreground">
                Shadow type
              </th>
              <th className="pb-2 pr-6 text-left text-xs font-medium text-muted-foreground">
                Backdrop/Blur
              </th>
              <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                Token
              </th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((t) => (
              <tr key={t.tier} className="border-b border-border">
                <td className="py-2 pr-6 font-medium text-foreground">
                  {t.tier}
                </td>
                <td className="py-2 pr-6 text-foreground">{t.name}</td>
                <td className="py-2 pr-6 font-mono text-xs text-muted-foreground">
                  {t.zIndex}
                </td>
                <td className="py-2 pr-6 text-muted-foreground">
                  {t.shadowType}
                </td>
                <td className="py-2 pr-6 text-muted-foreground">
                  {t.backdrop ? "Yes" : "No"}
                </td>
                <td className="py-2">
                  <Badge variant="secondary">{t.shadowClass}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 02. Responsive translation table
// ---------------------------------------------------------------------------

function ResponsiveTranslationSection() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <H3>Responsive translation</H3>
        <Muted className="max-w-prose">
          Mobile substitution rules for each desktop elevation pattern. Touch
          devices collapse layered overlays into bottom sheets or full-page
          sheets depending on content complexity.
        </Muted>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 pr-6 text-left text-xs font-medium text-muted-foreground">
                Desktop pattern
              </th>
              <th className="pb-2 pr-6 text-left text-xs font-medium text-muted-foreground">
                Mobile equivalent
              </th>
              <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                Rule
              </th>
            </tr>
          </thead>
          <tbody>
            {responsiveRules.map((r) => (
              <tr key={r.desktop} className="border-b border-border">
                <td className="py-2 pr-6 text-foreground">{r.desktop}</td>
                <td className="py-2 pr-6 text-foreground">{r.mobile}</td>
                <td className="py-2 text-muted-foreground">{r.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Muted className="max-w-prose text-xs">
        Three rules govern the translation. Linear content (flat lists, simple
        menus) collapses to a bottom sheet. Nested or searchable content
        promotes to a full-page sheet. Alerts and modals become full-page swap
        instances.
      </Muted>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Combined view
// ---------------------------------------------------------------------------

function MasterMappingView() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 p-10">
      <StrataSection />
      <ResponsiveTranslationSection />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story
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

/**
 * Complete reference for the 7-tier elevation system (L0-L6) with z-index
 * mapping, shadow tokens, backdrop rules, and responsive translation table
 * for mobile substitution patterns.
 */
export const MasterMapping: Story = {
  render: () => <MasterMappingView />,
};
