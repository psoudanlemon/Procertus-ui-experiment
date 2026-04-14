import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/components/ui/badge";
import { H2, H3 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "design tokens/Logotype",
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Asset paths (served via staticDirs from packages/ui/public)
// ---------------------------------------------------------------------------

const LOGO = "/Procertus logo.svg";
const LOGO_TAGLINE = "/Procertus Logo with tagline.svg";

// ---------------------------------------------------------------------------
// Contrast rule data (from brand book page 4: Logotype - Achtergrond)
// ---------------------------------------------------------------------------

type ContrastStatus = "recommended" | "allowed" | "avoid" | "forbidden";

type ContrastRule = {
  label: string;
  description: string;
  status: ContrastStatus;
  bgClass?: string;
  bgStyle?: React.CSSProperties;
  invert?: boolean;
};

const contrastRules: ContrastRule[] = [
  {
    label: "Color logo on white",
    description: "Recommended usage. Color logotype on a white or off-white background.",
    status: "recommended",
    bgClass: "bg-white border border-border",
  },
  {
    label: "Color logo on transparent",
    description: "Allowed usage. Color logotype on a transparent or near-white background.",
    status: "allowed",
    bgClass: "bg-neutral-100",
  },
  {
    label: "White logo on black",
    description: "Allowed usage. White logotype on a black or near-black background.",
    status: "allowed",
    bgClass: "bg-black",
    invert: true,
  },
  {
    label: "White logo on brand blue",
    description: "Allowed usage. White logotype on the Procertus primary blue background.",
    status: "allowed",
    bgClass: "bg-[#076293]",
    invert: true,
  },
  {
    label: "White logo on imagery",
    description: "Allowed by exception. White logo on a background image, only when legibility is guaranteed.",
    status: "allowed",
    bgStyle: { background: "linear-gradient(135deg, #5a8ea0 0%, #3b6978 40%, #7a9e8f 100%)" },
    invert: true,
  },
  {
    label: "Color logo on dark",
    description: "Use to avoid. The color logotype loses contrast on dark backgrounds.",
    status: "avoid",
    bgClass: "bg-neutral-950",
  },
  {
    label: "Blue logo on color",
    description: "Forbidden. The blue-only logotype can only be used on white backgrounds.",
    status: "forbidden",
    bgClass: "bg-[#dba94d]",
  },
  {
    label: "Insufficient legibility",
    description: "Forbidden. Any placement where the logotype becomes difficult to read.",
    status: "forbidden",
    bgStyle: { background: "linear-gradient(135deg, #b0b0b0 0%, #999 30%, #aaa 60%, #c0c0c0 100%)" },
  },
];

function StatusBadge({ status }: { status: ContrastStatus }) {
  const styles: Record<ContrastStatus, string> = {
    recommended: "bg-brand-accent-100 text-brand-accent-700",
    allowed: "bg-brand-primary-100 text-brand-primary-700",
    avoid: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    forbidden: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  const labels: Record<ContrastStatus, string> = {
    recommended: "Recommended",
    allowed: "Allowed",
    avoid: "Avoid",
    forbidden: "Forbidden",
  };
  return (
    <Badge variant="secondary" className={cn("text-[10px]", styles[status])}>
      {labels[status]}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// View: Visual contrast
// ---------------------------------------------------------------------------

function LogotypeContrastView() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 p-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <H2>Background rules</H2>
        <Muted className="max-w-prose">
          Every approved, conditional, and forbidden background treatment from
          the brand book, mapped to a concrete example.
        </Muted>
      </div>

      <div className="flex flex-col gap-8">

        <div className="overflow-hidden rounded-xl border border-border bg-white dark:bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Treatment</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Preview</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Rule</th>
              </tr>
            </thead>
            <tbody>
              {contrastRules.map((rule) => (
                <tr key={rule.label} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-5 font-medium text-foreground">{rule.label}</td>
                  <td className="px-4 py-5"><StatusBadge status={rule.status} /></td>
                  <td className="px-4 py-5">
                    <div
                      className={cn(
                        "flex min-h-[56px] w-[200px] items-center justify-center rounded-lg p-3",
                        rule.bgClass,
                      )}
                      style={rule.bgStyle}
                    >
                      <img
                        src={LOGO}
                        alt={rule.label}
                        className={cn("w-[160px]", rule.invert && "brightness-0 invert")}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-5 text-muted-foreground">{rule.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

/**
 * Background contrast rules, mode mapping, and forbidden placements
 * derived from the Procertus brand book (Logotype - Achtergrond).
 */
export const VisualContrast: Story = {
  name: "Background rules",
  render: () => <LogotypeContrastView />,
};
