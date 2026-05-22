import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * A loading spinner indicator with configurable sizes.
 */
const meta: Meta<typeof Spinner> = {
  title: "components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
  },
  args: {
    size: "default",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default spinner.
 */
export const Default: Story = {};

/**
 * Small size variant.
 */
export const Small: Story = {
  args: {
    size: "sm",
  },
};

/**
 * Large size variant.
 */
export const Large: Story = {
  args: {
    size: "lg",
  },
};

/**
 * All sizes side by side for comparison.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="default" />
      <Spinner size="lg" />
    </div>
  ),
};

/**
 * Spinner used inline with a button.
 */
export const WithButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner size="sm" />
      Loading...
    </Button>
  ),
};

// ---------------------------------------------------------------------------
// Branded spinner — proposal
// ---------------------------------------------------------------------------
// Uses the actual filled checkmark paths from the PROCERTUS logomark
// (same rounded vertices, same proportions, same colors). Two full
// slide-rotate-return sequences per keyframe cycle, each using a different
// diagonal so the four extreme poses trace a square around the centre:
//
//   sequence 1 (0% → 50%, rotation 0° → -180°): NW–SE diagonal
//     navy moves visually NW, teal moves visually SE
//   sequence 2 (50% → 100%, rotation -180° → -360°): NE–SW diagonal
//     navy moves visually NE, teal moves visually SW
//
// Rotation is clockwise (negative degrees in CSS — the 180° flip is the
// same in both directions, but the intermediate 90° / 270° sweep determines
// the perceived spin direction).
//
// Because the outer rotation is at 180° during sequence 2, the local
// translate is inverted vs. sequence 1 to land on the opposite diagonal
// in screen space — navy goes from (-8,-8) local to (-8,+8) local, etc.
//
// The logomark has perfect 180° rotational symmetry around (91, 65), so
// the 50% midpoint visually equals the 0% / 100% poses — the eye sees
// the logomark settle three times across the cycle.
//
// Nested groups: the outer one rotates the pair as a unit; each inner one
// handles its own diagonal slide. Each path also fades to a muted tone
// at the apart extremes (navy → muted-foreground, teal → muted) so the
// light/dark balance between the two checks is preserved.
//
// Snappy cubic-bezier easing per phase. Disabled under prefers-reduced-motion.

// Near-square viewBox — rotation sweeps a circle around the logomark centre.
const brandedSize = {
  sm: "size-8",
  default: "size-12",
  lg: "size-16",
} as const;

type BrandedSize = keyof typeof brandedSize;

// Filled checkmark paths copied verbatim from /Marks_Procertus logo.svg.
const CHECK_TEAL =
  "M98.15 90.99L82.03 76.66C76.95 72.15 76.5 64.38 81.01 59.3L81.38 58.88L101.94 77.15L128.8 46.46C133.43 41.17 141.48 40.63 146.77 45.26L146.86 45.34L107.43 90.41C105.04 93.14 100.88 93.41 98.16 90.99H98.15Z";
const CHECK_NAVY =
  "M85.01 37.78L101.13 52.11C106.21 56.62 106.66 64.39 102.15 69.47L101.78 69.89L81.22 51.62L54.36 82.31C49.73 87.6 41.68 88.14 36.39 83.51L36.3 83.43L75.73 38.36C78.12 35.63 82.28 35.36 85 37.78H85.01Z";

function BrandedSpinner({
  size = "default",
  className,
}: {
  size?: BrandedSize;
  className?: string;
}) {
  return (
    <span
      data-slot="branded-spinner"
      role="status"
      aria-label="Laden"
      className={cn("inline-block", brandedSize[size], className)}
    >
      {/* viewBox accommodates the rotation sweep of the slid-apart pair */}
      <svg viewBox="20 -5 142 140" fill="none" className="size-full">
        {/* Outer group rotates 360° around the logomark centre (2 × 180°) */}
        <g
          style={{ transformBox: "view-box", transformOrigin: "91px 65px" }}
          className="[animation:procertus-rotate_5s_cubic-bezier(0.83,0,0.17,1)_infinite] motion-reduce:[animation:none]"
        >
          {/* Navy slides up-left twice, snapping back through centre */}
          <g className="[animation:procertus-slide-navy_5s_cubic-bezier(0.83,0,0.17,1)_infinite] motion-reduce:[animation:none]">
            <path
              d={CHECK_NAVY}
              style={{
                "--ps-active": "var(--brand-primary-700)",
                "--ps-muted": "var(--muted-foreground)",
                fill: "var(--ps-active)",
              } as React.CSSProperties}
              className="dark:[--ps-active:var(--brand-primary-300)]"
            />
          </g>
          {/* Teal slides down-right twice, snapping back through centre */}
          <g className="[animation:procertus-slide-teal_5s_cubic-bezier(0.83,0,0.17,1)_infinite] motion-reduce:[animation:none]">
            <path
              d={CHECK_TEAL}
              style={{
                "--ps-active": "var(--brand-accent-300)",
                "--ps-muted": "var(--muted)",
                fill: "var(--ps-active)",
              } as React.CSSProperties}
              className=""
            />
          </g>
        </g>
      </svg>
      <style>{`
        @keyframes procertus-rotate {
          0%, 17.5%     { transform: rotate(0deg); }
          32.5%, 67.5%  { transform: rotate(-180deg); }
          82.5%, 100%   { transform: rotate(-360deg); }
        }
        @keyframes procertus-slide-navy {
          0%, 50%, 100% { transform: translate(0, 0); }
          17.5%, 32.5%  { transform: translate(12px, -20px); }
          67.5%, 82.5%  { transform: translate(12px, -20px); }
        }
        @keyframes procertus-slide-teal {
          0%, 50%, 100% { transform: translate(0, 0); }
          17.5%, 32.5%  { transform: translate(-12px, 20px); }
          67.5%, 82.5%  { transform: translate(-12px, 20px); }
        }
      `}</style>
    </span>
  );
}

/**
 * Branded spinner proposal — the two filled checkmarks from the PROCERTUS
 * logomark breathing along their natural diagonal axis. At rest they form
 * the logomark; mid-cycle they pull slightly apart, then return. Shown at
 * all three sizes for comparison with the primitive Spinner above.
 */
export const Branded: Story = {
  render: () => (
    <div className="flex items-center gap-section">
      <BrandedSpinner size="sm" />
      <BrandedSpinner size="default" />
      <BrandedSpinner size="lg" />
    </div>
  ),
};
