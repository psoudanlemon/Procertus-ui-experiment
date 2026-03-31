import type { Meta, StoryObj } from "@storybook/react-vite";

type Swatch = { name: string; var: string };

const GROUPS: { title: string; items: Swatch[] }[] = [
  {
    title: "Base",
    items: [
      { name: "Background", var: "--background" },
      { name: "Foreground", var: "--foreground" },
    ],
  },
  {
    title: "Primary",
    items: [
      { name: "Primary", var: "--primary" },
      { name: "Primary foreground", var: "--primary-foreground" },
    ],
  },
  {
    title: "Secondary & accent",
    items: [
      { name: "Secondary", var: "--secondary" },
      { name: "Secondary foreground", var: "--secondary-foreground" },
      { name: "Accent", var: "--accent" },
      { name: "Accent foreground", var: "--accent-foreground" },
    ],
  },
  {
    title: "UI",
    items: [
      { name: "Card", var: "--card" },
      { name: "Card foreground", var: "--card-foreground" },
      { name: "Muted", var: "--muted" },
      { name: "Muted foreground", var: "--muted-foreground" },
      { name: "Destructive", var: "--destructive" },
      { name: "Border", var: "--border" },
      { name: "Input", var: "--input" },
      { name: "Ring", var: "--ring" },
    ],
  },
  {
    title: "Charts",
    items: [
      { name: "Chart 1", var: "--chart-1" },
      { name: "Chart 2", var: "--chart-2" },
      { name: "Chart 3", var: "--chart-3" },
      { name: "Chart 4", var: "--chart-4" },
      { name: "Chart 5", var: "--chart-5" },
    ],
  },
  {
    title: "Sidebar",
    items: [
      { name: "Sidebar", var: "--sidebar" },
      { name: "Sidebar foreground", var: "--sidebar-foreground" },
      { name: "Sidebar primary", var: "--sidebar-primary" },
      { name: "Sidebar accent", var: "--sidebar-accent" },
      { name: "Sidebar border", var: "--sidebar-border" },
      { name: "Sidebar ring", var: "--sidebar-ring" },
    ],
  },
];

function ColorPaletteShowcase() {
  return (
    <div className="bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header>
          <h2 className="text-lg font-semibold tracking-tight">Color palette</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Semantic tokens from <code className="text-foreground">globals.css</code> — same idea as
            the Tweakcn “Color Palette” preview.
          </p>
        </header>
        {GROUPS.map((group) => (
          <section key={group.title} className="space-y-3">
            <h3 className="text-foreground text-sm font-medium">{group.title}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <SwatchCard key={item.var} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function SwatchCard({ item }: { item: Swatch }) {
  /** Avoid `style={ { ... } }` split across lines with adjacent braces in .stub files — Mustache can mangle those templates. */
  const swatchStyle = {
    backgroundColor: `var(${item.var})`,
  };
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div
        className="size-12 shrink-0 rounded-md border border-border shadow-sm"
        style={swatchStyle}
      />
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{item.name}</div>
        <code className="text-muted-foreground block truncate text-xs">{item.var}</code>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "design tokens/Color",
  component: ColorPaletteShowcase,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Swatches for semantic CSS variables (HSL) — similar to the Tweakcn [Color Palette](https://tweakcn.com/editor/theme) tab.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ColorPaletteShowcase>;

export const Default: Story = {
  render: () => <ColorPaletteShowcase />,
};
