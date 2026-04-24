import { Card, CardContent, Muted } from "@procertus-ui/ui";

/**
 * App-local marketing strip using **gradient** and **heading** tokens from the default theme.
 */
export function BrandGradientHero() {
  return (
    <Card className="overflow-hidden border-border/80 shadow-[var(--shadow-proc-md)]">
      <CardContent
        className="relative space-y-2 px-8 py-12 text-center sm:px-12"
        style={{ background: "var(--gradient-primary)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Procertus · PT1 extranet
        </p>
        <h2 className="text-balance text-3xl font-semibold text-heading-foreground sm:text-4xl">
          Onboarding prototype
        </h2>
        <Muted className="mx-auto max-w-xl text-pretty">
          This route composes <code className="font-mono text-[0.8rem] text-foreground">@procertus-ui/ui-lib</code>{" "}
          galleries with app-specific surfaces using CSS variables such as{" "}
          <code className="font-mono text-[0.8rem] text-foreground">--gradient-primary</code>.
        </Muted>
      </CardContent>
    </Card>
  );
}
