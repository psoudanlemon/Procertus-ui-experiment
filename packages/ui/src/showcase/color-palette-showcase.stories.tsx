import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { cn } from "@/lib/utils";
import { H2, H4 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";
import Color from "colorjs.io";

/* ═══════════════════════════════════════════════════════════════════════════
 * Shared constants
 * ═══════════════════════════════════════════════════════════════════════════ */

const SCALE_STEPS = [
  "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950",
] as const;

const NEUTRAL_STEPS = [
  "white", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950", "black",
] as const;

/* ═══════════════════════════════════════════════════════════════════════════
 * Shared primitive components (Brand + System stories)
 * ═══════════════════════════════════════════════════════════════════════════ */

function GradientStrip({
  cssVarPrefix,
  steps,
}: {
  cssVarPrefix: string;
  steps: readonly string[];
}) {
  return (
    <div className="flex h-3 overflow-hidden rounded-full">
      {steps.map((step) => (
        <div
          key={step}
          className="flex-1"
          style={{ backgroundColor: `var(${cssVarPrefix}-${step})` }}
        />
      ))}
    </div>
  );
}

function ScaleSwatchCard({
  step,
  cssVar,
  highlight,
  highlightLabel,
}: {
  step: string;
  cssVar: string;
  highlight?: boolean;
  highlightLabel?: string;
}) {
  const isDark = !isNaN(Number(step)) && Number(step) >= 500;
  const swatchRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState<{ hex: string; oklch: string } | null>(null);

  useEffect(() => {
    const el = swatchRef.current;
    if (!el) return;
    const raw = getComputedStyle(el).backgroundColor;
    try {
      const c = new Color(raw);
      setResolved({
        hex: c.to("srgb").toString({ format: "hex" }),
        oklch: c.to("oklch").toString({ precision: 3 }),
      });
    } catch {
      /* ignore parse failures */
    }
  }, [cssVar]);

  return (
    <div className="group relative space-y-1.5">
      <div
        ref={swatchRef}
        className={cn(
          "relative aspect-square rounded-md border border-border shadow-sm",
          highlight && "ring-2 ring-ring ring-offset-2 ring-offset-background"
        )}
        style={{ backgroundColor: `var(${cssVar})` }}
      >
        {highlight && highlightLabel && (
          <span
            className={cn(
              "absolute bottom-1 left-1 rounded px-1 py-0.5 text-[9px] font-semibold leading-none",
              isDark ? "bg-white/20 text-white" : "bg-black/10 text-black"
            )}
          >
            {highlightLabel}
          </span>
        )}
      </div>
      <div className="text-center text-xs font-medium">{step}</div>
      {/* Tooltip on hover */}
      <div className="pointer-events-none absolute -bottom-14 left-1/2 z-10 -translate-x-1/2 rounded bg-foreground px-2.5 py-1.5 text-[10px] leading-relaxed text-background whitespace-nowrap opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        <div className="font-medium">{cssVar}</div>
        {resolved && (
          <>
            <div className="text-background/70">{resolved.hex}</div>
            <div className="text-background/70">{resolved.oklch}</div>
          </>
        )}
      </div>
    </div>
  );
}

function ScaleSection({
  title,
  description,
  cssVarPrefix,
  steps,
  highlights = {},
}: {
  title: string;
  description?: string;
  cssVarPrefix: string;
  steps: readonly string[];
  highlights?: Record<string, string>;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div>
        <H4>{title}</H4>
        {description && (
          <Muted className="mt-0.5">{description}</Muted>
        )}
      </div>
      <GradientStrip cssVarPrefix={cssVarPrefix} steps={steps} />
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-11">
        {steps.map((step) => (
          <ScaleSwatchCard
            key={step}
            step={step}
            cssVar={`${cssVarPrefix}-${step}`}
            highlight={step in highlights}
            highlightLabel={highlights[step]}
          />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Brand Colors
 * ═══════════════════════════════════════════════════════════════════════════ */

const BRAND_SCALES = [
  {
    title: "Primary",
    description:
      "The navy brand scale. Primary-700 is one of the two logo colors and serves as the main action color in light mode.",
    prefix: "--brand-primary",
    highlights: { "700": "Logo Anchor" },
  },
  {
    title: "Accent",
    description:
      "The teal brand scale. Accent-300 is the second logo color. Used for focus rings and interactive highlights in light mode, and promoted to the primary action color in dark mode.",
    prefix: "--brand-accent",
    highlights: { "300": "Logo Anchor" },
  },
];

function BrandColorShowcase() {
  return (
    <div className="min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <header>
          <H2>Brand colors</H2>
          <Muted className="mt-2 text-base">
            Full Primary (Navy) and Accent (Teal) ramps. Steps marked{" "}
            <strong>Logo anchor</strong> are used in the PROCERTUS wordmark.
          </Muted>
        </header>
        {BRAND_SCALES.map((scale) => (
          <ScaleSection
            key={scale.prefix}
            title={scale.title}
            description={scale.description}
            cssVarPrefix={scale.prefix}
            steps={SCALE_STEPS}
            highlights={scale.highlights}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * System Colors
 * ═══════════════════════════════════════════════════════════════════════════ */

const SYSTEM_SCALES = [
  {
    title: "Destructive",
    description: "Errors, deletions, and destructive actions.",
    prefix: "--sys-destructive",
  },
  {
    title: "Success",
    description: "Confirmations, completions, and positive states.",
    prefix: "--sys-success",
  },
  {
    title: "Warning",
    description: "Cautions, alerts, and attention-needed states.",
    prefix: "--sys-warning",
  },
  {
    title: "Info",
    description: "Informational banners and general-purpose notifications.",
    prefix: "--sys-info",
  },
];

function SystemColorShowcase() {
  return (
    <div className="min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <header>
          <H2>System colors</H2>
          <Muted className="mt-2 text-base">
            Functional color scales for status and feedback. Kept intentionally
            restrained so they stay deferential to the brand colors.
          </Muted>
        </header>
        {SYSTEM_SCALES.map((scale) => (
          <ScaleSection
            key={scale.prefix}
            title={scale.title}
            description={scale.description}
            cssVarPrefix={scale.prefix}
            steps={SCALE_STEPS}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Neutral Colors
 * ═══════════════════════════════════════════════════════════════════════════ */

function NeutralColorShowcase() {
  return (
    <div className="min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <header>
          <H2>Neutral colors</H2>
          <Muted className="mt-2 text-base">
            Navy-tinted "Midnight" neutrals (hue ~230). Instead of generic grays,
            every shade carries a whisper of the brand navy, creating a more
            refined and premium feel across surfaces, borders, and text.
          </Muted>
        </header>
        <ScaleSection
          title="Neutral"
          description="The bulk of the interface lives in neutral tones. We infuse a hint of brand navy into every step, so even the quietest shades feel cohesive with the brand."
          cssVarPrefix="--neutral"
          steps={NEUTRAL_STEPS}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Theme Colors (semantic tokens)
 * ═══════════════════════════════════════════════════════════════════════════ */

type ColorSection = { title: string; items: string[] };

const SECTIONS: ColorSection[] = [
  {
    title: "Surfaces",
    items: ["--background", "--foreground", "--card", "--card-foreground", "--popover", "--popover-foreground"],
  },
  {
    title: "Structure",
    items: ["--muted", "--muted-foreground", "--border", "--input"],
  },
  {
    title: "Actions",
    items: ["--primary", "--primary-foreground", "--secondary", "--secondary-foreground", "--accent", "--accent-foreground"],
  },
  {
    title: "Urgency",
    items: ["--destructive", "--destructive-foreground", "--warning", "--warning-foreground", "--info", "--info-foreground", "--success", "--success-foreground"],
  },
  {
    title: "Focus",
    items: ["--ring", "--sidebar-ring"],
  },
  {
    title: "Navigation",
    items: ["--sidebar", "--sidebar-foreground", "--sidebar-primary", "--sidebar-accent", "--sidebar-border"],
  },
  {
    title: "Data",
    items: ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"],
  },
];

function SwatchCard({ cssVar }: { cssVar: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div
        className="size-12 shrink-0 rounded-md border border-border shadow-sm"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <code className="text-sm whitespace-nowrap">{cssVar}</code>
    </div>
  );
}

function ColorPaletteShowcase() {
  return (
    <div className="min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <H2>Color palette</H2>
          <Muted className="mt-2 text-base">
            Semantic tokens from the theme — these map to brand, system, and
            neutral scales and resolve to different values in light and dark
            mode.
          </Muted>
        </header>
        <div className="space-y-16">
          {SECTIONS.map((section) => (
            <section key={section.title} className="space-y-4">
              <H4>{section.title}</H4>
              <div className="grid gap-3 sm:grid-cols-2">
                {section.items.map((cssVar) => (
                  <SwatchCard key={cssVar} cssVar={cssVar} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Contrast Checker — powered by colorjs.io for native OKLCH support
 * ═══════════════════════════════════════════════════════════════════════════ */

type ContrastResult = {
  ratio: number;
  fgResolved: string;
  bgResolved: string;
  fgOklch: string;
  bgOklch: string;
  aa: boolean;
  aaLarge: boolean;
  aaa: boolean;
};

/**
 * Read a CSS custom property from the DOM, normalise it into a string
 * that colorjs.io can parse, and return a Color instance.
 *
 * Handles three formats browsers may return:
 *  1. A full function: `oklch(0.48 0.10 226)` → pass through
 *  2. Raw OKLCH values: `0.48 0.10 226`       → wrap in `oklch(…)`
 *  3. Legacy rgb/hsl:   `rgb(7, 98, 147)`      → pass through
 */
function resolveColor(el: Element, varName: string): Color | null {
  const probe = document.createElement("span");
  probe.style.display = "none";
  el.appendChild(probe);

  // Set background to the variable so the browser resolves it
  probe.style.backgroundColor = `var(${varName})`;
  const raw = getComputedStyle(probe).backgroundColor;
  el.removeChild(probe);

  if (!raw || raw === "rgba(0, 0, 0, 0)") return null;

  try {
    return new Color(raw);
  } catch {
    // If getComputedStyle returned raw OKLCH values without the function wrapper
    const trimmed = raw.trim();
    if (/^[\d.]+\s+[\d.]+\s+[\d.]+/.test(trimmed)) {
      try {
        return new Color(`oklch(${trimmed})`);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function useContrastRatio(
  containerRef: React.RefObject<HTMLElement | null>,
  fgVar: string,
  bgVar: string
): ContrastResult | null {
  const [result, setResult] = useState<ContrastResult | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const fg = resolveColor(el, fgVar);
    const bg = resolveColor(el, bgVar);
    if (!fg || !bg) return;

    // WCAG 2.1 contrast uses the WCAG21 algorithm
    const ratio = Math.abs(bg.contrast(fg, "WCAG21"));
    const rounded = Math.round(ratio * 100) / 100;

    setResult({
      ratio: rounded,
      fgResolved: fg.to("srgb").toString({ format: "hex" }),
      bgResolved: bg.to("srgb").toString({ format: "hex" }),
      fgOklch: fg.to("oklch").toString({ precision: 3 }),
      bgOklch: bg.to("oklch").toString({ precision: 3 }),
      aa: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaa: ratio >= 7,
    });
  }, [fgVar, bgVar, containerRef]);

  return result;
}

type ContrastPair = { label: string; fgVar: string; bgVar: string };
type ContrastSection = { title: string; pairs: ContrastPair[] };

const CONTRAST_SECTIONS: ContrastSection[] = [
  {
    title: "Surfaces",
    pairs: [
      { label: "Default", fgVar: "--foreground", bgVar: "--background" },
      { label: "Card", fgVar: "--card-foreground", bgVar: "--card" },
      { label: "Popover", fgVar: "--popover-foreground", bgVar: "--popover" },
    ],
  },
  {
    title: "Structure",
    pairs: [
      { label: "Muted", fgVar: "--muted-foreground", bgVar: "--muted" },
    ],
  },
  {
    title: "Actions",
    pairs: [
      { label: "Primary", fgVar: "--primary-foreground", bgVar: "--primary" },
      { label: "Secondary", fgVar: "--secondary-foreground", bgVar: "--secondary" },
      { label: "Accent", fgVar: "--accent-foreground", bgVar: "--accent" },
    ],
  },
  {
    title: "Urgency",
    pairs: [
      { label: "Destructive", fgVar: "--destructive-foreground", bgVar: "--destructive" },
      { label: "Warning", fgVar: "--warning-foreground", bgVar: "--warning" },
      { label: "Info", fgVar: "--info-foreground", bgVar: "--info" },
      { label: "Success", fgVar: "--success-foreground", bgVar: "--success" },
    ],
  },
  {
    title: "Navigation",
    pairs: [
      { label: "Default", fgVar: "--sidebar-foreground", bgVar: "--sidebar" },
      { label: "Primary", fgVar: "--sidebar-primary-foreground", bgVar: "--sidebar-primary" },
      { label: "Accent", fgVar: "--sidebar-accent-foreground", bgVar: "--sidebar-accent" },
    ],
  },
];

function ContrastBadge({
  pass,
  label,
}: {
  pass: boolean;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        pass
          ? "bg-sys-success-100 text-sys-success-700"
          : "bg-sys-destructive-100 text-sys-destructive-700"
      )}
    >
      {label}
    </span>
  );
}

function ContrastPairCard({ label, fgVar, bgVar }: ContrastPair) {
  const ref = useRef<HTMLDivElement>(null);
  const result = useContrastRatio(ref, fgVar, bgVar);

  return (
    <div
      ref={ref}
      className="space-y-4 rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        <div className="ml-auto flex items-center gap-2">
          {result && (
            <>
              <ContrastBadge pass={result.aa} label="AA" />
              <ContrastBadge pass={result.aaa} label="AAA" />
            </>
          )}
          <span className="font-mono text-lg font-bold tabular-nums">
            {result ? `${result.ratio}:1` : "\u2026"}
          </span>
        </div>
      </div>

      {/* Live preview — foreground text rendered on the background */}
      <div
        className="rounded-md border border-border p-4 text-sm font-medium"
        style={{ backgroundColor: `var(${bgVar})`, color: `var(${fgVar})` }}
      >
        Sample text Aa
      </div>

      {/* Token names + resolved OKLCH values */}
      <div className="text-muted-foreground space-y-0.5 text-xs">
        <div className="flex items-center gap-1.5">
          <code>{fgVar}</code>
          {result && (
            <span className="ml-auto flex items-center gap-1.5 font-mono">
              <span
                className="inline-block size-2.5 rounded-full border border-border"
                style={{ backgroundColor: `var(${fgVar})` }}
              />
              {result.fgOklch}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <code>{bgVar}</code>
          {result && (
            <span className="ml-auto flex items-center gap-1.5 font-mono">
              <span
                className="inline-block size-2.5 rounded-full border border-border"
                style={{ backgroundColor: `var(${bgVar})` }}
              />
              {result.bgOklch}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ContrastCheckerShowcase() {
  return (
    <div className="min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <H2>Contrast checker</H2>
          <Muted className="mt-2 text-base">
            WCAG 2.1 contrast ratios for semantic color pairings. Computed live
            from CSS custom properties.
          </Muted>
        </header>
        <div className="space-y-10">
          {CONTRAST_SECTIONS.map((section) => (
            <section key={section.title} className="space-y-4">
              <H4>{section.title}</H4>
              <div className="grid gap-5 sm:grid-cols-2">
                {section.pairs.map((pair) => (
                  <ContrastPairCard key={`${pair.fgVar}-${pair.bgVar}`} {...pair} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Story exports
 * ═══════════════════════════════════════════════════════════════════════════ */

const meta: Meta = {
  title: "design tokens/Color",
  component: ColorPaletteShowcase,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ColorPaletteShowcase>;

export const Brand: Story = {
  render: () => <BrandColorShowcase />,
};

export const Neutral: Story = {
  render: () => <NeutralColorShowcase />,
};

export const System: Story = {
  render: () => <SystemColorShowcase />,
};

export const Theme: Story = {
  render: () => <ColorPaletteShowcase />,
};

export const ContrastChecker: Story = {
  render: () => <ContrastCheckerShowcase />,
};
