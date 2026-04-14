import type { Meta, StoryObj } from "@storybook/react-vite";
import { H2 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Applied Guidelines/Document architecture",
  tags: ["!autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Physical constants
// ---------------------------------------------------------------------------

const A4_W_MM = 210;
const A4_H_MM = 297;
const MARGIN_MM = 20;

const PX_PER_MM = 2.5;

const A4_W = A4_W_MM * PX_PER_MM;
const A4_H = A4_H_MM * PX_PER_MM;
const MARGIN = MARGIN_MM * PX_PER_MM;

function pt(value: number): number {
  return Math.round(value * 1.333 * 100) / 100;
}

// ---------------------------------------------------------------------------
// Brand colors (B&W only for T3)
// ---------------------------------------------------------------------------

const BRAND = {
  ink: "#1a1a1a",
  gray700: "#374151",
  gray500: "#6b7280",
  gray400: "#9ca3af",
  gray300: "#d1d5db",
  gray200: "#e5e7eb",
  gray100: "#f3f4f6",
} as const;

// ---------------------------------------------------------------------------
// Logo (B&W variant)
// ---------------------------------------------------------------------------

function LogoWordmark({ width = 80 }: { width?: number }) {
  return (
    <img
      src="/Procertus logo.svg"
      alt="PROCERTUS"
      style={{ width, filter: "grayscale(1) brightness(0)" }}
    />
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const personnel = [
  { name: "J. Martinez", role: "Lead Auditor", cert: "LA-27001", expiry: "2027-06" },
  { name: "S. Chen", role: "Technical Expert", cert: "TE-27001", expiry: "2026-11" },
  { name: "A. Okonkwo", role: "Auditor", cert: "AU-27001", expiry: "2027-03" },
  { name: "M. Petersen", role: "Lead Auditor", cert: "LA-14001", expiry: "2027-01" },
  { name: "R. Nakamura", role: "Technical Expert", cert: "TE-45001", expiry: "2026-09" },
  { name: "L. Bergstr\u00f6m", role: "Auditor", cert: "AU-27001", expiry: "2028-02" },
  { name: "K. Osei", role: "Lead Auditor", cert: "LA-27001", expiry: "2026-12" },
  { name: "D. Ivanova", role: "Auditor", cert: "AU-14001", expiry: "2027-08" },
  { name: "F. Al-Rashid", role: "Technical Expert", cert: "TE-27001", expiry: "2027-04" },
  { name: "T. Johansson", role: "Auditor", cert: "AU-45001", expiry: "2026-10" },
  { name: "C. Dubois", role: "Lead Auditor", cert: "LA-27001", expiry: "2027-09" },
  { name: "H. Kim", role: "Auditor", cert: "AU-27001", expiry: "2026-08" },
  { name: "B. Novak", role: "Technical Expert", cert: "TE-14001", expiry: "2027-11" },
  { name: "E. Santos", role: "Auditor", cert: "AU-45001", expiry: "2028-01" },
  { name: "W. Müller", role: "Lead Auditor", cert: "LA-14001", expiry: "2027-05" },
];

// ---------------------------------------------------------------------------
// A4 page shell
// ---------------------------------------------------------------------------

function A4Page({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden border border-border bg-white shadow-sm"
      style={{ width: A4_W, height: A4_H }}
    >
      <div
        className="relative z-20 flex h-full flex-col"
        style={{ padding: MARGIN }}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

/**
 * Tier 3 (Utility) document: the internal export. Black-and-white only,
 * no background elements, no solid fills. Optimized for ink efficiency
 * and high-speed bulk reproduction.
 */
export const T3Utility: Story = {
  name: "T3 Utility",
  render: () => (
    <div className="flex w-[660px] max-w-full flex-col gap-8 p-8">
      <div className="flex flex-col gap-2 mb-2">
        <H2>T3 Utility: the internal export</H2>
        <Muted>Minimal document class. Black and white only, no fills, no backgrounds. Ink-efficient bulk printing.</Muted>
      </div>

      <A4Page>
        {/* Header: minimalist B&W logotype */}
        <div className="flex items-center justify-between">
          <LogoWordmark width={80} />
          <span
            className="font-mono"
            style={{ fontSize: pt(5), color: BRAND.gray400 }}
          >
            Export: 2026-04-14T09:32:00Z
          </span>
        </div>

        <div style={{ height: 1, background: BRAND.gray200, marginTop: pt(6), marginBottom: pt(8) }} />

        {/* Title */}
        <span
          className="font-sans font-bold uppercase"
          style={{
            fontSize: pt(7),
            letterSpacing: "0.08em",
            color: BRAND.ink,
            display: "block",
            marginBottom: pt(6),
          }}
        >
          Personnel competency register
        </span>

        {/* Table header */}
        <div
          className="grid font-bold uppercase"
          style={{
            gridTemplateColumns: "2.5fr 2fr 1.5fr 1fr",
            padding: `${pt(3)}px 0`,
            borderBottom: `2px solid ${BRAND.gray200}`,
            fontSize: pt(5.5),
            letterSpacing: "0.06em",
            color: BRAND.gray500,
          }}
        >
          <span>Name</span>
          <span>Role</span>
          <span>Certification</span>
          <span>Expiry</span>
        </div>

        {/* Table rows: no fills, no backgrounds, text + rules only */}
        <div className="flex-1">
          {personnel.map((row, i) => (
            <div
              key={row.name}
              className="grid"
              style={{
                gridTemplateColumns: "2.5fr 2fr 1.5fr 1fr",
                padding: `${pt(3)}px 0`,
                borderBottom: i < personnel.length - 1 ? `1px solid ${BRAND.gray100}` : "none",
                fontSize: pt(7),
                color: BRAND.gray700,
              }}
            >
              <span className="font-medium" style={{ color: BRAND.ink }}>{row.name}</span>
              <span style={{ color: BRAND.gray500 }}>{row.role}</span>
              <span className="font-mono" style={{ color: BRAND.gray500, fontSize: pt(6) }}>
                {row.cert}
              </span>
              <span className="font-mono" style={{ color: BRAND.gray400, fontSize: pt(6) }}>
                {row.expiry}
              </span>
            </div>
          ))}
        </div>

        {/* Footer: minimal */}
        <div
          className="flex items-end justify-between"
          style={{
            borderTop: `1px solid ${BRAND.gray200}`,
            paddingTop: pt(4),
          }}
        >
          <span className="font-sans" style={{ fontSize: pt(5.5), color: BRAND.gray300 }}>
            Internal use only
          </span>
          <span className="font-mono" style={{ fontSize: pt(5.5), color: BRAND.gray400 }}>
            Page 1 of 1
          </span>
        </div>
      </A4Page>
    </div>
  ),
};
