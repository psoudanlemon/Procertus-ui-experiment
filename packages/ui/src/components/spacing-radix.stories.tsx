import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { H2 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";
import type { Meta, StoryObj } from "@storybook/react-vite";

/* ---------------------------------------------------------------------------
 * Scale story row (raw multiplier table)
 * ------------------------------------------------------------------------- */

type ScaleToken = {
  name: string;
  value: number;
};

const ScaleRow = ({ value, name }: ScaleToken) => {
  const style = window.getComputedStyle(document.body);
  const size = style.getPropertyValue("--spacing");
  const rem = parseFloat(size) * value;
  const pixels = parseFloat(size) * 16 * value;
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{name}</TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {pixels}px
      </TableCell>
      <TableCell className="w-full">
        <div className="flex items-center gap-3">
          <div
            className="h-4 shrink-0 rounded-sm bg-primary"
            style={{ width: pixels }}
          />
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
            {rem}rem
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
};

/* ---------------------------------------------------------------------------
 * Context-specific spacing reference
 * ------------------------------------------------------------------------- */

type ContextToken = {
  role: string;
  mobile: string;
  desktop: string;
  intent: string;
};

const ContextRow = ({ role, mobile, desktop, intent }: ContextToken) => (
  <TableRow>
    <TableCell>
      <Badge
        variant="outline"
        className="font-medium normal-case tracking-normal"
      >
        {role}
      </Badge>
    </TableCell>
    <TableCell className="font-mono text-xs text-muted-foreground">
      {desktop}
    </TableCell>
    <TableCell className="font-mono text-xs text-muted-foreground">
      {mobile}
    </TableCell>
    <TableCell className="text-xs text-muted-foreground">{intent}</TableCell>
  </TableRow>
);

function ContextTable({
  title,
  subtitle,
  tokens,
}: {
  title: string;
  subtitle: string;
  tokens: ContextToken[];
}) {
  return (
    <div>
      <header className="mb-6">
        <H2>{title}</H2>
        <Muted className="mt-2 max-w-2xl text-base">{subtitle}</Muted>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Desktop (&ge;768px)</TableHead>
            <TableHead>Mobile (&lt;768px)</TableHead>
            <TableHead>Intent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => (
            <ContextRow key={token.role} {...token} />
          ))}
        </TableBody>
      </Table>
      <div className="mt-6 rounded-xl border-2 border-brand-primary-200 dark:border-brand-primary-800 bg-brand-primary-50 dark:bg-brand-primary-950 p-4">
        <p className="text-sm text-brand-primary-700 dark:text-brand-primary-300 leading-[1.6] m-0">
          <strong>Boundary is always 20px on mobile</strong> across both
          systems, ensuring a consistent, safe-area-compliant frame on every
          device. On desktop, the values diverge to match each context's density
          strategy.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Meta
 * ------------------------------------------------------------------------- */

/**
 * Spacing foundations for the Procertus design system.
 *
 * The scale uses 4px increments. Each step has an intent-based role
 * that describes *what the space does*, not which density mode it
 * belongs to. The role name stays the same across contexts; only the
 * resolved pixel value shifts between Operational and Spacious mode.
 */
const meta: Meta = {
  title: "design tokens/Spacing",
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------------------
 * Scale foundations story
 * ------------------------------------------------------------------------- */

const scaleTokens: ScaleToken[] = [
  { name: "x-1", value: 1 },
  { name: "x-2", value: 2 },
  { name: "x-3", value: 3 },
  { name: "x-4", value: 4 },
  { name: "x-5", value: 5 },
  { name: "x-6", value: 6 },
  { name: "x-7", value: 7 },
  { name: "x-8", value: 8 },
  { name: "x-9", value: 9 },
  { name: "x-10", value: 10 },
  { name: "x-12", value: 12 },
  { name: "x-14", value: 14 },
  { name: "x-16", value: 16 },
  { name: "x-20", value: 20 },
  { name: "x-24", value: 24 },
  { name: "x-28", value: 28 },
  { name: "x-32", value: 32 },
  { name: "x-36", value: 36 },
  { name: "x-40", value: 40 },
  { name: "x-48", value: 48 },
  { name: "x-56", value: 56 },
  { name: "x-64", value: 64 },
  { name: "x-72", value: 72 },
  { name: "x-80", value: 80 },
];

/**
 * The full multiplier scale for reference.
 */
export const ScaleFoundations: Story = {
  render: () => (
    <div>
      <header className="mb-6">
        <H2>Scale foundations</H2>
        <Muted className="mt-2 max-w-2xl text-base">
          The full spacing multiplier scale available for padding, margins, gaps,
          and layout rhythm.
        </Muted>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="hidden sm:table-cell">
              <span className="sr-only">Preview</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scaleTokens.map((token) => (
            <ScaleRow key={token.name} {...token} />
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

/* ---------------------------------------------------------------------------
 * Operational spacing reference
 * ------------------------------------------------------------------------- */

const operationalTokens: ContextToken[] = [
  { role: "Micro", mobile: "4px", desktop: "4px", intent: "The glue. Icon-to-text gaps and micro-grouping." },
  { role: "Element", mobile: "12px", desktop: "8px", intent: "Primary component padding. Larger on mobile for touch targets." },
  { role: "Component", mobile: "8px", desktop: "12px", intent: "Relationship gap between related elements or form fields." },
  { role: "Section", mobile: "12px", desktop: "16px", intent: "Structural separation between distinct blocks of data." },
  { role: "Region", mobile: "20px", desktop: "32px", intent: "Major breaks. The largest internal gap between UI sections." },
  { role: "Boundary", mobile: "20px", desktop: "16px", intent: "Outer frame. Page margins and viewport edges." },
];

/**
 * **Operational spacing** (professional mode)
 *
 * Quick reference for the staff management console. Dense, efficient,
 * optimised for scanning hundreds of records per session. Element padding
 * increases on mobile to accommodate touch targets.
 */
export const OperationalSpacing: Story = {
  render: () => (
    <ContextTable
      title="Operational spacing"
      subtitle="Professional mode for internal staff tools. Dense and efficient, optimised for speed and data-density. Element padding increases on mobile to accommodate touch targets."
      tokens={operationalTokens}
    />
  ),
};

/* ---------------------------------------------------------------------------
 * Spacious spacing reference
 * ------------------------------------------------------------------------- */

const spaciousTokens: ContextToken[] = [
  { role: "Micro", mobile: "8px", desktop: "8px", intent: "The glue. Icon-to-text gaps and micro-grouping." },
  { role: "Element", mobile: "16px", desktop: "12px", intent: "Primary component padding. Generous breath for trust and readability." },
  { role: "Component", mobile: "12px", desktop: "16px", intent: "Relationship gap between related elements or form fields." },
  { role: "Section", mobile: "16px", desktop: "24px", intent: "Structural separation between distinct blocks of data." },
  { role: "Region", mobile: "24px", desktop: "48px", intent: "Major breaks. Premium breathing room between UI sections." },
  { role: "Boundary", mobile: "20px", desktop: "24px", intent: "Outer frame. Page margins and viewport edges." },
];

/**
 * **Spacious spacing** (public mode)
 *
 * Quick reference for the public-facing registry and external documents.
 * Generous gaps create a premium, trustworthy layout where clarity and
 * readability are the priority.
 */
export const SpaciousSpacing: Story = {
  render: () => (
    <ContextTable
      title="Spacious spacing"
      subtitle="Public mode for the registry and external documents. Generous gaps create a premium, trustworthy layout where clarity, prestige, and readability are the priority."
      tokens={spaciousTokens}
    />
  ),
};
