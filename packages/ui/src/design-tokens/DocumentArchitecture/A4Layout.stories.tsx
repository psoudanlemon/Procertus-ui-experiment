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
// Constants: A4 physical dimensions mapped to screen
// ---------------------------------------------------------------------------

/** A4 in mm */
const A4_W_MM = 210;
const A4_H_MM = 297;
const MARGIN_MM = 20;
/** Scale factor: 1mm = 2.5px at preview resolution */
const PX_PER_MM = 2.5;

const A4_W = A4_W_MM * PX_PER_MM; // 525px
const A4_H = A4_H_MM * PX_PER_MM; // 742.5px
const MARGIN = MARGIN_MM * PX_PER_MM; // 50px

/** Convert pt to px (1pt = 1.333px at 96dpi) */
function pt(value: number): number {
  return Math.round(value * 1.333 * 100) / 100;
}

// ---------------------------------------------------------------------------
// Logo (static SVG asset from packages/ui/public)
// ---------------------------------------------------------------------------

function LogoWordmark({ width = 90 }: { width?: number }) {
  return (
    <img src="/Procertus Logo with tagline.svg" alt="PROCERTUS" style={{ width }} />
  );
}

// ---------------------------------------------------------------------------
// Shared page components
// ---------------------------------------------------------------------------

/** Operational header for T2 documents */
function PageHeader({ pageNum, totalPages }: { pageNum: number; totalPages: number }) {
  return (
    <div
      className="flex items-start justify-between"
      style={{ marginBottom: pt(8) }}
    >
      <div className="flex flex-col" style={{ gap: pt(2) }}>
        <span
          className="font-sans font-bold uppercase"
          style={{
            fontSize: pt(8),
            letterSpacing: "0.08em",
            color: "#076293",
          }}
        >
          Audit report
        </span>
        <span className="font-sans" style={{ fontSize: pt(6), color: "#9ca3af" }}>
          ISO 27001:2022 Stage 2 Certification
        </span>
      </div>
      <div className="flex flex-col items-end">
        <LogoWordmark width={120} />
      </div>
    </div>
  );
}

/** Footer with page number and timestamp */
function PageFooter({
  pageNum,
  totalPages,
  timestamp = "2026-04-14T09:32:00Z",
}: {
  pageNum: number;
  totalPages: number;
  timestamp?: string;
}) {
  return (
    <div
      className="flex items-end justify-between"
      style={{
        borderTop: "1px solid #e5e7eb",
        paddingTop: pt(4),
      }}
    >
      <span className="font-sans" style={{ fontSize: pt(6), color: "#d1d5db" }}>
        Confidential: Acme Corporation Ltd.
      </span>
      <span className="font-mono" style={{ fontSize: pt(6), color: "#d1d5db" }}>
        {timestamp}
      </span>
      <span className="font-mono" style={{ fontSize: pt(6), color: "#9ca3af" }}>
        Page {pageNum} of {totalPages}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sample data for multi-page demonstration
// ---------------------------------------------------------------------------

type FindingRow = {
  id: string;
  clause: string;
  control: string;
  evidence: string;
  status: "Pass" | "Minor NC" | "Major NC" | "Observation";
  risk: "Low" | "Med" | "High";
};

const findings: FindingRow[] = [
  { id: "01", clause: "A.5.1", control: "Information security policies", evidence: "POL-IS-001", status: "Pass", risk: "Low" },
  { id: "02", clause: "A.5.2", control: "Review of policies", evidence: "POL-RV-002", status: "Pass", risk: "Low" },
  { id: "03", clause: "A.6.1", control: "Organization of information security", evidence: "ORG-IS-003", status: "Pass", risk: "Low" },
  { id: "04", clause: "A.7.1", control: "Prior to employment", evidence: "HR-PE-004", status: "Pass", risk: "Low" },
  { id: "05", clause: "A.7.2", control: "During employment", evidence: "HR-DE-005", status: "Observation", risk: "Low" },
  { id: "06", clause: "A.8.1", control: "Asset management", evidence: "REG-AM-006", status: "Pass", risk: "Low" },
  { id: "07", clause: "A.8.2", control: "Information classification", evidence: "REG-IC-007", status: "Minor NC", risk: "Med" },
  { id: "08", clause: "A.9.1", control: "Access control policy", evidence: "POL-AC-008", status: "Pass", risk: "Low" },
  { id: "09", clause: "A.9.2", control: "User access management", evidence: "UAM-MG-009", status: "Pass", risk: "Low" },
  { id: "10", clause: "A.9.4", control: "System access control", evidence: "SAC-CT-010", status: "Minor NC", risk: "Med" },
  { id: "11", clause: "A.10.1", control: "Cryptographic controls", evidence: "CRY-CT-011", status: "Pass", risk: "Low" },
  { id: "12", clause: "A.11.1", control: "Secure areas", evidence: "PHY-SA-012", status: "Pass", risk: "Low" },
  { id: "13", clause: "A.11.2", control: "Equipment security", evidence: "PHY-EQ-013", status: "Pass", risk: "Low" },
  { id: "14", clause: "A.12.1", control: "Operational procedures", evidence: "OPS-PR-014", status: "Pass", risk: "Low" },
  { id: "15", clause: "A.12.4", control: "Logging and monitoring", evidence: "LOG-MN-015", status: "Major NC", risk: "High" },
  { id: "16", clause: "A.12.6", control: "Technical vulnerability mgmt", evidence: "VUL-MG-016", status: "Minor NC", risk: "Med" },
  { id: "17", clause: "A.13.1", control: "Network security", evidence: "NET-SC-017", status: "Pass", risk: "Low" },
  { id: "18", clause: "A.14.1", control: "Secure development", evidence: "DEV-SD-018", status: "Pass", risk: "Low" },
  { id: "19", clause: "A.14.2", control: "Development testing", evidence: "DEV-TS-019", status: "Observation", risk: "Low" },
  { id: "20", clause: "A.16.1", control: "Incident management", evidence: "INC-MG-020", status: "Pass", risk: "Low" },
  { id: "21", clause: "A.17.1", control: "Business continuity", evidence: "BCP-CT-021", status: "Pass", risk: "Low" },
  { id: "22", clause: "A.18.1", control: "Legal compliance", evidence: "LEG-CO-022", status: "Pass", risk: "Low" },
  { id: "23", clause: "A.18.2", control: "Security reviews", evidence: "SEC-RV-023", status: "Observation", risk: "Low" },
];

const ROWS_PER_PAGE_1 = 12;

const statusColors: Record<FindingRow["status"], string> = {
  Pass: "#16a34a",
  "Minor NC": "#d97706",
  "Major NC": "#dc2626",
  Observation: "#6b7280",
};

// ---------------------------------------------------------------------------
// Dimension reference data
// ---------------------------------------------------------------------------

type SpecRow = {
  element: string;
  value: string;
  note: string;
};

const specs: SpecRow[] = [
  { element: "Page size", value: "210 x 297mm", note: "ISO 216 A4" },
  { element: "Safe zone", value: "20mm", note: "All four edges" },
  { element: "Content area", value: `${A4_W_MM - MARGIN_MM * 2} x ${A4_H_MM - MARGIN_MM * 2}mm`, note: "Page minus margins" },
  { element: "Section heading", value: "8pt Bold", note: "Report section titles" },
  { element: "Body text", value: "11pt Regular", note: "Minimum for readability" },
  { element: "Metadata value", value: "8pt Medium", note: "Header field values" },
  { element: "Table data", value: "7pt Regular", note: "Dense data rows" },
  { element: "Table header", value: "5.5pt Bold", note: "Column labels, uppercase" },
  { element: "Metadata label", value: "5pt Bold", note: "Field labels, uppercase" },
  { element: "Footer", value: "6pt Regular", note: "Page numbers, timestamps" },
];

// ---------------------------------------------------------------------------
// A4 page shell
// ---------------------------------------------------------------------------

function A4Page({
  children,
  showMargins = false,
  label,
}: {
  children: React.ReactNode;
  showMargins?: boolean;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
          {label}
        </span>
      )}
      <div
        className="relative overflow-hidden border border-border bg-white shadow-sm"
        style={{ width: A4_W, height: A4_H }}
      >
        {/* Margin safe-zone overlay */}
        {showMargins && (
          <div
            className="pointer-events-none absolute z-10"
            style={{ inset: 0 }}
          >
            {/* Top margin */}
            <div
              className="absolute left-0 right-0 top-0"
              style={{
                height: MARGIN,
                background: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(236,72,153,0.06) 4px, rgba(236,72,153,0.06) 5px)",
              }}
            />
            {/* Bottom margin */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: MARGIN,
                background: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(236,72,153,0.06) 4px, rgba(236,72,153,0.06) 5px)",
              }}
            />
            {/* Left margin */}
            <div
              className="absolute bottom-0 left-0 top-0"
              style={{
                width: MARGIN,
                background: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(236,72,153,0.06) 4px, rgba(236,72,153,0.06) 5px)",
              }}
            />
            {/* Right margin */}
            <div
              className="absolute bottom-0 right-0 top-0"
              style={{
                width: MARGIN,
                background: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(236,72,153,0.06) 4px, rgba(236,72,153,0.06) 5px)",
              }}
            />
            {/* Inner boundary line */}
            <div
              className="absolute border border-dashed"
              style={{
                inset: MARGIN,
                borderColor: "rgba(236,72,153,0.35)",
              }}
            />
            {/* Dimension labels */}
            <span
              className="absolute font-mono"
              style={{
                fontSize: 9,
                color: "rgba(236,72,153,0.5)",
                top: MARGIN / 2 - 5,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              20mm
            </span>
            <span
              className="absolute font-mono"
              style={{
                fontSize: 9,
                color: "rgba(236,72,153,0.5)",
                left: MARGIN / 2 - 8,
                top: "50%",
                transform: "translateY(-50%) rotate(-90deg)",
              }}
            >
              20mm
            </span>
          </div>
        )}

        {/* Page content */}
        <div
          className="relative z-20 flex h-full flex-col"
          style={{ padding: MARGIN }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data table row
// ---------------------------------------------------------------------------

function FindingTableRow({ row }: { row: FindingRow }) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: "0.5fr 1fr 3fr 1.5fr 1.2fr 0.8fr",
        padding: `${pt(2.5)}px 0`,
        borderBottom: "1px solid #f3f4f6",
        fontSize: pt(7),
        color: "#374151",
      }}
    >
      <span style={{ color: "#9ca3af" }}>{row.id}</span>
      <span className="font-mono">{row.clause}</span>
      <span>{row.control}</span>
      <span className="font-mono" style={{ color: "#6b7280", fontSize: pt(6) }}>
        {row.evidence}
      </span>
      <span style={{ color: statusColors[row.status], fontWeight: 600 }}>
        {row.status}
      </span>
      <span style={{ color: row.risk === "High" ? "#dc2626" : row.risk === "Med" ? "#d97706" : "#6b7280" }}>
        {row.risk}
      </span>
    </div>
  );
}

function FindingTableHeader() {
  return (
    <div
      className="grid font-bold uppercase"
      style={{
        gridTemplateColumns: "0.5fr 1fr 3fr 1.5fr 1.2fr 0.8fr",
        padding: `${pt(3)}px 0`,
        borderBottom: "2px solid #e5e7eb",
        fontSize: pt(5.5),
        letterSpacing: "0.06em",
        color: "#6b7280",
      }}
    >
      <span>#</span>
      <span>Clause</span>
      <span>Control objective</span>
      <span>Evidence ref.</span>
      <span>Status</span>
      <span>Risk</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Physical constraints of the A4 page: 20mm safe zone and point-based
 * typography mapped to a 2.5px/mm screen preview.
 */
export const A4Layout: Story = {
  name: "A4 layout",
  render: () => {
    const page1Rows = findings.slice(0, ROWS_PER_PAGE_1);
    const page2Rows = findings.slice(ROWS_PER_PAGE_1);
    const totalPages = 2;

    return (
      <div className="flex w-[1140px] max-w-full flex-col gap-8 p-8">
        <div className="flex flex-col gap-2 mb-2">
          <H2>A4 layout</H2>
          <Muted>Physical A4 constraints at 2.5px/mm. The hatched boundary shows the mandatory 20mm safe zone.</Muted>
        </div>

        {/* Spec reference */}
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Element</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Value</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Notes</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((row, i) => (
                <tr key={row.element} className={i < specs.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-4 py-2.5 font-medium text-foreground">{row.element}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.value}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Page simulations */}
        <div className="flex gap-10">
          {/* Page 1 */}
          <A4Page showMargins label="Page 1 of 2">
            <PageHeader pageNum={1} totalPages={totalPages} />
            <div className="h-px w-full" style={{ background: "#e5e7eb", marginBottom: pt(6) }} />

            {/* Report metadata */}
            <div className="grid grid-cols-3" style={{ gap: pt(6), marginBottom: pt(10) }}>
              {[
                { label: "Client", value: "Acme Corporation Ltd." },
                { label: "Standard", value: "ISO/IEC 27001:2022" },
                { label: "Audit date", value: "14 April 2026" },
                { label: "Scope", value: "Cloud infrastructure" },
                { label: "Lead auditor", value: "J. Martinez (LA-27001)" },
                { label: "Report ref.", value: "RPT-2026-00417-S2" },
              ].map((m) => (
                <div key={m.label} className="flex flex-col" style={{ gap: pt(1) }}>
                  <span
                    className="font-sans font-bold uppercase"
                    style={{
                      fontSize: pt(5),
                      letterSpacing: "0.1em",
                      color: "#9ca3af",
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    className="font-sans"
                    style={{ fontSize: pt(8), color: "#1a1a1a" }}
                  >
                    {m.value}
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
                color: "#076293",
                marginBottom: pt(4),
                display: "block",
              }}
            >
              Detailed findings
            </span>

            {/* Data table */}
            <div className="flex-1">
              <FindingTableHeader />
              {page1Rows.map((row) => (
                <FindingTableRow key={row.id} row={row} />
              ))}
            </div>

            {/* Continuation indicator */}
            <div
              className="flex items-center justify-center"
              style={{ padding: `${pt(4)}px 0`, marginBottom: pt(4) }}
            >
              <span
                className="font-mono italic"
                style={{ fontSize: pt(6), color: "#9ca3af" }}
              >
                Continued on next page...
              </span>
            </div>

            <PageFooter pageNum={1} totalPages={totalPages} />
          </A4Page>

          {/* Page 2 */}
          <A4Page showMargins label="Page 2 of 2">
            <PageHeader pageNum={2} totalPages={totalPages} />
            <div className="h-px w-full" style={{ background: "#e5e7eb", marginBottom: pt(6) }} />

            {/* Section title (continued) */}
            <span
              className="font-sans font-bold uppercase"
              style={{
                fontSize: pt(6),
                letterSpacing: "0.08em",
                color: "#076293",
                marginBottom: pt(4),
                display: "block",
              }}
            >
              Detailed findings (continued)
            </span>

            {/* Data table continuation */}
            <div className="flex-1">
              <FindingTableHeader />
              {page2Rows.map((row) => (
                <FindingTableRow key={row.id} row={row} />
              ))}
            </div>

            {/* Summary block */}
            <div
              style={{
                marginTop: pt(12),
                padding: pt(8),
                border: "1px solid #e5e7eb",
                borderRadius: 4,
              }}
            >
              <span
                className="font-sans font-bold uppercase"
                style={{
                  fontSize: pt(5.5),
                  letterSpacing: "0.08em",
                  color: "#076293",
                  display: "block",
                  marginBottom: pt(4),
                }}
              >
                Summary
              </span>
              <div className="grid grid-cols-4" style={{ gap: pt(6) }}>
                {[
                  { label: "Total controls", value: "23", color: "#1a1a1a" },
                  { label: "Pass", value: "17", color: "#16a34a" },
                  { label: "Minor NC", value: "3", color: "#d97706" },
                  { label: "Major NC", value: "1", color: "#dc2626" },
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
                        color: "#9ca3af",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: pt(8) }} />
            <PageFooter pageNum={2} totalPages={totalPages} />
          </A4Page>
        </div>

        {/* Implementation note */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <p className="m-0 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">For developers:</strong> The
            preview renders at 2.5px/mm. Text uses
            a <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">pt()</code> helper
            (1pt = 1.333px at 96dpi). In the PDF renderer, use native point units
            directly. The 20mm safe zone is enforced at the renderer level and
            cannot be overridden by template authors.
          </p>
        </div>
      </div>
    );
  },
};
