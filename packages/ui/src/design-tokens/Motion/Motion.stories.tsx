import type { Meta, StoryObj } from "@storybook/react-vite";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "design tokens/Motion",
  tags: ["!autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Duration scale
// ---------------------------------------------------------------------------

function DurationRow({
  tier,
  duration,
  components,
}: {
  tier: string;
  duration: string;
  components: string[];
}) {
  return (
    <div className="grid w-full grid-cols-[120px_1fr] items-center gap-6 rounded-xl border border-border bg-card p-5">
      <div>
        <span className="block text-base font-semibold text-foreground">
          {tier}
        </span>
        <span className="block font-mono text-sm text-muted-foreground">
          {duration}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {components.map((c) => (
          <span
            key={c}
            className="inline-flex rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * The five duration tiers that govern all interactive and ambient motion
 * in the system.
 */
export const DurationScale: Story = {
  name: "Duration scale",
  render: () => (
    <div className="flex w-[800px] max-w-full flex-col gap-3 p-8">
      <div className="mb-6">
        <h2 className="m-0 text-lg font-semibold text-foreground">
          Duration scale
        </h2>
        <p className="m-0 mt-1 text-sm text-muted-foreground">
          The five duration tiers that cover every animation in the system.
        </p>
      </div>

      <DurationRow
        tier="Instant"
        duration="100ms"
        components={[
          "Tooltip",
          "Popover",
          "Dropdown menu",
          "Context menu",
          "Select",
          "Hover card",
          "Menubar",
          "Dialog overlay",
          "Alert dialog overlay",
        ]}
      />

      <DurationRow
        tier="Quick"
        duration="200ms"
        components={[
          "Accordion",
          "Collapsible",
          "Sheet overlay",
          "Sheet content",
          "Drawer overlay",
          "Sidebar width",
          "Scroll fades",
          "Nav viewport",
        ]}
      />

      <DurationRow
        tier="Emphasis"
        duration="300ms"
        components={[
          "Button states",
          "Density spacing",
          "Nav menu content",
          "Nav trigger icon",
          "Stepper indicator",
          "Stepper separator",
        ]}
      />

      <DurationRow
        tier="Deliberate"
        duration="500ms"
        components={["Step layout body"]}
      />

      <DurationRow
        tier="Ambient"
        duration="2s+"
        components={[
          "Spinner (2s)",
          "Skeleton (2s)",
          "Caret blink (1.25s)",
          "Glow-spin (6s)",
        ]}
      />

      <div className="mt-4 rounded-xl border border-border bg-muted/30 p-5">
        <p className="m-0 text-sm text-muted-foreground leading-relaxed">
          The <strong className="text-foreground">800ms</strong> command-pulse
          on button press is intentionally outside this scale. It is a branded
          interaction, not a state transition, and its longer duration reinforces
          the feeling of a deliberate action rippling outward.
        </p>
      </div>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Animation mapping
// ---------------------------------------------------------------------------

type MotionEntry = {
  component: string;
  easing: "ease-out" | "Expressive";
  duration: string;
  pattern: string;
};

const entries: MotionEntry[] = [
  { component: "Dialog overlay", easing: "ease-out", duration: "Instant", pattern: "Fade" },
  { component: "Dialog content", easing: "ease-out", duration: "Instant", pattern: "Fade + scale" },
  { component: "Alert dialog overlay", easing: "ease-out", duration: "Instant", pattern: "Fade" },
  { component: "Alert dialog content", easing: "ease-out", duration: "Instant", pattern: "Fade + scale" },
  { component: "Popover", easing: "ease-out", duration: "Instant", pattern: "Fade + scale + slide" },
  { component: "Tooltip", easing: "ease-out", duration: "Instant", pattern: "Fade + scale + slide" },
  { component: "Dropdown menu", easing: "ease-out", duration: "Instant", pattern: "Fade + scale + slide" },
  { component: "Context menu", easing: "ease-out", duration: "Instant", pattern: "Fade + scale + slide" },
  { component: "Select", easing: "ease-out", duration: "Instant", pattern: "Fade + scale + slide" },
  { component: "Hover card", easing: "ease-out", duration: "Instant", pattern: "Fade + scale + slide" },
  { component: "Menubar", easing: "ease-out", duration: "Instant", pattern: "Fade + scale + slide" },
  { component: "Sheet overlay", easing: "ease-out", duration: "Quick", pattern: "Fade" },
  { component: "Sheet content", easing: "ease-out", duration: "Quick", pattern: "Fade + slide" },
  { component: "Drawer overlay", easing: "ease-out", duration: "Quick", pattern: "Fade" },
  { component: "Accordion", easing: "ease-out", duration: "Quick", pattern: "Expand / collapse" },
  { component: "Collapsible", easing: "ease-out", duration: "Quick", pattern: "Expand / collapse" },
  { component: "Sidebar width", easing: "ease-out", duration: "Quick", pattern: "Expand / collapse" },
  { component: "Navigation viewport", easing: "ease-out", duration: "Quick", pattern: "Fade + scale" },
  { component: "Scroll fades", easing: "ease-out", duration: "Quick", pattern: "Fade" },
  { component: "Button states", easing: "ease-out", duration: "Emphasis", pattern: "Transition" },
  { component: "Button press", easing: "ease-out", duration: "Branded", pattern: "Command pulse" },
  { component: "Density spacing", easing: "ease-out", duration: "Emphasis", pattern: "Transition" },
  { component: "Nav menu content", easing: "Expressive", duration: "Emphasis", pattern: "Slide + fade" },
  { component: "Nav trigger icon", easing: "ease-out", duration: "Emphasis", pattern: "Rotate" },
  { component: "Stepper indicator", easing: "ease-out", duration: "Emphasis", pattern: "Transition + fade" },
  { component: "Stepper separator", easing: "ease-out", duration: "Emphasis", pattern: "Transition" },
  { component: "Step layout body", easing: "Expressive", duration: "Deliberate", pattern: "Slide + fade" },
  { component: "Spinner", easing: "ease-out", duration: "Ambient", pattern: "Continuous loop" },
  { component: "Skeleton", easing: "ease-out", duration: "Ambient", pattern: "Continuous loop" },
  { component: "Caret blink", easing: "ease-out", duration: "Ambient", pattern: "Continuous loop" },
  { component: "Glow-spin", easing: "ease-out", duration: "Ambient", pattern: "Continuous loop" },
];

function EasingPill({ easing }: { easing: MotionEntry["easing"] }) {
  const styles: Record<MotionEntry["easing"], string> = {
    "ease-out": "bg-muted text-muted-foreground",
    Expressive: "bg-brand-primary-100 text-brand-primary-800 dark:bg-brand-primary-900 dark:text-brand-primary-200",
  };

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${styles[easing]}`}>
      {easing}
    </span>
  );
}

/**
 * Every animated component in the system mapped to its easing curve,
 * duration tier, and animation pattern.
 */
export const AnimationMapping: Story = {
  name: "Animation mapping",
  render: () => (
    <div className="w-[960px] max-w-full p-8">
      <div className="mb-6">
        <h2 className="m-0 text-lg font-semibold text-foreground">
          Animation mapping
        </h2>
        <p className="m-0 mt-1 text-sm text-muted-foreground">
          Every animated component, its curve, tier, and pattern at a glance.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Component</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Easing</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Duration</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Pattern</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.component} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 font-medium text-foreground">{entry.component}</td>
                <td className="px-4 py-3"><EasingPill easing={entry.easing} /></td>
                <td className="px-4 py-3 text-muted-foreground">{entry.duration}</td>
                <td className="px-4 py-3 text-muted-foreground">{entry.pattern}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
};
