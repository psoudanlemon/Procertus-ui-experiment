import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { H2 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ReactNode } from "react";

type Typography = {
  name: string;
  value: string;
};

const TypographyRow = ({
  value,
  name,
  styleKey,
  children,
}: {
  value: string;
  name: string;
  styleKey: keyof CSSProperties;
  children?: ReactNode;
}) => {
  const style = window.getComputedStyle(document.body);
  const styleValue = style.getPropertyValue(value);
  return (
    <TableRow>
      <TableCell className="pr-8">{name}</TableCell>
      <TableCell className="whitespace-nowrap pr-8">{styleValue}</TableCell>
      <TableCell>
        <div style={{ [styleKey]: styleValue, lineHeight: 1.4 }} className="whitespace-nowrap py-1">
          {children}
        </div>
      </TableCell>
    </TableRow>
  );
};

const meta: Meta<{
  children: string;
  heading: string;
  description: string;
  key: keyof CSSProperties;
  property: Typography[];
}> = {
  title: "design tokens/Typography",
  argTypes: {
    heading: { table: { disable: true } },
    description: { table: { disable: true } },
  },
  args: {
    children: "Typeface",
  },
  render: (args) => (
    <div>
      <header className="mb-4">
        <H2>{args.heading}</H2>
        <Muted className="mt-2 text-base">{args.description}</Muted>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pr-8">Name</TableHead>
            <TableHead className="pr-8">Property</TableHead>
            <TableHead>Example</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {args.property.map(({ name, value }) => (
            <TypographyRow key={name} name={name} value={value} styleKey={args.key}>
              {args.children}
            </TypographyRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const FontFamily: Story = {
  args: {
    heading: "Font family",
    description: "Tailwind v4 --font-* variables — font family tokens applied by the theme.",
    key: "fontFamily",
    property: [
      { name: "sans", value: "--font-sans" },
      { name: "mono", value: "--font-mono" },
    ],
  },
};

export const FontSize: Story = {
  args: {
    heading: "Font size",
    description: "Tailwind v4 --text-* variables — the default font size scale.",
    key: "fontSize",
    property: [
      { name: "xs", value: "--text-xs" },
      { name: "sm", value: "--text-sm" },
      { name: "base", value: "--text-base" },
      { name: "lg", value: "--text-lg" },
      { name: "xl", value: "--text-xl" },
      { name: "2xl", value: "--text-2xl" },
      { name: "3xl", value: "--text-3xl" },
      { name: "4xl", value: "--text-4xl" },
      { name: "5xl", value: "--text-5xl" },
      { name: "6xl", value: "--text-6xl" },
      { name: "7xl", value: "--text-7xl" },
      { name: "8xl", value: "--text-8xl" },
      { name: "9xl", value: "--text-9xl" },
    ],
  },
};

export const FontWeight: Story = {
  args: {
    heading: "Font weight",
    description: "Tailwind v4 --font-weight-* variables — the default font weight scale.",
    key: "fontWeight",
    property: [
      { name: "thin", value: "--font-weight-thin" },
      { name: "extralight", value: "--font-weight-extralight" },
      { name: "light", value: "--font-weight-light" },
      { name: "normal", value: "--font-weight-normal" },
      { name: "medium", value: "--font-weight-medium" },
      { name: "semibold", value: "--font-weight-semibold" },
      { name: "bold", value: "--font-weight-bold" },
      { name: "extrabold", value: "--font-weight-extrabold" },
      { name: "black", value: "--font-weight-black" },
    ],
  },
};

export const LetterSpacing: Story = {
  args: {
    heading: "Letter spacing",
    description: "Tailwind v4 --tracking-* variables — the default letter spacing scale.",
    key: "letterSpacing",
    property: [
      { name: "tighter", value: "--tracking-tighter" },
      { name: "tight", value: "--tracking-tight" },
      { name: "normal", value: "--tracking-normal" },
      { name: "wide", value: "--tracking-wide" },
      { name: "wider", value: "--tracking-wider" },
      { name: "widest", value: "--tracking-widest" },
    ],
  },
};

export const LineHeight: Story = {
  args: {
    heading: "Line height",
    description:
      "Tailwind v4 --text-*--line-height variables — per-size line height overrides applied by the theme. Body sizes (xs-lg) use 1.4x; headings (2xl+) use 1.2x.",
    key: "lineHeight",
    property: [
      { name: "xs", value: "--text-xs--line-height" },
      { name: "sm", value: "--text-sm--line-height" },
      { name: "base", value: "--text-base--line-height" },
      { name: "lg", value: "--text-lg--line-height" },
      { name: "xl", value: "--text-xl--line-height" },
      { name: "2xl", value: "--text-2xl--line-height" },
      { name: "3xl", value: "--text-3xl--line-height" },
      { name: "4xl", value: "--text-4xl--line-height" },
      { name: "5xl", value: "--text-5xl--line-height" },
      { name: "6xl", value: "--text-6xl--line-height" },
      { name: "7xl", value: "--text-7xl--line-height" },
      { name: "8xl", value: "--text-8xl--line-height" },
      { name: "9xl", value: "--text-9xl--line-height" },
    ],
  },
};
