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

function mm(value: number): number {
  return value * PX_PER_MM;
}

function pt(value: number): number {
  return Math.round(value * 1.333 * 100) / 100;
}

// ---------------------------------------------------------------------------
// Brand colors
// ---------------------------------------------------------------------------

const BRAND = {
  navy: "#076293",
  ink: "#1a1a1a",
  gray700: "#374151",
  gray500: "#6b7280",
  gray400: "#9ca3af",
  gray300: "#d1d5db",
  gray200: "#e5e7eb",
  gray100: "#f3f4f6",
  pass: "#16a34a",
  minorNC: "#d97706",
  majorNC: "#dc2626",
  observation: "#6b7280",
} as const;

// ---------------------------------------------------------------------------
// Logo
// ---------------------------------------------------------------------------

function LogoWordmark({ width = 120 }: { width?: number }) {
  return (
    <img
      src="/Procertus Logo with tagline.svg"
      alt="PROCERTUS"
      style={{ width }}
    />
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type FindingRow = {
  id: string;
  clause: string;
  control: string;
  evidence: string;
  status: "Pass" | "Minor NC" | "Major NC" | "Observation";
  risk: "Low" | "Med" | "High";
};

const statusColor: Record<FindingRow["status"], string> = {
  Pass: BRAND.pass,
  "Minor NC": BRAND.minorNC,
  "Major NC": BRAND.majorNC,
  Observation: BRAND.observation,
};

const findings: FindingRow[] = [
  { id: "01", clause: "A.5.1", control: "Information security policies", evidence: "POL-IS-001", status: "Pass", risk: "Low" },
  { id: "02", clause: "A.5.2", control: "Review of policies", evidence: "POL-RV-002", status: "Pass", risk: "Low" },
  { id: "03", clause: "A.6.1", control: "Organization of info security", evidence: "ORG-IS-003", status: "Pass", risk: "Low" },
  { id: "04", clause: "A.7.1", control: "Prior to employment", evidence: "HR-PE-004", status: "Pass", risk: "Low" },
  { id: "05", clause: "A.7.2", control: "During employment", evidence: "HR-DE-005", status: "Observation", risk: "Low" },
  { id: "06", clause: "A.8.1", control: "Asset management", evidence: "REG-AM-006", status: "Pass", risk: "Low" },
  { id: "07", clause: "A.8.2", control: "Information classification", evidence: "REG-IC-007", status: "Minor NC", risk: "Med" },
  { id: "08", clause: "A.9.1", control: "Access control policy", evidence: "POL-AC-008", status: "Pass", risk: "Low" },
  { id: "09", clause: "A.9.2", control: "User access management", evidence: "UAM-MG-009", status: "Pass", risk: "Low" },
  { id: "10", clause: "A.9.4", control: "System access control", evidence: "SAC-CT-010", status: "Minor NC", risk: "Med" },
  { id: "11", clause: "A.10.1", control: "Cryptographic controls", evidence: "CRY-CT-011", status: "Pass", risk: "Low" },
  { id: "12", clause: "A.12.4", control: "Logging and monitoring", evidence: "LOG-MN-015", status: "Major NC", risk: "High" },
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
 * Tier 2 (Operational) document: the audit report. High-density layout
 * with logotype anchored top-right, metadata strip, data table with
 * status indicators, and summary statistics.
 */
export const T2Operational: Story = {
  name: "T2 Operational",
  render: () => (
    <div className="flex w-[660px] max-w-full flex-col gap-8 p-8">
      <div className="flex flex-col gap-2 mb-2">
        <H2>T2 Operational: the audit report</H2>
        <Muted>High-density compliance artifacts. Data tables, status indicators, and structured metadata.</Muted>
      </div>

      <A4Page>
        {/* Header: document type left, logotype right */}
        <div
          className="flex items-start justify-between"
          style={{ marginBottom: mm(3) }}
        >
          <div className="flex flex-col" style={{ gap: pt(2) }}>
            <span
              className="font-sans font-bold uppercase"
              style={{
                fontSize: pt(8),
                letterSpacing: "0.08em",
                color: BRAND.navy,
              }}
            >
              Audit report
            </span>
            <span
              className="font-sans"
              style={{ fontSize: pt(6), color: BRAND.gray400 }}
            >
              ISO 27001:2022 Stage 2 Certification
            </span>
          </div>
          <LogoWordmark width={120} />
        </div>

        <div style={{ height: 1, background: BRAND.gray200, marginBottom: mm(3) }} />

        {/* Metadata strip */}
        <div
          className="grid grid-cols-3"
          style={{ gap: `${mm(2)}px ${mm(4)}px`, marginBottom: mm(4) }}
        >
          {[
            { label: "Client", value: "Acme Corporation Ltd." },
            { label: "Standard", value: "ISO/IEC 27001:2022" },
            { label: "Audit date", value: "14 April 2026" },
            { label: "Scope", value: "Cloud infrastructure" },
            { label: "Lead auditor", value: "J. Martinez (LA-27001)" },
            { label: "Report ref.", value: "RPT-2026-00417-S2" },
          ].map((f) => (
            <div key={f.label} className="flex flex-col" style={{ gap: pt(1) }}>
              <span
                className="font-sans font-bold uppercase"
                style={{
                  fontSize: pt(5),
                  letterSpacing: "0.1em",
                  color: BRAND.gray400,
                }}
              >
                {f.label}
              </span>
              <span
                className="font-sans"
                style={{ fontSize: pt(8), color: BRAND.ink }}
              >
                {f.value}
              </span>
            </div>
          ))}
        </div>

        {/* Section title */}
        <span
          className="font-sans font-bold uppercase"
          style={{
            fontSize: pt(6),
            letterSpacing: "0.08em",
            color: BRAND.navy,
            marginBottom: pt(4),
            display: "block",
          }}
        >
          Detailed findings
        </span>

        {/* Table header */}
        <div
          className="grid font-bold uppercase"
          style={{
            gridTemplateColumns: "0.5fr 1fr 3fr 1.5fr 1.2fr 0.8fr",
            padding: `${pt(3)}px 0`,
            borderBottom: `2px solid ${BRAND.gray200}`,
            fontSize: pt(5.5),
            letterSpacing: "0.06em",
            color: BRAND.gray500,
          }}
        >
          <span>#</span>
          <span>Clause</span>
          <span>Control objective</span>
          <span>Evidence ref.</span>
          <span>Status</span>
          <span>Risk</span>
        </div>

        {/* Table rows */}
        <div className="flex-1">
          {findings.map((row) => (
            <div
              key={row.id}
              className="grid"
              style={{
                gridTemplateColumns: "0.5fr 1fr 3fr 1.5fr 1.2fr 0.8fr",
                padding: `${pt(2.5)}px 0`,
                borderBottom: `1px solid ${BRAND.gray100}`,
                fontSize: pt(7),
                color: BRAND.gray700,
              }}
            >
              <span style={{ color: BRAND.gray400 }}>{row.id}</span>
              <span className="font-mono">{row.clause}</span>
              <span>{row.control}</span>
              <span className="font-mono" style={{ color: BRAND.gray500, fontSize: pt(6) }}>
                {row.evidence}
              </span>
              <span style={{ color: statusColor[row.status], fontWeight: 600 }}>
                {row.status}
              </span>
              <span style={{ color: row.risk === "High" ? BRAND.majorNC : row.risk === "Med" ? BRAND.minorNC : BRAND.gray500 }}>
                {row.risk}
              </span>
            </div>
          ))}
        </div>

        {/* Summary block */}
        <div
          style={{
            padding: mm(3),
            border: `1px solid ${BRAND.gray200}`,
            borderRadius: 4,
            marginTop: mm(3),
          }}
        >
          <span
            className="font-sans font-bold uppercase"
            style={{
              fontSize: pt(5.5),
              letterSpacing: "0.08em",
              color: BRAND.navy,
              display: "block",
              marginBottom: mm(2),
            }}
          >
            Summary
          </span>
          <div className="grid grid-cols-5" style={{ gap: mm(2) }}>
            {[
              { label: "Total", value: "12", color: BRAND.ink },
              { label: "Pass", value: "8", color: BRAND.pass },
              { label: "Minor NC", value: "2", color: BRAND.minorNC },
              { label: "Major NC", value: "1", color: BRAND.majorNC },
              { label: "Observation", value: "1", color: BRAND.observation },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span
                  className="font-sans font-bold"
                  style={{ fontSize: pt(14), color: s.color }}
                >
                  {s.value}
                </span>
                <span
                  className="font-sans uppercase"
                  style={{
                    fontSize: pt(5),
                    letterSpacing: "0.08em",
                    color: BRAND.gray400,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-end justify-between"
          style={{
            borderTop: `1px solid ${BRAND.gray200}`,
            paddingTop: pt(4),
            marginTop: mm(3),
          }}
        >
          <span className="font-sans" style={{ fontSize: pt(5.5), color: BRAND.gray300 }}>
            Confidential: Acme Corporation Ltd.
          </span>
          <span className="font-mono" style={{ fontSize: pt(5.5), color: BRAND.gray300 }}>
            2026-04-14T09:32:00Z
          </span>
          <span className="font-mono" style={{ fontSize: pt(5.5), color: BRAND.gray400 }}>
            Page 1 of 12
          </span>
        </div>
      </A4Page>
    </div>
  ),
};
