---
name: design-guidelines
description: "Build or refine a Guidelines.mdx documentation page for a design token category (typography, color, radius, spacing, shadow, etc.) in Storybook. Use when creating, editing, or reviewing any Guidelines.mdx file under packages/ui/src/."
argument-hint: "[token category: typography, color, radius, spacing, shadow...]"
user-invocable: true
---

Build or refine a **Guidelines.mdx** page for a design token category. These pages are the single source of truth for how a token category is implemented and used across the Procertus design system.

## Existing pages

Read at least two of these before writing a new page to absorb the voice and rhythm:

| Category | Path | Notable patterns |
|----------|------|-----------------|
| Typography | `packages/ui/src/components/Guidelines.mdx` | DO/DON'T blocks, reference table, cross-reference links |
| Color | `packages/ui/src/showcase/ColorGuidelines.mdx` | Comparison blocks, system-color left-border cards, beacon principle |
| Gradient | `packages/ui/src/components/GradientGuidelines.mdx` | Evolution/progression blocks, concise page, no reference table |
| Radius | `packages/ui/src/showcase/RadiusGuidelines.mdx` | Numbered sections, optical scaling table, kinetic pairing |
| Spacing | `packages/ui/src/components/spacing-guidelines.mdx` | Skeleton wireframe demo, density system, accordion metaphor |
| Iconography | `packages/ui/src/design-tokens/Iconography/Guidelines.mdx` | Numbered sections, h4-style card headings, plain anchor links |

## Mandatory preparation

Before writing or editing a guidelines page:

1. **Read at least two existing pages** from the table above to absorb structure, tone, and patterns.
2. **Audit the implementation**: Read `packages/ui/src/styles/themes/default.css` to understand what tokens exist for this category.
3. **Audit the components**: Grep for how shadcn primitives (Button, Label, Table, Badge, Input, Sidebar, etc.) use the relevant CSS properties. Record exact classes.
4. **Identify discrepancies**: Compare what the docs say vs what the code does. The code is truth; the docs must match.

---

## Narrative philosophy

Guidelines pages are not reference tables with pretty formatting. They are **persuasive narratives** that teach a reader *why* each decision was made and *how* it connects to the broader design language. Every page follows a deliberate arc:

1. **Open with the "not decoration" motif.** Nearly every page begins by stating what the token is NOT (decorative, arbitrary, a checklist) before defining what it IS (a functional signal, structural intent, a language).
2. **Give each section an evocative name.** Not "Dark mode colors" but "The beacon principle." Not "Responsive spacing" but "The accordion system." Not "Gradient types" but "The mesh methodology." These names make the system memorable and speakable.
3. **Use real-world analogies.** A dark car on a sunlit street. A machined edge. Checkmark DNA. These ground abstract token decisions in physical intuition so readers internalize the reasoning, not just the rule.
4. **Thread core concepts across sections.** The "frame vs content" distinction, the idea of "cognitive load reduction," and the "brand DNA" thread should surface wherever relevant, creating conceptual continuity.
5. **End each section with a bridge.** The last paragraph or callout should create momentum toward the next section: "With the functional roles defined... we can now address how this adapts when the lights go out."

---

## Page structure

Every guidelines page follows this skeleton. Each element is described with its precise markup pattern.

### 1. Hero section

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
    Philosophy statement. Start with what this token is NOT,
    then define what it IS and why it matters for the platform.
    Use <strong>bold</strong> for key concepts and <em>italics</em>
    for the "so what" moment.
  </p>
</div>
```

Key rules:
- The page title uses **inline style** for font-size, never Tailwind heading classes (Storybook MDX overrides `<h1>`-`<h6>`)
- Philosophy paragraph is capped at `max-w-[680px]` for comfortable reading width
- Open with the "not decoration" motif: "Gradients at PROCERTUS are not decoration. They are a functional signal..."

### 2. Section separator + section wrapper

Every major section is preceded by an `<hr />` and wrapped in a `<div>` with top margin:

```tsx
<hr />

<div className="mt-16">   {/* first section after hero uses mt-16 */}
  ## The evocative section name

  1-3 sentence explanation of *why* before any visual content.

  {/* cards, examples, callouts */}
</div>

<hr />

<div className="mt-20">   {/* subsequent sections use mt-20 */}
  ## Next section

  {/* content */}
</div>
```

Rules:
- Use `mt-16` for the first section after the hero
- Use `mt-20` for all subsequent sections
- Every section opens with a markdown `##` heading (never JSX `<h2>`)
- **Optional numbering**: Use `## 01. The blueprint radius` style when sections form a strict sequence (Radius, Iconography). Omit numbers when sections are thematic layers (Color, Typography, Spacing).
- Follow the heading with a 1-3 sentence explanation of the *why*, either as markdown body text or as a `<p className="text-base text-muted-foreground leading-[1.6] m-0 max-w-[680px]">` paragraph

### 3. Concept cards

Concept cards present two or more facets of a design decision.

**Grid layout**: Use `grid-cols-1 md:grid-cols-2` for two cards, `md:grid-cols-3` for three. Choose the column count that best fits the content.

**Stack layout**: When mixing different card types or when cards vary significantly in height, use `flex flex-col` with a gap value instead of grid:

```tsx
<div className="flex flex-col mt-6" style={{ gap: '24px' }}>
  {/* Mixed content: cards, callouts, grids */}
</div>
```

**Card anatomy** - the standard internal structure:

```tsx
<div className="rounded-xl border border-border bg-card p-6">
  {/* 1. Title - always inline style for font-size */}
  <span className="font-semibold text-foreground block"
        style={{ fontSize: '1.5rem' }}>
    Card Title
  </span>

  {/* 2. Subtitle label - uppercase micro-label */}
  <span className="uppercase block mb-3"
        style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
                 color: 'var(--muted-foreground)', marginTop: '8px' }}>
    SUBTITLE
  </span>

  {/* 3. Description paragraph */}
  <p className="text-sm text-muted-foreground m-0"
     style={{ lineHeight: 1.6 }}>
    Description text explaining this facet.
  </p>

  {/* 4. Optional: preview area, cross-reference links, or color swatch */}
</div>
```

**Alternative card anatomy** - for simpler cards where a bold h4 heading suffices (used in Iconography):

```tsx
<div className="rounded-xl border border-border bg-card p-6">
  <h4 className="font-sans text-base font-bold text-foreground m-0 mb-3">Card title</h4>
  <p className="text-sm text-muted-foreground leading-[1.6] m-0">
    Description text.
  </p>
</div>
```

**Highlighted card variant** - for the recommended or primary option:

```tsx
<div className="rounded-xl border-2 border-brand-primary-200 dark:border-brand-primary-800 bg-card p-6">
  {/* Same internal anatomy */}
</div>
```

**Accent-highlighted card variant** - for secondary emphasis (differentiation, interaction-related):

```tsx
<div className="rounded-xl border-2 border-brand-accent-200 dark:border-brand-accent-800 bg-card p-6">
  {/* Same internal anatomy */}
</div>
```

**System-color left-border card** - for semantic status categories (success, warning, destructive, info):

```tsx
<div className="rounded-xl border-l-4 bg-sys-success-50 dark:bg-sys-success-950 p-6"
     style={{ borderLeftColor: 'var(--sys-success-500)' }}>
  <span className="font-semibold text-sys-success-900 dark:text-sys-success-100 block"
        style={{ fontSize: '1.5rem' }}>Success</span>
  <span className="uppercase text-sys-success-700 dark:text-sys-success-300 block mb-3"
        style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginTop: '8px' }}>
    Confirmed
  </span>
  <p className="text-sm text-sys-success-800 dark:text-sys-success-200 m-0 mb-3"
     style={{ lineHeight: 1.6 }}>
    Description using domain-specific examples.
  </p>
</div>
```

**Cards with preview area** - live preview at the bottom:

```tsx
{/* After the description paragraph: */}
<div className="p-4 rounded-lg bg-muted/50 border border-border flex-1 mt-auto">
  {/* Live component preview */}
</div>
```

When cards contain a preview, add `flex flex-col` to the card wrapper so `mt-auto` pushes the preview to the bottom.

**Cards with cross-reference links** - link to related Storybook stories:

```tsx
{/* After the description paragraph: */}
<div className="flex flex-col items-start gap-3 mt-1">
  <Button variant="link" className="p-0 h-auto text-base font-semibold" asChild>
    <a href="?path=/story/components-button--default">Buttons</a>
  </Button>
</div>
```

### 4. Comparison blocks

Show the PROCERTUS approach alongside a generic or rejected alternative. The rejected option appears at reduced opacity:

```tsx
<div className="flex flex-col gap-6 mt-6">
  <div className="rounded-xl border-2 border-brand-primary-200 dark:border-brand-primary-800 bg-card p-6">
    {/* Our approach - full opacity, highlighted border */}
    <span className="font-semibold text-foreground block" style={{ fontSize: '1.5rem' }}>Our approach</span>
    {/* ... */}
  </div>
  <div className="rounded-xl border border-border bg-card p-6" style={{ opacity: 0.5 }}>
    {/* Generic/rejected approach - dimmed */}
    <span className="font-semibold text-foreground block" style={{ fontSize: '1.5rem' }}>Every other platform</span>
    {/* ... */}
  </div>
</div>
```

### 5. Progression/evolution blocks

Show how a design decision evolved through iterations. Each step builds on the previous. The final step gets the highlighted border:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
  <div className="rounded-xl border border-border bg-card p-6">
    <span className="font-semibold text-foreground block" style={{ fontSize: '1.25rem', opacity: 0.75 }}>Step name</span>
    <span className="uppercase block mb-3" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--muted-foreground)', marginTop: '8px', opacity: 0.75 }}>Step 1</span>
    {/* Visual preview + brief explanation */}
  </div>
  {/* Step 2 at opacity 0.85 */}
  <div className="rounded-xl border-2 border-brand-primary-200 dark:border-brand-primary-800 bg-card p-6">
    {/* Final step at full opacity, highlighted */}
    <span className="font-semibold text-foreground block" style={{ fontSize: '1.25rem' }}>What we chose</span>
    <span className="uppercase block mb-3" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--muted-foreground)', marginTop: '8px' }}>What we chose</span>
    {/* ... */}
  </div>
</div>
```

### 6. DO / DON'T examples

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
        {/* Bad example - use line-through and/or opacity to visually mark as wrong */}
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

### 7. Callout boxes

Three callout variants exist. Use the appropriate one:

**Brand callout** - for brand-specific rules (e.g., "PROCERTUS is always uppercase"):

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

**Warning callout** - for critical constraints (e.g., "One gradient per view"):

```tsx
<div className="mt-8 rounded-xl border-2 border-sys-warning-300 dark:border-sys-warning-700 bg-sys-warning-50 dark:bg-sys-warning-950 p-6">
  <h4 className="font-sans text-base font-bold text-sys-warning-800 dark:text-sys-warning-200 m-0 mb-3">
    Constraint title. Written as a short imperative.
  </h4>
  <p className="text-base text-sys-warning-700 dark:text-sys-warning-300 leading-[1.6] m-0">
    Explanation of *why* this constraint exists. Ground it in a consequence.
  </p>
</div>
```

**Muted info callout** - for supplementary notes and links to interactive stories:

```tsx
<div className="mt-6 rounded-xl border border-border bg-muted/30 p-6">
  <p className="text-base text-muted-foreground leading-[1.6] m-0">
    Supplementary note. Use <strong>bold</strong> for key values.
  </p>
  <Button variant="link" className="p-0 h-auto text-sm" asChild>
    <a href="?path=/story/design-tokens-category--story-name">View the tokens</a>
  </Button>
</div>
```

### 8. Blockquotes

Use markdown blockquotes sparingly for golden rules, short, memorable summaries of a key principle:

```markdown
> If text describes the *frame*, uppercase it.
> If text describes the *content inside the frame*, leave it in sentence case.
```

Place immediately after the concept cards they summarize, before any callout or sub-section.

### 9. Reference table (optional)

Not every page needs a reference table. Use one when the token category has a discrete set of named values with specific properties (typography scale, radius tokens, spacing tokens). Skip it when the page is more conceptual (gradient philosophy, iconography rationale).

When included, column structure varies by token category:

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

### 10. Skeleton wireframe examples

For layout-oriented tokens (spacing, density), use Skeleton components to demonstrate spatial relationships without distracting with real content:

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<div className="rounded-xl border border-border bg-card overflow-hidden p-section">
  <div className="flex flex-col gap-micro">
    <Skeleton className="h-5 w-56 rounded" />
    <Skeleton className="h-3 w-80 rounded" />
  </div>
  {/* More skeleton layouts demonstrating spacing tokens in action */}
</div>
```

### 11. Cross-reference links

Two link styles are used. Choose based on context:

**Button variant** - the standard for most cross-references:

```tsx
<Button variant="link" className="p-0 h-auto text-sm" asChild>
  <a href="?path=/story/design-tokens-category--story-name">View the tokens</a>
</Button>
```

**Plain anchor** - for inline links within card content or when multiple links flow as text:

```tsx
<a href="?path=/story/design-tokens-category--story-name"
   className="font-semibold text-brand-primary-700 underline underline-offset-4 hover:text-brand-primary-900">
  Browse the full symbol library
</a>
```

**Arrow links** - for "see it in action" transitions at the end of a section:

```tsx
<Button variant="link" className="p-0 h-auto text-sm" asChild>
  <a href="?path=/story/applied-guidelines-category--default">
    Now that you've read the rules, go see the proof &rarr;
  </a>
</Button>
```

### 12. For developers box

Always the last element on the page. Separated by `<hr className="page-end" />` with generous top margin:

```tsx
<hr className="page-end" />

<div className="rounded-xl border border-border bg-muted/30 p-6"
     style={{ marginTop: '5rem' }}>
  <h4 className="font-sans text-base font-bold text-foreground m-0 mb-3">
    For developers
  </h4>
  <p className="text-base text-muted-foreground leading-[1.6] m-0">
    Every rule on this page is <strong>already encoded in the component library</strong>.
    {/* List which specific components handle the transformation automatically */}
    {/* Name the CSS file or token layer that governs the behavior */}
    Do not manually override these defaults.
  </p>
  {/* Optional: links to related token explorer stories */}
</div>
```

Key points:
- "For developers" uses **sentence case** (lowercase "d")
- Always open with "Every rule on this page is already encoded in the component library"
- Name the specific components and CSS files involved
- End with a "do not override" directive
- Optionally include links to interactive token explorers

---

## Tone and voice

### Core principles

- **Authoritative but practical**: explain the *why* behind every rule, grounded in UX research or cognitive load theory
- **Data-dense platform mindset**: Procertus is a certification management platform. Professionals scan data. Every decision serves scanning velocity
- **Concise**: no filler. Each sentence earns its place. If a paragraph can be one sentence, make it one sentence
- **Prescriptive**: use "do / don't", not "consider / might want to". These are rules, not suggestions
- **Sentence case everywhere**: headings, labels, callout titles all use sentence case, not title case

### Rhetorical patterns to use

1. **"Not decoration" opener**: "[Thing] at PROCERTUS is not decoration. It is [functional purpose]." Use in hero and section intros.
2. **"The [evocative name]" headings**: Give abstract concepts branded names that people can reference in conversation: "the beacon principle", "the surface handshake", "the architectural beat".
3. **Physical analogies**: Ground abstract decisions in tangible comparisons. "The visual equivalent of a machined edge." "Think of a dark car on a sunlit street." These make the reasoning stick.
4. **Question framing**: Use quoted questions to articulate what the user subconsciously asks: *"Where am I?"* and *"What is this field for?"*
5. **Domain-specific examples**: Always use PROCERTUS domain language: certifications, auditors, compliance, registries, accreditation chains. Never use generic "user dashboard" or "shopping cart" examples.
6. **Short imperative constraints**: Warning callouts use punchy imperatives: "One gradient per view." "Never uppercase strings longer than two words."

### Words and phrases to avoid

- "Consider" / "you might want to" / "it's recommended" (be prescriptive instead)
- Em dashes (use commas, colons, or periods)
- Title case in headings (use sentence case)
- Generic examples (shopping carts, social media, todo lists)

---

## Technical constraints

These are hard-won lessons from existing pages. Follow them exactly:

### Storybook MDX overrides
- **Never use `<h1>`-`<h6>` for preview text.** Storybook's MDX addon replaces heading elements with its own styled components, stripping inline styles. Use `<p>` or `<span>` with inline `style` instead.
- **Never rely on Tailwind utility classes for font-size, font-weight, or letter-spacing in preview elements.** Storybook's docs CSS can override them. Use inline `style={{ fontSize: '...', fontWeight: ... }}` for all preview text inside tables and cards.
- **Tailwind classes that DO work reliably in MDX**: layout (`flex`, `grid`, `gap-*`, `p-*`, `m-*`, `rounded-*`), color (`text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`), display (`uppercase`, `line-through`).
- **Markdown headings (`##`, `###`) are fine for section structure.** Only avoid JSX heading elements for preview/demo text.

### Component previews
- **Real components** (Button, Label, Input, TableHead, Badge, H1-H4, Skeleton) render correctly because they encapsulate their own styles. Always prefer rendering actual components over mimicking their styles with inline CSS.
- **For non-component previews** (body text, metadata, badge-like spans), always use inline styles for typography properties.

### Tables
- Always add `className="rounded-xl overflow-hidden"` to `<Table>`.
- Import Table components from `@/components/ui/table`.

### Colors
- Use semantic colors: `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`
- Brand primary: `text-brand-primary-500`, `border-brand-primary-200 dark:border-brand-primary-800`
- Brand accent: `border-brand-accent-200 dark:border-brand-accent-800`
- System colors for DO/DON'T: `sys-success-*` (green), `sys-destructive-*` (red), `sys-warning-*` (amber), `sys-info-*` (blue)
- Always include `dark:` variants for brand and system color backgrounds/borders

### Spacing
- Section gaps: `mt-16` for the first section after hero, `mt-20` for subsequent sections
- Content gaps: `mt-6` between subsections and after headings
- Card gaps: `gap-6` in grids
- DO/DON'T block gaps: `gap-3` in the flex column wrapper
- Callout top margins: `mt-6` for muted/brand, `mt-8` for warning
- Stacked content: `style={{ gap: '24px' }}` in flex-col wrappers
- For developers box: `style={{ marginTop: '5rem' }}`

---

## Meta tag

Place the page in the Storybook sidebar under design tokens:

```
<Meta title="design tokens/{Category}/Guidelines" />
```

## Imports

Standard imports for every guidelines page:

```tsx
import { Meta } from "@storybook/addon-docs/blocks";
import { Button } from "@/components/ui/button";
```

Add component imports as needed for the token category. Common additions:

```tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { H1, H2, H3, H4 } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
```

Only import what you actually use on the page.

---

## Checklist before finishing

- [ ] Every token value documented matches `default.css` exactly
- [ ] Every component class documented matches the actual component source
- [ ] All preview elements use inline styles (not Tailwind) for typography
- [ ] All tables have `rounded-xl overflow-hidden`
- [ ] DO/DON'T examples use real components where possible
- [ ] DON'T examples are visually marked (line-through and/or opacity)
- [ ] No `<h1>`-`<h6>` tags used for preview text
- [ ] All callout boxes include `dark:` color variants
- [ ] Cards follow the standard or h4 anatomy consistently within each section
- [ ] Sections are wrapped in `<div className="mt-{16|20}">` with `<hr />` separators
- [ ] Page has a "For developers" closing box (sentence case) after `<hr className="page-end" />`
- [ ] Meta title follows `design tokens/{Category}/Guidelines` pattern
- [ ] Section headings use evocative names, not generic descriptors
- [ ] Hero opens with the "not decoration" motif
- [ ] Domain examples use PROCERTUS terminology (certifications, auditors, compliance)
- [ ] No em dashes used anywhere
- [ ] All headings and labels use sentence case
