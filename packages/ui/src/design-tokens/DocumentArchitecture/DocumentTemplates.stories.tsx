import type { Meta, StoryObj } from "@storybook/react-vite";

import { H2 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "design tokens/Document architecture",
  tags: ["!autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * The three tiers of authority that govern all physical and digital document
 * output from the Procertus certification platform.
 */
export const DocumentTemplates: Story = {
  name: "Document tiers",
  render: () => (
    <div className="flex w-[960px] max-w-full flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <H2>Document tiers</H2>
        <Muted className="max-w-prose">
          Every document produced by the platform maps to one of three tiers.
          The tier determines logotype treatment, color allowance, grid density,
          and typographic hierarchy.
        </Muted>
      </div>

      {/* Tier comparison table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Property</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">T1 Formal</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">T2 Operational</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">T3 Utility</th>
            </tr>
          </thead>
          <tbody>
            {[
              { property: "Logotype", t1: "Centered, 55mm", t2: "Top-right + tagline", t3: "Top-left, B&W" },
              { property: "Color mode", t1: "Full brand", t2: "Full brand", t3: "Black + white" },
              { property: "Background", t1: "Brand watermark", t2: "None", t3: "None" },
              { property: "Grid", t1: "Centered single", t2: "6-column", t3: "Single-column" },
              { property: "Solid fills", t1: "Permitted", t2: "Permitted", t3: "Prohibited" },
              { property: "Margins", t1: "20mm safe zone", t2: "20mm safe zone", t3: "20mm safe zone" },
            ].map((row, i, arr) => (
              <tr key={row.property} className={i < arr.length - 1 ? "border-b border-border" : ""}>
                <td className="px-4 py-3 font-bold text-foreground">{row.property}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.t1}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.t2}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.t3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Implementation note */}
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <p className="m-0 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">For developers:</strong> Document
          generation uses these tiers as configuration presets. Each tier maps to
          a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">DocumentTierConfig</code> that
          controls header layout, color mode, grid columns, and background
          treatment. The 20mm safe zone is enforced at the PDF renderer level
          and cannot be overridden by template authors.
        </p>
      </div>
    </div>
  ),
};
