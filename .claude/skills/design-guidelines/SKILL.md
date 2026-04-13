---
name: design-guidelines
description: "Build or refine a Guidelines.mdx documentation page for a design token category (typography, color, radius, spacing, shadow, etc.) in Storybook. Use when creating, editing, or reviewing any Guidelines.mdx file under packages/ui/src/."
argument-hint: "[token category: typography, color, radius, spacing, shadow...]"
user-invocable: true
---

Build or refine a **Guidelines.mdx** page for a design token category. These pages are the single source of truth for how a token category is implemented and used across the Procertus design system.

## Reference Implementation

The Typography guidelines at `packages/ui/src/components/Guidelines.mdx` is the gold standard. Every new guidelines page must match its quality, structure, and tone. Read it before starting.

## Mandatory Preparation

Before writing or editing a guidelines page:

1. **Read the reference**: `packages/ui/src/components/Guidelines.mdx` — absorb the structure, tone, and patterns.
2. **Audit the implementation**: Read `packages/ui/src/styles/themes/default.css` to understand what tokens exist for this category.
3. **Audit the components**: Grep for how shadcn primitives (Button, Label, Table, Badge, Input, Sidebar, etc.) use the relevant CSS properties. Record exact classes.
4. **Identify discrepancies**: Compare what the docs say vs what the code does. The code is truth — the docs must match.

---

## Page Structure

Every guidelines page follows this exact skeleton. Each element is described with its precise markup pattern.

### 1. Hero Section

The hero sits at the top of the page, outside any section wrapper.

```tsx
<div className="mb-12">
  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-primary-500 m-0 mb-3">
    PROCERTUS Design Guidelines
  </p>
  <h1 className="font-sans font-bold text-foreground m-0 mb-4"
      style={{ fontSize: '1.875rem', lineHeight: 1.2, letterSpacing: '-0.03em' }}>
    {Category Name}
  </h1>
  <p className="text-lg text-muted-foreground leading-[1.6] m-0 max-w-[680px]">
    1-2 sentence philosophy statement explaining *why* this token category
    matters for cognitive load / usability. Reference the frame vs content
    distinction where relevant.
  </p>
</div>
```

Key rules:
- The page title uses **inline style** for font-size — never Tailwind heading classes (Storybook MDX overrides `<h1>`-`<h6>`)
- Philosophy paragraph is capped at `max-w-[680px]` for comfortable reading width
- Use `<strong>` to highlight key concepts in the philosophy statement

### 2. Section Separator + Section Wrapper

Every major section is preceded by an `<hr />` and wrapped in a `<div>` with top margin:

```tsx
<hr />

<div className="mt-16">   {/* first section after hero uses mt-16 */}
  {/* section content */}
</div>

<hr />

<div className="mt-20">   {/* subsequent sections use mt-20 */}
  {/* section content */}
</div>
```

Rules:
- Use `mt-16` for the first section after the hero
- Use `mt-20` for all subsequent sections
- Every section opens with a markdown `##` heading (never JSX `<h2>`)
- Follow the heading with a 1-3 sentence explanation of the *why*

### 3. Concept Cards

Concept cards are the primary way to present two or more facets of a design decision.

**Grid layout**: Use `grid-cols-1 md:grid-cols-2` for two cards, `md:grid-cols-3` for three. Choose the column count that best fits the content.

```tsx
<div className="grid grid-cols-1 md:grid-cols-{2|3} gap-6 mt-6">
  <div className="rounded-xl border border-border bg-card p-6">
    {/* Card content */}
  </div>
</div>
```

**Card anatomy** — every card follows this exact internal structure:

```tsx
<div className="rounded-xl border border-border bg-card p-6">
  {/* 1. Title — always inline style for font-size */}
  <span className="font-semibold text-foreground block"
        style={{ fontSize: '1.5rem' }}>
    Card Title
  </span>

  {/* 2. Subtitle label — uppercase micro-label */}
  <span className="uppercase block mb-3"
        style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
                 color: 'var(--muted-foreground)' }}>
    SUBTITLE
  </span>

  {/* 3. Description paragraph */}
  <p className="text-sm text-muted-foreground m-0"
     style={{ lineHeight: 1.6 }}>
    Description text explaining this facet.
  </p>

  {/* 4. Optional: preview area OR cross-reference links */}
</div>
```

**Highlighted card variant** — use when one card deserves emphasis (e.g., the recommended option):

```tsx
<div className="rounded-xl border-2 border-brand-primary-200 dark:border-brand-primary-800 bg-card p-6">
  {/* Same internal anatomy */}
</div>
```

**Cards with preview area** — some cards include a live preview at the bottom:

```tsx
{/* After the description paragraph: */}
<div className="p-4 rounded-lg bg-muted/50 border border-border flex-1 mt-auto">
  {/* Live component preview */}
</div>
```

When cards contain a preview, add `flex flex-col` to the card wrapper so `mt-auto` pushes the preview to the bottom.

**Cards with cross-reference links** — link to related Storybook stories:

```tsx
{/* After the description paragraph: */}
<div className="flex flex-col items-start gap-3 mt-1">
  <Button variant="link" className="p-0 h-auto text-base font-semibold" asChild>
    <a href="?path=/story/components-button--default">Buttons</a>
  </Button>
  {/* More links... */}
</div>
```

Use `font-semibold` on links when the section topic is bold/semibold weight; omit it for regular weight sections.

### 4. DO / DON'T Examples

DO/DON'T blocks appear under a `### In context` sub-heading within their parent section.

```tsx
### In context

<div className="flex flex-col gap-3 mt-6">
  {/* DO block */}
  <div className="flex gap-6 items-baseline p-6 rounded-xl border border-sys-success-500 bg-sys-success-50 dark:bg-sys-success-950">
    <span className="shrink-0 w-14 text-base font-bold text-sys-success-600 dark:text-sys-success-400">
      DO
    </span>
    <div>
      <p className="m-0 text-base text-foreground">
        One-sentence description of the correct approach.
      </p>
      <div className="mt-3">
        {/* Live example using real components where possible */}
      </div>
    </div>
  </div>

  {/* DON'T block */}
  <div className="flex gap-6 items-baseline p-6 rounded-xl border border-sys-destructive-500 bg-sys-destructive-50 dark:bg-sys-destructive-950">
    <span className="shrink-0 w-14 text-base font-bold text-sys-destructive-600 dark:text-sys-destructive-400">
      DON'T
    </span>
    <div>
      <p className="m-0 text-base text-foreground">
        One-sentence description of the anti-pattern.
      </p>
      <div className="mt-3">
        {/* Bad example — use line-through and/or opacity to visually mark as wrong */}
      </div>
    </div>
  </div>
</div>
```

Rules:
- Always use `### In context` as the sub-heading
- Prefer real component renders inside the example area
- Mark DON'T examples visually: `line-through decoration-sys-destructive-400/50` and/or `opacity-60`
- Multiple DO/DON'T blocks can appear in the same `flex flex-col gap-3` wrapper

### 5. Callout Boxes

Three callout variants exist. Use the appropriate one:

**Brand callout** — for brand-specific rules (e.g., "PROCERTUS is always uppercase"):

```tsx
<div className="mt-6 rounded-xl border-2 border-brand-primary-200 dark:border-brand-primary-800 bg-brand-primary-50 dark:bg-brand-primary-950 p-6">
  <h4 className="font-sans text-base font-bold text-brand-primary-800 dark:text-brand-primary-200 m-0 mb-3">
    Rule title
  </h4>
  <p className="text-base text-brand-primary-700 dark:text-brand-primary-300 leading-[1.6] m-0">
    Explanation.
  </p>
</div>
```

**Warning callout** — for critical constraints (e.g., "Never uppercase more than two words"):

```tsx
<div className="mt-8 rounded-xl border-2 border-sys-warning-300 dark:border-sys-warning-700 bg-sys-warning-50 dark:bg-sys-warning-950 p-6">
  <h4 className="font-sans text-base font-bold text-sys-warning-800 dark:text-sys-warning-200 m-0 mb-3">
    Constraint title
  </h4>
  <p className="text-base text-sys-warning-700 dark:text-sys-warning-300 leading-[1.6] m-0 mb-4">
    Explanation.
  </p>
  {/* Optional: inline examples grid showing acceptable vs unacceptable */}
</div>
```

**Muted info callout** — for supplementary notes (e.g., "All uppercase elements use +0.05em letter-spacing"):

```tsx
<div className="mt-6 rounded-xl border border-border bg-muted/30 p-6">
  <p className="text-base text-muted-foreground leading-[1.6] m-0">
    Supplementary note. Use <strong>bold</strong> for key values.
  </p>
</div>
```

### 6. Blockquotes

Use markdown blockquotes sparingly for golden rules — short, memorable summaries of a key principle:

```markdown
> If text describes the *frame*, uppercase it.
> If text describes the *content inside the frame*, leave it in sentence case.
```

Place immediately after the concept cards they summarize, before any callout or sub-section.

### 7. Reference Table

Every page needs at least one comprehensive reference table showing exact values and live previews. Column structure varies by token category.

Typography example columns: Element, Line Height, Weight, Case, Size, Preview.
Color example columns: Token, Value, Usage, Preview swatch.
Spacing example columns: Token, Value, Context, Preview.

```tsx
<div className="mt-6">
  <Table className="rounded-xl overflow-hidden">
    <TableHeader>
      <TableRow>
        <TableHead>Column A</TableHead>
        {/* ... */}
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell className="font-bold">Row label</TableCell>
        <TableCell className="text-muted-foreground">Value</TableCell>
        {/* Preview cell with real component or inline-styled element */}
      </TableRow>
    </TableBody>
  </Table>
</div>
```

Rules:
- First column (element/token name) is always `font-bold`
- Value columns use `text-muted-foreground`
- Preview column renders real components or inline-styled elements
- Follow the table with a muted info callout if there is a universal rule to highlight

### 8. For Developers Box

Always the last element on the page. Separated by `<hr className="page-end" />` with generous top margin:

```tsx
<hr className="page-end" />

<div className="rounded-xl border border-border bg-muted/30 p-6"
     style={{ marginTop: '5rem' }}>
  <h4 className="font-sans text-base font-bold text-foreground m-0 mb-3">
    For Developers
  </h4>
  <p className="text-base text-muted-foreground leading-[1.6] m-0">
    Every rule on this page is <strong>already encoded in the component library</strong>.
    {/* List which components handle the transformation automatically */}
    Write text in natural case. The components handle the visual transformation.
    Do not manually override these defaults.
  </p>
</div>
```

---

## Tone & Voice

- **Authoritative but practical**: explain the *why* behind every rule, grounded in UX research or cognitive load theory
- **Data-dense platform mindset**: Procertus is a certification management platform. Professionals scan data. Every decision serves scanning velocity
- **Concise**: no filler. Each sentence earns its place. If a paragraph can be one sentence, make it one sentence
- **Prescriptive**: use "do / don't", not "consider / might want to". These are rules, not suggestions

---

## Technical Constraints (Critical)

These are hard-won lessons from the Typography page. Follow them exactly:

### Storybook MDX Overrides
- **NEVER use `<h1>`-`<h6>` for preview text.** Storybook's MDX addon replaces heading elements with its own styled components, stripping inline styles. Use `<p>` or `<span>` with inline `style` instead.
- **NEVER rely on Tailwind utility classes for font-size, font-weight, or letter-spacing in preview elements.** Storybook's docs CSS can override them. Use inline `style={{ fontSize: '...', fontWeight: ... }}` for all preview text inside tables and cards.
- **Tailwind classes that DO work reliably in MDX**: layout (`flex`, `grid`, `gap-*`, `p-*`, `m-*`, `rounded-*`), color (`text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`), display (`uppercase`, `line-through`).
- **Markdown headings (`##`, `###`) are fine for section structure** — these are intentionally styled by Storybook. Only avoid JSX heading elements for preview/demo text.

### Component Previews
- **Real components** (Button, Label, Input, TableHead, Badge, H1-H4) render correctly because they encapsulate their own styles. Always prefer rendering actual components over mimicking their styles with inline CSS.
- **For non-component previews** (body text, metadata, badge-like spans), always use inline styles for typography properties.

### Tables
- Always add `className="rounded-xl overflow-hidden"` to `<Table>`.
- Import Table components from `@/components/ui/table`.

### Colors
- Use semantic colors: `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`
- Brand accent: `text-brand-primary-500`, `border-brand-primary-200 dark:border-brand-primary-800`
- System colors for DO/DON'T: `sys-success-*` (green), `sys-destructive-*` (red), `sys-warning-*` (amber)
- Always include `dark:` variants for brand and system color backgrounds/borders

### Spacing
- Section gaps: `mt-16` for the first section after hero, `mt-20` for subsequent sections
- Content gaps: `mt-6` between subsections and after headings
- Card gaps: `gap-6` in grids
- DO/DON'T block gaps: `gap-3` in the flex column wrapper
- Callout top margins: `mt-6` for muted/brand, `mt-8` for warning
- For Developers box: `style={{ marginTop: '5rem' }}`

---

## Meta Tag

Place the page in the Storybook sidebar under design tokens:

```
<Meta title="design tokens/{Category}/Guidelines" />
```

## Imports

Standard imports for every guidelines page:

```tsx
import { Meta } from "@storybook/addon-docs/blocks";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
```

Add additional component imports as needed for the token category (e.g., `H1, H2, H3, H4` from `@/components/ui/heading` for typography).

---

## Checklist Before Finishing

- [ ] Every token value documented matches `default.css` exactly
- [ ] Every component class documented matches the actual component source
- [ ] All preview elements use inline styles (not Tailwind) for typography
- [ ] All tables have `rounded-xl overflow-hidden`
- [ ] DO/DON'T examples use real components where possible
- [ ] DON'T examples are visually marked (line-through and/or opacity)
- [ ] No `<h1>`-`<h6>` tags used for preview text
- [ ] All callout boxes include `dark:` color variants
- [ ] Cards follow the exact anatomy: title (1.5rem inline), subtitle (uppercase 12px), description, optional preview/links
- [ ] Sections are wrapped in `<div className="mt-{16|20}">` with `<hr />` separators
- [ ] Page has a "For Developers" closing box after `<hr className="page-end" />`
- [ ] Meta title follows `design tokens/{Category}/Guidelines` pattern
- [ ] Cross-reference links use `<Button variant="link">` pointing to Storybook stories
