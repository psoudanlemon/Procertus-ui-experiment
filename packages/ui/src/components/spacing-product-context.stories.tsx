import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DensityProvider } from "@/components/density-provider";
import { H2 } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Muted } from "@/components/ui/typography";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShieldCheckIcon } from "lucide-react";

/* ---------------------------------------------------------------------------
 * Shared certificate data (identical in both views)
 * ------------------------------------------------------------------------- */

const certificateFields = [
  { label: "Certificate holder", width: "w-48" },
  { label: "Standard", width: "w-36" },
  { label: "Scope", width: "w-64" },
  { label: "Certification body", width: "w-40" },
  { label: "Issue date", width: "w-28" },
  { label: "Expiry date", width: "w-28" },
  { label: "Certificate number", width: "w-44" },
  { label: "Audit cycle", width: "w-32" },
];

/* ---------------------------------------------------------------------------
 * Spacious view: public registry, airy and trustworthy
 * ------------------------------------------------------------------------- */

function SpaciousView() {
  return (
    <DensityProvider density="spacious">
      <div className="mx-auto max-w-3xl p-boundary">
        {/* Page header */}
        <div className="mb-section flex items-center gap-element">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <ShieldCheckIcon className="size-6 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>

        {/* Status banner */}
        <Card className="mb-section border-success/30 bg-success/5">
          <CardContent className="flex items-center gap-element">
            <Badge variant="success">Active</Badge>
            <Skeleton className="h-3 w-56" />
          </CardContent>
        </Card>

        {/* Certificate detail card: spacing driven by density context */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-1 h-3 w-72" />
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="flex flex-col gap-element">
              {certificateFields.map((field) => (
                <div key={field.label} className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {field.label}
                  </span>
                  <Skeleton className={`h-4 ${field.width}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spacing annotation */}
        <div className="mt-boundary rounded-lg border border-dashed border-primary/30 bg-primary/5 p-element">
          <p className="text-xs font-medium text-primary">Spacious spacing</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Internal card padding: 12px. Vertical field gaps: 12px. Page margins:
            24px. Optimized for trust, readability, and a premium feel for
            public-facing registry visitors.
          </p>
        </div>
      </div>
    </DensityProvider>
  );
}

/* ---------------------------------------------------------------------------
 * Operational view: management console, dense and efficient
 * ------------------------------------------------------------------------- */

function OperationalView() {
  return (
    <DensityProvider density="operational">
      <div className="p-boundary">
        {/* Compact page header */}
        <div className="mb-component flex items-center gap-element">
          <ShieldCheckIcon className="size-4 text-primary" />
          <Skeleton className="h-5 w-48" />
          <Badge variant="success" className="ml-auto">Active</Badge>
        </div>

        {/* Two-column dense layout: spacing driven by density context */}
        <div className="grid gap-component lg:grid-cols-2">
          {/* Left column */}
          <Card>
            <CardContent>
              <div className="flex flex-col gap-element">
                {certificateFields.slice(0, 4).map((field) => (
                  <div key={field.label} className="flex items-center gap-element">
                    <span className="w-32 shrink-0 text-xs text-muted-foreground">
                      {field.label}
                    </span>
                    <Skeleton className="h-3.5 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right column */}
          <Card>
            <CardContent>
              <div className="flex flex-col gap-element">
                {certificateFields.slice(4).map((field) => (
                  <div key={field.label} className="flex items-center gap-element">
                    <span className="w-32 shrink-0 text-xs text-muted-foreground">
                      {field.label}
                    </span>
                    <Skeleton className="h-3.5 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spacing annotation */}
        <div className="mt-section rounded-lg border border-dashed border-primary/30 bg-primary/5 p-component">
          <p className="text-xs font-medium text-primary">Operational spacing</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Internal card padding: 8px. Vertical field gaps: 8px. Page margins:
            16px. Multi-column layout maximizes screen real estate for staff
            workflows.
          </p>
        </div>
      </div>
    </DensityProvider>
  );
}

/* ---------------------------------------------------------------------------
 * Story
 * ------------------------------------------------------------------------- */

/**
 * **Product context: density as a design tool**
 *
 * The same certificate data rendered through two spacing strategies:
 *
 * - **Spacious** (public registry): 16px padding, 16px gaps, generous margins.
 *   Airy, trustworthy, premium.
 * - **Operational** (management console): 8px padding, 8px gaps, multi-column.
 *   Dense, efficient, scannable.
 *
 * This is the north star for spacing decisions at Procertus: density serves
 * different user needs. Trust for the public, efficiency for the staff.
 */
const meta: Meta = {
  title: "Applied Guidelines/Spacing",
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Side-by-side view: the same data, two density strategies.
 */
export const Duality: Story = {
  render: () => (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="border-r border-border bg-background">
        <div className="border-b border-border bg-muted/50 px-4 py-2">
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            Spacious: public registry
          </span>
        </div>
        <SpaciousView />
      </div>
      <div className="bg-background">
        <div className="border-b border-border bg-muted/50 px-4 py-2">
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            Operational: management console
          </span>
        </div>
        <OperationalView />
      </div>
    </div>
  ),
};
