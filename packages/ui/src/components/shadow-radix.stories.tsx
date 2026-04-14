import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/components/ui/badge";
import { H2, H3 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "design tokens/Shadow",
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Neutral shadow token data
// ---------------------------------------------------------------------------

const neutralTokens = [
  {
    name: "Tactile",
    token: "shadow-proc-tactile",
    css: "--shadow-proc-tactile",
    elevation: "Interactive",
    spec: "0 1px 0 rgb(0 0 0 / 0.05), 0 1px 3px rgb(0 0 0 / 0.08)",
    usage: "Pressed/active states, subtle depth cue for interactive elements",
  },
  {
    name: "Extra small",
    token: "shadow-proc-xs",
    css: "--shadow-proc-xs",
    elevation: "L1 Standout",
    spec: "0 1px 2px rgb(0 0 0 / 0.06)",
    usage: "Raised cards, promoted elements",
  },
  {
    name: "Small",
    token: "shadow-proc-sm",
    css: "--shadow-proc-sm",
    elevation: "L2 Whisper",
    spec: "0 2px 8px rgb(0 0 0 / 0.08)",
    usage: "Tooltips, hover cards",
  },
  {
    name: "Medium",
    token: "shadow-proc-md",
    css: "--shadow-proc-md",
    elevation: "L3 Overlay",
    spec: "0 8px 24px rgb(0 0 0 / 0.12)",
    usage: "Dropdowns, popovers, sheets, selects",
  },
  {
    name: "Large",
    token: "shadow-proc-lg",
    css: "--shadow-proc-lg",
    elevation: "L4-L5 Takeover / System",
    spec: "0 16px 48px rgb(0 0 0 / 0.16)",
    usage: "Modal dialogs, command palette, toasts",
  },
] as const;

// ---------------------------------------------------------------------------
// Story 01: Status (neutral token mapping)
// ---------------------------------------------------------------------------

function StatusView() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 p-10">
      <div className="flex flex-col gap-2">
        <H2>Neutral shadow tokens</H2>
        <Muted className="max-w-prose">
          Five neutral shadows form the depth budget for the entire system.
          Shadows use only black at varying opacities, never color, so elevation
          stays consistent and avoids feeling decorative. Each token maps to one
          or more elevation tiers.
        </Muted>
      </div>

      {/* Visual progression */}
      <div className="flex flex-col gap-6">
        <H3>Shadow progression</H3>
        <div className="flex flex-wrap items-end justify-center gap-10 py-8">
          {neutralTokens.map((t) => (
            <div key={t.token} className="flex flex-col items-center gap-4">
              <div
                className="flex size-28 items-center justify-center rounded-xl bg-card ring-1 ring-foreground/[0.04]"
                style={{
                  boxShadow: `var(${t.css})`,
                }}
              />
              <Badge variant="secondary" className="text-[10px]">
                {t.token}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Mapping table */}
      <div className="flex flex-col gap-6">
        <H3>Token reference</H3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 pr-6 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Token
                </th>
                <th className="pb-3 pr-6 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Usage
                </th>
                <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Preview
                </th>
              </tr>
            </thead>
            <tbody>
              {neutralTokens.map((t) => (
                <tr key={t.token} className="border-b border-border">
                  <td className="py-4 pr-6">
                    <code className="text-xs text-muted-foreground">
                      {t.token}
                    </code>
                  </td>
                  <td className="py-4 pr-6 text-muted-foreground">{t.usage}</td>
                  <td className="overflow-visible py-4">
                    <div className="p-4">
                      <div
                        className="size-8 rounded-md bg-card ring-1 ring-foreground/[0.04]"
                        style={{ boxShadow: `var(${t.css})` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Constraint callout */}
      <div className="rounded-lg border border-border bg-muted/30 p-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Constraint: </span>
          Shadows are a finite resource. Five neutral values, zero colored
          shadows in the neutral set. Dark mode overrides use tinted oklch
          values instead of pure black to blend naturally with dark surfaces.
        </p>
      </div>
    </div>
  );
}

/**
 * Reference table mapping all five neutral shadow tokens to their elevation
 * tiers, CSS values, and intended usage. Neutral shadows are always static
 * and never colored.
 */
export const NeutralShadows: Story = {
  render: () => <StatusView />,
};

// ---------------------------------------------------------------------------
// Story 02: Standout gradient shadow (animated)
// ---------------------------------------------------------------------------

function StandoutGradientView() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 p-10">

      <div className="flex flex-col gap-2">
        <H2>Standout gradient shadow</H2>
        <Muted className="max-w-prose">
          The one exception to neutral-only shadows. A soft gradient glow that
          rotates continuously, drawing attention to promoted elements without
          resorting to gradient backgrounds. Use sparingly: a KPI card, a search
          bar, a call-to-action. One standout per viewport at most.
        </Muted>
      </div>

      {/* Anatomy */}
      <div className="flex flex-col gap-6">
        <H3>Anatomy</H3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 pr-6 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Property
                </th>
                <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 font-medium text-foreground">
                  Gradient colors
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-4 rounded-full"
                        style={{
                          background: "oklch(0.803 0.073 173)",
                        }}
                      />
                      <code className="text-xs text-muted-foreground">
                        accent-300
                      </code>
                    </div>
                    <span className="text-muted-foreground/40">to</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="size-4 rounded-full"
                        style={{
                          background: "oklch(0.477 0.102 227)",
                        }}
                      />
                      <code className="text-xs text-muted-foreground">
                        primary-700
                      </code>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 font-medium text-foreground">
                  Gradient type
                </td>
                <td className="py-3 text-muted-foreground">
                  <code className="text-xs">conic-gradient</code>, rotating via
                  CSS custom property
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 font-medium text-foreground">
                  Animation
                </td>
                <td className="py-3 text-muted-foreground">
                  360° rotation, 6s linear infinite
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 font-medium text-foreground">
                  Blur layers
                </td>
                <td className="py-3 text-muted-foreground">
                  Two pseudo-elements (<code className="text-xs">::before</code>,{" "}
                  <code className="text-xs">::after</code>): primary at 12px blur
                  (50% opacity), secondary at 16px blur (20% opacity,
                  counter-rotating)
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 font-medium text-foreground">
                  Motion behavior
                </td>
                <td className="py-3 text-muted-foreground">
                  Continuous rotation. Respects{" "}
                  <code className="text-xs">prefers-reduced-motion</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Live demo */}
      <div className="flex flex-col gap-6">
        <H3>Live preview</H3>
        <div className="flex items-center justify-center py-16">
          <div className="glow-standout rounded-2xl">
            <div className="relative flex h-48 w-80 flex-col items-center justify-center gap-3 rounded-2xl bg-card ring-1 ring-foreground/10">
              <span className="text-3xl font-semibold text-foreground">
                94.2%
              </span>
              <span className="text-sm text-muted-foreground">
                Certification pass rate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage guidelines */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            When to use
          </p>
          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <li>KPI cards that need attention on a dense dashboard</li>
            <li>Search bar in the header to signal primary interaction</li>
            <li>Call-to-action card during onboarding flows</li>
            <li>Featured item in a list or grid</li>
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Constraints
          </p>
          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <li>One standout per viewport, never two competing</li>
            <li>Always paired with a neutral background, never a gradient</li>
            <li>Must gracefully degrade when motion is reduced</li>
            <li>Reserved for L1 Standout tier only</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Animated gradient shadow using a conic gradient that rotates from
 * accent-300 to primary-700. Reserved for the Standout elevation tier
 * to draw attention to a single promoted element per viewport.
 */
export const BrandedGlow: Story = {
  render: () => <StandoutGradientView />,
};
