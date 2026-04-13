import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { H2 } from "@/components/ui/heading";
import { Muted, Small } from "@/components/ui/typography";
import type { Meta, StoryObj } from "@storybook/react-vite";

type Radius = {
  name: string;
  value: string;
};

const RadiusTile = ({ value }: Pick<Radius, "value">) => {
  const style = window.getComputedStyle(document.body);
  const computed = style.getPropertyValue(value);
  const px =
    value === "--radius-ds-full"
      ? "pill"
      : `${Math.round(parseFloat(computed) * 16)}px`;

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{value}</TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {computed || "0"}
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {px}
      </TableCell>
      <TableCell>
        <div
          className="size-16 border-2 border-border bg-card shadow-sm"
          style={{ borderRadius: computed }}
        />
      </TableCell>
    </TableRow>
  );
};

/**
 * Radius tokens for the design system
 */
const meta: Meta<{
  radius: Radius[];
}> = {
  title: "design tokens/Radius",
  argTypes: {},
  render: (args) => (
    <div>
      <header className="mb-4">
        <H2>Radius</H2>
        <Muted className="mt-2 text-base">
          Border radius tokens for consistent corner rounding across buttons,
          cards, and containers.
        </Muted>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Pixels</TableHead>
            <TableHead>
              <span className="sr-only">Preview</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {args.radius.map(({ name, value }) => (
            <RadiusTile key={name} value={value} />
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The full design-system radius scale from `none` to `full`.
 */
export const Core: Story = {
  args: {
    radius: [
      { name: "none", value: "--radius-ds-none" },
      { name: "xs", value: "--radius-ds-xs" },
      { name: "sm", value: "--radius-ds-sm" },
      { name: "md", value: "--radius-ds-md" },
      { name: "lg", value: "--radius-ds-lg" },
      { name: "xl", value: "--radius-ds-xl" },
      { name: "2xl", value: "--radius-ds-2xl" },
      { name: "3xl", value: "--radius-ds-3xl" },
      { name: "4xl", value: "--radius-ds-4xl" },
      { name: "full", value: "--radius-ds-full" },
    ],
  },
};
