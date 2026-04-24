import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  H1,
  H2,
  H3,
  Input,
  Label,
  Lead,
  Muted,
  P,
  Progress,
  Separator,
  Slider,
  Small,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@procertus-ui/ui";

import { TokenSwatch } from "./TokenSwatch";

export type DesignTokensShowcaseProps = {
  className?: string;
  /** Optional app-specific hero or chrome rendered above the gallery */
  headerAddon?: ReactNode;
};

/**
 * Presentational gallery: **semantic colors**, **typography**, **radius / shadow** tokens, and common **form primitives** — aligned with `@procertus-ui/ui` foundations.
 */
export function DesignTokensShowcase({ className, headerAddon }: DesignTokensShowcaseProps) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl space-y-8 px-4 py-8", className)}>
      <header className="space-y-4">
        {headerAddon}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="secondary">Design system</Badge>
            <H1 className="text-balance">Token & primitive reference</H1>
            <Lead className="max-w-2xl text-pretty">
              Surfaces, semantic ramps, typography, and controls backed by CSS variables and Tailwind v4 theme tokens.
              Import <code className="font-mono text-sm">@procertus-ui/ui/globals.css</code> in your Vite entry CSS, then add an{" "}
              <code className="font-mono text-sm">@source</code> for your app so utilities compile.
            </Lead>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm">
              Secondary
            </Button>
            <Button type="button" size="sm">
              Primary
            </Button>
            <Button type="button" variant="destructive" size="sm">
              Destructive
            </Button>
          </div>
        </div>
      </header>

      <Tabs defaultValue="overview" className="gap-6">
        <TabsList variant="line" className="w-full min-w-0 flex-wrap justify-start sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="surfaces">Semantic colors</TabsTrigger>
          <TabsTrigger value="shape">Shape & depth</TabsTrigger>
          <TabsTrigger value="controls">Form controls</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Alert>
            <AlertTitle>Primitives + tokens</AlertTitle>
            <AlertDescription>
              Components come from <strong>@procertus-ui/ui</strong>; composed layouts from{" "}
              <strong>@procertus-ui/ui-lib</strong>. Prefer semantic utilities (<code className="font-mono">text-muted-foreground</code>,{" "}
              <code className="font-mono">bg-card</code>) over raw brand steps unless you are authoring marketing surfaces.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Heading scale uses <code className="font-mono">text-heading-*</code> +{" "}
                <code className="font-mono">text-heading-foreground</code>; body uses foreground / muted pairs.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <H2>Heading 2</H2>
                <H3>Heading 3</H3>
                <P>Body paragraph — neutral foreground on elevated surfaces.</P>
                <Muted>Muted helper — secondary reading priority.</Muted>
                <Small>Small caption — metadata and table hints.</Small>
              </div>
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
                <P className="font-mono text-sm">Inline code tokens</P>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  --radius · --shadow-proc-* · --gradient-primary
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Alert variant="success">
              <AlertTitle>Success tone</AlertTitle>
              <AlertDescription>Uses system success ramp on card surface.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Destructive tone</AlertTitle>
              <AlertDescription>Reserved for blocking errors and irreversible actions.</AlertDescription>
            </Alert>
          </div>
        </TabsContent>

        <TabsContent value="surfaces" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Semantic surfaces</CardTitle>
              <CardDescription>Each tile pairs background + on-color text from the default theme.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <TokenSwatch label="background / foreground" swatchClassName="bg-background text-foreground" hint="App canvas" />
              <TokenSwatch label="card" swatchClassName="bg-card text-card-foreground" hint="Panels & dialogs" />
              <TokenSwatch label="primary" swatchClassName="bg-primary text-primary-foreground" hint="Main CTA fill" />
              <TokenSwatch label="secondary" swatchClassName="bg-secondary text-secondary-foreground" hint="Supporting actions" />
              <TokenSwatch label="muted" swatchClassName="bg-muted text-muted-foreground" hint="Subtle fills" />
              <TokenSwatch label="accent" swatchClassName="bg-accent text-accent-foreground" hint="Highlights" />
              <TokenSwatch label="destructive" swatchClassName="bg-destructive text-destructive-foreground" hint="Danger" />
              <TokenSwatch label="success" swatchClassName="bg-success text-success-foreground" hint="Positive system state" />
              <TokenSwatch label="warning" swatchClassName="bg-warning text-warning-foreground" hint="Attention" />
              <TokenSwatch label="info" swatchClassName="bg-info text-info-foreground" hint="Informational" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand primary ramp (CSS variables)</CardTitle>
              <CardDescription>Raw steps for illustrations and data viz — prefer semantic tokens for UI chrome.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-11">
              {(
                [
                  "50",
                  "100",
                  "200",
                  "300",
                  "400",
                  "500",
                  "600",
                  "700",
                  "800",
                  "900",
                  "950",
                ] as const
              ).map((step) => (
                <div key={step} className="space-y-1 text-center">
                  <div
                    className="h-14 rounded-md border border-border/60 shadow-[var(--shadow-proc-xs)]"
                    style={{ background: `var(--brand-primary-${step})` }}
                  />
                  <Small className="text-muted-foreground">{step}</Small>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shape" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Radius scale</CardTitle>
              <CardDescription>Tailwind <code className="font-mono">rounded-*</code> mapped to <code className="font-mono">--radius</code> derivatives.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              {(["rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-full"] as const).map((r) => (
                <div key={r} className="flex flex-col items-center gap-2">
                  <div className={cn("size-16 border-2 border-primary/40 bg-accent/40", r)} />
                  <Small className="text-muted-foreground">{r}</Small>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Procertus elevation</CardTitle>
              <CardDescription>Shadow tokens from the default theme (<code className="font-mono">--shadow-proc-*</code>).</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(["xs", "sm", "md", "lg"] as const).map((tier) => (
                <div
                  key={tier}
                  className="rounded-xl border border-border bg-card p-4 text-sm text-card-foreground"
                  style={{ boxShadow: `var(--shadow-proc-${tier})` }}
                >
                  <p className="font-medium">shadow-proc-{tier}</p>
                  <Muted className="mt-1">Elevation preview</Muted>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inputs & toggles</CardTitle>
              <CardDescription><code className="font-mono">Field</code> + primitives for dense forms.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="max-w-md gap-6">
                <Field>
                  <FieldLabel htmlFor="ds-email">Work email</FieldLabel>
                  <FieldContent>
                    <Input id="ds-email" type="email" placeholder="you@procertus.example" autoComplete="off" />
                    <FieldDescription>Uses <code className="font-mono">border-input</code> and focus ring tokens.</FieldDescription>
                  </FieldContent>
                </Field>
                <Separator />
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="ds-notify">Product alerts</FieldLabel>
                  <Switch id="ds-notify" defaultChecked />
                </Field>
                <Field orientation="horizontal">
                  <div className="flex items-center gap-3">
                    <Checkbox id="ds-terms" defaultChecked />
                    <Label htmlFor="ds-terms" className="font-normal">
                      Remember workspace layout
                    </Label>
                  </div>
                </Field>
                <Field>
                  <FieldLabel>Completion</FieldLabel>
                  <FieldContent className="gap-3">
                    <Progress value={62} />
                    <Slider defaultValue={[38]} max={100} aria-label="Demo slider" />
                  </FieldContent>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
