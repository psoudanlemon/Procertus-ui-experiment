import type { Meta, StoryObj } from "@storybook/react-vite";
import { H2 } from "@/components/ui/heading";
import { Muted, Small } from "@/components/ui/typography";

type Gradient = {
  variable: string;
  lightStops: string;
  darkStops: string;
};

function GradientSwatch({ variable, lightStops, darkStops }: Gradient) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className="flex aspect-square w-1/4 shrink-0 rounded-md border border-border bg-card"
          style={{ backgroundImage: `var(${variable})` }}
        />
        <div className="space-y-1 pt-1">
          <code className="block text-sm font-medium text-foreground">
            {variable}
          </code>
          <Small className="hidden text-muted-foreground dark:block">{darkStops}</Small>
          <Small className="text-muted-foreground dark:hidden">{lightStops}</Small>
        </div>
      </div>
    </div>
  );
}

const gradients: Gradient[] = [
  {
    variable: "--gradient-primary",
    lightStops: "brand-primary-200, brand-primary-100 on neutral base",
    darkStops: "brand-primary-700, brand-primary-800 on neutral base",
  },
  {
    variable: "--gradient-accent",
    lightStops: "brand-accent-200, brand-accent-100 on neutral base",
    darkStops: "brand-accent-800, brand-accent-900 on neutral base",
  },
  {
    variable: "--gradient-neutral",
    lightStops: "neutral-100, neutral-50, neutral-white",
    darkStops: "neutral-700, neutral-800, neutral-950",
  },
  {
    variable: "--gradient-blend",
    lightStops: "brand-primary-200, brand-accent-200, brand-primary-100",
    darkStops: "brand-primary-900, brand-accent-900, brand-primary-800",
  },
];

function GradientTokens() {
  return (
    <div>
      <header className="mb-8">
        <H2>Gradient</H2>
        <Muted className="mt-2 text-base">
          Surface gradients for standout cards, hero sections, and decorative backgrounds.
          Toggle dark mode to see each gradient adapt.
        </Muted>
      </header>
      <div className="grid grid-cols-2 gap-6">
        {gradients.map((g) => (
          <GradientSwatch key={g.variable} {...g} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof GradientTokens> = {
  title: "design tokens/Gradient",
  component: GradientTokens,
};

export default meta;
type Story = StoryObj<typeof GradientTokens>;

export const Default: Story = {};
