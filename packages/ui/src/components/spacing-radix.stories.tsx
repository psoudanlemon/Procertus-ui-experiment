import * as React from "react";
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
 * Read spacing tokens from the live stylesheet
 *
 * Walks document.styleSheets to find both the base selector rule and its
 * @media (min-width: 768px) override, so the table always reflects the
 * current source of truth in default.css.
 * ------------------------------------------------------------------------- */

const SPACING_ROLES = [
  "micro",
  "component",
  "section",
  "region",
  "boundary",
] as const;

type SpacingRole = (typeof SPACING_ROLES)[number];
type ResolvedTokens = Record<SpacingRole, { mobile: string; desktop: string }>;

const remToPx = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.endsWith("rem")) {
    return `${Math.round(parseFloat(trimmed) * 16)}px`;
  }
  return trimmed;
};

function readSpacingFromStyleSheets(targetSelector: string): ResolvedTokens {
  const result = Object.fromEntries(
    SPACING_ROLES.map((role) => [role, { mobile: "", desktop: "" }]),
  ) as ResolvedTokens;

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRule[];
    try {
      rules = Array.from(sheet.cssRules ?? []);
    } catch {
      continue;
    }
    for (const rule of rules) {
      if (
        rule instanceof CSSStyleRule &&
        rule.selectorText === targetSelector
      ) {
        for (const role of SPACING_ROLES) {
          const value = rule.style.getPropertyValue(`--spacing-${role}`);
          if (value) result[role].mobile = remToPx(value);
        }
      } else if (
        rule instanceof CSSMediaRule &&
        rule.conditionText.includes("768px")
      ) {
        for (const inner of Array.from(rule.cssRules)) {
          if (
            inner instanceof CSSStyleRule &&
            inner.selectorText === targetSelector
          ) {
            for (const role of SPACING_ROLES) {
              const value = inner.style.getPropertyValue(`--spacing-${role}`);
              if (value) result[role].desktop = remToPx(value);
            }
          }
        }
      }
    }
  }
  return result;
}

function useSpacingTokens(targetSelector: string): ResolvedTokens {
  const [tokens, setTokens] = React.useState<ResolvedTokens>(() =>
    Object.fromEntries(
      SPACING_ROLES.map((role) => [role, { mobile: "", desktop: "" }]),
    ) as ResolvedTokens,
  );
  React.useEffect(() => {
    setTokens(readSpacingFromStyleSheets(targetSelector));
  }, [targetSelector]);
  return tokens;
}

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
          <strong>Boundary is always larger than region.</strong> The outer page
          frame is the biggest spacing token in the ladder, then region (between
          top-level page blocks), section (inside a card), component (inside a
          primitive), and micro (inside a phrase). Each tier is a clear visual
          step up so the layout hierarchy reads at a glance.
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

const ROLE_INTENT: Record<SpacingRole, { label: string; intent: string }> = {
  micro: {
    label: "Micro",
    intent:
      "Inside a phrase. Icon-to-label gaps, title-to-subtitle, status dot to text.",
  },
  component: {
    label: "Component",
    intent:
      "Inside a single component. Button padding, input padding, icon-to-text gaps inside primitives. Larger on mobile for touch targets.",
  },
  section: {
    label: "Section",
    intent:
      "Inside a section or card. Card padding, gaps between rows in a list, gaps between sibling components arranged in the same panel.",
  },
  region: {
    label: "Region",
    intent:
      "Inside a page region. Vertical rhythm between top-level page blocks (header, stat row, main grid, activity feed).",
  },
  boundary: {
    label: "Boundary",
    intent:
      "The outer page frame. Applied by the app shell to the main content area, page margins, and viewport edges. Pages should not re-apply it.",
  },
};

function buildContextTokens(resolved: ResolvedTokens): ContextToken[] {
  return SPACING_ROLES.map((role) => ({
    role: ROLE_INTENT[role].label,
    mobile: resolved[role].mobile || "—",
    desktop: resolved[role].desktop || resolved[role].mobile || "—",
    intent: ROLE_INTENT[role].intent,
  }));
}

/**
 * **Operational spacing** (professional mode)
 *
 * Quick reference for the staff management console. Dense, efficient,
 * optimised for scanning hundreds of records per session. Values are read
 * live from default.css so this table never goes out of sync with the tokens.
 */
function OperationalSpacingTable() {
  const resolved = useSpacingTokens(":root");
  return (
    <ContextTable
      title="Operational spacing"
      subtitle="Professional mode for internal staff tools. Dense and efficient, optimised for speed and data-density. Element padding increases on mobile to accommodate touch targets."
      tokens={buildContextTokens(resolved)}
    />
  );
}

export const OperationalSpacing: Story = {
  render: () => <OperationalSpacingTable />,
};

/* ---------------------------------------------------------------------------
 * Spacious spacing reference
 * ------------------------------------------------------------------------- */

/**
 * **Spacious spacing** (public mode)
 *
 * Quick reference for the public-facing registry and external documents.
 * Generous gaps create a premium, trustworthy layout where clarity and
 * readability are the priority. Values read live from default.css.
 */
function SpaciousSpacingTable() {
  const resolved = useSpacingTokens('[data-density="spacious"]');
  return (
    <ContextTable
      title="Spacious spacing"
      subtitle="Public mode for the registry and external documents. Generous gaps create a premium, trustworthy layout where clarity, prestige, and readability are the priority."
      tokens={buildContextTokens(resolved)}
    />
  );
}

export const SpaciousSpacing: Story = {
  render: () => <SpaciousSpacingTable />,
};
