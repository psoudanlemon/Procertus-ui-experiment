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
  gray500: "#6b7280",
  gray400: "#9ca3af",
  gray300: "#d1d5db",
  gray200: "#e5e7eb",
} as const;

// ---------------------------------------------------------------------------
// Logo assets
// ---------------------------------------------------------------------------

function LogoWordmark({ width = 150 }: { width?: number }) {
  return (
    <img
      src="/Procertus Logo with tagline.svg"
      alt="PROCERTUS"
      style={{ width }}
    />
  );
}

function BrandWatermark({ width = 300 }: { width?: number }) {
  return (
    <svg
      aria-hidden="true"
      style={{ width }}
      viewBox="0 0 979 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M547.152 485.365L404.547 358.595C359.607 318.697 355.626 249.96 395.523 205.019L398.797 201.304L580.681 362.929L818.297 91.4304C859.257 44.6324 930.471 39.8553 977.269 80.8146L978.065 81.5223L629.248 480.234C608.105 504.385 571.303 506.773 547.241 485.365H547.152Z"
        fill="#B8E8DC"
      />
      <path
        d="M430.913 14.6355L573.518 141.406C618.458 181.303 622.439 250.041 582.542 294.981L579.268 298.696L397.385 137.071L159.768 408.57C118.808 455.368 47.5941 460.145 0.796186 419.186L0 418.478L348.817 19.7665C369.96 -4.38444 406.762 -6.773 430.824 14.6355H430.913Z"
        fill="#C8E6F8"
      />
    </svg>
  );
}

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
 * Tier 1 (Formal) document: the certificate. Centered logotype, pictogram
 * watermark at 5% opacity, and achievement-focused typography. Designed
 * for framing and long-term archival.
 */
export const T1Formal: Story = {
  name: "T1 Formal",
  render: () => (
    <div className="flex w-[660px] max-w-full flex-col gap-8 p-8">
      <div className="flex flex-col gap-2 mb-2">
        <H2>T1 Formal: the certificate</H2>
        <Muted>Highest-authority document class. Centered layout, full brand palette, pictogram watermark.</Muted>
      </div>

      <A4Page>
        {/* Brand watermark: bottom-right, matching status pages */}
        <div
          className="pointer-events-none absolute"
          style={{
            right: 0,
            bottom: 0,
            transform: "translate(15%, 10%)",
          }}
        >
          <BrandWatermark width={mm(120)} />
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-between">
          {/* Header: centered logotype */}
          <div className="flex flex-col items-center" style={{ gap: mm(3), paddingTop: mm(8) }}>
            <LogoWordmark width={mm(55)} />
            <div
              className="bg-brand-primary-200"
              style={{ height: 1, width: mm(20), marginTop: mm(2) }}
            />
          </div>

          {/* Achievement focus area */}
          <div className="flex flex-col items-center text-center" style={{ gap: pt(3) }}>
            <span
              className="font-sans font-bold uppercase"
              style={{
                fontSize: pt(7),
                letterSpacing: "0.15em",
                color: BRAND.navy,
              }}
            >
              Certificate of achievement
            </span>
            <span
              className="font-sans font-bold"
              style={{
                fontSize: pt(22),
                letterSpacing: "-0.02em",
                color: BRAND.ink,
                lineHeight: 1.1,
              }}
            >
              ISO 27001:2022
            </span>
            <span
              className="font-sans"
              style={{
                fontSize: pt(9),
                color: BRAND.gray500,
                lineHeight: 1.5,
              }}
            >
              Information Security Management System
            </span>

            <div
              style={{
                height: 1,
                width: mm(30),
                background: BRAND.gray200,
                marginTop: mm(4),
                marginBottom: mm(4),
              }}
            />

            <span
              className="font-sans font-semibold"
              style={{ fontSize: pt(14), color: BRAND.ink }}
            >
              Acme Corporation Ltd.
            </span>
            <span
              className="font-sans"
              style={{ fontSize: pt(8), color: BRAND.gray400, marginTop: mm(1) }}
            >
              Issued 14 April 2026 &middot; Valid until 13 April 2029
            </span>

            <div
              className="grid grid-cols-2"
              style={{ gap: `${mm(2)}px ${mm(10)}px`, marginTop: mm(6) }}
            >
              {[
                { label: "Certification body", value: "PROCERTUS Certification" },
                { label: "Certificate number", value: "CERT-2026-00417" },
                { label: "Accreditation", value: "UKAS 12345" },
                { label: "Scope", value: "Cloud infrastructure and SaaS" },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center" style={{ gap: pt(1) }}>
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
                    style={{ fontSize: pt(7), color: BRAND.gray500 }}
                  >
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer: signature + cert ref */}
          <div
            className="flex w-full items-end justify-between"
            style={{ paddingBottom: mm(2) }}
          >
            <div className="flex flex-col" style={{ gap: mm(1) }}>
              <div style={{ height: mm(10), borderBottom: `1.5px solid ${BRAND.gray300}`, width: mm(40) }} />
              <span
                className="font-sans font-bold uppercase"
                style={{
                  fontSize: pt(5),
                  letterSpacing: "0.1em",
                  color: BRAND.gray400,
                }}
              >
                Authorized signatory
              </span>
            </div>
            <div className="flex flex-col items-end" style={{ gap: pt(1) }}>
              <span
                className="font-mono"
                style={{ fontSize: pt(5.5), color: BRAND.gray300 }}
              >
                CERT-2026-00417
              </span>
              <span
                className="font-mono"
                style={{ fontSize: pt(5), color: BRAND.gray300 }}
              >
                14 April 2026
              </span>
            </div>
          </div>
        </div>
      </A4Page>
    </div>
  ),
};
