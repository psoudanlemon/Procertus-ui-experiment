import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardContent } from "@/components/ui/card";
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

function GradientHeroExample() {
  return (
    <div className="flex flex-col gap-section">
      <header>
        <H2>Hero</H2>
        <Muted className="mt-2 text-base">
          Marketing-strip gebruik van een gradient-token in combinatie met de heading-laag.
          Gradient als ondergrond, headingtokens voor het kopje, muted-foreground voor de
          ondersteunende tekst. Wissel licht/donker om de adaptatie te zien.
        </Muted>
      </header>
      <Card className="overflow-hidden border-border/80 shadow-[var(--shadow-proc-md)]">
        <CardContent
          className="relative space-y-2 px-8 py-12 text-center sm:px-12"
          style={{ background: "var(--gradient-primary)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            PROCERTUS · certification platform
          </p>
          <h2 className="text-balance text-3xl font-semibold text-heading-foreground sm:text-4xl">
            Eén platform voor elk certificeringsdossier
          </h2>
          <Muted className="mx-auto max-w-xl text-pretty">
            Van aanvraag tot opvolging, alles op één plek. Volg de status van je dossier,
            beheer je team en houd documenten up-to-date.
          </Muted>
        </CardContent>
      </Card>
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

/**
 * Marketing-strip toepassing van `--gradient-primary` met heading-foreground en
 * muted-foreground. Het patroon dat eerder leefde als `BrandGradientHero` in
 * de app-source.
 */
export const Hero: StoryObj<typeof GradientHeroExample> = {
  render: () => <GradientHeroExample />,
};
